var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var Validator = require('jsonschema').Validator;

var assert = require('assert');

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

var searchParamSchema = {
   "id": "/SearchParam",
   "type": "object",
   "properties": {
      "collection": { "type": "string" },
      "values" : { "type": "object" }
   }
};

var mongo_url;
var srv_param;
var v = new Validator();

function checkValidity(param, schema) {
   var i;
   var report = v.validate(param, schema); 

   if(report.errors.length == 0) 
     return true;

   console.log(schema.id + " file is not valid: ");
   for(i = 0; i < report.errors.length; i++) {
      console.log(report.errors[i].message);
   }
   return false;
}

function openConfig() {
   var fs = require('fs');

   try {
   var data = fs.readFileSync('config.json', 'utf8');
   } catch(err) {
      console.log(err);
      return false;
   }

   if(data === null || data === undefined) {
      console.log("the configuration file doens't exist");
      return false;
   }

   srv_param = JSON.parse(data);
   if(!checkValidity(srv_param, configSchema))
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
         errorMessage("mongoclient test", err);
         return;
      }

      db.close();
   });

   return true;
}

function errorMessage(entity, error) {
   console.log("there was an error with " + entity + ": " + error);
}

exports.checkConfig = openConfig;

exports.init = function () {
   if(!openConfig()) {
      srv_param = null;
      console.log("srv_param is corrupted");
      return false;
   }

   if(srv_param.server_port === undefined)
      srv_param.server_port = 27017; 

   mongo_url = 'mongodb://' + srv_param.server_url + 
               ':' + srv_param.server_port + "/" + srv_param.db_name;

   if(!testServer())
      return false;

   console.log("the mongodb server " + mongo_url + " is operational");
   return true;
}

exports.query = function (search_param, callback) {
   if(!checkValidity(search_param, searchParamSchema))
      callback("validity error");

   MongoClient.connect(mongo_url, function (err, db) {
      if(err) {
         errorMessage("mongoclient.connect", err);
         return callback(err);
      }

      db.collection(search_param.collection, function (err, col) {
         if(err) {
            errorMessage("database collection", err);
            db.close();
            return callback(err);
         }

         console.log("collection established to " + search_param.collection);
         console.log("\n### QUERY ###");
         console.log("doing a query: db." + search_param.collection +
                     ".find(query);");
         console.log(search_param.values);

         col.find(search_param.values).toArray(function(err, doc) {
            if(err) {
               errorMessage("find query", err);
               db.close();
               return callback(err);
            }

            callback(null, doc[0]);
            db.close();
         });

      });

   });
}
