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
});

