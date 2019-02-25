DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quanity INT default 0,
  PRIMARY KEY (item_id)
);
INSERT INTO products(product_name,department_name,price,stock_quanity)
VALUES
("dog","pin",20.05,25),
("girl","pin",20.10,15),
("beach","pin",14.00,35),
("beer","pin",50.00,6),
("bear","plush",10.60,50),
("monkey","plush",10.00,23),
("snake","plush",10.00,4),
("doll house","toy",50.00,3),
("clown","toy",5.50,23),
("dragon","toy",15.00,22);
