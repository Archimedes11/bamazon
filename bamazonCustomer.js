var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// creates a connection object to connect to the DB
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// Connects to the DB
connection.connect(function (err) {
    if (err) {
        console.error("error: " + err.stack);
    }
    productDisplay();
});

// Displays the products available for purchase from bamazon
function productDisplay() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        customerProduct(res);
    });
}

// Asks the user what the item ID number is for the item they want to buy.
function customerProduct(inventory) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the 'ID' of the item you would you like to purchase? (Press 'Q' to Quit)",
                validate: function (val) {
                    return !isNaN(val) || val.toLowerCase() === "q";
                }
            }
        ])
        .then(function (val) {
            quitQuestion(val.choice);
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);
            // If the product is in stock, it assigns that amount to the variable "customerQuantity"
            // else, it lets the user know that the item is out of stock
            if (product) {
                customerQuantity(product);
            }
            else {
                console.log("\n");
                console.log("***");
                console.log("That item is out of stock.");
                console.log("***");

                productDisplay();
            }
        });
}

// Asks the user how much of the product do they want to buy.
function customerQuantity(product) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many " + product.product_name + "s would you like to buy? (Press 'Q' to Quit)",
                validate: function (val) {
                    return val > 0 || val.toLowerCase() === "q";//takes an input of capital Q as well as lowercase
                }
            }
        ])
        .then(function (val) {
            quitQuestion(val.quantity);
            var quantity = parseInt(val.quantity);
            // If the stock quantity is lower than the customerQuantity then it lets the user know.
            if (quantity > product.stock_quantity) {
                console.log("\n");
                console.log("***");
                console.log("Not enough " + product.product_name + "s in stock.");
                console.log("***");

                productDisplay();
            }
            // else the user buys the product
            else {
                buyProduct(product, quantity);
            }
        });
}

// Changes the amount of a product a user buys in the DB and then notifies them of their purchase.
function buyProduct(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function (err, res) {
            console.log("\n");
            console.log("***");
            console.log("You've bought " + quantity + " " + product.product_name + "s.");
            console.log("***");
            productDisplay();
        }
    );
}

// checkInventory checks to see if the item the user wants is in stock.
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
    return null;
}

// Prompts the user to see if they woud like to exit.
function quitQuestion(choice) {
    if (choice.toLowerCase() === "q") {
        console.log("Goodbye!");
        process.exit(0);
    }
}
