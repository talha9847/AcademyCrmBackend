
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



CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(10) DEFAULT 'student',
    full_name VARCHAR(100) NOT NULL,
    is_active boolean,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'teacher', 'student'))
);
INSERT INTO users (id, email, password, role, full_name,is_active, created_at, updated_at) VALUES
(1, 'admin@gmail.com', '$2b$10$QhpTKn2N/jW8krBIFnGitui9uqigtPWpML7jqsIp5xdFWLbbqW3b.', 'admin', 'Admin User', '2025-09-25 08:24:07.698077', '2025-09-25 08:24:07.698077',true),
(2, 'teacher@gmail.com', '$2b$10$j2IwHW3Yn5DnaLfNDozpoe59Ne8xpsMh0teCCoQCWnl5X7zFbnkU.', 'teacher', 'Teacher User', '2025-09-25 08:24:07.756119', '2025-09-25 08:24:07.756119',true),
(3, 'student@gmail.com', '$2b$10$yyW4sQrLALd2IEEeY7JGNu5TqBBIE2Kk5vgrMXImf1EkJ/7hpEDnG', 'student', 'Student User', '2025-09-25 08:24:07.809748', '2025-09-25 08:24:07.809748',true),
(5, 'samir@gmail.com', '$2b$10$OYzFt5wKzWeK.g3qkXXyKe7A/QJBdI/tcjOjUmzX6edWLKPoZ.LAW', 'student', 'Samir Shaikh', '2025-09-25 08:25:14.825186', '2025-09-25 08:25:14.825186',true),
(6, 'yahyaa@gmail.com', '$2b$10$n57tPbgTWY0DwDP9N18Z8uihuem2qZYEzs0WHRSdQTubpDpeo0.Sa', 'student', 'Yahyaa Patel', '2025-09-25 08:29:17.389715', '2025-09-25 08:29:17.389715',true),
(12, 'samir1@gmail.com', '$2b$10$WganVhGCj.dpDIKAZp/i6uLOg0EFMGHsyV9NFsQTXh4RK6km0VRZ.', 'student', 'Samir Shaikh', '2025-09-25 15:30:50.176413', '2025-09-25 15:30:50.176413',true);




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


CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO classes (id, name) VALUES
(1, 'TALLY PRIME'),
(2, 'SPOKEN ENGLISH'),
(3, 'CCC'),
(4, 'IELTS GT');


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
    profile_photo varchar(100),
    signature_photo varchar(100),
    status varchar(20),
    mobile varchar(20),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

INSERT INTO students (
    id, user_id, class_id, section_id, admission_number, date_of_birth, gender, roll_no, session_id, address,profile_photo,signature_photo,status,mobile
) VALUES
(1, 5, 1, 1, '1001', '2003-01-01', NULL, NULL, NULL, NULL,'samir@gmail.com_profile.png',NULL,'ACTIVE',NULL),
(2, 6, 1, 2, '10002', '2003-01-01', NULL, NULL, NULL, NULL,'yahyaa@gmail.com_profile.jpeg','yahyaa@gmail.com_signature.jpeg','ACTIVE',NULL),
(7, 12, 1, 2, '1002', '2003-01-01', 'Male', '10002', 1, 'At.Kosamba surat, gujarat','yahyaa@gmail.com_profile.jpeg','yahyaa@gmail.com_signature.jpeg','ACTIVE',NULL);


CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    hire_date DATE,
    department VARCHAR(50),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    section_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,

    CONSTRAINT unique_student_class_session UNIQUE (student_id, class_id, session_id)
);


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
    certificate_number VARCHAR(30) UNIQUE NOT NULL,  
    verification_code VARCHAR(30) UNIQUE NOT NULL,   
	recipient_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
	enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,                   
    description TEXT,                                
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    issued_by INTEGER, 
    template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,  
    is_revoked BOOLEAN DEFAULT FALSE,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(1000) NOT NULL,
    class_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);


INSERT INTO templates (id, name, class_id, created_at) VALUES
(1, 'uploads/certificates/ccc.png', 1, '2025-10-28 10:55:19.687802'),
(2, 'uploads/certificates/tallyprime.png', 2, '2025-10-28 10:55:19.687802'),
(3, 'uploads/certificates/spokenenglish.png', 3, '2025-10-28 10:55:19.687802'),
(4, 'uploads/certificates/combo.png', 5, '2025-10-31 23:05:02.20486');



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



INSERT INTO courses (
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




CREATE TABLE herosection (
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
INSERT INTO herosection (
    id,badge_text,heading1,heading2,description,button1_text,button1_link,button2_text,button2_link,stat1_value,stat2_value,stat3_value,image_url,floating_card1_title,floating_card1_subtitle,floating_card2_title,floating_card2_subtitle,created_at,updated_at
) VALUES (
    1,'Trusted by 10,000+ Students','Transform Your Future with','Expert Training','Join industry-leading courses designed to accelerate your career. Learn from experts and master the skills that matter.','Explore Courses','/courses','Contact Us','/contact','10+','25+','10k+','/images/hero-section.jpg','90%','Job Assistance','20+','Courses','2025-10-12 07:36:14.985003','2025-10-12 07:36:14.985003'
);




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



CREATE TABLE fee_payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    student_fee_id INTEGER,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Paid',
    receipt_number VARCHAR(25) UNIQUE NOT NULL,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (student_fee_id) REFERENCES student_fees(id) ON DELETE CASCADE
);

INSERT INTO fee_payments (student_id, student_fee_id,amount_paid,payment_method) VALUES (7,5,5000.00,'Cash');



CREATE TABLE IF NOT EXISTS expense (
    id SERIAL PRIMARY KEY,
    expense_name VARCHAR(255),
    amount NUMERIC(10,2),
    date_of_expense DATE,
    category VARCHAR(100),
    detailed_notes TEXT
);

INSERT INTO expense (id, expense_name, amount, date_of_expense, category, detailed_notes) VALUES
(1, 'Q4 Software License', 0.00, '2025-10-22', 'Operations', 'Free license provided under annual plan'),
(2, 'Cloud Hosting - October', 12000.50, '2025-10-22', 'IT/Tech', 'Monthly AWS charges'),
(3, 'Office Supplies Purchase', 2350.00, '2025-10-22', 'Payroll', 'Printer ink and paper restock'),
(4, 'Team Lunch - Diwali Celebration', 8700.00, '2025-10-22', 'Events', 'Team-building event expenses'),
(5, 'Marketing Campaign - LinkedIn Ads', 15000.00, '2025-10-22', 'Others', 'Paid social media campaign'),
(6, 'Stacy Fernandez', 41.00, '1974-01-25', 'Others', 'Others'),
(7, 'Nina Campbell', 62.00, '1988-11-09', 'Payroll', 'Dolor dolore quia cu'),
(8, 'Angela Herman', 39.00, '2007-02-14', 'Maintenance', 'Aperiam beatae dolor'),
(9, 'Kato Merritt', 82.00, '2023-01-27', 'Events', 'Aperiam non iure cum'),
(10, 'Inez Herring', 365.00, '2010-06-04', 'Maintenance', 'Doloremque consequun');




CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    src VARCHAR,
    alt VARCHAR,
    caption VARCHAR,
    show BOOLEAN DEFAULT false
);


INSERT INTO gallery (id, src, alt, caption, show) VALUES
(1, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea3d706319d.jpg', 'Students collaborating in a modern classroom', 'Interactive Learning Session', TRUE),
(2, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea3d8f0db2c.jpg', 'Professor lecturing in a large hall', 'Main Lecture Hall Facility', TRUE),
(3, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea3dd42b66e.jpg', 'Students cheering during graduation', 'Celebrating Success: Graduation', TRUE),
(4, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea433e19b12.jpg', 'A bright, quiet academy library', 'Interactive Learning Session', TRUE),
(5, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea448e156a5.jpeg', 'Vibrant Campus Life', 'Interactive Learning Session', TRUE),
(6, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea47584273e.jpg', 'Hands-on Lab Training', 'Interactive Learning Session', TRUE),
(7, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea3d706319d.jpg', 'Students collaborating in a modern classroom', 'Interactive Learning Session', FALSE),
(8, 'https://partner.digitalclassworld.com/storage/homepage/gallary/68ea3d706319d.jpg', 'Students collaborating in a modern classroom', 'Interactive Learning Session', FALSE);


CREATE TABLE IF NOT EXISTS herosection (
    id SERIAL PRIMARY KEY,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO herosection (
    id, badge_text, heading1, heading2, description, 
    button1_text, button1_link, button2_text, button2_link, 
    stat1_value, stat2_value, stat3_value, image_url, 
    floating_card1_title, floating_card1_subtitle, 
    floating_card2_title, floating_card2_subtitle, 
    created_at, updated_at
) VALUES (
    1, 
    'Trusted by 10,000+ Students', 
    'Transform Your Future with', 
    'Expert Training', 
    'Join industry-leading courses designed to accelerate your career. Learn from experts and master the skills that matter.', 
    'Explore Courses', 
    '/courses', 
    'Contact Us', 
    '/contact', 
    '10+', 
    '25+', 
    '10k+', 
    '/images/hero-section.jpg', 
    '90%', 
    'Job Assistance', 
    '20+', 
    'Courses', 
    '2025-10-12 07:36:14.985003', 
    '2025-10-12 07:36:14.985003'
);



CREATE TABLE IF NOT EXISTS milestones (
    id SERIAL PRIMARY KEY,
    year VARCHAR,
    title VARCHAR,
    description TEXT,
    icon VARCHAR,
    color VARCHAR
);

INSERT INTO milestones (id, year, title, description, icon, color) VALUES
(4, 'Today', 'Benchmark of Excellence', 'Mehtab Computer Academy stands as a leading, highly-rated academy in Surat, known for its unwavering commitment to excellence and a team of qualified and certified educators.', 'Award', '#e60076'),
(2, '2013', 'Computer Academy Launch', 'We expanded our vision and laid the foundation of Mehtab Computer Academy, integrating essential computer education to empower students with technical and professional knowledge.', 'GraduationCap', '#990efc'),
(3, '2023', 'Global Certification', 'Introduced globally recognized language proficiency courses such as IELTS, PTE, TOEFL, and Duolingo, ensuring our students are well-prepared for international opportunities.', 'Globe', '#00bba7'),
(6, '1975', 'Ut dolorem doloremqu', 'Iusto et at doloribu', 'Activity', '#c20f0f'),
(1, '2002', 'The Founding', 'Mehtab Shaikh started as an English tutor, committed to delivering quality education. Successfully trained 10,000+ students, helping them achieve excellence in language skills.', 'BookOpen', '#135dff');



CREATE TABLE IF NOT EXISTS sendusmessage (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(20),
    lname VARCHAR(20),
    email VARCHAR(40),
    phone VARCHAR(20),
    course TEXT,
    message TEXT
);


INSERT INTO sendusmessage (id, fname, lname, email, phone, course, message) VALUES
(1, 'Yoko Vaughn', NULL, 'melijefeq@mailinator.com', '+1 (241) 784-7879', 'marketing', 'Omnis impedit volup'),
(2, 'Bertha Huber', 'Avye Garner', 'vinajat@mailinator.com', '+1 (619) 597-1001', 'marketing', 'Explicabo Tenetur b'),
(3, 'Eagan Potts', 'Brynn Hayes', 'lekiciq@mailinator.com', '+1 (422) 562-2584', 'marketing', 'Cupidatat minim fugi');


CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    course VARCHAR,
    rating INTEGER,
    text TEXT,
    show BOOLEAN DEFAULT false
);

INSERT INTO testimonials (id, name, course, rating, text, show) VALUES
(4, 'Priya Patel', 'Full Stack Development', 5, 'The practical training and expert guidance helped me land my dream job as a web developer. The faculty is incredibly supportive!', false),
(1, 'Talha Malek', 'Full Stack Development', 5, 'Best computer institute in Surat! The course content is up-to-date and the placement assistance is excellent.', true),
(6, 'Neville Brennan', 'Eaque aut nisi dolor', 3, 'Error ut nobis rerum', true),
(3, 'Anjali Desai', 'IELTS Preparation', 5, 'Achieved 7.5 band score in IELTS thanks to the structured coaching and mock tests. Highly recommended for study abroad aspirants!', true);



CREATE TABLE IF NOT EXISTS aboutcoremission (
    id SERIAL PRIMARY KEY,
    icon VARCHAR,
    title VARCHAR,
    description TEXT,
    show BOOLEAN DEFAULT false
);


INSERT INTO aboutcoremission (id, icon, title, description, show) VALUES
(1, 'TrendingUp', 'Empowerment', 'Provide accessible, high-quality education that empowers individuals to achieve their career goals.', true),
(6, 'Apple', 'Eos aperiam perspici', 'Tenetur deserunt pla', false),
(5, 'Activity', 'Laboris nostrud alia', 'Non tempore ipsam l', false),
(4, 'Check', 'Excellence', 'Uphold the highest standards of education quality, infrastructure, and student support services.', true),
(2, 'Lightbulb', 'Innovation', 'Cultivate a learning environment that encourages creativity, critical thinking, and problem-solving skills.', true),
(3, 'Heart', 'Career Growth', 'Bridge the gap between education and employment with industry-relevant skills and placement assistance.', true);


CREATE TABLE IF NOT EXISTS aboutcorevision (
    id SERIAL PRIMARY KEY,
    icon VARCHAR,
    title VARCHAR,
    description TEXT,
    color VARCHAR,
    show BOOLEAN DEFAULT false
);

INSERT INTO aboutcorevision (id, icon, title, description, color, show) VALUES
(2, 'Layers', 'Quality Education', 'ISO certified training programs with industry-recognized certifications and hands-on practical experience.', 'from-blue-500 to-cyan-500', true),
(4, 'Briefcase', 'Student Success', 'Dedicated to placement and career growth with 100% job assistance and ongoing professional support.', 'from-green-500 to-emerald-500', true),
(1, 'Target', 'Our Vision', 'To be the leading computer education institute in the region, empowering students with skills for the digital age.', 'from-blue-500 to-cyan-500', true),
(3, 'Users', 'Expert Facultys', 'Experienced instructors with real-world industry knowledge and a passion for teaching and mentoring.', 'from-orange-500 to-red-500', true),
(5, 'Drill', 'Dolores ea voluptate', 'Quidem officiis illo', NULL, false);



CREATE TABLE IF NOT EXISTS aboutpagesection (
    id SERIAL PRIMARY KEY,
    heading1 TEXT,
    description1 TEXT,
    heading2 TEXT,
    description2 TEXT,
    description3 TEXT,
    images VARCHAR(255)[],
    state_val INTEGER,
    heading3 TEXT,
    description4 TEXT
);

INSERT INTO aboutpagesection (
    id, heading1, description1, heading2, description2, description3, images, state_val, heading3, description4
) VALUES (
    1,
    'Empowering Futures in the Digital Age',
    'With over two decades of dedicated excellence, Mehtab Computer Academy has transformed thousands of lives, setting the benchmark for quality computer education in Gujarat. Two Decades of Excellence, Defined by Impact',
    'Two Decades of Excellence, Defined by Impact',
    'Mehtab Computer Academy was founded with a powerful vision: to make quality computer education accessible to everyone. What began as a local training center has evolved into one of the most trusted names in the industry.',
    'For over 20 years, we have been committed to adapting our curriculum to the latest industry standards, ensuring our students are not just taught, but are truly prepared for successful careers in IT, design, and development.',
    NULL,
    20,
    'Our Core Mission',
    'We are driven by a commitment to quality and a focus on measurable career outcomes for every student.'
);


CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    date DATE,
    excerpt VARCHAR,
    category VARCHAR,
    image VARCHAR,
    slug VARCHAR,
    show BOOLEAN DEFAULT FALSE
);


INSERT INTO blogs (
    id, title, date, excerpt, category, image, slug, show
) VALUES
(4, 'Top 5 JavaScript Frameworks to Learn in 2026', '2025-09-01', 'A breakdown of the most in-demand front-end and back-end frameworks like React, Vue, Next.js, and Node.', 'Tech Guides', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop', 'top-5-javascript-frameworks', FALSE),
(5, 'Mastering Data Structures and Algorithms', '2025-08-20', 'Tips and resources for acing your technical interviews by strengthening your DSA knowledge.', 'Career Tips', 'https://i.pinimg.com/736x/50/dc/61/50dc6172cca59b64bd488234ec53b54d.jpg', 'mastering-dsa', FALSE),
(6, 'Upcoming Webinar: Acing Your First Job Interview', '2025-08-05', 'Register for our free session on crafting the perfect resume and confidently answering behavioral questions.', 'Announcements', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHXlhDJlJbJBXcEfmdVvi6_Ki85as2k9vdfA&s', 'webinar-job-interview', FALSE),
(1, 'New Batch Starting: Full Stack Web Development', '2025-10-01', 'Join our comprehensive full stack development course starting next month. Limited seats available!', 'Announcements', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop', 'full-stack-batch-start', TRUE),
(2, 'Success Story: From Student to Software Engineer', '2025-09-25', 'Read how our student Rahul landed his dream job at a top IT company after completing our training program.', 'Success Stories', 'https://res.cloudinary.com/dk02a9iu6/image/upload/v1708944461/website-images/bacexnbe7gbmhjkkwog3.png', 'rahul-success-story', TRUE),
(3, 'The PMKVY Certification Program is Now Open', '2025-09-15', 'Government-approved skill development program with free training and certification. Apply now for funded courses!', 'Programs', 'https://algocademy.com/blog/wp-content/uploads/2024/09/51df8d23thumbnail.jpeg', 'pmkvy-program-open', TRUE);



-- Table: public.courses
-- DROP TABLE IF EXISTS public.courses;

CREATE TABLE IF NOT EXISTS courses
(
    id SERIAL PRIMARY KEY,
    category VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    price NUMERIC(10,2),
    duration VARCHAR(50),
    level VARCHAR(50),
    image VARCHAR(255),
    featured BOOLEAN DEFAULT FALSE,
    slug VARCHAR(255) UNIQUE,
    tagline VARCHAR(100),
    short_description TEXT,
    long_description JSONB DEFAULT '[]'::jsonb,
    curriculum JSONB DEFAULT '[]'::jsonb,
    instructor_name VARCHAR(100),
    instructor_title VARCHAR(100),
    instructor_bio TEXT,
    instructor_image_url VARCHAR(255)
);


INSERT INTO public.courses
(id, category, title, description, price, duration, level, image, featured, slug, tagline, short_description, long_description, curriculum, instructor_name, instructor_title, instructor_bio, instructor_image_url)
VALUES
(3, 'Programming & Development', 'Python Mastery', 'From basics to data science. Learn Python for web development, automation, and data analysis.', 109.00, '9 weeks', 'Beginner', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', TRUE, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL),
(4, 'HTML & CSS Fundamentals', 'HTML & CSS Fundamentals', 'Build the foundation for web development. Master HTML5 and CSS3 for creating beautiful websites.', 99.00, '6 weeks', 'Beginner', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop', FALSE, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, NULL, NULL, NULL, NULL),
(5, 'Web Development', 'JavaScript Essential', 'Learn the core concepts of JavaScript including DOM manipulation, ES6 features, and asynchronous programming.', 89.00, '7 weeks', 'Intermediate', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop', TRUE, NULL, NULL, NULL, '[]'::jsonb, '[]'::jsonb, 'John Doe', 'Senior Developer', 'Senior Developer at Google', NULL),
(1, 'Programming & Development', 'C & C++ Programming', 'Learn the fundamentals of C and C++ programming languages. Master pointers, memory management, and object-oriented programming.', 99.00, '8 weeks', 'Beginner', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', FALSE, NULL, NULL, 'Dive deep into PostgreSQL features beyond basic CRUD operations. This course covers advanced indexing, partitioning, writing efficient stored procedures, and implementing high-availability setups for enterprise-level data.', 
'["Learn to optimize slow queries using execution plans and custom indexes.", "Implement data partitioning for massive tables to improve read/write performance.", "Understand various replication strategies (Streaming, Logical) for high availability.", "OK i am OK with this cours", "Add one more"]'::jsonb, 
'["Module 1: Advanced Indexing and Query Optimization", "Module 2: Stored Procedures, Functions, and Triggers", "Module 3: Table Partitioning and Inheritance", "Module 4: Replication, Failover, and High Availability (HA)", "Module 5: Data Modeling for OLAP/OLTP Systems", "Module 6: Security and Auditing in PostgreSQL", "Module 7"]'::jsonb, 
'Talha Malek', 'Software Engineer', '15+ years of experience designing and managing PostgreSQL databases for Fortune 500 companies. Dedicated to sharing performance tuning secrets.', NULL),
(10, 'Programming & Development', 'Java Developments', 'Complete Java course from basics to advanced concepts. Learn about OOP, collections, and build real-world applications.', 139.00, '10 weeks', 'Intermediate', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop', TRUE, NULL, NULL, NULL, '[]'::jsonb, '["Module 1:", "Module 2:", "Module 3:", "Module 4:", "Module 5:"]'::jsonb, NULL, NULL, NULL, NULL),
(6, 'Full Stack Development', 'Full Stack Development with MERN', 'Become a full stack developer by mastering MongoDB, Express.js, React, and Node.js. Build real-world full-stack apps.', 159.00, '12 weeks', 'Advanced', 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&h=400&fit=crop', TRUE, NULL, NULL, 'It is the short descripton.', 
'["YOu will learn everything here", "lkfjdlsk"]'::jsonb, '[]'::jsonb, 'John Doe', 'Software Engineer', 'It''s the good one', NULL);
