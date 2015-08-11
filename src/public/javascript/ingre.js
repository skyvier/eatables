$(function () {
   /* dbHandler defined by dbscript.js */
   var dataHandler = new dbHandler('192.168.1.42', 1337, console.log);

   /* Ingredient table titles */
   var tableTitles = {
      manufacturer: "Brand",
      name: "Name",
      type: "Type",
      measure: "Amount",
      measure_unit: "In",
      price: "Price",
      sources: "Sources"
   };

   /* Ingredient table */
   var ingreTable = new eatables.table("ingredients", null, 
      tableTitles, true, function (err) {
         if(err)
            console.log(err);
      });

   ingreTable.setTableClass("data");

   /* Respond to search_query response from the server */
   dataHandler.onResponse('ingredients_request', function (data) {
      if(data.results.length === 0) {
         console.log("no search results");
         return;
      }

      ingreTable.display(data.results);
   });

   dataHandler.listen();
   dataHandler.queryObject(new dbObject('ingredients', {}, 'ingredients_request'), 0);
});
