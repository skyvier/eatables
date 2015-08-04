/** @namespace */
var eatables = eatables || {};

/**
 * Parses an arguments list (args) to the javascript
 * data types.
 *
 * @param args parameter array
 * @return typeof args if args isn't array
*/
eatables.typer = function (args) {
   var i; 

   var objects = [], numbers = [],
   strings = [], arrays = [];

   /* Parse arguments */
   this.constructor = function () {
      if(typeof args !== 'object') {
         return typeof args;
      }

      for(i = 0; i < args.length; i++) {
         arg = args[i]; 
         if(typeof arg === 'object') {
            if(!arg)
               continue;

            if(Array.isArray(arg)) {
               arrays.push(arg);
            } else {
               objects.push(arg);
            }
         } else if(typeof arg === 'number') {
            numbers.push(arg);
         } else if(typeof arg === 'string') {
            strings.push(arg);
         }
      }
   }();

   /**
    * Return an array of _type arguments
    *
    * @param _type {String} a javascript type identifier string
    * @return array of arguments of type _type
    */
   this.type = function (_type) {
      switch (_type) {
         case 'object':
            return objects;
         case 'number':
            return numbers;
         case 'string':
            return strings;
         case 'array':
            return arrays;
      }

      console.log("unknown _type");
      return null;
   };
};
