/* 
 * Functionalities for expressing database 
 * data in the eatables web page.
*/

var eatables = eatables || {};

/* Data presentation functions */

// TODO: clean this mess

/*
 * Creates a html table object that can be
 * moved, changed and sorted.
 *
 * @param _target id of the target dom
 * @param _data the data array (can be null)
 * @param sortable true for sortable table
 * @param callback the callback(err) function
*/
eatables.table = function (_target, _data, sortable, callback) {

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

   /* Variables */

   var data = _data; // the source data
   var target = _target; // the id of the current target (div)
   var output = _data; // (filtered) data
   var dom; // the jquery object representing the html

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
         });
      });
   };

   var row = function (target, elements, id) {
      for(var p in elements) {
         target.append("<td id=row_" + id + ">" + elements[p] + "</td>");
      }

      $("td#row_" + id, target).wrapAll("<tr></tr>");
   };

   // you can also create a table without data
   var constructDom = function () {
      dom = $("<div id=" + target + ">");
      var i;

      if(!output)
         return;

      row(dom, Object.keys(output[0]), "title");
      
      for(i = 0; i < output.length; i++) {
         row(dom, output[i], i);
      }

      $("tr", dom).wrapAll("<table></table>");

      if(sortable)
         makeSortable(dom);
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
    * Function print the table to a dom element (div).
    *
    * @param _target the id of the target element
   */
   this.printTo = function (_target) {
      target = _target;
      print();
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
         output = [{ error: "No result" }];

      constructDom();
      print();
   };
};


