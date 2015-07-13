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

var dbObjectSchema = {
   "id": "/DbObject",
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

exports.insert = db_operation.bind(null, operation_insert);
exports.query = db_operation.bind(null, operation_query);

function db_operation(operation, object, callback) {
   if(!checkValidity(object, dbObjectSchema))
      callback("validity error");

   MongoClient.connect(mongo_url, function (err, db) {
      if(err) {
         errorMessage("mongoclient.connect", err);
         return callback(err, null);
      }

      db.collection(object.collection, function (err, col) {
         if(err) {
            errorMessage("database collection", err);
            db.close();
            return callback(err);
         }

         var op_name = operation.name;
         console.log("\n### " + op_name + " ###");
         console.log("doing an " + op_name + ": db." + object.collection +
                     "." + op_name + "(" + JSON.stringify(object.values, null, 4) + ")");

         operation(object, col, function (err, doc) {
            if(err) {
               db.close();
               return callback(err); 
            }

            db.close();
            callback(null, doc);
         });
      });

   });
}

function operation_insert(object, collection, callback) {
   collection.insert(object.values, { w:1 }, function (err, doc) {
      if(err) {
         errorMessage("insert query", err);
         return callback(err);
      }

      callback(null, doc);
   });
}

function operation_query(object, collection, callback) {
   collection.find(object.values).toArray(function(err, doc) {
      if(err) {
         errorMessage("find query", err);
         return callback(err);
      }

      callback(null, doc[0]);
   });
}

