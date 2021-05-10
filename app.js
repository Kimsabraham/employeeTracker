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
        viewEmployees();
        break;
      case "View All Employees by Department":
        viewDep();
        break;
      case "View All Employees by Role":
        viewRoles();
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
// functions of user inputs
function viewEmployees() {
  var query = `SELECT employee.first_name, employee.last_name, 
    employee.role_id, role.title, role.salary, role.id
    FROM employee 
    INNER JOIN role ON (employee.role_id = role.id)
    ORDER BY employee.role_id    
    `;
  connection.query(query, null, function (err, res) {
    console.table(res);
  });
  runApp();
}
function viewDep() {
  prompt({
    name: "department",
    type: "input",
    message: "Which Department would you like to view?",
  }).then(function (answer) {
    var query = `SELECT department.name, employee.role_id, department.id, 
        employee.first_name, employee.last_name, role.department_id, role.id
        FROM department 
        INNER JOIN role ON (department.id = role.department_id)
        INNER JOIN employee ON (role.id = employee.role_id)
        WHERE (department.name = ?)
        ORDER BY department.id
        `;
    connection.query(query, [answer.department], function (err, res) {
      console.table(res);
      runApp();
    });
  });
}
// list of roles
function viewRoles() {
  prompt({
    name: "role",
    type: "rawlist",
    message: "Which Role would you like to view?",
    choices: [
      "Manager",
      "Creative Director",
      "Marketing",
      "Sales Team",
      "Accountant",
      "Operations",
      "Researche",
      "HR Representative",
      "Customer Service Rep.",
      "IT",
    ],
  }).then(function (answer) {
    var query = `SELECT employee.role_id, employee.first_name, employee.last_name, 
        role.department_id, role.title, role.salary
        FROM role 
        INNER JOIN employee ON (role.id = employee.role_id)
        WHERE (role.title = ?)
        ORDER BY role.title
        `;
    connection.query(query, [answer.role, answer.role], function (err, res) {
      console.table(res);
      runApp();
    });
  });
}
function addDep() {
  prompt({
    name: "newDepartment",
    type: "input",
    message:
      "What is the Name of the new Department that you would like to add",
  }).then(function (answer) {
    const query = `INSERT INTO department (name)
        VALUES (?);
        `;
    connection.query(query, [answer.newDepartment], function (err, res) {
      console.table(res);
      console.log("Its been added!");
      runApp();
    });
  });
}
function addRole() {
  prompt([
    {
      name: "newRole",
      type: "input",
      message: "Title of the new Role?",
    },
    {
      name: "salary",
      type: "input",
      message: "Salary of the new Role?",
    },
    {
      name: "departmentId",
      type: "input",
      message:
        "What is the Department Id of the new Role?"
    },
  ]).then(function (answer) {
    const query = `INSERT INTO role (title, salary, department_id)
        VALUES (?, ?, ?);
        `;
    connection.query(
      query,
      [answer.newRole, answer.salary, answer.departmentId],
      function (err, res) {
        console.table(res);
        console.log("Its been added!");
        runApp();
      }
    );
  });
}
function addEmployee() {
  prompt([
    {
      name: "firstName",
      type: "input",
      message: "First name of the new Employee?",
    },
    {
      name: "lastName",
      type: "input",
      message: "Last name of the new employee?",
    },
  ]).then(function (answer) {
    const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, 4, 1);
        `;
    connection.query(
      query,
      [answer.firstName, answer.lastName],
      function (err, res) {
        console.table(res);
        console.log("Its been added!");
        runApp();
      }
    );
  });
}
function updateRole() {
  prompt([
    {
      name: "title",
      type: "input",
      message: "New title of the role you want to update?",
    },
    {
      name: "salary",
      type: "input",
      message: "New salary of the updated Role?",
    },
    {
      name: "departmentId",
      type: "input",
      message:
        "New department Id of the updated Role?"
    },
  ]).then(function (answer) {
    const query = `UPDATE role 
        SET title = ?, salary = ?, department_id = ?
        WHERE title = ?;
        `;
    connection.query(
      query,
      [answer.title, answer.salary, answer.departmentId, answer.title],
      function (err, res) {
        console.table(res);
        console.log("Its been added!");
        runApp();
      }
    );
  });
}