require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
//var db = require("./dbconnect.js");
//var procedctsForsale = require("./products.txt");
var fs = require("fs");


//let connection = new  connection (MYSQLCONNECTION());

//console.log(connection)
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "now4kids",
    database: "bamazon_DB"

  });
  
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
 //buyItem();
 console.log('connected')
 buyItem();
 //connection.end();
});


function buyItem() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    //console.log(results);
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        
          {
            name: "choice",
            type: "rawlist",
            //choices: ["POST", "BID", "EXIT"],
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                var product_info= "";
                product_info = results[i].product_name + " " + results[i].department_name  + " " +  " for " +   results[i].price;
                choiceArray.push(product_info);
              }
              return choiceArray;
            },
            message: "What item would you like to purchase?"
          },
        {
          name: "qty",
          type: "input",
          message: "How many would you like to purchase?"
        },
       // Here we ask the user to confirm.
       {
        type: "confirm",
        message: `Please confirm your purchase:`,
        name: "confirm",
        default: true
      }
      ])
      .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.confirm) {
      //console.log('cmd in inqurire ' + inquirerResponse.cmd);
      //console.log('searchValue from inqurier ' + inquirerResponse.searchValue);
     // cmd = inquirerResponse.cmd;
      //searchValue = inquirerResponse.searchValue;
      //processCmd(cmd, searchValue);
      console.log(inquirerResponse)

    }
    else {
      console.log("\nThat's okay, let me know when you are ready to the search again.\n");
    };
  })
  connection.end();
})
}3
