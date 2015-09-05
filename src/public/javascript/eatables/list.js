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
      var structure = new eatables.structure(target);   

      if(typeof structure === 'undefined' || structure === null)
         console.log("could not find the html structure");

      /**
       * Function appends a list element with a value only
       * to the list.
       *
       * @param value {String|Number} value to be inserted 
      */
      var appendValue = function(value) {
         structure.$().append("<" + element + " value=\"" + value + "\">");
      };

      /**
       * Function appends a list element with a text only
       * to the list.
       *
       * @param value {String|Number} value to be inserted 
      */
      var appendText = function (value) {
         structure.$().append("<" + element + ">" + value + "</" + element + ">");
      };

      /**
       * Function appends a list element with a value and
       * a text to the list.
       *
       * @param value {String|Number} value to be inserted 
      */
      var appendTextAndValue = function (value) {
          structure.$().append("<" + element + " value=\"" + 
                value + "\">" + value + "</" + element + ">");
      };

      /**
       * Function updates the new values to the list with a
       * custom appendMethod.
       *
       * @param appendMethod {Function} function of type 'append(value)'
       * @param dataObjects {Object[]} an array of data objects
       * @param keys {String[]} the object property to be appended in the list
       * @param separator {String} a string separating the object properties
      */
      this.updateData = function (appendMethod, dataObjects, keys, separator) {
         var i, a, output, isObjectList;

         if(separator === undefined)
            separator = "";

         // If no keys are defined, the dataObjects list
         // probably doesn't contain objects.
         if(keys === undefined) {
            isObjectList = false;
         } else {
            isObjectList = true;
            if(!$.isArray(keys))
               keys = [keys];
         }

         $(element, structure.$()).remove();

         for(i = 0; i < dataObjects.length; i++) {
            if(isObjectList) {
               output = "";
               for(a = 0; a < keys.length; a++) {
                  output += dataObjects[i][keys[a]] + separator;
               }
            } else {
               output = dataObjects[i];
            }

            appendMethod(output);
         }
      };

      /**
       * Function updates the new values to the list.
       * Function updateValue with appendValue as an appendMethod.
      */
      this.updateValues = this.updateData.bind(null, appendValue);

      /**
       * Function updates the new values to the list.
       * Function updateValue with appendText as an appendMethod.
      */
      this.updateTexts = this.updateData.bind(null, appendText);

      /**
       * Function updates the new values to the list.
       * Function updateValue with appendTextAndValue as an appendMethod.
      */
      this.updateTextsAndValues = this.updateData.bind(null, 
            appendTextAndValue);
   };
} else {
   console.log("eatables.structure must be defined!");
}
