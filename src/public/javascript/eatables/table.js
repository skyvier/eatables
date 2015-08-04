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
      callback("table target is undefined");
      return null;
   }

   if(_target && $("#" + _target).length === 0 ) {
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

      $("th#row_title", table).each(function () {
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
      var selector, 
          getHandler = function () {
            var id = $(this).attr("id");

            if(id === 'row_title')
               return;

            id = Number(id.charAt(id.length-1));
            console.log(id);
            return clickHandlers[selector](output[id]);
      };

      for(selector in clickHandlers) {
         $(selector, dom).click(getHandler);
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
   var buildTable = function () {
      var i;

      if(!target) {
         console.log("specify target first");
         return;
      }

      dom = $("<div id=" + target + ">");

      if(!output || !data) {
         console.log("no output or data");
         return;
      }

      /* If titles are undefined, use object properties */
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

   var print = function () {
      if(!target) {
         console.log("specify target first");
         return;
      }

      $("#" + target).replaceWith(dom);
   };

   var resetOutput = function () {
      output = data;
   };

   /* Priviledged functions */

   /* 
    * Data management 
   */

   /**
    * Function removes all data elements.
   */
   this.flushData = function () {
      data = [];
      resetOutput();
   };

   /**
    * Function changes the data variables of the table to _data.
    *
    * @param _data {Object|Object[]} data object or data array
   */
   this.setData = function (_data) {
      data = _data || null;
      if(data && !$.isArray(data))
         data = [data];

      resetOutput();
   };

   /**
    * Function appends a data element to the table data.
    *
    * @param _data {Object} data object
    * @return true if the append operation succeeds
   */
   this.appendData = function (dataElement) {
      if(typeof dataElement === 'undefined' || !dataElement) {
         console.log("cannot append empty data");
         return false;
      }

      if(!data)
         data = [];

      data.push(dataElement);
      resetOutput();
      return true;
   };

   /*
    * Table output management 
   */

   /**
    * Function filters the output according to a regex. 
    *
    * @param prop {String} the property to filter 
    * @param regex {Object} a JS RegExp object
   */
   this.filterTable = function (prop, regex) {
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

      buildTable();
      print();
   };

   /**
    * Function displays the existing or new data (parameter)
    * as a table in the target location.
    *
    * @param _data {Object[]|Object} data element or array or undefined
   */
   this.display = function (_data) {
      if(typeof _data !== 'undefined') {
         this.setData(_data);
      }

      buildTable();
      print();
   };

   /**
    * Function appends a dataElement to the data
    * and displays the modified table.
    *
    * @param _data {Object} a data element
    * @return true if append operation succeeds
   */
   this.append = function (dataElement) {
      if(!this.appendData(dataElement))
         return false;

      buildTable();
      print();
      return true;
   };
   
   /*
    * Target management
   */

   /**
    * Function set the target parameter for the table.
    *
    * @param _target {String} the id of the target element
   */
   this.setTarget = function (_target) {
      target = _target;
   };

   /**
    * Function changes the target parameter and print
    * the table to the new location.
    *
    * @param _target {String} the id of the target element
   */
   this.printTo = function (_target) {
      target = _target;
      print();
   };

   /*
    * Event handlers
   */

   /**
    * Function allows the user to get data from the clicked row.
    * The handler calls the callback function with the data
    * of the clicked element.
    *
    * Doesn't apply to the title bar.
    *
    * @param selector {String} the css selector of the object(s)
    * @param callback {Function} a callback function
   */
   this.onClick = function (selector, callback) {
      clickHandlers[selector] = callback;
   };

};

