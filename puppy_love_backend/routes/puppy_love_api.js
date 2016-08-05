var pg = require('pg');


var client = new pg.Client('postgres://localhost:3000');
client.connect();
// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', function() { client.end(); });
