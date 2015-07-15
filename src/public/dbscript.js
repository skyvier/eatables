/* Database functions for eatables */

/* A constructor for a database object based on
 * dbObjectSchema in the mongodb_handler package.
 * 
 * @param col target collection in the DB
 * @param val a value object
*/
function dbObject(col, val) {
   this.collection = col;
   this.values = val;
}

/* A constructor for a database handler
 * 
 * @param url the url address for the database
 * @param val the port of the database
*/
function dbHandler(url, port) {
   url = url + ':' + port
   this.socket = io.connect(url);

   this.socket.on('connect_failed', function () {
      console.log("connection failed");
   });
}

/* Inserts a database object to the database.
 * A function of dbHandler.
 * 
 * @param object database object (dbObject)
 * @param callback callback(err, data)
*/
dbHandler.prototype.insertObject = function (object, callback) {
   this.socket.emit('insert', object);
   console.log("object inserted");

   // TODO: handle the response here (OK?)
   this.socket.on('insert_response', function (data) {
      if(data.ok !== 1) 
         callback("error on insert object");
       
      console.log("object { name: " + object.values.name + 
            " } succesfully inserted");
      callback(null, data);
   });
}

/* Queries a database object from the database.
 * A function of dbHandler.
 * 
 * @param object database object (dbObject)
 * @param callback callback(err, data)
*/
dbHandler.prototype.queryObject = function (object, callback) {
   this.socket.emit('query', object);
   this.socket.on('query_response', function (data) {
      if(typeof data === "string")
         callback("no result");

      callback(null, data);
   });
}
