/* 
 * Functionalities for expressing database 
 * data in the eatables web page.
*/

var eatables = eatables || {};

/*
 * A html structure handler.
 * The object makes jquery operations simpler.
 *
 * @param _dom the target (jquery object or selector string)
*/
eatables.structure = function (_dom) {
   var dom; 
   
   var construct = function () {
      if(typeof _dom !== 'object')
         dom = $(_dom) || null;
      else
         dom = _dom; 

      if(!dom) {
         console.log("structure: no such html object");
         return null;
      }
   }();

   /*
    * Function changes a text, attribute or value
    * of a html element in the structure.
    *
    * @param selector the element selector (esim. p#id)
    * @param attr the attribute to change (can be text or value)
    * @param value the value of the attribute
   */
   this.change = function (selector, attr, value) {
      var elem = $(selector, dom);

      value = value || "";

      if(elem.length === 0) {
         console.log("element does not exist");
         return;
      }

      try {
         if(attr === 'text') 
            elem.text(value);
         else if(attr === 'value')
            elem.val(value);
         else
            elem.attr(attr, value);
      } catch(err) {
         console.log("error on structure.change: " + err);
      }
   };

   /*
    * Function adds a jquery an event handler
    * TODO: finish this
    *
    * @param selector css selector to the element 
    * @param _event the event to handle
    * @param handler the handler function
   */
   this.addEventHandler = function (selector, _event, handler) {
      console.log("adding an event handler to: " + selector + " at " + _event);
      $("tbody", dom).on(_event, selector, { element: $(selector, dom) }, function () {
         console.log("GOT IT");   
      });
   };

   /*
    * Function returns the jquery object and/or changes it.
    *
    * @param value new dom value
   */
   this.$ = function (value) {
      if(typeof value !== 'undefined')
         dom = value;

      return dom;
   };
};

