INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Protocol Club', id, 'Premier coding club focusing on web development, coding events, and technical workshops. Organizes placement preparatory sessions and industry talks.','Dr. Anand Kumar', 'anand.kumar@bmsce.ac.in', 'Rahul Sharma', 'rahul.sharma@bmsce.ac.in' FROM departments WHERE code = 'CSE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'CodeC Club', id, 'Competitive programming club specializing in DSA challenges, hackathons, and coding competitions. Weekly coding challenges and ICPC preparatory sessions.','Dr. Priya Patel', 'priya.patel@bmsce.ac.in', 'Ananya Reddy', 'ananya.reddy@bmsce.ac.in' FROM departments WHERE code = 'CSE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'AI Research Club', id, 'Advanced research club for machine learning, deep learning, and generative AI. Collaborates with industry partners on cutting-edge AI projects.','Dr. Suresh Rao', 'suresh.rao@bmsce.ac.in', 'Karthik Nair', 'karthik.nair@bmsce.ac.in' FROM departments WHERE code = 'CSE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Cyber Security Club', id, 'Security-focused club conducting ethical hacking workshops, CTF events, and security awareness programs. Industry partnerships with security firms.','Dr. Meena Krishnan', 'meena.krishnan@bmsce.ac.in', 'Aditya Verma', 'aditya.verma@bmsce.ac.in' FROM departments WHERE code = 'CSE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'TechNova Club', id, 'Software development club focusing on full-stack projects, open source contributions, and startup incubation.','Dr. Vikram Singh', 'vikram.singh@bmsce.ac.in', 'Priya Sharma', 'priya.sharma@bmsce.ac.in' FROM departments WHERE code = 'ISE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'DataVerse Club', id, 'Data analytics club specializing in big data processing, visualization, and business intelligence. Partners with analytics companies.','Dr. Lakshmi Devi', 'lakshmi.devi@bmsce.ac.in', 'Sanjay Kumar', 'sanjay.kumar@bmsce.ac.in' FROM departments WHERE code = 'ISE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Neural Nexus', id, 'Deep learning research club focusing on neural networks, NLP, and AI research publications.','Dr. Arun Kumar', 'arun.kumar@bmsce.ac.in', 'Vidya Rao', 'vidya.rao@bmsce.ac.in' FROM departments WHERE code = 'AIML';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Vision AI Club', id, 'Computer vision club specializing in image processing, object detection, and visual AI applications.','Dr. Rajeshwari PM', 'rajeshwari.pm@bmsce.ac.in', 'Sneha Gupta', 'sneha.gupta@bmsce.ac.in' FROM departments WHERE code = 'AIML';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'CircuitVerse Club', id, 'Electronics and embedded systems club focusing on circuit design, IoT projects, and hardware development.','Dr. Nagaraj R', 'nagaraj.r@bmsce.ac.in', 'Tejas MH', 'tejas.mh@bmsce.ac.in' FROM departments WHERE code = 'ECE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'RoboTech Club', id, 'Robotics and automation club building autonomous robots, drones, and hardware automation projects.','Dr. Shashidhar K', 'shashidhar.k@bmsce.ac.in', 'Prajwal S', 'prajwal.s@bmsce.ac.in' FROM departments WHERE code = 'ECE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Spark Club', id, 'Electrical innovation club focusing on renewable energy projects, smart grid technology, and power systems.','Dr. Chandrashekar', 'chandrashekar@bmsce.ac.in', 'Manjunath P', 'manjunath.p@bmsce.ac.in' FROM departments WHERE code = 'EE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'PowerTech Society', id, 'Power systems engineering society working on transmission, distribution, and smart grid research.','Dr. Kulkarni S', 'kulkarni.s@bmsce.ac.in', 'Naveen Kumar', 'naveen.kumar@bmsce.ac.in' FROM departments WHERE code = 'EE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Aero Club', id, 'Aerospace engineering club building drones, aircraft models, and participating in national competitions.','Dr. Ramesh BK', 'ramesh.bk@bmsce.ac.in', 'Shreya N', 'shreya.n@bmsce.ac.in' FROM departments WHERE code = 'ME';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'AutoTech Club', id, 'Automobile engineering club working on vehicle design, EV projects, and Formula Student India.','Dr. Venkatesh P', 'venkatesh.p@bmsce.ac.in', 'Abhishek K', 'abhishek.k@bmsce.ac.in' FROM departments WHERE code = 'ME';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Robotics Society', id, 'Mechatronics and robotics society participating in national robotics competitions and research.','Dr. Murali D', 'murali.d@bmsce.ac.in', 'Rohan K', 'rohan.k@bmsce.ac.in' FROM departments WHERE code = 'ME';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Nirman Club', id, 'Structural engineering club for construction projects, design competitions, and civil innovation.','Dr. Savita KS', 'savita.ks@bmsce.ac.in', 'Pooja R', 'pooja.r@bmsce.ac.in' FROM departments WHERE code = 'CE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'GreenBuild Club', id, 'Sustainable construction club focusing on environmental projects, green buildings, and sustainability.','Dr. Ranjith B', 'ranjith.b@bmsce.ac.in', 'Meghana S', 'meghana.s@bmsce.ac.in' FROM departments WHERE code = 'CE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'BioInnovators Club', id, 'Biotechnology research club focusing on healthcare technology, bioinformatics, and life sciences.','Dr. Usha R', 'usha.r@bmsce.ac.in', 'Kavya S', 'kavya.s@bmsce.ac.in' FROM departments WHERE code = 'BT';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Entrepreneurship Cell', id, 'The E-Cell fosters entrepreneurship culture, organizes startup events, business competitions, and connects students with investors.','Dr. Sharma V', 'economy@bmsce.ac.in', 'Aniket Desai', 'ecell@bmsce.ac.in' FROM departments WHERE code = 'COLLEGE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Cultural Club', id, 'The cultural club organizes music, dance, drama events, and represents BMSCE in inter-college cultural fests.','Dr. Lakshmi N', 'cultural@bmsce.ac.in', 'Disha Gowda', 'cultural.club@bmsce.ac.in' FROM departments WHERE code = 'COLLEGE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Sports Club', id, 'Sports club for cricket, football, athletics, and various sports activities. organizes annual sports fest.','Dr. Suresh B', 'sports@bmsce.ac.in', 'Sachin K', 'sports.club@bmsce.ac.in' FROM departments WHERE code = 'COLLEGE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'Photography Club', id, 'Photography and media club covering all college events, exhibitions, and visual storytelling projects.','Dr. Maya R', 'photography@bmsce.ac.in', 'Arjun M', 'photo.club@bmsce.ac.in' FROM departments WHERE code = 'COLLEGE';
INSERT INTO clubs (name, department_id, description, faculty_coordinator_name, faculty_coordinator_email, student_coordinator_name, student_coordinator_email)
SELECT 'NSS Club', id, 'National Service Scheme club for social service, community welfare, and volunteer activities.','Dr. Narayan G', 'nss@bmsce.ac.in', 'Pallavi M', 'nss.club@bmsce.ac.in' FROM departments WHERE code = 'COLLEGE';
UPDATE clubs SET member_count = CASE 
  WHEN name = 'Protocol Club' THEN 150
  WHEN name = 'CodeC Club' THEN 200
  WHEN name = 'AI Research Club' THEN 120
  WHEN name = 'Cyber Security Club' THEN 90
  WHEN name = 'TechNova Club' THEN 110
  WHEN name = 'DataVerse Club' THEN 95
  WHEN name = 'Neural Nexus' THEN 85
  WHEN name = 'Vision AI Club' THEN 75
  WHEN name = 'CircuitVerse Club' THEN 130
  WHEN name = 'RoboTech Club' THEN 100
  WHEN name = 'Spark Club' THEN 80
  WHEN name = 'PowerTech Society' THEN 60
  WHEN name = 'Aero Club' THEN 70
  WHEN name = 'AutoTech Club' THEN 90
  WHEN name = 'Robotics Society' THEN 110
  WHEN name = 'Nirman Club' THEN 65
  WHEN name = 'GreenBuild Club' THEN 50
  WHEN name = 'BioInnovators Club' THEN 45
  WHEN name = 'Entrepreneurship Cell' THEN 250
  WHEN name = 'Cultural Club' THEN 350
  WHEN name = 'Sports Club' THEN 300
  WHEN name = 'Photography Club' THEN 120
  WHEN name = 'NSS Club' THEN 400
  ELSE 50
END;