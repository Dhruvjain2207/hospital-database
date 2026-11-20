# 🏥 Hospital Management System

> A full-stack web application for managing hospital operations — built as a college DBMS project using React, Node.js, Express, and MySQL.

---

## Project Overview

The **Hospital Management System** is a beginner-level college Database Management System (DBMS) project that simulates the core operations of a hospital. It provides a clean, browser-based interface to manage patients, doctors, departments, appointments, rooms, admissions, nurses, staff, medicines, and prescriptions.

The goal of this project is to demonstrate practical use of SQL (MySQL) integrated with a modern web stack. All data is stored in a relational MySQL database, accessed through a RESTful Express.js API, and displayed via a React 18 frontend.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Database** | MySQL 8.0 |
| **Backend** | Node.js + Express.js |
| **Frontend** | React 18 + Vite |
| **API Communication** | Axios |
| **Routing** | React Router DOM |
| **Environment Config** | dotenv |

---

## Project Structure

```
hospital/
├── hospital.sql              ← Full database schema + sample data
├── README.md                 ← This file
├── backend/
│   ├── package.json          ← Backend dependencies
│   ├── server.js             ← Express server & all API routes
│   ├── db.js                 ← MySQL connection configuration
│   └── .env                  ← Environment variables (DB credentials)
└── frontend/
    ├── package.json          ← Frontend dependencies
    ├── vite.config.js        ← Vite build configuration
    ├── index.html            ← HTML entry point
    └── src/
        ├── main.jsx          ← React app entry point
        ├── App.jsx           ← Root component & router setup
        ├── App.css           ← Global styles
        ├── api.js            ← Axios base URL configuration
        └── pages/
            ├── Dashboard.jsx
            ├── Patients.jsx
            ├── Doctors.jsx
            ├── Departments.jsx
            ├── Appointments.jsx
            ├── Rooms.jsx
            ├── Admissions.jsx
            ├── Nurses.jsx
            ├── Staff.jsx
            ├── Medicines.jsx
            └── Prescriptions.jsx
```

---

## Database Tables (10 Tables)

| # | Table Name | Purpose |
|---|---|---|
| 1 | `departments` | Stores hospital departments (e.g., Cardiology, Neurology) |
| 2 | `doctors` | Stores doctor details, their specialization, and department |
| 3 | `patients` | Stores patient personal and contact information |
| 4 | `appointments` | Records scheduled appointments between patients and doctors |
| 5 | `rooms` | Tracks hospital rooms, their type, and availability status |
| 6 | `admissions` | Manages patient admissions, assigned room, and discharge info |
| 7 | `nurses` | Stores nurse details and their department assignment |
| 8 | `staff` | Records non-medical staff (admin, housekeeping, etc.) |
| 9 | `medicines` | Maintains a catalog of medicines with stock and pricing |
| 10 | `prescriptions` | Links patients, doctors, and medicines via prescriptions |

---

## Features

| Module | Features |
|---|---|
| **Dashboard** | Overview statistics: total patients, doctors, appointments, etc. |
| **Patients** | Add, view, edit, and delete patient records |
| **Doctors** | Manage doctor profiles, specializations, and department links |
| **Departments** | Create and manage hospital departments |
| **Appointments** | Schedule, update, and cancel patient-doctor appointments |
| **Rooms** | Track room types (General, ICU, Private) and availability |
| **Admissions** | Admit patients to rooms and record discharge dates |
| **Nurses** | Maintain nurse records and department assignments |
| **Staff** | Manage non-medical staff roles and details |
| **Medicines** | Maintain medicine inventory with stock levels and prices |
| **Prescriptions** | Record medicine prescriptions tied to patients and doctors |

---

## Prerequisites

Before running this project, ensure the following are installed on your system:

- **Node.js** v18 or higher — [https://nodejs.org](https://nodejs.org)
- **MySQL 8.0** or higher — installed and running as a service
- **MySQL Workbench** *(optional but recommended)* — [https://www.mysql.com/products/workbench/](https://www.mysql.com/products/workbench/)
- **npm** (comes bundled with Node.js)

---

## Installation & Setup

### Step 1: Database Setup

1. Open **MySQL Workbench** (or the MySQL command-line client)
2. Open the `hospital.sql` file from the project root:
   - In Workbench: `File → Open SQL Script → select hospital.sql`
3. Run the entire script:
   - In Workbench: press **Ctrl + Shift + Enter**
   - In CLI: `mysql -u root -p < hospital.sql`
4. Verify the `hospital_db` database was created with all 10 tables:

```sql
USE hospital_db;
SHOW TABLES;
```

---

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Edit the `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_db
PORT=5000
```

Start the backend server:

```bash
npm start
```

✅ Backend runs at: **http://localhost:5000**

---

### Step 3: Frontend Setup

Open a **new terminal window**, then:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs at: **http://localhost:5173**

> **Note:** Keep both the backend terminal and the frontend terminal running at the same time. The frontend communicates with the backend at port 5000.

---

## API Endpoints

All endpoints are prefixed with `http://localhost:5000`.

### Departments
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/departments` | Fetch all departments | `SELECT * FROM departments` |
| POST | `/departments` | Add a new department | `INSERT INTO departments` |
| PUT | `/departments/:id` | Update department details | `UPDATE departments WHERE id` |
| DELETE | `/departments/:id` | Delete a department | `DELETE FROM departments WHERE id` |

### Doctors
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/doctors` | Fetch all doctors (with department name) | `SELECT ... JOIN departments` |
| POST | `/doctors` | Add a new doctor | `INSERT INTO doctors` |
| PUT | `/doctors/:id` | Update doctor details | `UPDATE doctors WHERE id` |
| DELETE | `/doctors/:id` | Delete a doctor | `DELETE FROM doctors WHERE id` |

### Patients
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/patients` | Fetch all patients | `SELECT * FROM patients` |
| POST | `/patients` | Register a new patient | `INSERT INTO patients` |
| PUT | `/patients/:id` | Update patient info | `UPDATE patients WHERE id` |
| DELETE | `/patients/:id` | Delete a patient record | `DELETE FROM patients WHERE id` |

### Appointments
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/appointments` | Fetch all appointments (with names) | `SELECT ... JOIN patients, doctors` |
| POST | `/appointments` | Schedule a new appointment | `INSERT INTO appointments` |
| PUT | `/appointments/:id` | Update appointment details | `UPDATE appointments WHERE id` |
| DELETE | `/appointments/:id` | Cancel an appointment | `DELETE FROM appointments WHERE id` |

### Rooms
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/rooms` | Fetch all rooms | `SELECT * FROM rooms` |
| POST | `/rooms` | Add a new room | `INSERT INTO rooms` |
| PUT | `/rooms/:id` | Update room info/status | `UPDATE rooms WHERE id` |
| DELETE | `/rooms/:id` | Delete a room | `DELETE FROM rooms WHERE id` |

### Admissions
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/admissions` | Fetch all admissions (with names) | `SELECT ... JOIN patients, rooms` |
| POST | `/admissions` | Admit a patient | `INSERT INTO admissions` |
| PUT | `/admissions/:id` | Update/discharge patient | `UPDATE admissions WHERE id` |
| DELETE | `/admissions/:id` | Remove an admission | `DELETE FROM admissions WHERE id` |

### Nurses
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/nurses` | Fetch all nurses | `SELECT ... JOIN departments` |
| POST | `/nurses` | Add a new nurse | `INSERT INTO nurses` |
| PUT | `/nurses/:id` | Update nurse details | `UPDATE nurses WHERE id` |
| DELETE | `/nurses/:id` | Delete nurse record | `DELETE FROM nurses WHERE id` |

### Staff
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/staff` | Fetch all staff members | `SELECT * FROM staff` |
| POST | `/staff` | Add a new staff member | `INSERT INTO staff` |
| PUT | `/staff/:id` | Update staff details | `UPDATE staff WHERE id` |
| DELETE | `/staff/:id` | Delete staff record | `DELETE FROM staff WHERE id` |

### Medicines
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/medicines` | Fetch all medicines | `SELECT * FROM medicines` |
| POST | `/medicines` | Add a new medicine | `INSERT INTO medicines` |
| PUT | `/medicines/:id` | Update medicine/stock | `UPDATE medicines WHERE id` |
| DELETE | `/medicines/:id` | Remove a medicine | `DELETE FROM medicines WHERE id` |

### Prescriptions
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/prescriptions` | Fetch all prescriptions (with names) | `SELECT ... JOIN patients, doctors, medicines` |
| POST | `/prescriptions` | Add a new prescription | `INSERT INTO prescriptions` |
| PUT | `/prescriptions/:id` | Update prescription | `UPDATE prescriptions WHERE id` |
| DELETE | `/prescriptions/:id` | Delete a prescription | `DELETE FROM prescriptions WHERE id` |

### Dashboard
| Method | Endpoint | Description | SQL Operation |
|---|---|---|---|
| GET | `/dashboard/stats` | Fetch count statistics for all modules | `SELECT COUNT(*) FROM ...` (multiple queries) |

---

## SQL Concepts Used

This project demonstrates **16 SQL concepts** throughout the database schema and API queries:

| # | SQL Concept | Example Used In This Project |
|---|---|---|
| 1 | `CREATE DATABASE` | `CREATE DATABASE hospital_db;` — creates the main database |
| 2 | `USE` | `USE hospital_db;` — selects the active database |
| 3 | `CREATE TABLE` | Used to create all 10 tables with column definitions |
| 4 | `PRIMARY KEY` | Every table has a primary key (e.g., `patient_id INT PRIMARY KEY AUTO_INCREMENT`) |
| 5 | `FOREIGN KEY` | `doctors.department_id` references `departments.department_id` |
| 6 | `AUTO_INCREMENT` | All primary key IDs auto-increment on insert |
| 7 | `NOT NULL` | Enforces required fields (e.g., patient name, doctor name) |
| 8 | `DEFAULT` | `status VARCHAR(20) DEFAULT 'Scheduled'` in appointments |
| 9 | `INSERT INTO` | Used to populate sample data and add new records via API |
| 10 | `SELECT` | Used in every GET endpoint to fetch records |
| 11 | `SELECT *` | Used for simple full-table reads (e.g., `SELECT * FROM patients`) |
| 12 | `WHERE` | Filters records by ID (e.g., `WHERE patient_id = ?`) |
| 13 | `UPDATE` | Used in all PUT endpoints (e.g., `UPDATE patients SET ... WHERE id = ?`) |
| 14 | `DELETE` | Used in all DELETE endpoints (e.g., `DELETE FROM patients WHERE id = ?`) |
| 15 | `JOIN` (INNER JOIN) | Used in appointments, prescriptions, etc. to fetch related names across tables |
| 16 | `COUNT()` | Used in the Dashboard stats query (`SELECT COUNT(*) FROM patients`) |

---

## Screenshots / Module Descriptions

### 🏠 Dashboard
Displays summary statistics cards showing total counts for patients, doctors, appointments, admissions, rooms, and medicines. Provides a quick at-a-glance view of the hospital's status.

### 🧑‍⚕️ Patients
Full CRUD interface for patient records. Fields include name, age, gender, contact number, address, and blood group. Supports adding new patients, editing existing ones, and deleting records.

### 👨‍⚕️ Doctors
Manage doctor profiles including name, specialization, contact, and department assignment. Doctors are linked to departments via a foreign key relationship, and the department name is displayed using a JOIN.

### 🏢 Departments
Add and manage hospital departments (e.g., Cardiology, Orthopedics, Neurology). Department records are referenced by doctors and nurses.

### 📅 Appointments
Schedule appointments between patients and doctors. Displays patient and doctor names (via JOIN), appointment date/time, and status (Scheduled / Completed / Cancelled).

### 🛏️ Rooms
Track hospital room inventory. Each room has a room number, type (General / ICU / Private), and availability status (Available / Occupied). Used during patient admissions.

### 🏥 Admissions
Record patient admissions by linking a patient to a room. Stores admission date and discharge date. Room occupancy can be updated upon discharge.

### 💉 Nurses
Maintain nurse records including name, qualification, shift, contact, and department assignment. Similar structure to doctors, linked to departments.

### 🧹 Staff
Manage non-medical staff such as administrative assistants, housekeeping, and security. Fields include name, role, contact, and salary.

### 💊 Medicines
Catalog of all medicines in the hospital. Stores medicine name, type, manufacturer, price, and stock quantity. Used when creating prescriptions.

### 📋 Prescriptions
Links patients, doctors, and medicines together. Records the prescribed medicine, dosage instructions, and prescription date. Uses a three-table JOIN for display.

---

## Usage Instructions

After completing the **Installation & Setup** steps above:

1. **Open the application** in your browser at `http://localhost:5173`
2. **Start with Departments** — Add a few hospital departments (e.g., Cardiology, Pediatrics)
3. **Add Doctors** — Register doctors and assign them to a department
4. **Register Patients** — Add patient records with their personal details
5. **Add Rooms** — Add hospital rooms with types and mark them as Available
6. **Schedule Appointments** — Create appointments linking patients to doctors
7. **Admit a Patient** — Use the Admissions page to assign a patient to a room
8. **Add Medicines** — Populate the medicine catalog with stock details
9. **Write Prescriptions** — Prescribe medicines to patients, assigned by a doctor
10. **View Dashboard** — Check the Dashboard for a live count of all records

> **Tip:** Use the **Edit** and **Delete** buttons on each page to modify or remove records. All changes reflect immediately in the MySQL database.

---

## Notes for Examiner

- ✅ This is a **beginner-level college DBMS project** designed for academic submission
- ✅ All SQL queries follow **basic MySQL syntax** — straightforward and readable
- ✅ **No advanced SQL concepts** are used — no stored procedures, triggers, views, or indexes
- ✅ The `hospital.sql` file is **independently executable** in MySQL Workbench with a single script run
- ✅ The project demonstrates a full **CRUD application** (Create, Read, Update, Delete) across 10 database tables
- ✅ **Foreign key relationships** are established between tables to enforce referential integrity
- ✅ The frontend and backend are **completely separated** (decoupled architecture) communicating via REST API
- ✅ Sample/seed data is included in `hospital.sql` for immediate demonstration without manual data entry

---

*Hospital Management System — College DBMS Project*
