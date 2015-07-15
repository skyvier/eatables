var express = require('express'),
   app = express(),
   server = require('http').Server(app),
   io = require('socket.io')(server),
   db = require('./mongodb_handler');

if(!db.init()) {
   console.log("db fail");
} else {
   console.log("db success");
}

server.listen(1337);

app.use(express.static('public'));

io.on('connection', function (socket) {
   socket.on('query', function (data) {
      if(!data) {
         console.log("### EMPTY DATA PACKET ###");
         return;
      } 

      db.query(data, function (err, res) {
         if(err) {
            console.log(err);
            return;
         }

         if(!res) {
            socket.emit('query_response', 'No result.');
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


