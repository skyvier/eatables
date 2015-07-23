$(function () {
   var dataHandler = new dbHandler('192.168.1.42', 1337, console.log);
   var dataList = new eatables.appendableList($("#suggestions"), "option");
   var foodInfo = new eatables.structure($("div.foodbox"));

   dataHandler.onResponse('search_query', function (data) {
      console.log("got response");
      dataList.updateData(data.results, "name");  
   });

   dataHandler.onResponse('search_result', function (data) {
      if(data.results.length === 0)
         return;

      data = data.results[0];

      console.log("got data");
      var alaotsikko = data.type + " / " + data.effort;
      foodInfo.change("h2.otsikko", "text", data.name);
      foodInfo.change("h3.alaotsikko", "text", alaotsikko);
      foodInfo.change("td#time", "text", data.time || "-");
      foodInfo.change("td#portions", "text", data.portions || "-");
      foodInfo.change("td#recipe", "text", data.recipe || "-");
   });

   dataHandler.listen();

   function submitForm() {
      console.log("submitted!");
      var sVal = $("#search").val();
      var foodsObj = new dbObject('foods', { name: sVal }, 
                             'search_result');
      if($("#food").is(':checked')) {
         dataHandler.queryObject(foodsObj, 1);
      }

      return false;
   }

   $("#search").on('input', function () {
      var sVal = $(this).val();

      // don't do the query with empty input value
      if(sVal === "")
         return;

      // submit form automatically if a proper option is typed
      if($("#suggestions").find("option").filter(function (index) {
         return $(this).val() === sVal;
      }).length !== 0) {
         submitForm();
      }

      // so far searches only for foods
      var foodsObj = new dbObject('foods', { name: new dbRegex('^' + sVal, 'i') }, 
                             'search_query');
      if($("#food").is(':checked')) {
         dataHandler.queryObject(foodsObj, 5);
      }
   }); 

   $("#search_form").on('submit', submitForm);
});
