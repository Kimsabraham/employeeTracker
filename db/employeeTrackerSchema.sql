-- deletes exisiting database
DROP DATABASE IF EXISTS employee_trackerDB;
-- creates database
CREATE database employee_trackerDB;

-- use database
USE employee_trackerDB;

-- creates department table
CREATE TABLE department (

id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
name VARCHAR(30) NOT NULL
 
);

-- creates role table
CREATE TABLE role (

id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT NOT NULL,
FOREIGN KEY (department_id) REFERENCES department (id)
);

-- creates employee table
CREATE TABLE employee (

id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
FOREIGN KEY (role_id) REFERENCES role (id),
manager_id INTEGER NULL,
FOREIGN KEY (manager_id) REFERENCES employee (id)
);

