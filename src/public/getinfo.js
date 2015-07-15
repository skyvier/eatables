$(function () {
   /*
    * Socket.io functionalities
   */
   
   var dataHandler = new dbHandler('localhost', 1337);

   /*
    * Site element functionalities
   */

   $("#food_request").click(function () {
      console.log("button pushed");
      var obj = new dbObject('foods', { name: $("#foodname").val() });
      dataHandler.queryObject(obj, function (err, data) {
         console.log("got response");
         if(err) {
            $("#foodinfo").text(data);
            return;
         }

         $("#foodinfo").text(JSON.stringify(data, null, 4));
      });
   });

   $("#insert_button").click(function () {
      console.log("insert button pushed");
      var obj = new dbObject('foods', 
         { name: $("#name").val(),
           type: $("#type_select").val(),
           effort: $("#diff_slider").val()
         });

      dataHandler.insertObject(obj, function (err) {
         if(err)
            console.log(err);
      });
   });

   $("#diff_slider").change(function () {
      var value = $("#diff_slider").val();
      console.log(value);
      $("#indicator").text(value);
   });

});

