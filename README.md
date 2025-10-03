# Verto-Assignment

# Inventory Management System API

A backend-heavy Node.js API to manage products in a warehouse, built with **Express** and **MySQL**. This API allows you to perform full CRUD operations on products, manage stock quantities, and check low-stock items.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Sample Data](#sample-data)

---

## Features

- **Product Management**: Create, Read, Update, Delete products.
- **Inventory Management**:
  - Increase stock quantity.
  - Decrease stock quantity with validation (cannot go below zero).
- **Low Stock Alert**: List products with stock below threshold.

---

## Technologies

- Node.js
- Express.js
- MySQL
- dotenv (for environment variables)
- nodemon (dev dependency for auto-reloading)

---

## Setup Instructions

bash
Copy code
npm install
Dependencies:

express

mysql2

dotenv

Dev Dependencies:

nodemon 

Create .env file in the root:

env
Copy code
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=inventory_db
PORT=5000
Replace your_mysql_user and your_mysql_password with your MySQL credentials.

Database Setup
Create database:

sql
Copy code
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;
Create products table:

sql
Copy code
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
Optional: Insert sample data:

sql
Copy code
INSERT INTO products (name, description, stock_quantity, low_stock_threshold)
VALUES
('Gaming Laptop', 'High performance gaming laptop', 10, 5),
('Mechanical Keyboard', 'RGB mechanical keyboard', 25, 5),
('Wireless Mouse', 'Ergonomic wireless mouse', 30, 10),
('Monitor', '27-inch 4K monitor', 15, 5),
('Headphones', 'Noise-cancelling headphones', 12, 3);
Running the Project
Start the server:

bash
Copy code
npm run dev
Server will run on http://localhost:5000 (or the port specified in .env).

Testing Endpoints:

Use Postman, Thunder Client, or cURL.

API Endpoints
Method	Endpoint	Body / Notes	Description
GET	/products	None	Get all products
GET	/products/:id	None	Get product by ID
POST	/products	{ "name": "Laptop", "description": "Gaming laptop", "stock_quantity": 10, "low_stock_threshold": 5 }	Create a new product
PUT	/products/:id	{ "name": "Laptop", "description": "Updated description", "stock_quantity": 15, "low_stock_threshold": 5 }	Update a product
DELETE	/products/:id	None	Delete a product by ID
POST	/products/:id/increase	{ "quantity": 5 }	Increase stock quantity
POST	/products/:id/decrease	{ "quantity": 3 }	Decrease stock quantity (fails if insufficient)
GET	/products/low-stock	None	List products where stock < low_stock_threshold
