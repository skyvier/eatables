/* 
 * Functionalities for expressing database 
 * data in the eatables web page.
*/

var eatables = eatables || {};

/* Data presentation functions */

/*
 * Adds a table object to a division.
 *
 * @param div id of the division
 * @param data the data array
*/
eatables.table = function (name, data) {
   var dom = $("<div id=" + name + ">");
   var tableName = name;

   var row = function (elements, id) {
      var tr = $("<tr>");
      console.log("adding a row");

      for(var p in elements) {
         tr.append("<td id=row_" + id + ">" + elements[p] + "</td>");
      }

      dom.append(tr);
   };

   var construct = function () {
      dom.append("<table>");
      row(Object.keys(data[0]), "title");
      
      var i;
      for(i = 0; i < data.length; i++) {
         row(data[i], i);
      }
   }();

   this.printTo = function (divId) {
      $("#" + divId).append(dom);
   };
}


