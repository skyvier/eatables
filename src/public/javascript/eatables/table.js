/* 
 * Functionalities for expressing database 
 * data in the eatables web page.
*/

var eatables = eatables || {};

/* Data presentation functions */

// TODO: clean this mess
// JS and OOP ftw.

/*
 * Creates a html table object that can be
 * moved, changed and sorted.
 *
 * @param _target id of the target dom
 * @param _data the data array (can be null)
 * @param _titles the data value titles (can be null)
 * @param sortable true for sortable table
 * @param callback the callback(err) function
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

   var data = _data; // the source data
   var target = _target; // the id of the current target (div)
   var output = _data; // (filtered) data
   var titles = _titles; // titles for specific data keys
   var dom;
   
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

   var row = function (target, elements, id) {
      var td_value;
      for(var p in titles) {
         td_value = elements[p] || "-";
         target.append("<td id=row_" + id + ">" + td_value + "</td>");
      }

      $("td#row_" + id, target).wrapAll("<tr id=row_" + id + "></tr>");
   };

   // you can also create a table without data
   var constructDom = function () {
      var i;
      dom = $("<div id=" + target + ">");

      if(!output || !data)
         return;

      titles = titles || Object.keys(data[0]);

      row(dom, titles, "title");
      
      for(i = 0; i < output.length; i++) {
         row(dom, output[i], i);
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

   /*
    * Function prints the table to a dom element (div).
    *
    * @param _target the id of the target element
   */
   this.printTo = function (_target) {
      target = _target;
      print();
   };

   /*
    * Function get data from the clicked row.
    * The handler calls the callback function with the data
    * of the clicked element.
    *
    * @param selector the css selector of the object(s)
    * @param callback a callback function
   */
   this.onClick = function (selector, callback) {
      console.log("adding a click handler for: " + selector);
      clickHandlers[selector] = callback;
   };

   /*
    * Function changes the source data for the table. 
    *
    * @param _data the data array 
   */
   this.changeData = function (_data) { 
      setData(_data);
      constructDom();
      print();
   };

   /*
    * Function filters the output according to a regex. 
    *
    * @param prop the property to filter 
    * @param regex a JS RegExp object
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

