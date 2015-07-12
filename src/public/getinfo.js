$(function () {
   var socket = io.connect('http://localhost:1337');
   console.log("socket created!");

   socket.on('food_response', function (data) {
      console.log("got response");
      $("#foodinfo").innerHTML = data.toString();
   });

   $("#food_request").click(function () {
      console.log("button pushed");
      var keyword = $("#foodname").value;
      socket.emit('food_request', { value: keyword });
      console.log("sent request");
   });
});

