$(function () {
   /* Variables */

   var dataHandler = new dbHandler('localhost', 1337);

   /* Socket.io functionalities */

   var resultTable = new eatables.table("typeinfo", null, true, function (err) {
      if(err) {
         console.log("result table craetion error: " + err);
         return;
      }

      dataHandler.onResponse('type_request', function (data) {
            console.log("got response");

            $("#bytype").text(JSON.stringify(data, null, 4));

            if(resultTable)
               resultTable.changeData(data.results); 
      });
   });

   dataHandler.onResponse('name_request', function (data) {
         console.log("got response");
         
         // if the response wasn't a database object
         $("#foodinfo").text(JSON.stringify(data.results, null, 4));
   });

   dataHandler.listen();

   /*
    * Site element functionalities
   */
   
   $("#type_request").click(function () {
      console.log("type request pushed");
      var obj = new dbObject('foods', { type: $("#foodtype").val() }, 'type_request');
      dataHandler.queryObject(obj, 0);
   });

   $("#food_request").click(function () {
      console.log("button pushed");
      var obj = new dbObject('foods', { name: $("#foodname").val() }, 'name_request');
      dataHandler.queryObject(obj, 1);
   });

   $("#insert_button").click(function () {
      console.log("insert button pushed");
      var obj = new dbObject('foods', 
         { name: $("#name").val(),
           type: $("#type_select").val(),
           effort: $("#diff_slider").val()
         });

      dataHandler.insertObject(obj);
   });

   $("#diff_slider").change(function () {
      var value = $("#diff_slider").val();
      console.log(value);
      $("#indicator").text(value);
   });
});

