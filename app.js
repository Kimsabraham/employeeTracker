// Dependcies
var mysql = require("mysql2");
var { prompt } = require("inquirer");
// SQL host
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "company_employeedb",
});
// connection
connection.connect(function (err) {
  if (err) throw err;
  runApp();
});
// List of actions
function runApp() {
  console.table("Employee!");
  prompt({
    name: "action",
    type: "rawlist",
    message: "Select a choice?",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Role",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee's Role",
      "Exit",
    ],
   