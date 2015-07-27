/**
 * Functionalities for expressing database 
 * data in the eatables web page.
 * @author Joonas Laukka
*/

/** @namespace */
var eatables = eatables || {};

/* Data presentation functions */

// TODO: clean this mess
// JS and OOP ftw.

/**
 * Creates a html table object that can be
 * moved, changed and sorted.
 * @constructor
 *
 * @param _target {String} id of the target dom
 * @param _data {Object[]} the data array (can be null)
 * @param _titles {Object} the data value titles (can be null)
 * @param sortable {Boolean} true for sortable table
 * @param callback {Function} the callback(err) function
*/
eatables.table = function (_target, _data, _titles, sortable, callback) {

   /* Error handling */

   callback = callback || console.log;

   if(_target === undefined) {
      callback("table has no target");
      return null;
   }

   if($("#" + _target).length === 0) {
      callback("target element does not exist");
      return null;
   }

   if(typeof callback !== 'function') {
      callback = console.log;
      console.log("no callback function was defined, using console.log");
   }

   /* Variables */

   /** 
    * The source data array
    * @type {Object[]}  
   */
   var data = _data;    

   /** 
    * The id of the target (div) 
    * @type {String}
   */
   var target = _target;    

   /** 
    * The filtered data 
    * @type {Object[]} 
   */
   var output = _data;    

   /** 
    * An object containing the table titles for specific data object properties
    * @type {Object} 
   */
   var titles = _titles;    

   /** 
    * The jQuery object (dom)
    * @type {Object} 
   */
   var dom;    

   /** 
    * Click event handlers for dom elements
    * @type {Object} 
   */
   var clickHandlers = {};

   /* Private functions */

   var makeSortable = function () {
      var table = $("table", dom);

      $("td#row_title", table).each(function () {
         var index = $(this, table).index();
         var inverse = false;
         
         $(this).click(function () {
            table.find('td').not("#row_title").filter(function () {
               return $(this, table).index() === index;
            }).sortElements(function (a, b) {
               return $(a, table).text() > $(b, table).text() ?
                 (inverse ? -1 : 1) : (inverse ? 1 : -1);
            }, function () { return this.parentNode; });

            inverse = !inverse;

            makeClickable();
         });
      });
   };

   var makeClickable = function () {
      var selector;
      for(selector in clickHandlers) {
         $(selector, dom).click(function () {
            var id = $(this).attr("id");

            if(id === 'row_title')
               return;

            id = Number(id.charAt(id.length-1));;
            console.log(id);
            return clickHandlers[selector](output[id]);
         });
      }
   };

   var row = function (elements, id) {
      var td_value;

      for(var p in titles) {
         if($.isArray(titles)) {
            td_value = elements[titles[p]] || "-";   
         } else {
            td_value = elements[p] || "-";
         }

         dom.append("<td id=row_" + id + ">" + td_value + "</td>");
      }

      $("td#row_" + id, dom).wrapAll("<tr id=row_" + id + "></tr>");
   };

   // you can also create a table without data
   var constructDom = function () {
      var i;
      dom = $("<div id=" + target + ">");

      if(!output || !data)
         return;

      titles = titles || Object.keys(data[0]);

      /* Creates the title row */
      for(var p in titles) {
         dom.append("<th id=row_title>" + titles[p] + "</th>");
      }

      $("th#row_title", dom).wrapAll("<tr id=row_title></tr>");
     
      /* Creates the data rows */ 
      for(i = 0; i < output.length; i++) {
         row(output[i], i);
      }

      $("tr", dom).wrapAll("<table></table>");

      if(sortable)
         makeSortable();

      makeClickable();
   };

   var construct = function () {
      constructDom();
      callback(null);
   }();

   var print = function () {
      $("#" + target).replaceWith(dom);
   };

   var setData = function (_data) {
      data = _data;
      output = data;
   };

   /* Priviledged functions */

   /**
    * Function prints the table to a dom element (div).
    *
    * @param _target {String} the id of the target element
   */
   this.printTo = function (_target) {
      target = _target;
      print();
   };

   /**
    * Function get data from the clicked row.
    * The handler calls the callback function with the data
    * of the clicked element.
    *
    * @param selector {String} the css selector of the object(s)
    * @param callback {Function} a callback function
   */
   this.onClick = function (selector, callback) {
      console.log("adding a click handler for: " + selector);
      clickHandlers[selector] = callback;
   };

   /**
    * Function changes the source data for the table. 
    *
    * @param _data {Object[]} the data array 
   */
   this.changeData = function (_data) { 
      setData(_data);
      constructDom();
      print();
   };

   /**
    * Function filters the output according to a regex. 
    *
    * @param prop {String} the property to filter 
    * @param regex {Object} a JS RegExp object
   */
   this.filterData = function (prop, regex) {
      try {
         output = data.filter(function (value) {
            return regex.test(value[prop]);
         });
      } catch(err) {
         console.log("there was an error with filterData: " + err);
         return;
      }

      if(output.length === 0)
         output = [{ Error: "No result" }];

      constructDom();
      print();
   };
};

