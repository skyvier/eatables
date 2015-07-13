var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var Validator = require('jsonschema').Validator;

var configSchema = {
   "id": "/Config",
   "type": "object",
   "properties": {
      "server_url": { "type": "string" },
      "server_port": { "type": "string" },
      "db_name": { "type": "string" }
   },
   "required": ["server_url", "db_name"]
};

var mongo_url;
var param;
var v = new Validator();

function checkValidity(srv_param) {
   var i;
   var report = v.validate(srv_param, configSchema); 

   if(report.errors.length == 0) 
     return true;

   console.log("config file is not valid: ");
   for(i = 0; i < report.errors.length; i++) {
      console.log(report.errors[i].message);
   }
   return false;
}

function openConfig() {
   var fs = require('fs');
   var data = fs.readFileSync('config.json', 'utf8');
   if(data === null || data === undefined) {
      console.log("the configuration file doens't exist");
      return false;
   }

   param = JSON.parse(data);
   if(!checkValidity(param))
      return false;

   return true;
}

function testServer() {
   if(mongo_url === undefined) {
      console.log("mongoclient hasn't been initialised");
      return false;
   }

   MongoClient.connect(mongo_url, function (err, db) {
      if(err) {
         console.log("there was an error with mongoclient error test: " + err);
         return;
      }

      db.close();
   });

   return true;
}

exports.checkConfig = openConfig;

exports.init = function () {
   if(!openConfig()) {
      param = null;
      console.log("param is corrupted");
      return false;
   }

   if(param.server_port === undefined)
      param.server_port = 27017; 

   mongo_url = 'mongodb://' + param.server_url + ':' + param.server_port;

   if(!testServer())
      return false;

   console.log("the mongodb server " + mongo_url + " is operational");
   return true;
}



     
