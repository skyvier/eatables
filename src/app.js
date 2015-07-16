var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
   
var db = require('./mongodb_handler');

if(!db.init()) {
   console.log("db fail");
} else {
   console.log("db success");
}

server.listen(1337);

app.use(express.static('public'));

io.on('connection', function (socket) {
   /* This won't be needed in the future */
   socket.on('query_one', function (data) {
      if(!data) {
         console.log("### EMPTY DATA PACKET ###");
         return;
      } 

      db.queryOne(data, function (err, res) {
         if(err) {
            console.log(err);
            return;
         }

         console.log("\n### RESPONSE ###");
         console.log(res[0]);
         res[0].destination = res.destination;
         socket.emit('query_response', res[0]);
      });
   });

   socket.on('query', function (data) {
      if(!data) {
         console.log("### EMPTY DATA PACKET ###");
         return;
      } 

      db.query(data.options, data, function (err, res) {
         if(err) {
            console.log(err);
            return;
         }

         console.log("\n### RESPONSE ###");
         console.log(res);
         socket.emit('query_response', res);
      });
   });

   socket.on('insert', function (data) {
      if(!data) {
         console.log("### EMPTY DATA PACKET ###");
         return;
      }

      db.insert(data, function (err, res) {
         if(err) {
            console.log(err);
            return;
         }

         console.log("\n### RESPONSE ###");
         console.log(res.result);
         socket.emit('insert_response', res.result);
      });
   });

});


