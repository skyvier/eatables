/** @namespace */
var eatables = eatables || {};

/**
 * An array for unique items.
 *
 * @class uniqueArray
 * @author Joonas Laukka
 *
 * @constructor
*/
eatables.uniqueArray = function () {
   this.array = [];

   /**
    * Function pushes the value if it
    * doesn't yet exist in the array.
    *
    * @param value {String|Number|Object} push value
    * @return true if succeeds, false otherwise
   */
   this.push = function (value) {
      if($.inArray(value, this.array) !== -1)
         return false;

      this.array.push(value);
      return true;
   };

   /**
    * Function pushes the value object if 
    * it is unique when it comes to a single property.
    *
    * @param value {Object} push value
    * @param prop {String} property name
    * @return true if succeeds, false otherwise
   */
   this.pushByProperty = function (value, prop) {
      var i, keys;
      for(i = 0; i < this.array.length; i++) {
         if(typeof this.array[i] !== 'object')
            continue;

         keys = Object.keys(this.array[i]);
         if($.inArray(prop, keys) !== -1) {
            if(this.array[i][prop] === value[prop])
               return false;   
         } 
      }

      this.array.push(value);
      return true;
   };
};

