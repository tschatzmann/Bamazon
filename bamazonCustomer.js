require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
//var db = require("./dbconnect.js");
//var procedctsForsale = require("./products.txt");
var fs = require("fs");

var itemStmt = "";
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

 startSale();
});
function startSale() {
  // query the database for all items being auctioned
  connection.query("SELECT department_name from products group by department_name;", function(err, results) {
    if (err) throw err;
    //console.log(results);
    inquirer
      .prompt([
       // Here we ask the user to confirm.
       {
        type: "confirm",
        message: `Welcome to Bamazon, would like to purchase an item?:`,
        name: "confirm",
        default: true
      }
      ])
      .then(function(startResponse) {
    if (startResponse.confirm) {
//      console.log(startResponse)
      GetDepartment();
  }
    else {
      console.log("\nThat's okay, let me know when you are ready to shop again.\n");
      connection.end();
    };
  })
})
}

function GetDepartment() {
  // query the database for all departments
  connection.query("SELECT department_name from products group by department_name;", function(err, results) {
    if (err) throw err;
    //console.log(results);
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        
          {
            name: "department",
            type: "rawlist",
            //choices: ["POST", "BID", "EXIT"],
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                var product_info= "";
                product_info = results[i].department_name
                choiceArray.push(product_info);
              }
              return choiceArray;
            },
            message: "Please chose a department to purchase from?"
          },
       // Here we ask the user to confirm.
       {
        type: "confirm",
        message: `Continue ?:`,
        name: "confirm",
        default: true
      }
      ])
      .then(function(DepartmentResponse) {
        if (DepartmentResponse.confirm) {
            buyItem(DepartmentResponse);

      }
        else {
      console.log("\nThat's okay, let me know when you are ready to shop again.\n");
      startSale();
      };
    })
})
}
//
function buyItem(DepartmentResponse) {
 // console.log(DepartmentResponse);
  // query the database for all items being auctioned
  connection.query( "SELECT * FROM products WHERE ?",{department_name: DepartmentResponse.department},function(err, results) {
    if (err) throw err;
    //console.log(results);
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([      
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
               var product_info= "";
               product_info = results[i].product_name + ", " + results[i].department_name  + ", " +  " for " +   results[i].price;
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
        message:"Please confirm your purchase.",
        name: "confirm",
        default: true
      }
      ])
      .then(function(inquirerResponse) {
    if (inquirerResponse.confirm) {
      var chosenItem;
     // console.log(results.length);
     // console.log(inquirerResponse.choice);
      str = inquirerResponse.choice;
     // console.log(str);
      var userChoice = str.split(", ")
       //var userChoice = str[0] - 1;
     // console.log(userChoice)
      userChoice = userChoice[0];
      //console.log('after parsing')
     // console.log(userChoice)
      for (var i = 0; i < results.length; i++) {
        if (results[i].product_name == userChoice) { 
          chosenItem = results[i];
          //console.log(chosenItem);
        }
      }   
     // console.log(inquirerResponse)
      //console.log(chosenItem)
      //console.log(chosenItem.item_id)
      connection.query(
        "SELECT * FROM products WHERE ?",{item_id: chosenItem.item_id},
        function(err, results) {
          if (err) throw err;
        //  console.log(inquirerResponse)
        //  console.log(results[0])
          //
          qty = parseInt(inquirerResponse.qty)
          if (results[0].stock_quanity > qty){
            var totalPurchase = (qty * chosenItem.price);
            var msg = `Your purchase of ${inquirerResponse.qty} ${chosenItem.product_name} ${chosenItem.department_name} comes to ${totalPurchase}`
            var newQty = results[0].stock_quanity - qty;
          //  console.log(newQty);
          //  console.log(chosenItem.item_id)
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quanity: newQty
                },
                {
                  item_id: chosenItem.item_id
                }
              ],
              function(err) {
                if (err) throw err;
                console.log(msg)
                startSale();
              }
            );
          }
          else{
            msg = `Sorry we only ${results[0].stock_quanity} in stock for ${chosenItem.product_name} ${chosenItem.department_name}`
            console.log(msg);
            startSale();
          }
     
         })
        }
         else {
           console.log("\nThat's okay, let me know when you are ready to purchase an item.\n");
           startSale();
         }
        }

)
})
};
