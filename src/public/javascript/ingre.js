$(function () {
   $.getJSON("../configs.json").done(function (configs) {
      if(typeof configs === 'undefined') {
         console.log("configs is undefined");
         return;
      }

      // Read the configuration file and set the proper ingredient
      // type options.
      var typeList = new eatables.appendableList($("select#type"), "option");
      typeList.updateTextsAndValues(configs.ingredients.types);

      // Read the configuration file and set the proper ingredient
      // measure unit options.
      var unitList = new eatables.appendableList($("select#measure_unit"), "option");
      unitList.updateTextsAndValues(configs.ingredients.measure_units);
   }).fail(function () {
      // Reading the configurations has failed
      
      console.log("couldn't load configurations");
      window.open("../error.html");
   }).always(function () {

   /* dbHandler defined by dbscript.js */
   var dataHandler = new dbHandler('192.168.1.42', 1337, console.log);

   /* Ingredient table titles */
   var tableTitles = {
      manufacturer: "Brand",
      name: "Name",
      type: "Type",
      measure: "Amount",
      measure_unit: "In",
      price: "Price",
      sources: "Sources"
   };

   /* Ingredient table */
   var ingreTable = new eatables.table("ingredients", null, 
      tableTitles, true, function (err) {
         if(err)
            console.log(err);
      });

   ingreTable.setTableClass("data");

   /* Respond to search_query response from the server */
   dataHandler.onResponse('ingredients_request', function (data) {
      if(data.results.length === 0) {
         console.log("no search results");
         return;
      }

      ingreTable.display(data.results);
   });

   dataHandler.listen();
   dataHandler.queryObject(new dbObject('ingredients', {}, 'ingredients_request'), 0);

   /* form submit function */
   function validateAndInsert() {
      // ingredient name and measure is required 
      if($("#name").val().length === 0 || $("#measure").val().length === 0) {
         alert("Ingredient name and amount are required!");
         return false;
      }

      var values = {
         manufacturer: $("#manufacturer").val() || "",
         name: $("#name").val(),
         type: $("#type").val(),
         measure: $("#measure").val(),
         measure_unit: $("#measure_unit").val(),
         price: $("#price").val() || "",
         sources: $("#sources").val() || ""
      };

      // replace ',' characters in a price or amount
      values.price = values.price.replace(',', '.');
      values.measure = values.measure.replace(',', '.');
      
      // create the database query object and insert the data
      var ingreObject = new dbObject('ingredients', values, 'insert_response');
      dataHandler.insertObject(ingreObject);

      return true;
   }

   $("#add_ingre").on('submit', validateAndInsert);

   });
});
