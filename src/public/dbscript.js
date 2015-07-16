/* Database functions for eatables */

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
   console.log("adding a response callback");
   if(typeof callback === 'function')
      this.destCallbacks[dest] = callback;   
   else
      console.log("the callback was not a function");

   console.log(JSON.stringify(this.destCallbacks, null, 4));
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

      console.log(destination);

      if(callbacks[destination] === undefined) {
         console.log("a lost query response registered:");
         console.log(data);
         return;
      }

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
   this.socket.emit('insert', object);
   console.log("insert request sent");
};

/* Queries a database object from the database.
 * A function of dbHandler.
 * 
 * @param object database object (dbObject)
*/
dbHandler.prototype.queryOneObject = function (object) {
   this.rawQuery(object, 'query_one');
};

/* Queries multiple database objects from the database.
 * A function of dbHandler.
 * 
 * @param object database object (dbObject)
 * @param count the amount of results wanted (0 = all)
*/
dbHandler.prototype.queryObject = function (object, count) {
   object.options = { limit: count };
   this.rawQuery(object, 'query');
};

/*
 * Constains the raw query functionalities. 
 * Should not be used by itself.
 *
 * @param object database object (dbObject)
 * @param type the type of the query
*/
dbHandler.prototype.rawQuery = function (object, type) {
   this.socket.emit(type, object);
};
