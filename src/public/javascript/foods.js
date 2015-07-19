$(function () {
   /* Variables */

   var dataHandler = new dbHandler('localhost', 1337);
   var currentType = "Main";

   /* dbHandler functionalities */

   // creates a sortable table with no data
   var resultTable = new eatables.table("foods", null, true, function (err) {
      if(err) {
         console.log("result table craetion error: " + err);
         return;
      }

      // an unfortunate side effect of using socket.io instead of ajax
      dataHandler.onResponse('type_request', function (data) {
            console.log("got response");

            if(resultTable)
               resultTable.changeData(data.results); 
      });
   });

   dataHandler.listen();

   dataHandler.queryObject(new dbObject('foods', { type: "Main" }, 'type_request'), 0);

   /*
    * Site element functionalities
   */
   
   $("#main").click(function () {
      console.log("main type request");
      currentType = "Main";
      var obj = new dbObject('foods', { type: "Main" }, 'type_request');
      dataHandler.queryObject(obj, 0);
   });

   $("#dessert").click(function () {
      console.log("dessert type request");
      currentType = "Dessert";
      var obj = new dbObject('foods', { type: "Dessert" }, 'type_request');
      dataHandler.queryObject(obj, 0);
   });

   $("#search_foods").keyup(function () {
      var obj = new dbObject('foods', { type: currentType, 
      name: new dbRegex("^" + $(this).val(), "i") }, 'type_request'); 
      dataHandler.queryObject(obj, 0);
   });

});

