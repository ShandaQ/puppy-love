var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:3000/puppy_love';

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('select * from pups', function(err, data){
  console.log(data);
});
query.on('end', function() { client.end(); });
