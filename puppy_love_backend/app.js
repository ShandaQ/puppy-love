var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var bcrypt = require('bcrypt');
var randToken = require('rand-token');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/puppy_love';

var client = new pg.Client(connectionString);
client.connect();

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/listpuppies', function(req, res){
  client.query("select * from pups", function(err, data){
    if(err){
      console.error(err);
      res.status(500);
      res.json({
        status: 'fail',
        message: err.message
      });
      return;
    }
    console.log(data);
    res.json({
      data: data.rows
    });
  });
});

app.get('/profile/:ownerID', function(req,res){
  var ownerID = req.params.ownerID;

  client.query(`
    select owner.username, owner.email, owner.location,
    pups.name, pups.id as pupID
    from owner
      left join pups on owner.id = pups.owner_id
    where owner.id = $1`, [ownerID],function(err, results){
      if(err){
        console.error(err);
        res.status(500);
        res.json({
          status: 'fail',
          message: err.message
        });
        return;
      }
      res.json({
        results: results.rows
      });
      console.log(results);
    });
});

app.get('/petfile/:petID', function(req,res){
  var petId = req.params.petID;
  client.query(`
    select pups.name, pups.age, pups.breed, pups.litters, pups.gender, owner.username, pups.owner_id
    from pups
      left join owner on owner.id = pups.owner_id
    where pups.id = $1`, [petId],function(err, results){
      if(err){
        console.error(err);
        res.status(500);
        res.json({
          status: 'fail',
          message: err.message
        });
        return;
      }
      res.json({
        results: results.rows[0]
      });
    });
});


app.post('/login', function(req,res){
  var credentials = req.body;
  console.log(credentials);

  // check if user exits
  client.query(`select username, pswd
    from owner
    where username = $1`,[credentials.username], function(err, results){
      if(err){
        console.error(err);
        res.status(500);
        res.json({
          status: 'fail',
          // "database connectivity error"
          message: err.message
        });
        return;
      }


      // if results are empty, user does not exist
      if(results.rows === undefined || results.rows.length === 0){
        res.status(500);
        res.json({
          status: 'fail',
          message: 'Invalid username or password'
        });
        return;
      }

      console.log(results.rows[0].pswd);
      var pswd_results = results.rows[0].pswd

      // username exist check pswd
      bcrypt.compare(credentials.password,pswd_results, function(err,match){
        if(err || !match){
          console.error(err);
          res.status(409);
          res.json({
            status: 'fail',
            message: 'Invalid username or password'
          });
          return;
        }

        // username and password are correct
        res.json({
          status: 'good',
          message: 'valid username or password'
        });
      });
    }); //end query
});

app.post('/register', function(req, res){
  var credentials = req.body;
  var encryptedPswd;

  // user register
  // check if user name already exist in the database
  // var checkExist =
  client.query(`
    select owner.username
    from owner
    where owner.username = $1`,[credentials.username],function(err, results){
      if(err){
        console.error(err);
        res.status(500);
        res.json({
          status: 'fail',
          message: err.message
        });
        return;
      }

      // if the checkExist query is empty add the user to the database
      // else return a msg username already exits
      if(results.rows === undefined || results.rows.length === 0){
        // res.status(500);
        // res.json({
        //   status: 'good',
        //   message: 'great username, you can use this'
        // });

        // hash the pswd
        bcrypt.hash(credentials.password, 10, function(err,encryptedPswd){
          if(err){
            console.error(err);
            res.status(500);
            res.json({
              status: 'fail',
              message: err.message
            });
            return;
          }
          //insert the username and pswd to the database

          client.query(`INSERT INTO owner VALUES
            (DEFAULT,$1, $2, $3 ,$4)`, [credentials.username, encryptedPswd, credentials.email, credentials.location],function(err, results){
              if(err){
                console.error(err);
                res.status(500);
                res.json({
                  status: 'fail',
                  message: err.message
                });
                return;
              }

              res.json({
                results: results.rows
              });
            });
        }); // ends bcrypt.hash
        return;
      }else{
        res.status(500);
        res.json({
          status: 'fail',
          message: 'username already exist'
        });
        return;
      }

      res.json({
        results: results.rows
      });
    });
});

app.post('/addpet',function(req,res){
  var credentials = req.body;
  console.log(credentials);

  client.query(`
    select id
    from owner
    where username = $1`, [credentials.username],function(err, results){
      if(err){
        console.error(err);
        res.status(500);
        res.json({
          status: 'fail',
          message: err.message
        });
        return;
      }

      // res.json({
      //   results: results.rows
      // });
      console.log(results);
      var userid = results.rows[0].id;

      client.query(`INSERT INTO pups VALUES
        (DEFAULT,$1, $2, $3 ,$4, $5, $6)`, [credentials.petname, credentials.petage, credentials.petbreed, credentials.petlitters, credentials.petgender,userid],function(err, results){
          if(err){
            console.error(err);
            res.status(500);
            res.json({
              status: 'fail',
              message: err.message
            });
            return;
          }

          res.json({
            results: results.rows
          });
        });
    });


});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

app.listen(5000, function(){
  console.log('App is listening on port 5000');
});
