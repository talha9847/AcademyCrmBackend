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

INSERT INTO fee_payments (student_id, student_fee_id,amount_paid,payment_method) VALUES (7,5,5000.00,'Cash');

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
    gender VARCHAR(10),
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






CREATE TABLE public.herosection (
    id INTEGER,
    badge_text TEXT,
    heading1 TEXT,
    heading2 TEXT,
    description TEXT,
    button1_text TEXT,
    button1_link TEXT,
    button2_text TEXT,
    button2_link TEXT,
    stat1_value TEXT,
    stat2_value TEXT,
    stat3_value TEXT,
    image_url TEXT,
    floating_card1_title TEXT,
    floating_card1_subtitle TEXT,
    floating_card2_title TEXT,
    floating_card2_subtitle TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
INSERT INTO public.herosection (id,badge_text,heading1,heading2,description,button1_text,button1_link,button2_text,button2_link,stat1_value,stat2_value,stat3_value,image_url,floating_card1_title,floating_card1_subtitle,floating_card2_title,floating_card2_subtitle,created_at,updated_at
) 
VALUES('ISO Certified Institute Since 2003'Shape Your Future with'Quality Education'Join Surat''s leading computer education institute with 20+ years of excellence. Master in-demand skills in programming, design, and languages with expert guidance.'Explore Courses'/courses'Contact Us'/contact'20+'50+'10k+','/images/hero-section.jpg','100%','Job Assist','20+','Courses','2025-10-14 12:36:15',  '2025-10-14 12:36:15');




CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    price VARCHAR(20),
    duration VARCHAR(50),
    level VARCHAR(50),
    image TEXT,
    featured BOOLEAN DEFAULT false
);


INSERT INTO public.courses (
    id, category, title, description, price, duration, level, image, featured
) VALUES
(1, 'Programming & Development', 'C & C++ Programming', 'Learn the fundamentals of C and C++ programming languages. Master pointers, memory management, and object-oriented programming.', '99', '8 weeks', 'Beginner', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', TRUE),
(2, 'Programming & Development', 'Java Development', 'Complete Java course from basics to advanced concepts. Learn about OOP, collections, and build real-world applications.', '129', '10 weeks', 'Intermediate', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', FALSE),
(3, 'Programming & Development', 'Python Mastery', 'From basics to data science. Learn Python for web development, automation, and data analysis.', '109', '9 weeks', 'Beginner', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', TRUE),
(4, 'HTML & CSS Fundamentals', 'HTML & CSS Fundamentals', 'Build the foundation for web development. Master HTML5 and CSS3 for creating beautiful websites.', '99', '6 weeks', 'Beginner', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', TRUE),
(5, 'Web Development', 'JavaScript Essential', 'Learn the core concepts of JavaScript including DOM manipulation, ES6 features, and asynchronous programming.', '89', '7 weeks', 'Intermediate', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop', FALSE),
(6, 'Full Stack Development', 'Full Stack Development with MERN', 'Become a full stack developer by mastering MongoDB, Express.js, React, and Node.js. Build real-world full-stack apps.', '149', '12 weeks', 'Advanced', 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&h=400&fit=crop', TRUE),
(7, 'Consequuntur ex inve', 'Quam sunt quibusdam', 'Hic numquam consequa', '521', 'Fugiat dolore et qu', 'Ea mollitia mollitia', 'https://www.mygreatlearning.com/blog/wp-content/uploads/2020/10/shutterstock_1096975310.jpg', FALSE),
(8, 'Quo fugit aut volup', 'Fuga Distinctio Il', 'Dolore doloribus pra', '827', 'Ab nobis eos et und', 'Atque porro sunt ass', 'https://www.mygreatlearning.com/blog/wp-content/uploads/2020/10/shutterstock_1096975310.jpg', FALSE),
(9, 'In adipisicing earum', 'Sint eiusmod accusa', 'Aliquip consequatur', '664', 'Voluptatem deserunt', 'Autem molestiae ea i', 'https://www.mygreatlearning.com/blog/wp-content/uploads/2020/10/shutterstock_1096975310.jpg', FALSE);




CREATE TABLE daily_attendance (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE SET NULL,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_id,section_id,session_id, attendance_date)
);



CREATE TABLE daily_attendance_records (
    id SERIAL PRIMARY KEY,
    attendance_id INTEGER NOT NULL REFERENCES daily_attendance(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Leave')),
    remarks TEXT,
    marked_by INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (attendance_id, student_id)
);





CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    certificate_number VARCHAR(30) UNIQUE NOT NULL,  -- e.g., ME2025-000123
    verification_code VARCHAR(30) UNIQUE NOT NULL,   -- for QR link
    recipient_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_type VARCHAR(20) CHECK (recipient_type IN ('student', 'teacher')) NOT NULL,
    title VARCHAR(100) NOT NULL,                   
    description TEXT,                                
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,  -- ✅ added proper FK
    is_revoked BOOLEAN DEFAULT FALSE,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
