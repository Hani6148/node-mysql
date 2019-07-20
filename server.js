var mysql = require("mysql");
var inquirer = require("inquirer");
myport=3306;
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  port: myport,

  // Your username
  user: "root",

  // Your password
  password: "hani",
  database: "bamazon" 
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("you are connected on port",myport);
  startApp();
});

function startApp(){
    connection.query("select * from product",function(err,res){
        if(err) throw err;
        
        for (i=0 ; i<res.length;i++){
            console.log( "id: ", res[i].item_id,"  | product name: ",res[i].product_name,"  | price: ",res[i].price,"  | stock quantity: ",res[i].stock_qty,"\n");
        }
        inquirer.prompt(
            [
                {
                    name:"id",
                    type:"input",
                    message: "what is the ID of the item you want to purchase",
                    validate: function(value) {
                        if (isNaN(value) === false && value <= res.length) {
                          return true;
                        }
                        console.log("  this id does not exist")
                        return false;
                        
                      }

                },{
                    name:"qty",
                    type:"input",
                    message:"how many items of the same category do you want to purchase ?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                },{
                    name:"yes",
        type:"confirm",
        message: "do you confirm ?",
        default:true
                }

            ]).then(function(data){
             if(data.yes){
                for (i=0; i<res.length;i++){
                    if (res[i].item_id==data.id){
                        ourItem=res[i].item_id;
                        ourqty=data.qty
                        ourPrice=res[i].price,
                        
                        makeOrder(ourItem,ourqty,res[i].stock_qty,ourPrice);
                        break;
                    }
                   
                }
                
            }
            else{
                startApp();
            }
            })
    })
}

function makeOrder(ourItem,ourqty,stock,price){
    if(ourqty>stock){
        console.log("the amount of items available is insufficient");

        restartApp();
    }
    else{
        newqty=stock-ourqty;
        bill=price*ourqty;
        connection.query("update product set ? where ?",[{stock_qty:newqty},{item_id:ourItem}]);
        console.log("you have succesfully placed your order \n your total is:",bill," $");
        console.log("-----------------------------------------------------------------------------------\n\n\n\n\n\n\n\n\n")
        restartApp();
    }
}

function restartApp(){
    inquirer.prompt({
        name:"restart",
        type:"confirm",
        message: "do you want to make another purchase:",
        default:true
    }).then(function(data){
    if(data.restart){
        startApp();
    }
    else{
        connection.end();
    }
    })
}