-- ===================== HOSPITAL MANAGEMENT SYSTEM - SQL FILE =====================
-- Project   : Hospital Management System
-- Database  : hospital_db
-- Created   : 2026-11-20
-- Description: Complete SQL file for a Hospital Management System including
--              table creation, sample data, and various queries.
-- ================================================================================


-- ===================== SECTION 1: DATABASE CREATION =====================

-- Drop database if it already exists, then create fresh
DROP DATABASE IF EXISTS hospital_db;
CREATE DATABASE hospital_db;
USE hospital_db;


-- ===================== SECTION 2: TABLE CREATION =====================

-- Table 1: departments
-- Stores all hospital departments
CREATE TABLE departments (
    dept_id    INT          NOT NULL AUTO_INCREMENT,
    dept_name  VARCHAR(100) NOT NULL,
    dept_head  VARCHAR(100),
    location   VARCHAR(100),
    PRIMARY KEY (dept_id)
);

-- Table 2: doctors
-- Stores doctor details; linked to departments via dept_id
CREATE TABLE doctors (
    doctor_id      INT          NOT NULL AUTO_INCREMENT,
    doctor_name    VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    dept_id        INT,
    phone          VARCHAR(15),
    email          VARCHAR(100),
    salary         DECIMAL(10, 2),
    PRIMARY KEY (doctor_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Table 3: patients
-- Stores patient registration details
CREATE TABLE patients (
    patient_id      INT          NOT NULL AUTO_INCREMENT,
    patient_name    VARCHAR(100) NOT NULL,
    age             INT          NOT NULL,
    gender          VARCHAR(10)  NOT NULL,
    phone           VARCHAR(15),
    address         VARCHAR(255),
    blood_group     VARCHAR(5),
    registered_date DATE,
    PRIMARY KEY (patient_id)
);

-- Table 4: appointments
-- Stores appointment bookings; linked to patients and doctors
CREATE TABLE appointments (
    appointment_id   INT         NOT NULL AUTO_INCREMENT,
    patient_id       INT,
    doctor_id        INT,
    appointment_date DATE        NOT NULL,
    appointment_time TIME,
    status           VARCHAR(20) DEFAULT 'Scheduled',
    reason           VARCHAR(255),
    PRIMARY KEY (appointment_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id)  REFERENCES doctors(doctor_id)
);

-- Table 5: rooms
-- Stores hospital room information
CREATE TABLE rooms (
    room_id         INT         NOT NULL AUTO_INCREMENT,
    room_number     VARCHAR(10) NOT NULL,
    room_type       VARCHAR(50) NOT NULL,
    status          VARCHAR(20) DEFAULT 'Available',
    charges_per_day DECIMAL(8, 2),
    PRIMARY KEY (room_id)
);

-- Table 6: admissions
-- Records patient admissions; linked to patients, rooms, and doctors
CREATE TABLE admissions (
    admission_id   INT  NOT NULL AUTO_INCREMENT,
    patient_id     INT,
    room_id        INT,
    doctor_id      INT,
    admission_date DATE NOT NULL,
    discharge_date DATE,
    total_charges  DECIMAL(10, 2),
    PRIMARY KEY (admission_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (room_id)    REFERENCES rooms(room_id),
    FOREIGN KEY (doctor_id)  REFERENCES doctors(doctor_id)
);

-- Table 7: nurses
-- Stores nurse details; linked to departments via dept_id
CREATE TABLE nurses (
    nurse_id   INT          NOT NULL AUTO_INCREMENT,
    nurse_name VARCHAR(100) NOT NULL,
    dept_id    INT,
    phone      VARCHAR(15),
    shift      VARCHAR(20),
    PRIMARY KEY (nurse_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Table 8: staff
-- Stores non-medical hospital staff details
CREATE TABLE staff (
    staff_id   INT          NOT NULL AUTO_INCREMENT,
    staff_name VARCHAR(100) NOT NULL,
    role       VARCHAR(100) NOT NULL,
    dept_id    INT,
    phone      VARCHAR(15),
    salary     DECIMAL(10, 2),
    PRIMARY KEY (staff_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Table 9: medicines
-- Stores medicine inventory details
CREATE TABLE medicines (
    medicine_id       INT          NOT NULL AUTO_INCREMENT,
    medicine_name     VARCHAR(100) NOT NULL,
    category          VARCHAR(100),
    quantity_in_stock INT,
    price_per_unit    DECIMAL(8, 2),
    supplier          VARCHAR(100),
    PRIMARY KEY (medicine_id)
);

-- Table 10: prescriptions
-- Records which medicines are prescribed to patients by doctors
CREATE TABLE prescriptions (
    prescription_id   INT         NOT NULL AUTO_INCREMENT,
    patient_id        INT,
    doctor_id         INT,
    medicine_id       INT,
    dosage            VARCHAR(100),
    prescribed_date   DATE        NOT NULL,
    quantity_prescribed INT,
    PRIMARY KEY (prescription_id),
    FOREIGN KEY (patient_id)  REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id)   REFERENCES doctors(doctor_id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id)
);


-- ===================== SECTION 3: SAMPLE INSERT DATA =====================

-- Insert data into departments (must be first; other tables depend on it)
INSERT INTO departments (dept_name, dept_head, location) VALUES
('Cardiology',       'Dr. Ramesh Kumar',   'Block A, Floor 1'),
('Neurology',        'Dr. Sunita Sharma',  'Block B, Floor 2'),
('Orthopedics',      'Dr. Arjun Singh',    'Block A, Floor 3'),
('Pediatrics',       'Dr. Meena Patel',    'Block C, Floor 1'),
('General Medicine', 'Dr. Vikram Nair',    'Block D, Floor 1'),
('Emergency',        'Dr. Priya Reddy',    'Block E, Ground'),
('Pharmacy',         'Mr. Suresh Gupta',   'Block F, Ground');

-- Insert data into doctors
INSERT INTO doctors (doctor_name, specialization, dept_id, phone, email, salary) VALUES
('Dr. Ramesh Kumar',   'Cardiologist',          1, '9876543210', 'ramesh@hospital.com',  95000.00),
('Dr. Sunita Sharma',  'Neurologist',           2, '9876543211', 'sunita@hospital.com',  92000.00),
('Dr. Arjun Singh',    'Orthopedic Surgeon',    3, '9876543212', 'arjun@hospital.com',   89000.00),
('Dr. Meena Patel',    'Pediatrician',          4, '9876543213', 'meena@hospital.com',   85000.00),
('Dr. Vikram Nair',    'General Physician',     5, '9876543214', 'vikram@hospital.com',  78000.00),
('Dr. Priya Reddy',    'Emergency Specialist',  6, '9876543215', 'priya@hospital.com',   88000.00),
('Dr. Anil Verma',     'Cardiologist',          1, '9876543216', 'anil@hospital.com',    91000.00);

-- Insert data into patients
INSERT INTO patients (patient_name, age, gender, phone, address, blood_group, registered_date) VALUES
('Amit Sharma',    34, 'Male',   '9900001111', '12 MG Road, Bangalore',       'B+',  '2026-01-05'),
('Pooja Mehta',    28, 'Female', '9900002222', '45 Park Street, Delhi',        'A+',  '2026-02-10'),
('Ravi Kumar',     55, 'Male',   '9900003333', '7 Lake View, Chennai',         'O+',  '2026-03-15'),
('Sneha Joshi',    22, 'Female', '9900004444', '3 Civil Lines, Jaipur',        'AB+', '2026-04-20'),
('Mahesh Yadav',   47, 'Male',   '9900005555', '89 Shivaji Nagar, Pune',       'A-',  '2026-05-01'),
('Kavya Nair',     31, 'Female', '9900006666', '21 Anna Nagar, Hyderabad',     'O-',  '2026-06-18'),
('Deepak Jain',    60, 'Male',   '9900007777', '5 Sector 11, Chandigarh',      'B-',  '2026-07-22'),
('Anjali Singh',   19, 'Female', '9900008888', '67 Nehru Place, Mumbai',       'AB-', '2026-08-30');

-- Insert data into rooms
INSERT INTO rooms (room_number, room_type, status, charges_per_day) VALUES
('101', 'General Ward',  'Occupied',   800.00),
('102', 'General Ward',  'Available',  800.00),
('201', 'Private Room',  'Occupied',  2500.00),
('202', 'Private Room',  'Available', 2500.00),
('301', 'ICU',           'Occupied',  6000.00),
('302', 'ICU',           'Available', 6000.00),
('401', 'Semi-Private',  'Available', 1500.00),
('402', 'Semi-Private',  'Occupied',  1500.00);

-- Insert data into appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES
(1, 1, '2026-11-01', '10:00:00', 'Completed',  'Chest pain and breathlessness'),
(2, 4, '2026-11-05', '11:30:00', 'Completed',  'Routine child health checkup'),
(3, 2, '2026-11-10', '09:00:00', 'Scheduled',  'Frequent headaches'),
(4, 5, '2026-11-12', '14:00:00', 'Scheduled',  'Fever and cold'),
(5, 3, '2026-11-14', '10:30:00', 'Scheduled',  'Knee pain'),
(6, 6, '2026-11-15', '08:00:00', 'Cancelled',  'Accident injury'),
(7, 1, '2026-11-18', '15:00:00', 'Scheduled',  'Follow-up for heart condition'),
(8, 5, '2026-11-20', '12:00:00', 'Scheduled',  'General checkup');

-- Insert data into admissions
INSERT INTO admissions (patient_id, room_id, doctor_id, admission_date, discharge_date, total_charges) VALUES
(1, 3, 1, '2026-10-01', '2026-10-07', 42000.00),
(3, 1, 2, '2026-10-15', '2026-10-20', 24000.00),
(5, 8, 3, '2026-11-01', '2026-11-05', 18000.00),
(7, 5, 1, '2026-11-10', NULL,         NULL),
(2, 4, 4, '2026-11-12', NULL,         NULL),
(6, 2, 6, '2026-11-14', '2026-11-16', 10000.00);

-- Insert data into nurses
INSERT INTO nurses (nurse_name, dept_id, phone, shift) VALUES
('Asha Thomas',    1, '9811001100', 'Morning'),
('Rekha Pillai',   2, '9811002200', 'Evening'),
('Sonia Kapoor',   3, '9811003300', 'Night'),
('Nidhi Rao',      4, '9811004400', 'Morning'),
('Geeta Mishra',   5, '9811005500', 'Evening'),
('Pooja Bhatt',    6, '9811006600', 'Night'),
('Ritu Sharma',    1, '9811007700', 'Morning');

-- Insert data into staff
INSERT INTO staff (staff_name, role, dept_id, phone, salary) VALUES
('Suresh Gupta',  'Pharmacist',         7, '9822001100', 45000.00),
('Kiran Bose',    'Lab Technician',     5, '9822002200', 38000.00),
('Mohan Lal',     'Receptionist',       5, '9822003300', 28000.00),
('Deepa Nair',    'Hospital Admin',     5, '9822004400', 52000.00),
('Rahul Das',     'Radiologist',        2, '9822005500', 60000.00),
('Anita Soni',    'Nutritionist',       4, '9822006600', 42000.00),
('Sunil Tiwari',  'Security Guard',     6, '9822007700', 22000.00);

-- Insert data into medicines
INSERT INTO medicines (medicine_name, category, quantity_in_stock, price_per_unit, supplier) VALUES
('Aspirin',        'Analgesic',       500,  5.00,   'MedSupply Co.'),
('Amoxicillin',    'Antibiotic',      300,  12.50,  'PharmaPlus Ltd.'),
('Metformin',      'Antidiabetic',    400,  8.00,   'HealthCare Pharma'),
('Atorvastatin',   'Statin',          250,  18.00,  'CardioMed Suppliers'),
('Paracetamol',    'Analgesic',       600,  3.50,   'MedSupply Co.'),
('Omeprazole',     'Antacid',         350,  10.00,  'GastroPharm'),
('Amlodipine',     'Antihypertensive',200,  22.00,  'CardioMed Suppliers'),
('Cetirizine',     'Antihistamine',   450,  7.00,   'AllergyMeds Inc.');

-- Insert data into prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, medicine_id, dosage, prescribed_date, quantity_prescribed) VALUES
(1, 1, 4, '10mg once daily',         '2026-11-01', 30),
(1, 1, 7, '5mg once daily',          '2026-11-01', 30),
(2, 4, 5, '500mg twice daily',       '2026-11-05', 10),
(3, 2, 1, '75mg once daily',         '2026-11-10', 30),
(4, 5, 5, '500mg three times daily', '2026-11-12', 15),
(4, 5, 6, '20mg once daily',          '2026-11-12', 14),
(5, 3, 2, '500mg twice daily',       '2026-11-14',  7),
(7, 1, 4, '20mg once daily',         '2026-11-18', 30);


-- ===================== SECTION 4: SELECT QUERIES =====================

-- Display all departments
SELECT * FROM departments ORDER BY dept_id;

-- Display all doctors with their department names
SELECT doctor_id, doctor_name, specialization, dept_name, phone, email, salary
FROM doctors
JOIN departments ON doctors.dept_id = departments.dept_id
ORDER BY doctor_id;

-- Display all patients ordered by registration date
SELECT * FROM patients ORDER BY registered_date;

-- Display all appointments (upcoming / scheduled)
SELECT * FROM appointments
WHERE status = 'Scheduled'
ORDER BY appointment_date, appointment_time;

-- Display all available rooms
SELECT * FROM rooms WHERE status = 'Available' ORDER BY room_id;

-- Display all current (active) admissions where patient is not yet discharged
SELECT * FROM admissions WHERE discharge_date IS NULL ORDER BY admission_date;

-- Display all nurses with their shift information
SELECT * FROM nurses ORDER BY dept_id, shift;

-- Display all staff members ordered by salary descending
SELECT * FROM staff ORDER BY salary DESC;

-- Display complete medicine inventory
SELECT * FROM medicines ORDER BY category, medicine_name;

-- Display all prescriptions ordered by prescribed date
SELECT * FROM prescriptions ORDER BY prescribed_date DESC;


-- ===================== SECTION 5: UPDATE QUERIES =====================

-- Mark an appointment as Completed (appointment_id = 3)
UPDATE appointments
SET status = 'Completed'
WHERE appointment_id = 3;

-- Update a patient's phone number (patient_id = 2)
UPDATE patients
SET phone = '9900009999'
WHERE patient_id = 2;

-- Set discharge date and total charges for an admission (admission_id = 4)
-- Patient was admitted in an ICU at 6000/day for 7 days
UPDATE admissions
SET discharge_date = '2026-11-17',
    total_charges  = 42000.00
WHERE admission_id = 4;

-- Update room status to Occupied when a patient is admitted (room_id = 2)
UPDATE rooms
SET status = 'Occupied'
WHERE room_id = 2;

-- Increase stock of Paracetamol (medicine_id = 5) after a new delivery
UPDATE medicines
SET quantity_in_stock = quantity_in_stock + 200
WHERE medicine_id = 5;

-- Update a doctor's salary (doctor_id = 5)
UPDATE doctors
SET salary = 82000.00
WHERE doctor_id = 5;

-- Change a nurse's shift (nurse_id = 3)
UPDATE nurses
SET shift = 'Morning'
WHERE nurse_id = 3;


-- ===================== SECTION 6: DELETE QUERIES =====================

-- Delete a cancelled appointment (appointment_id = 6)
DELETE FROM appointments
WHERE appointment_id = 6 AND status = 'Cancelled';

-- Delete a prescription record that was entered by mistake (prescription_id = 8)
DELETE FROM prescriptions
WHERE prescription_id = 8;

-- Remove a staff member who has left the hospital (staff_id = 7)
DELETE FROM staff
WHERE staff_id = 7;

-- Delete a medicine that is no longer stocked (medicine_id = 8)
-- Note: Ensure no prescriptions reference this medicine before deleting
DELETE FROM medicines
WHERE medicine_id = 8;


-- ===================== SECTION 7: JOIN QUERIES =====================

-- JOIN 1: List appointments with patient name, doctor name, date and status
-- Useful for the appointments management screen
SELECT
    a.appointment_id,
    p.patient_name,
    d.doctor_name,
    d.specialization,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.reason
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors  d ON a.doctor_id  = d.doctor_id
ORDER BY a.appointment_date, a.appointment_time;

-- JOIN 2: List current admissions with patient name, room number, room type, and doctor
-- Useful for the admissions/ward management screen
SELECT
    adm.admission_id,
    p.patient_name,
    p.blood_group,
    r.room_number,
    r.room_type,
    d.doctor_name,
    adm.admission_date,
    adm.discharge_date,
    adm.total_charges
FROM admissions adm
JOIN patients p ON adm.patient_id = p.patient_id
JOIN rooms    r ON adm.room_id    = r.room_id
JOIN doctors  d ON adm.doctor_id  = d.doctor_id
ORDER BY adm.admission_date DESC;

-- JOIN 3: Show prescriptions with patient name, doctor name, and medicine name
-- Useful for the pharmacy / prescription screen
SELECT
    pr.prescription_id,
    p.patient_name,
    d.doctor_name,
    m.medicine_name,
    m.category,
    pr.dosage,
    pr.quantity_prescribed,
    pr.prescribed_date
FROM prescriptions pr
JOIN patients  p ON pr.patient_id  = p.patient_id
JOIN doctors   d ON pr.doctor_id   = d.doctor_id
JOIN medicines m ON pr.medicine_id = m.medicine_id
ORDER BY pr.prescribed_date DESC;

-- JOIN 4: List doctors along with their department name and location
SELECT
    d.doctor_id,
    d.doctor_name,
    d.specialization,
    dept.dept_name,
    dept.location,
    d.phone,
    d.email
FROM doctors d
JOIN departments dept ON d.dept_id = dept.dept_id
ORDER BY dept.dept_name, d.doctor_name;

-- JOIN 5: List nurses with their department name and shift
SELECT
    n.nurse_id,
    n.nurse_name,
    dept.dept_name,
    n.shift,
    n.phone
FROM nurses n
JOIN departments dept ON n.dept_id = dept.dept_id
ORDER BY dept.dept_name, n.shift;

-- JOIN 6: List staff members with their department names
SELECT
    s.staff_id,
    s.staff_name,
    s.role,
    dept.dept_name,
    s.phone,
    s.salary
FROM staff s
JOIN departments dept ON s.dept_id = dept.dept_id
ORDER BY dept.dept_name, s.role;


-- ===================== SECTION 8: COUNT AND GROUP BY QUERIES =====================

-- Count total number of patients registered
SELECT COUNT(*) AS total_patients FROM patients;

-- Count total number of doctors in the hospital
SELECT COUNT(*) AS total_doctors FROM doctors;

-- Count number of doctors in each department
-- Useful for department overview dashboard card
SELECT
    dept.dept_name,
    COUNT(d.doctor_id) AS number_of_doctors
FROM departments dept
LEFT JOIN doctors d ON dept.dept_id = d.dept_id
GROUP BY dept.dept_name
ORDER BY number_of_doctors DESC;

-- Count appointments by status (Scheduled, Completed, Cancelled)
-- Useful for appointment stats dashboard card
SELECT
    status,
    COUNT(*) AS total_appointments
FROM appointments
GROUP BY status
ORDER BY total_appointments DESC;

-- Count number of patients per blood group
-- Useful for blood bank / patient statistics
SELECT
    blood_group,
    COUNT(*) AS patient_count
FROM patients
GROUP BY blood_group
ORDER BY patient_count DESC;

-- Count rooms by type and their current availability status
SELECT
    room_type,
    status,
    COUNT(*) AS room_count
FROM rooms
GROUP BY room_type, status
ORDER BY room_type, status;

-- Count total occupied vs available rooms
SELECT
    status,
    COUNT(*) AS room_count
FROM rooms
GROUP BY status;

-- Count nurses per department
SELECT
    dept.dept_name,
    COUNT(n.nurse_id) AS number_of_nurses
FROM departments dept
LEFT JOIN nurses n ON dept.dept_id = n.dept_id
GROUP BY dept.dept_name
ORDER BY number_of_nurses DESC;

-- Count prescriptions per doctor (shows most active doctors)
SELECT
    d.doctor_name,
    COUNT(pr.prescription_id) AS total_prescriptions
FROM doctors d
LEFT JOIN prescriptions pr ON d.doctor_id = pr.doctor_id
GROUP BY d.doctor_name
ORDER BY total_prescriptions DESC;

-- Sum of total charges collected from completed admissions
SELECT
    SUM(total_charges) AS total_revenue
FROM admissions
WHERE discharge_date IS NOT NULL;

-- Count admissions per doctor (workload per doctor)
SELECT
    d.doctor_name,
    d.specialization,
    COUNT(adm.admission_id) AS total_admissions
FROM doctors d
LEFT JOIN admissions adm ON d.doctor_id = adm.doctor_id
GROUP BY d.doctor_name, d.specialization
ORDER BY total_admissions DESC;

-- Total value of medicine inventory per category
-- Useful for pharmacy stock dashboard
SELECT
    category,
    COUNT(medicine_id)                           AS total_medicines,
    SUM(quantity_in_stock)                       AS total_units_in_stock,
    SUM(quantity_in_stock * price_per_unit)      AS total_stock_value
FROM medicines
GROUP BY category
ORDER BY total_stock_value DESC;

-- Count appointments per doctor (doctor workload summary)
SELECT
    d.doctor_name,
    d.specialization,
    COUNT(a.appointment_id) AS total_appointments
FROM doctors d
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
GROUP BY d.doctor_name, d.specialization
ORDER BY total_appointments DESC;

-- ===================== END OF HOSPITAL.SQL =====================
