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

// starts application
connection.connect(function (err) {
  if (err) throw err;

  questions();
});

// questions for the user
function questions() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Choose below.",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Role",
        "Create a Department",
        "Create a Role",
        "Add an Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    // switch case for answers/choices
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View employees by their department":
          viewDepartments();
          break;

        case "View employees by their role":
          viewRoles();
          break;

        case "Create a new department":
          newDepartment();
          break;
        case "Create a new role":
          newRole();
          break;
        case "Add a new employee":
          newEmployee();
          break;
       
        case "Update current employee role":
          updateEmployee();
          break;
       
        case "Exit":
          connection.end();
          break;
      }
    });
}

// view all employees
function viewEmployees() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

    function (err, res) {
      if (err) throw err;

      console.table(res);
      questions();
    }
  );
}

// view employees by department
function viewDepartments() {
  connection.query(
    "SELECT department.name FROM employee_trackerDB.department",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
        ])
        .then(function (answer) {
          console.log(answer);
          console.log(answer.choice);

          connection.query(
            `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
      FROM employee_trackerDB.employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      WHERE department.name LIKE "${answer.choice}"`,
            function (err, res) {
              if (err) throw err;

              console.table(res);
              questions();
            }
          );
        });
    }
  );
}

// view  employees by role
function viewRoles() {
  connection.query("SELECT role.title FROM employee_trackerDB.role", function (
    err,
    res
  ) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
          message: "Which Role?",
        },
      ])
      .then(function (answer) {
        console.log(answer);
        console.log(answer.choice);

        connection.query(
          `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
        FROM employee_trackerDB.employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        WHERE role.title LIKE "${answer.choice}"`,
          function (err, res) {
            if (err) throw err;

            console.table(res);
            questions();
          }
        );
      });
  });
}

// create a department
function newDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department name?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        function (err) {
          if (err) throw err;
          console.log(`You have created a department ${answer.name}.`)
          questions();
        }
      );
    });
}

