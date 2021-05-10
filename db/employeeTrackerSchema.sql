DROP DATABASE IF EXISTS company_employeeDB;
CREATE database company_employeeDB;

USE company_employeeDB;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(10) NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Management"), 
("Sales"),  
("Finance"), 
("Human Resources"),
("Operations"), 
("Research"),
("Creative"),
("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 60000, 1), 
("Creative Director", 48000, 2), 
("Marketing", 49000, 3),
("Sales", 48000, 3),
("Accountant", 43000, 2),
("Operations", 40000, 2), 
("Research", 85000, 1),
("HR", 70000, 2),
("Customer Service Rep", 40000, 3),
("IT", 100000, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Scott", "Davis", 1, null),
("Bob", "Lee", 2, 1),
("Rob", "Stark", 3, 1),
("Andy", "Bernard", 4, 2),


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;