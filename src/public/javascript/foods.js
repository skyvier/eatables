$(function () {
   /* Variables */

   var dataHandler = new dbHandler('192.168.1.42', 1337, function () {
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

   /* Food information functionalities */
   
   var foodInfo = new eatables.structure($("div.foodbox"));
   
   function updateInfo(data) {
      var alaotsikko = data.type + " / " + data.effort;
      foodInfo.change("h2.otsikko", "text", data.name);
      foodInfo.change("h3.alaotsikko", "text", alaotsikko);
      foodInfo.change("td#time", "text", data.time || "-");
      foodInfo.change("td#portions", "text", data.portions || "-");
      foodInfo.change("td#recipe", "text", data.recipe || "-");
   }

   /* Table functionalities */

   var foodTableTitles = {
      name: "Name",
      time: "Time",
      portions: "Portions",
      effort: "Effort"
   };

   // creates a sortable table with no data
   var resultTable = new eatables.table("foods", null, foodTableTitles, 
      true, function (err) {

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
            
            /* Display the information of the first result */
            updateInfo(data.results[0]);
      });
   });

   resultTable.onClick("tr", function (data) {
      console.log("got data");
      updateInfo(data);
   });

   /* dbHandler functionalities */

   dataHandler.listen();
   dataHandler.queryObject(new dbObject('foods', { type: "Main" }, 'type_request'), 0);

   /*
    * Site element functionalities
   */

   function typeSearch(_type) {
      $('h2#type_title').text(_type);
      var obj = new dbObject('foods', { type: _type }, 'type_request');
      dataHandler.queryObject(obj, 0);
   }

   $("#main").click(function () {
      typeSearch("Main");
   });

   $("#dessert").click(function () {
      typeSearch("Dessert");
   });

   $("#add").click(function () {
      window.location.replace("/new_food.html");
   });

   $("#search_foods").keyup(function () {
      resultTable.filterData("name", new RegExp("^" + $(this).val(), "i"));
   });

});

