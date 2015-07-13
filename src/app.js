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
            io.emit('food_response', 'No result.');
            return;
         }

         console.log("\n### RESPONSE ###");
         console.log(res);
         io.emit('food_response', res);
      });
   });
});


