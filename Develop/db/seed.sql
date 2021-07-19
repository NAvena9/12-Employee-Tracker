use employee_trackerDB;

INSERT INTO departments (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Digital'),
    ('Operations'),
    ('Finance'),
    ('Legal');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Engineering PM', 150000, 2),
    ('Design Engineer', 100000, 2)
    ('Software PM', 150000, 3),
    ('Front-End Software Engineer', 100000, 3),
    ('Back-End Software Engineer', 115000, 3),
    ('Full-Stack Software Engineer', 130000, 3),
    ('Operations Manager', 125000, 4),
    ('Field Engieer', 80000, 4),
    ('Account Manager', 145000, 5),
    ('Accountant', 75000, 5),
    ('Legal Team Lead', 240000, 6),
    ('Lawyer', 160000, 6);

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Josh', 'Ritchy', 1, NULL),
    ('Marcela', 'Vargas', 9, NULL),
    ('Laura', 'Chan', 10, 9),
    ('Na', 'Saigon', 5, NULL),
    ('Mike', 'Song', 8, 5),
    ('Lance', 'Staupulos', 6, 5),
    ('Ashley', 'VanLandingham', 3, NULL),
    ('Kee', 'Winterberg', 4, 3),
    ('John', 'Qualls', 10, 9),
    ('Kunal', 'Singh', 11, NULL),
    ('Magdelin', 'Goitia', 2, 1),
    ('Malia', 'Williams', 12, 11),
    ('Prisca', 'Ovalle', 13, NULL),
    ('Luis', 'Pompa', 14, 13);
