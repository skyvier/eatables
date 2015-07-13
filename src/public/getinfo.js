$(function () {
   var socket = io.connect('http://localhost:1337');
   console.log("socket created!");

   socket.on('food_response', function (data) {
      console.log("got response");
      if(typeof data == "string")
         $("#foodinfo").text(data);
      else
         $("#foodinfo").text(data.type);
   });

   $("#food_request").click(function () {
      console.log("button pushed");
      console.log($("#foodname").val());
      var searchParam = {
         collection: "foods",
         values: {
            name: $("#foodname").val()
         }
      };
      console.log(searchParam);
      console.log(searchParam.values);
      socket.emit('query', searchParam);
      console.log("sent request");
   });

   $("#insert_button").click(function () {
      console.log("insert button pushed");
      var insert_param = {
         collection: "foods",
         values: {
            name: $("#name").val(),
            type: $("#type_select").val(),
            effort: $("#diff_slider").val()
         }
      };
      console.log(insert_param);
      console.log(insert_param.values);
      socket.emit('insert', insert_param);
      console.log("sent insert");
   });

   $("#diff_slider").change(function () {
      var value = $("#diff_slider").val();
      console.log(value);
      $("#indicator").text(value);
   });

});

