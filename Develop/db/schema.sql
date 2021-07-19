DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE departments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) UNIQUE NOT NULL, 
);

CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title  VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL, 
    -- AQUI VA DEPARTMENT_ID REFER
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);


CREATE TABLE employees (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    -- ROLE_ID JUNCTION
    role_id INT, 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    -- MANAGER_ID JUNCTION
    manager_id INT NULL,
    FOREIGN KEY (manager_id) REFERENCES employees (id) 
);