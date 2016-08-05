var pg = require('pg');

var client = new pg.Client({
    user: "dhvddhjrmenjzn",
    password: "Bj7BnGj_oyIrqk-twO29ZeaJok",
    database: "d28ae5g8pp6c51",
    port: 5432,
    host: "ec2-54-235-86-129.compute-1.amazonaws.com",
    ssl: true
});
client.connect();

var query = client.query('select * from pups', function(err, data){
  console.log(data);
});
query.on('end', function() { client.end(); });
