CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO classes (id, name) VALUES
(1, 'CLASS 9'),
(2, 'CLASS 10'),
(3, 'CLASS 11'),
(4, 'CLASS 12');




CREATE TABLE fee_payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    student_fee_id INTEGER,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Paid',
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (student_fee_id) REFERENCES student_fees(id) ON DELETE CASCADE
);



CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pages (id, name, slug) VALUES
(1, 'Dashboard', 'dashboard'),
(2, 'Teachers', 'teachers'),
(3, 'Students', 'students');






CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    relation VARCHAR(50),
    occupation VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO parents (
    id, student_id, full_name, phone, email, relation, occupation, address
) VALUES (
    1, 7, 'Mujjaffar', '9929886655', 'Mujjaffar@gmail.com', 'father', 'tyre', 'Vapi gujarat'
);





CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    class_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);
INSERT INTO sections (id, name, class_id) VALUES
(1, 'A', 1),
(2, 'B', 1),
(3, 'A', 2),
(4, 'B', 2),
(5, 'A', 3),
(6, 'B', 3),
(7, 'A', 4),
(8, 'B', 4);





CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    timing TEXT
);
INSERT INTO sessions (id, timing) VALUES
(1, '8:00 TO 9:30'),
(2, '9:30 TO 11:00'),
(3, '11:00 TO 12:30'),
(4, '12:30 TO 2:00'),
(5, '2:00 TO 3:30'),
(6, '5:00 TO 6:30'),
(7, '3:30 TO 5:00');





CREATE TABLE student_fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    total_fee NUMERIC(10, 2) NOT NULL,
    due_date DATE,
    discount NUMERIC(10, 2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO student_fees (id, student_id, total_fee, due_date, discount, description) VALUES
(5, 7, 5000.00, '2025-12-12', 0.00, NULL);



CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    class_id INTEGER,
    section_id INTEGER,
    admission_number VARCHAR(20) UNIQUE,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gender VARCHAR(20),
    roll_no TEXT,
    session_id INTEGER,
    address TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

INSERT INTO students (
    id, user_id, class_id, section_id, admission_number, date_of_birth, gender, roll_no, session_id, address
) VALUES
(1, 5, 1, 1, '1001', '2003-01-01', NULL, NULL, NULL, NULL),
(2, 6, 1, 2, '10002', '2003-01-01', NULL, NULL, NULL, NULL),
(7, 12, 1, 2, '1002', '2003-01-01', 'Male', '10002', 1, 'At.Kosamba surat, gujarat');





CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    hire_date DATE,
    department VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE user_page_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    page_id INTEGER,
    is_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, page_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);
INSERT INTO user_page_access (id, user_id, page_id, is_enabled) VALUES
(1, 1, 1, TRUE),
(2, 1, 2, TRUE),
(3, 1, 3, TRUE),
(4, 2, 1, FALSE),
(5, 2, 2, TRUE),
(6, 2, 3, FALSE),
(7, 3, 1, FALSE),
(8, 3, 2, FALSE),
(9, 3, 3, FALSE),
(11, 5, 1, FALSE),
(12, 5, 2, FALSE),
(13, 5, 3, FALSE),
(14, 6, 1, FALSE),
(15, 6, 2, FALSE),
(16, 6, 3, FALSE),
(17, 12, 1, FALSE),
(18, 12, 2, FALSE),
(19, 12, 3, FALSE);





CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(10) DEFAULT 'student',
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'teacher', 'student'))
);
INSERT INTO users (id, email, password, role, full_name, created_at, updated_at) VALUES
(1, 'admin@gmail.com', '$2b$10$QhpTKn2N/jW8krBIFnGitui9uqigtPWpML7jqsIp5xdFWLbbqW3b.', 'admin', 'Admin User', '2025-09-25 08:24:07.698077', '2025-09-25 08:24:07.698077'),
(2, 'teacher@gmail.com', '$2b$10$j2IwHW3Yn5DnaLfNDozpoe59Ne8xpsMh0teCCoQCWnl5X7zFbnkU.', 'teacher', 'Teacher User', '2025-09-25 08:24:07.756119', '2025-09-25 08:24:07.756119'),
(3, 'student@gmail.com', '$2b$10$yyW4sQrLALd2IEEeY7JGNu5TqBBIE2Kk5vgrMXImf1EkJ/7hpEDnG', 'student', 'Student User', '2025-09-25 08:24:07.809748', '2025-09-25 08:24:07.809748'),
(5, 'samir@gmail.com', '$2b$10$OYzFt5wKzWeK.g3qkXXyKe7A/QJBdI/tcjOjUmzX6edWLKPoZ.LAW', 'student', 'Samir Shaikh', '2025-09-25 08:25:14.825186', '2025-09-25 08:25:14.825186'),
(6, 'yahyaa@gmail.com', '$2b$10$n57tPbgTWY0DwDP9N18Z8uihuem2qZYEzs0WHRSdQTubpDpeo0.Sa', 'student', 'Yahyaa Patel', '2025-09-25 08:29:17.389715', '2025-09-25 08:29:17.389715'),
(12, 'samir1@gmail.com', '$2b$10$WganVhGCj.dpDIKAZp/i6uLOg0EFMGHsyV9NFsQTXh4RK6km0VRZ.', 'student', 'Samir Shaikh', '2025-09-25 15:30:50.176413', '2025-09-25 15:30:50.176413');