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

var dev = function (input) {
   if(process.argv[2] === '-dev')
      console.log(input);
};

server.listen(1337);

app.use(express.static('public'));

// simple error handling
app.post('/error', function (req, res) {
   if(!req)
      return;

   console.log("#### ERROR ####");
   console.log(req.error);
});

io.on('connection', function (socket) {
   /* Display connection information */
   var address = socket.handshake.address;
   console.log("\n### CONNECTION ###\nFROM: " + address);

   /* This won't be needed in the future */
   socket.on('query', function (data) {
      dev("\n### QUERY REQUEST ###");

      if(!data) {
         dev("### EMPTY DATA PACKET ###");
         return;
      } 

      db.query(data.options, data, function (err, res) {
         if(err) {
            dev(err);
            return;
         }

         dev("\n### RESPONSE ###");
         dev(res);
         socket.emit('query_response', res);
      });
   });

   socket.on('insert', function (data) {
      dev("\n### INSERT REQUEST ###");

      if(!data) {
         dev("### EMPTY DATA PACKET ###");
         return;
      }

      db.insert(data, function (err, res) {
         if(err) {
            dev(err);
            return;
         }

         dev("\n### RESPONSE ###");
         dev(res.result);
         socket.emit('insert_response', res.result);
      });
   });

});


