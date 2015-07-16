/* 
 * Functionalities for expressing database 
 * data in the eatables web page.
*/

var eatables = eatables || {};

/* Data presentation functions */


// TODO: just change the dom to the new data
// dont create a new table

/*
 * Adds a table object to a division.
 *
 * @param div id of the division
 * @param data the data array
*/
eatables.table = function (_target, data) {
   // var dom = $("_target") ?
   var dom = $("<div id=" + _target + ">");
   var target = _target;

   var sortable = function () {
      var table = $("table", dom);
      var title_row = $("td#row_title", table);

      title_row.each(function () {
         var index = title_row.index(this);
         var inverse = false;
         console.log(index);
         
         $(this).click(function () {
            console.log("I was clicked: " + index);
            table.find('td').not("#row_title").filter(function () {
               console.log($(this, table).index());
               return $(this, table).index() === index;
            }).sortElements(function (a, b) {
               return $(a, table).text() > $(b, table).text() ?
                 (inverse ? -1 : 1) : (inverse ? 1 : -1);
            }, function () { return this.parentNode; });

            inverse = !inverse;
         });
      });
   };

   var row = function (elements, id) {
      console.log("adding a row");

      for(var p in elements) {
         dom.append("<td id=row_" + id + ">" + elements[p] + "</td>");
      }

      $("td#row_" + id, dom).wrapAll("<tr></tr>");
   };

   var construct = function () {
      row(Object.keys(data[0]), "title");
      
      var i;
      for(i = 0; i < data.length; i++) {
         row(data[i], i);
      }

      $("tr", dom).wrapAll("<table></table>");

      sortable();
   }();

   this.print = function () {
      if($("div#" + target).length)
         $("div#" + target).replaceWith(dom);
      else
         console.log("the target doesn't exist");
   };

   this.changeDom = function () {
      dom.append("<p>Hello</p>");
   };


   this.changeTarget = function (_target) { target = _target; };
}


