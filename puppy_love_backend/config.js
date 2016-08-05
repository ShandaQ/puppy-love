var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:3000/PUPPY_LOVE';

var client = new pg.Client(connectionString);
client.connect();
