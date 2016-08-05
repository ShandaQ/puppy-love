var express = require('express');
var router = express.Router();

var pg = require('pg');
var path = require('path');

var connectionString = require(path.join(__dirname,'../','config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/search', function(req, res){
  var results;

  // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        var query = client.query('select * from pups', function(err, data){
          if(err){
            console.error(err);
          }
          console.log(data);
        });
        query.on('end', function() { client.end(); });


        // SQL Query > Select Data
        // var query = client.query("SELECT * FROM PUPS;");
        //
        // // Stream results back one row at a time
        // query.on('row', function(row) {
        //     results.push(row);
        // });

        // // After all data is returned, close connection and return results
        // query.on('end', function() {
        //     done();
        //     return res.json(results);
        // });

    });
});

module.exports = router;
