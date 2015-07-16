$(function () {
   /* Socket.io functionalities */
   var dataHandler = new dbHandler('localhost', 1337);

   /*
    * Site element functionalities
   */

   var resultTable = {};

   dataHandler.onResponse('type_request', function (data) {
         console.log("got response");

         $("#bytype").text(JSON.stringify(data, null, 4));
         var resultTable = new eatables.table("theinfo", data.results);
         resultTable.printTo("typeinfo");
   });

   dataHandler.onResponse('name_request', function (data) {
         console.log("got response");
         
         // if the response wasn't a database object
         if(!data._id) {
            $("#foodinfo").text("No result");
            return;
         }

         $("#foodinfo").text(JSON.stringify(data, null, 4));
   });

   dataHandler.listen();

   $("#type_request").click(function () {
      console.log("type request pushed");
      var obj = new dbObject('foods', { type: $("#foodtype").val() }, 'type_request');
      dataHandler.queryObject(obj, 0);
   });

   $("#food_request").click(function () {
      console.log("button pushed");
      var obj = new dbObject('foods', { name: $("#foodname").val() }, 'name_request');
      dataHandler.queryOneObject(obj);
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

