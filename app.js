// dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");

// SQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "July301993!",
  database: "employee_trackerDB",
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
        "View All employees",
        "View All employees by department",
        "View All employees by role",
        "Create a new department",
        "Create a new role",
        "Add a new employee",
        "Update employee role",
        "Exit",
      ],
    })
    // switch case for answers/choices
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View employees by department":
          viewDepartments();
          break;

        case "View employees by role":
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
       
        case "Update a employee role":
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
            message: "Name of department?",
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

// view employees by role
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
          message: "What role?",
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

// creates new department
function newDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Name of the deparment?",
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

// create a new role
function newRole() {
  connection.query(
    "SELECT department.name, department.id FROM employee_trackerDB.department",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              var choiceArrayID = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
                choiceArrayID.push(res[i].id);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
          {
            name: "title",
            type: "input",
            message: "What is the name of the role?",
          },
          {
            name: "salary",
            type: "input",
            message: "Desired salary?",
          },
        ])
        .then(function (answer) {
          var department_id = answer.choice;

          for (var i = 0; i < res.length; i++) {
            if (res[i].name === answer.choice) {
              department_id = res[i].id;
              console.log(department_id);
            }
          }

          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.title,
              salary: answer.salary,
              department_id: department_id,
            },
            function (err) {
              if (err) throw err;

              console.log(`You have created ${answer.title} with salary of ${answer.salary} in ${department_id}.`)

              questions();
            }
          );
        });
    }
  );
}

// add an employee
function newEmployee() {
  connection.query(
    "SELECT role.title, role.id FROM employee_trackerDB.role",
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

          var role_id = answer.choice;

          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.choice) {
              role_id = res[i].id;
              console.log(role_id);
            }
          }

          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: role_id,
            },
            function (err) {
              if (err) throw err;

              console.log(`You have created an employee ${answer.first_name} ${answer.last_name} with a role of ${role_id}.`)

              questions();
            }
          );
        });
    }
  );
}

// update employee role
function updateEmployee() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, role.id, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            choices: function () {
              var choiceArray1 = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray1.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return choiceArray1;
            },
            message: "Select employee you wish to edit.",
          },
        ])
        .then(function (answer) {
          connection.query(
            `SELECT role.title, role.id, role.salary
            FROM employee_trackerDB.role`,

            function (err, res4) {
              if (err) throw err;

              inquirer
                .prompt([
                  {
                    name: "roleChoice",
                    type: "list",
                    choices: function () {
                      var choiceArray2 = [];
                      for (var i = 0; i < res4.length; i++) {
                        choiceArray2.push(res4[i].title);
                      }

                      return choiceArray2;
                    },
                    message: "What is the role?",
                  },
                ])
                .then(function (answer2) {
                  console.log(answer);

                
                  var role_id, employeeId;

                  // searches for matching name
                  connection.query(
                    `SELECT employee.first_name, employee.last_name, employee.id
            FROM employee_trackerDB.employee`,

                    function (err, res2) {
                      if (err) throw err;

                      for (var i = 0; i < res2.length; i++) {
                        if (
                          `${res2[i].first_name} ${res2[i].last_name}` ===
                          answer.employeeChoice
                        ) {
                          employeeId = res2[i].id;
                        }
                      }
                      // searches for matching title
                      connection.query(
                        `SELECT role.title, role.salary, role.id
              FROM employee_trackerDB.role`,

                        function (err, res3) {
                          if (err) throw err;

                          for (var i = 0; i < res3.length; i++) {
                            if (`${res3[i].title}` === answer2.roleChoice) {
                              role_id = res3[i].id;
                            }
                          }

                          connection.query(
                            "UPDATE employee SET ? WHERE ?",
                            [
                              {
                                role_id: role_id,
                              },

                              {
                                id: employeeId,
                              },
                            ],
                            function (err) {
                              if (err) throw err;
                              console.log("Employee's role has been changed.");
                              questions();
                            }
                          );
                        }
                      );
                    }
                  );
                });
            }
          );
        });
    }
  );
}