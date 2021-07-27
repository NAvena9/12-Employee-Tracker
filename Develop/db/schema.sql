DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE departments (
    id INT NOT  NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id) 
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT,
    title  VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL, 
    -- AQUI VA DEPARTMENT_ID REFER
    department_id INT NOT NULL REFERENCES departments(id), 
    PRIMARY KEY(id)
    -- FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE CASCADE
);


CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id),
    manager_id INT NULL REFERENCES employees(id),
    PRIMARY KEY(id)
    -- FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
    -- FOREIGN KEY(manager_id) REFERENCES employees(id) 
);
