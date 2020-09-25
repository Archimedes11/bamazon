DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INTEGER(10) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox", "Electronics", 500, 27),
  ("Computer", "Electronics", 900, 12),
  ("Guitar", "Music", 400, 4),
  ("Piano", "Music", 950, 1),
  ("Soccer Ball", "Sporting Goods", 25, 40),
  ("Fishing Rod", "Sporting Goods", 50, 30),
  ("Sunglasses", "Fashion", 300, 15),
  ("Purse", "Fashion", 250, 10),
  ("Oven", "Cooking", 600, 35),
  ("Spatula", "Cooking", 5, 55);