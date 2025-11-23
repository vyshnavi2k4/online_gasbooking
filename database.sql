CREATE DATABASE gas_booking;

USE gas_booking;

CREATE TABLE consumers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consumer_id VARCHAR(10) NOT NULL,
  mobile VARCHAR(10) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  distributor_name VARCHAR(100) NOT NULL,
  lpg_id VARCHAR(17) NOT NULL
);
USE online_gasbooking;
SELECT * FROM customers;
