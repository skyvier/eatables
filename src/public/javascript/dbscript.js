/** Database functions for eatables 
 * @author Joonas Laukka
*/

// TODO: AJAX instead of socket.io
// or keep using it for practice

/** 
 * A constructor for a database object based on
 * dbObjectSchema in the mongodb_handler package.
 * @class dbObject
 * @constructor
 * 
 * @param col {String} target collection in the DB
 * @param val {Object} a value object
 * @param dest {String} the response destination
*/
function dbObject(col, val, dest) {
   this.destination = dest;
   this.collection = col;
   this.values = val;
}

/**
 * A constructor for a database regular expression.
 *
 * For some reason the javascript RegExp object
 * doesn't seem to survive the transmission to server.
 * It'll be created on the server side.
 * @class dbRegex
 * @constructor
 *
 * @param expression {String} regular expression
 * @param flags {String} regexp flags
*/
function dbRegex(expression, flags) {
   this.$regex = [expression, flags || ""];
}

/** 
 * A constructor for a database handler
 * @class dbHandler
 * @constructor
 * 
 * @param url {String} the url address for the database
 * @param val {String|Number} the port of the database
 * @param callback {Function} callback for error handling
*/
function dbHandler(url, port, callback) {
   url = url + ':' + port;
   try {
      this.socket = io.connect(url);
   } catch(err) {
      callback(err);
   }
   
   /**
    * destCallbacks contains the query response callbacks
    * @type {Object}
   */
   this.destCallbacks = {};

   this.socket.on('connect_failed', function () {
      callback("connection failed");
   });
}

/**
 * Define a function for handling a response.
 * This is an obvious downside of using socket.io.
 *
 * @param dest {String} response destination identifier
 * @param callback {Function} the destination function for the response 
*/
dbHandler.prototype.onResponse = function (dest, callback) {
   console.log("adding a response callback for " + dest);
   if(typeof callback === 'function')
      this.destCallbacks[dest] = callback;   
   else
      console.log("the callback was not a function");
};

// TODO: move these back to the constructor
/**
 * This function defines the action to be taken on
 * a socket response. The response destinations
 * should be added first through onResponse.
*/
dbHandler.prototype.listen = function () {
   this.socket.on('insert_response', function (data) {
      if(data.ok !== 1) 
         console.log("error on insert object");

      if(callbacks[insert_response] !== undefined)
         callbacks[insert_response](data);
   });

   var callbacks = this.destCallbacks;
   this.socket.on('query_response', function (data) {
      console.log("got a query response");
      console.log(JSON.stringify(data, null, 4));
      var destination = data.destination;

      if(destination === undefined)
         return;

      if(callbacks[destination] === undefined) {
         console.log("a lost query response registered:");
         console.log(data);
         return;
      }

      if(data.results.length === 0)
         data.results.push({ error: "No result." });
         
      // do something
      // NOTE: handle errors on the other side
      callbacks[destination](data);
   });
};

/** 
 * Inserts a database object to the database.
 * 
 * @param object {dbObject} database object
*/
dbHandler.prototype.insertObject = function (object) {
   this.rawRequest(object, 'insert');
   console.log("insert request sent");
};

/** 
 * Queries multiple database objects from the database.
 * 
 * @param object {dbObject} database object
 * @param count {Number} the amount of results wanted (0 = all)
*/
dbHandler.prototype.queryObject = function (object, count) {
   object.options = { limit: count || 0 };
   this.rawRequest(object, 'query');
};

/** 
 * Queries multiple database objects from more than one collections.
 * Null objects are discarded.
 * 
 * @param objects {dbObject} database objects
 * @param count {Number} the amount of results wanted (0 = all)
 * @example queryObjects(obj1, obj2, obj3, 1);
*/
dbHandler.prototype.queryGlobal = function () {
   var i, arg, count, values = {},
      options, dest, prop, object;

   /* Parse arguments */
   for(i = 0; i < arguments.length; i++) {
      arg = arguments[i]; 
      if(typeof arg === 'object') {
         if(!arg)
            continue;

         dest = arg.destination || "";
         if(!values.hasOwnProperty(dest)) 
            values[dest] = [];

         values[dest].push(arg);
      } else if(typeof arg === 'number') {
         count = arg;
      }
   }

   /* Add the count option */
   count = count || 0;
   options = { limit: count }; 

   /* Send an inter collection request for every destination */
   for(prop in values) {
      object = new dbObject('', values[prop], prop);
      object.options = options;
      this.rawRequest(object, 'inter_collection'); 
   }
};

/**
 * Constains the raw request functionalities. 
 * Should not be used by itself.
 *
 * @param object {dbObject} database object
 * @param type {String} the type of the query
*/
dbHandler.prototype.rawRequest = function (object, type) {
   try {
      this.socket.emit(type, object);
   } catch(err) {
      console.log("there was an error with a rawRequest type: " + type + ":");
      console.log(err);
   }
};
