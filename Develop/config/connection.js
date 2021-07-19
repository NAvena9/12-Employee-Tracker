//Connection setup to SQL database
const mysql = require ('mysql');
// const util = require('util');
  

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"root",
    database: 'employee_trackerDB'
});

connection.connect((err) => {
  if(err) throw err;
  console.log('Connected to port 3306')
});

module.exports = connection;