/* Database functions for eatables */

// TODO: AJAX instead of socket.io

/* A constructor for a database object based on
 * dbObjectSchema in the mongodb_handler package.
 * 
 * @param col target collection in the DB
 * @param val a value object
*/
function dbObject(col, val, dest) {
   this.destination = dest;
   this.collection = col;
   this.values = val;
}

/* A constructor for a database handler
 * 
 * @param url the url address for the database
 * @param val the port of the database
*/
function dbHandler(url, port) {
   url = url + ':' + port;
   this.socket = io.connect(url);
   this.destCallbacks = {};

   this.socket.on('connect_failed', function () {
      console.log("connection failed");
   });
}

dbHandler.prototype.onResponse = function (dest, callback) {
   console.log("adding a response callback for " + dest);
   if(typeof callback === 'function')
      this.destCallbacks[dest] = callback;   
   else
      console.log("the callback was not a function");
};

// TODO: move these back to the constructor
dbHandler.prototype.listen = function () {
   this.socket.on('insert_response', function (data) {
      if(data.ok !== 1) 
         console.log("error on insert object");
       
      console.log("object { name: " + object.values.name + 
            " } succesfully inserted");
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
      callbacks[destination](data);
   });
};

/* Inserts a database object to the database.
 * A function of dbHandler.
 * 
 * @param object database object (dbObject)
*/
dbHandler.prototype.insertObject = function (object) {
   this.rawRequest(object, 'insert');
   console.log("insert request sent");
};

/* Queries multiple database objects from the database.
 * A function of dbHandler.
 * 
 * @param object database object (dbObject)
 * @param count the amount of results wanted (0 = all)
*/
dbHandler.prototype.queryObject = function (object, count) {
   object.options = { limit: count, fields: { _id: 0 } };
   this.rawRequest(object, 'query');
};

/*
 * Constains the raw request functionalities. 
 * Should not be used by itself.
 *
 * @param object database object (dbObject)
 * @param type the type of the query
*/
dbHandler.prototype.rawRequest = function (object, type) {
   try {
      this.socket.emit(type, object);
   } catch(err) {
      console.log("there was an error with a rawRequest type: " + type + ":");
      console.log(err);
   }
};
