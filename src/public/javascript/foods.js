$(function () {
   /* Variables */

   var dataHandler = new dbHandler('localhost', 337, function () {
      // if an error occurs, change the page to an error page
      // TODO: make this work
      if(err) {
         console.log(err);
         $.post('localhost:1337/error', { error: err })
            .done(function () {
               window.location.replace("/error.html");
            })
            .fail(function () {
               window.location.replace("/error_fail.html");
            });
      }
   });

   var currentType = "Main";

   /* Table functionalities */

   // creates a sortable table with no data
   var resultTable = new eatables.table("foods", null, true, function (err) {
      if(err) {
         console.log("result table craetion error: " + err);
         return;
      }

      // only adds the destination function if table is created
      // an unfortunate side effect of using socket.io instead of ajax
      dataHandler.onResponse('type_request', function (data) {
            console.log("got response");

            if(resultTable)
               resultTable.changeData(data.results); 
      });
   });

   /* dbHandler functionalities */

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
      resultTable.filterData("name", new RegExp("^" + $(this).val(), "i"));
   });

});

