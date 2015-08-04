$(function () {
   /* dbHandler defined by dbscript.js */
   var dataHandler = new dbHandler('192.168.1.42', 1337, console.log);

   /* An appendable <datalist> handler */
   var dataList = new eatables.appendableList($("#suggestions"), "option");

   /* A html structure where the values change */
   var foodInfo = new eatables.structure($("div.foodbox"));

   /* Table titles */
   var ingreTitles = {
      name: "Name",
      manufacturer: "Maker",
      type: "Type",
      amount: "Amount",
      price: "Price"
   };

   /* Ingredient table */
   var ingreTable = new eatables.table("ingredients", null, 
      ingreTitles, true, function (err) {
         if(err)
            console.log(err);
      });

   /* Respond to search_query response from the server */
   dataHandler.onResponse('search_query', function (data) {
      console.log("got response");
      dataList.updateData(data.results, "name");  
   });

   /* Respond to search_result response from the server */
   dataHandler.onResponse('search_result', function (data) {
      if(data.results.length === 0) {
         console.log("no search results");
         return;
      }

      ingreTable.flushData();

      data = data.results[0];
      if(data.collection === 'foods') {
         var subtitle = data.type + " / " + data.effort;
         foodInfo.change("h2.otsikko", "text", data.name);
         foodInfo.change("h3.alaotsikko", "text", subtitle);
         foodInfo.change("td#time", "text", data.time || "-");
         foodInfo.change("td#portions", "text", data.portions || "-");
         foodInfo.change("td#recipe", "text", data.recipe || "-");

         /* TODO: query ingredient details and append them to talbe */
      } else if(data.collection === 'ingredients') {
         ingreTable.display(data); 
      }
   });

   /* Initialize dbHandler with the previous responses */
   dataHandler.listen();

   /* Search form submit function, queries data */
   function submitForm() {
      var sVal = $("#search").val();
      var foodsObj = null, ingreObj = null;

      console.log("submitted!");

      if($("#food").is(':checked')) {
         foodsObj = new dbObject('foods', { name: sVal }, 
            'search_result');
      }

      if($("#ingredient").is(':checked')) {
         ingreObj = new dbObject('ingredients', { name: sVal }, 
            'search_result');
      }

      dataHandler.queryGlobal(ingreObj, foodsObj, 1);

      return false;
   }

   /* Runs whenever the input field changes (updates options) */
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
