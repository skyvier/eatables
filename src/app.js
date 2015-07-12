var express = require('express'),
   app = express(),
   server = require('http').Server(app),
   dbserver = require('mongodb').Server,
   Db = require('mongodb').Db;
   io = require('socket.io')(server);

var db = new Db('test', 
   new dbserver('localhost', 27017, {}), { native_parser: false });

if(db === null)
   console.log("db is null");

server.listen(1337);

app.use(express.static('public'));

io.on('connection', function (socket) {
   console.log("got a connection");
   socket.on('food_request', function (data) {
      console.log("food request");
      // add mongo query
      io.emit('food_response', '{ testi: arvo }');
   });
});


