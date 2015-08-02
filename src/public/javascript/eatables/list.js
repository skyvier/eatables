/** @namespace */
var eatables = eatables || {};

if(typeof eatables.structure !== 'undefined') {
   /**
    * A html appendable list structure handler.
    * The object makes jquery operations simpler.
    *
    * Requires eatables.structure
    *
    * @class appendableList
    * @uses eatables.structure
    * @author Joonas Laukka
    *
    * @constructor
    *
    * @param target {String|Object} the target (jquery object or selector string)
    * @param element {String} the css selector for the list element 
    * @example new appendableList($("#target_table"), "td")
   */
   eatables.appendableList = function (target, element) {
      /** 
       * eatables.structure allows simpler jquery operations
       * @type {Object}
      */
      this.structure = new eatables.structure(target);   

      /**
       * Function appends a list element to the list.
       *
       * @param value {String|Number} value to be inserted 
      */
      this.appendValue = function(value) {
         if(element === 'li') {
            this.structure.$().append("<li>" + value + "</li>");
            return;
         }

         this.structure.$().append("<" + element + " value=\"" + value + "\">");
      };

      /**
       * Function updates the new values to the list.
       *
       * @param dataObjects {Object[]} an array of data objects
       * @param keys {String[]} the object property to be appended in the list
       * @param separator {String} a string separating the object properties
      */
      this.updateData = function (dataObjects, keys, separator) {
         var i, a, output;

         if(separator === undefined)
            separator = "";

         if(!$.isArray(keys))
            keys = [keys];

         $(element, this.structure.$()).remove();

         for(i = 0; i < dataObjects.length; i++) {
            output = "";
            for(a = 0; a < keys.length; a++) {
               output += dataObjects[i][keys[a]] + separator;
            }

            this.appendValue(output);
         }
      };
   };
} else {
   console.log("eatables.structure must be defined!");
}
