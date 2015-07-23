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
       * eatables.structure allows more simple jquery operations
       * @type {Object}
      */
      this.structure = new eatables.structure(target);   

      /**
       * Function appends a list element to the list.
       *
       * @param value {String|Number} value to be inserted 
      */
      this.appendValue = function(value) {
         this.structure.$().append("<" + element + " value=\"" + value + "\">");
      };

      /**
       * Function updates the new values to the list.
       *
       * @param dataObjects {Object[]} an array of data objects
       * @param key {String} the object property to be appended in the list
      */
      this.updateData = function (dataObjects, key) {
         var i;
         $(element, this.structure.$()).remove();

         for(i = 0; i < dataObjects.length; i++) {
            this.appendValue(dataObjects[i][key]);
         }
      };
   };
} else {
   console.log("eatables.structure must be defined!");
}
