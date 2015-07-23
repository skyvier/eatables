var eatables = eatables || {};

/* Requires eatables.structure */

if(typeof eatables.structure !== 'undefined') {
   /*
    * A html appendable list structure handler.
    * The object makes jquery operations simpler.
    *
    * @param _dom the target (jquery object or selector string)
   */
   eatables.appendableList = function (target, element) {
      // eatables.structure allows more simple jquery operations
      this.structure = new eatables.structure(target);   

      /*
       * Function appends a list element to the list.
       *
       * @param value value to be inserted 
      */
      this.appendValue = function(value) {
         this.structure.$().append("<" + element + " value=\"" + value + "\">");
      }

      /*
       * Function updates the new values to the list.
       *
       * @param dataObjects an array of data objects
       * @param key the object property to be appended in the list
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
