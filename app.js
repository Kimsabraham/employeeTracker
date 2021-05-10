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
    message: "Select a choice",
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
    // case and switch based on input from user
  }).then(function (answer) {
    switch (answer.action) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "View All Employees by Department":
        viewAllDep();
        break;
      case "View All Employees by Role":
        viewAllRole();
        break;
      case "Add a Department":
        addDep();
        break;
      case "Add a Role":
        addRole();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update an Employee's Role":
        updateRole();
        break;
      case "Exit":
        connection.end();
        break;
    }
  });
}
