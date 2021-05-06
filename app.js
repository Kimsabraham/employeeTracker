// dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

// SQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123",
  database: "employeeTracker",
});

