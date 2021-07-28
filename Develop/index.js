///1.- Call modules to use
const inquirer = require("inquirer");
const connection = require('./config/connection');
const figlet = require('figlet');
const chalk = require("chalk");

var roleID;
var managerID;
var roleArray = [];

///2.- startAppiate the app with a welcome message (then start function call)
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to port 3306')
    welcomeToApp();
});

///3.- Welcome Message / then start inquirer 
function welcomeToApp() {
    figlet.text('Welcome to Oats Inc', {
        font: 'basic',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log("-".repeat(90));
        console.log(chalk.blue(data));
        console.log("-".repeat(90));
        startApp();
    });
}

///start inquirer (menu with list of options of what the app can do)
function startApp() {
    inquirer
        .prompt({
            name: "startMenu",
            type: "list",
            message: "Welcome to the employee management app, What would you like to do today?",
            choices: [
                "View All Employees",
                "View Employees By Manager",
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function (answers) {
            //Switch statement used for checking the function that the user picks
            switch (answers.startMenu) {

                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View Employees By Manager":
                    viewEmployeeByManager();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Department":
                    addNewDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    Adieu();
                    break;
            }
        })
}

//4- Defining functions

//View All  Empployees 
function viewAllEmployees() {
    const query = "SELECT first_name AS `First Name`, last_name AS `Last Name`, manager_id  AS `Manager ID`, role_id  AS `Role ID` FROM employees";

    connection.query(query, function (err, results) {
        console.log("\n");
        console.table(results);
        startApp();
    })
}


//View all employees ordered by manager
function viewEmployeeByManager() {
    const query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Name,roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees e INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.manager_id";

    connection.query(query, function (err, results) {
        console.log("\n");
        console.table(results);
        startApp();
    })


}

//Add Employee
function addEmployee() {
    const query = "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Name, roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees e INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.manager_id";

    connection.query(query, function (err, results) {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "employeeFirstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "employeeLastName"
            },
            {
                type: "list",
                message: "What is the role of the employee?",
                name: "employeeRole",
                choices: getRoles() //This method helps grabing all the roles from the roles table so the user can pick one
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "employeeManager",
                choices: function () { //all of the managers are gotten then pushed into an array so the user can pick
                    var managerArray = [];
                    for (var i = 0; i < results.length; i++) {
                        managerArray.push(results[i].Name);
                    }
                    return managerArray;
                }
            }
        ]).then(answers => {
            //This loop iterates through the roles to check if there are any matches of the employee role against a title and then assigns the corresponding role Id  to a variable that then sends the value using the addQuery function
            connection.query("SELECT * FROM roles", function (err, results) {
                for (let i = 0; i < results.length; i++) {
                    if (answers.employeeRole === results[i].title) {
                        roleID = results[i].id;
                    }
                }
                //compares manager selected to a manager in the results query , the managerID is assigned to 
                connection.query(query, function (err, results) {
                    for (let i = 0; i < results.length; i++) {
                        if (answers.employeeManager === results[i].Name) {
                            managerID = results[i].id
                        }
                    }
                    //addQuery function takes in the roleID, managerID, and the name of the new employee
                    addQuery(roleID, managerID, answers.employeeFirstName, answers.employeeLastName);
                })
            })
        })
    })
}

function addQuery(roleID, managerID, employeeFirstName, employeeLastName) { //creates a new employee with using an SQL query (uses the input from the user)
    connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", [employeeFirstName, employeeLastName, roleID, managerID], function (err, results) {
        if (err) throw err;
        console.log("\nEmployee added\n")
        startApp();
    });
}

//Create a new department 
function addNewDepartment() {
    inquirer.prompt({
        type: "input",
        message: "Which department would you like to add?",
        name: "newDepartment"
    }).then(answers => {
        connection.query("INSERT INTO departments (department_name) VALUES (?)", [answers.newDepartment], function (err, results) {
            console.log("\nNew department added!\n")
            startApp();
        })
    })
};

//Create a New Role 
function addRole() {
    connection.query("SELECT * FROM departments", function (err, results) {
        inquirer.prompt([
            {
                type: "input",
                name: "roleName",
                message: "What is the name of the role you want to add?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the yearly compensation/salary?"
            },
            {
                type: "list",
                name: "corresDept",
                message: "Which department is the role in?",
                choices: function () {
                    const departmentArray = [];
                    for (let i = 0; i < results.length; i++) {
                        departmentArray.push(results[i].department_name)
                    }
                    return departmentArray;
                }
            }
        ]).then(answers => {
            for (let i = 0; i < results.length; i++) {
                if (answers.corresDept === results[i].department_name) {
                    var deptID = results[i].id;
                }
            }

            var salary = parseInt(answers.salary);
            connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${answers.roleName}", ${salary}, ${deptID})`, function (err, results) {
                if (err) throw err;
                console.log("\n Role added!\n");
                startApp();
            })
        })
    })

};

//View All Roles
function viewAllRoles() {
    connection.query("SELECT roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department FROM roles INNER JOIN departments ON roles.department_id = departments.id", function (err, results) {
        console.log("\n")
        console.table(results);
        startApp();
    })
}

//View all Departments
function viewAllDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        console.log("\n")
        console.table(results);
        startApp();
    })
}

//Helps to update an employee role
function updateEmployeeRole() {
    const query = "SELECT e.id, m.id AS managerID, roles.id AS RoleID, CONCAT(e.first_name, ' ', e.last_name) AS Name,roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees e INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY departments.department_name;";

    connection.query(query, function (err, results) {
        inquirer.prompt([
            {
                type: "list",
                name: "employeeToUpdate",
                message: "Which Employee Role do you want to Update?",
                //Method that grabs all of the employees and puts them into an array for the user to choose from
                choices: function () {
                    employeeArray = [];
                    for (let i = 0; i < results.length; i++) {
                        employeeArray.push(results[i].Name)
                    }
                    return employeeArray;
                }
            },
            {
                type: "list",
                name: "employeeUpRole",
                message: "What is the employee's new role?",
                choices: getRoles()
            }
        ]).then(answers => {

            //For loop iterates through the results and if the employee that the user picks matches a name in the database, it sets the ID of the employee to variable
            for (let i = 0; i < results.length; i++) {
                if (answers.employeeToUpdate === results[i].Name) {
                    var empID = results[i].id;

                }
                //Check to see if the updated employee role the user picked matches a role, and then assign the manager ID and roleID to variables to be injected into the UPDATE query
                if (answers.employeeUpRole === results[i].Title) {
                    var manID = results[i].managerID;
                    var posID = results[i].RoleID;
                }

            }

            connection.query(`UPDATE employees SET role_id = ${posID}, manager_id = ${manID}  WHERE id = ${empID}`, function (err, results) {
                console.log("\n Employee role updated!\n");
                startApp();
            })

        })
    })
}
//Helper function that grabs all the roles and puts them into an array
function getRoles() {

    connection.query("SELECT * FROM roles", function (err, results) {
        for (var i = 0; i < results.length; i++) {
            roleArray.push(results[i].title);
        }
    })

    return roleArray;
}

function Adieu() {
    figlet.text('Thanks for using the App, Au revoir', {
        font: 'basic',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    }, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.blue(data));
        connection.end();
    });
};
