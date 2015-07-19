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
   if(_target === undefined) {
      if(typeof callback === 'function') 
         return callback("table has no target");

      return null;
   }

   if($("#" + _target).length === 0) {
      if(typeof callback === 'function')
         return callback("target element does not exist");

      return null;
   }

   var target = _target;
   var tableDom;

   var makeSortable = function (dom) {
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
   var constructDom = function (data) {
      var dom = $("<div id=" + target + ">");
      var i;

      if(!data)
         return dom;

      row(dom, Object.keys(data[0]), "title");
      
      for(i = 0; i < data.length; i++) {
         row(dom, data[i], i);
      }

      $("tr", dom).wrapAll("<table></table>");

      if(sortable)
         makeSortable(dom);

      $("div#" + target).replaceWith(dom);

      return dom;
   };

   var construct = function () {
      tableDom = constructDom(_data);
      callback(null);
   }();

   this.printTo = function (_target) {
      $("div#" + _target).replaceWith(dom);
   };

   this.changeData = function (_data) { 
      tableDom = constructDom(_data);
   };
};


