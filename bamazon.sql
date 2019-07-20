DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

use bamazon;

CREATE Table product (
item_id integer(10) AUTO_INCREMENT NOT NULL,
product_name varchar(30) NOT NULL,
department|_name varchar(30) NOT NULL,
price INTEGER(15) NOT null,
stock_qty INTEGER(4),
 PRIMARY KEY (item_id)
);