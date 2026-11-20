const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Helper ─────────────────────────────────────────────────────────────────
// Wraps db.query in a Promise so we can use async/await cleanly
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// =============================================================================
// PATIENTS
// =============================================================================

// GET /api/patients/count/total
app.get('/api/patients/count/total', async (req, res) => {
  try {
    const results = await query('SELECT COUNT(*) as total FROM patients');
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients
app.get('/api/patients', async (req, res) => {
  try {
    const results = await query('SELECT * FROM patients ORDER BY registered_date DESC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/patients/:id
app.get('/api/patients/:id', async (req, res) => {
  try {
    const results = await query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
    if (results.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/patients
app.post('/api/patients', async (req, res) => {
  try {
    const { patient_name, age, gender, phone, address, blood_group, registered_date } = req.body;
    const results = await query(
      'INSERT INTO patients (patient_name, age, gender, phone, address, blood_group, registered_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        patient_name,
        parseInt(age, 10) || 0,
        gender,
        phone || null,
        address || null,
        blood_group || null,
        registered_date || new Date().toISOString().split('T')[0]
      ]
    );
    res.status(201).json({ message: 'Patient registered successfully', patient_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/patients/:id
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { patient_name, age, gender, phone, address, blood_group, registered_date } = req.body;
    const results = await query(
      'UPDATE patients SET patient_name=?, age=?, gender=?, phone=?, address=?, blood_group=?, registered_date=? WHERE patient_id=?',
      [
        patient_name,
        parseInt(age, 10) || 0,
        gender,
        phone || null,
        address || null,
        blood_group || null,
        registered_date || null,
        req.params.id
      ]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/patients/:id
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM patients WHERE patient_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// DOCTORS
// =============================================================================

// GET /api/doctors/count/total
app.get('/api/doctors/count/total', async (req, res) => {
  try {
    const results = await query('SELECT COUNT(*) as total FROM doctors');
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const results = await query(
      `SELECT doctors.*, departments.dept_name
       FROM doctors
       LEFT JOIN departments ON doctors.dept_id = departments.dept_id
       ORDER BY doctor_name`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/:id
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const results = await query(
      `SELECT doctors.*, departments.dept_name
       FROM doctors
       LEFT JOIN departments ON doctors.dept_id = departments.dept_id
       WHERE doctors.doctor_id = ?`,
      [req.params.id]
    );
    if (results.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/doctors
app.post('/api/doctors', async (req, res) => {
  try {
    const { doctor_name, specialization, dept_id, phone, email, salary } = req.body;
    const results = await query(
      'INSERT INTO doctors (doctor_name, specialization, dept_id, phone, email, salary) VALUES (?, ?, ?, ?, ?, ?)',
      [doctor_name, specialization, dept_id || null, phone || null, email || null, salary || null]
    );
    res.status(201).json({ message: 'Doctor added successfully', doctor_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/doctors/:id
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const { doctor_name, specialization, dept_id, phone, email, salary } = req.body;
    const results = await query(
      'UPDATE doctors SET doctor_name=?, specialization=?, dept_id=?, phone=?, email=?, salary=? WHERE doctor_id=?',
      [doctor_name, specialization, dept_id || null, phone || null, email || null, salary || null, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/doctors/:id
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM doctors WHERE doctor_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// DEPARTMENTS
// =============================================================================

// GET /api/departments
app.get('/api/departments', async (req, res) => {
  try {
    const results = await query('SELECT * FROM departments ORDER BY dept_name');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/departments
app.post('/api/departments', async (req, res) => {
  try {
    const { dept_name, dept_head, location } = req.body;
    const results = await query(
      'INSERT INTO departments (dept_name, dept_head, location) VALUES (?, ?, ?)',
      [dept_name, dept_head || null, location || null]
    );
    res.status(201).json({ message: 'Department added successfully', dept_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/departments/:id
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { dept_name, dept_head, location } = req.body;
    const results = await query(
      'UPDATE departments SET dept_name=?, dept_head=?, location=? WHERE dept_id=?',
      [dept_name, dept_head || null, location || null, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/departments/:id
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM departments WHERE dept_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// APPOINTMENTS
// =============================================================================

// GET /api/appointments/count/today
app.get('/api/appointments/count/today', async (req, res) => {
  try {
    const results = await query('SELECT COUNT(*) as total FROM appointments WHERE DATE(appointment_date) = CURDATE()');
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const results = await query(
      `SELECT appointments.*,
              patients.patient_name,
              doctors.doctor_name
       FROM appointments
       LEFT JOIN patients ON appointments.patient_id = patients.patient_id
       LEFT JOIN doctors  ON appointments.doctor_id  = doctors.doctor_id
       ORDER BY appointment_date DESC`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments
app.post('/api/appointments', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status, reason } = req.body;
    const results = await query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time || null, status || 'Scheduled', reason || null]
    );
    res.status(201).json({ message: 'Appointment added successfully', appointment_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/appointments/:id
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status, reason } = req.body;
    const results = await query(
      'UPDATE appointments SET patient_id=?, doctor_id=?, appointment_date=?, appointment_time=?, status=?, reason=? WHERE appointment_id=?',
      [patient_id, doctor_id, appointment_date, appointment_time || null, status || 'Scheduled', reason || null, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/appointments/:id
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM appointments WHERE appointment_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// ROOMS
// =============================================================================

// GET /api/rooms/available
app.get('/api/rooms/available', async (req, res) => {
  try {
    const results = await query("SELECT * FROM rooms WHERE status = 'Available' ORDER BY room_number");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const results = await query('SELECT * FROM rooms ORDER BY room_number');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms
app.post('/api/rooms', async (req, res) => {
  try {
    const { room_number, room_type, status, charges_per_day, price_per_day } = req.body;
    const charges = charges_per_day !== undefined ? charges_per_day : price_per_day;
    const results = await query(
      'INSERT INTO rooms (room_number, room_type, status, charges_per_day) VALUES (?, ?, ?, ?)',
      [room_number, room_type, status || 'Available', charges || 0]
    );
    res.status(201).json({ message: 'Room added successfully', room_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/rooms/:id
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { room_number, room_type, status, charges_per_day, price_per_day } = req.body;
    const charges = charges_per_day !== undefined ? charges_per_day : price_per_day;
    const results = await query(
      'UPDATE rooms SET room_number=?, room_type=?, status=?, charges_per_day=? WHERE room_id=?',
      [room_number, room_type, status || 'Available', charges || 0, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/rooms/:id
app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM rooms WHERE room_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// ADMISSIONS
// =============================================================================

// GET /api/admissions
app.get('/api/admissions', async (req, res) => {
  try {
    const results = await query(
      `SELECT admissions.*,
              patients.patient_name,
              rooms.room_number,
              doctors.doctor_name
       FROM admissions
       LEFT JOIN patients ON admissions.patient_id = patients.patient_id
       LEFT JOIN rooms    ON admissions.room_id    = rooms.room_id
       LEFT JOIN doctors  ON admissions.doctor_id  = doctors.doctor_id
       ORDER BY admission_date DESC`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admissions
app.post('/api/admissions', async (req, res) => {
  try {
    const { patient_id, room_id, doctor_id, admission_date, discharge_date, total_charges } = req.body;
    const results = await query(
      'INSERT INTO admissions (patient_id, room_id, doctor_id, admission_date, discharge_date, total_charges) VALUES (?, ?, ?, ?, ?, ?)',
      [
        patient_id,
        room_id,
        doctor_id,
        admission_date,
        discharge_date || null,
        total_charges || 0
      ]
    );
    // Mark room as Occupied if still admitted
    if (!discharge_date && room_id) {
      await query("UPDATE rooms SET status = 'Occupied' WHERE room_id = ?", [room_id]);
    }
    res.status(201).json({ message: 'Admission recorded successfully', admission_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admissions/:id
app.put('/api/admissions/:id', async (req, res) => {
  try {
    const { patient_id, room_id, doctor_id, admission_date, discharge_date, total_charges } = req.body;
    const results = await query(
      'UPDATE admissions SET patient_id=?, room_id=?, doctor_id=?, admission_date=?, discharge_date=?, total_charges=? WHERE admission_id=?',
      [
        patient_id,
        room_id,
        doctor_id,
        admission_date,
        discharge_date || null,
        total_charges || 0,
        req.params.id
      ]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Admission not found' });

    // If discharged, free the room
    if (discharge_date && room_id) {
      await query("UPDATE rooms SET status = 'Available' WHERE room_id = ?", [room_id]);
    }
    res.json({ message: 'Admission updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admissions/:id
app.delete('/api/admissions/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM admissions WHERE admission_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Admission not found' });
    res.json({ message: 'Admission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// NURSES
// =============================================================================

// GET /api/nurses
app.get('/api/nurses', async (req, res) => {
  try {
    const results = await query(
      `SELECT nurses.*, departments.dept_name
       FROM nurses
       LEFT JOIN departments ON nurses.dept_id = departments.dept_id
       ORDER BY nurse_name`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/nurses
app.post('/api/nurses', async (req, res) => {
  try {
    const { nurse_name, dept_id, phone, shift } = req.body;
    const results = await query(
      'INSERT INTO nurses (nurse_name, dept_id, phone, shift) VALUES (?, ?, ?, ?)',
      [nurse_name, dept_id || null, phone || null, shift || null]
    );
    res.status(201).json({ message: 'Nurse added successfully', nurse_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/nurses/:id
app.put('/api/nurses/:id', async (req, res) => {
  try {
    const { nurse_name, dept_id, phone, shift } = req.body;
    const results = await query(
      'UPDATE nurses SET nurse_name=?, dept_id=?, phone=?, shift=? WHERE nurse_id=?',
      [nurse_name, dept_id || null, phone || null, shift || null, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Nurse not found' });
    res.json({ message: 'Nurse updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/nurses/:id
app.delete('/api/nurses/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM nurses WHERE nurse_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Nurse not found' });
    res.json({ message: 'Nurse deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// STAFF
// =============================================================================

// GET /api/staff
app.get('/api/staff', async (req, res) => {
  try {
    const results = await query(
      `SELECT staff.*, departments.dept_name
       FROM staff
       LEFT JOIN departments ON staff.dept_id = departments.dept_id
       ORDER BY staff_name`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/staff
app.post('/api/staff', async (req, res) => {
  try {
    const { staff_name, role, dept_id, phone, salary } = req.body;
    const results = await query(
      'INSERT INTO staff (staff_name, role, dept_id, phone, salary) VALUES (?, ?, ?, ?, ?)',
      [staff_name, role, dept_id || null, phone || null, salary || null]
    );
    res.status(201).json({ message: 'Staff added successfully', staff_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/staff/:id
app.put('/api/staff/:id', async (req, res) => {
  try {
    const { staff_name, role, dept_id, phone, salary } = req.body;
    const results = await query(
      'UPDATE staff SET staff_name=?, role=?, dept_id=?, phone=?, salary=? WHERE staff_id=?',
      [staff_name, role, dept_id || null, phone || null, salary || null, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/staff/:id
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM staff WHERE staff_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// MEDICINES
// =============================================================================

// GET /api/medicines/low-stock
app.get('/api/medicines/low-stock', async (req, res) => {
  try {
    const results = await query('SELECT * FROM medicines WHERE quantity_in_stock < 20 ORDER BY quantity_in_stock');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/medicines
app.get('/api/medicines', async (req, res) => {
  try {
    const results = await query('SELECT * FROM medicines ORDER BY medicine_name');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/medicines
app.post('/api/medicines', async (req, res) => {
  try {
    const { medicine_name, category, quantity_in_stock, price_per_unit, price, supplier } = req.body;
    const unitPrice = price_per_unit !== undefined ? price_per_unit : price;
    const results = await query(
      'INSERT INTO medicines (medicine_name, category, quantity_in_stock, price_per_unit, supplier) VALUES (?, ?, ?, ?, ?)',
      [medicine_name, category || null, quantity_in_stock || 0, unitPrice || 0, supplier || null]
    );
    res.status(201).json({ message: 'Medicine added successfully', medicine_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/medicines/:id
app.put('/api/medicines/:id', async (req, res) => {
  try {
    const { medicine_name, category, quantity_in_stock, price_per_unit, price, supplier } = req.body;
    const unitPrice = price_per_unit !== undefined ? price_per_unit : price;
    const results = await query(
      'UPDATE medicines SET medicine_name=?, category=?, quantity_in_stock=?, price_per_unit=?, supplier=? WHERE medicine_id=?',
      [medicine_name, category || null, quantity_in_stock || 0, unitPrice || 0, supplier || null, req.params.id]
    );
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Medicine not found' });
    res.json({ message: 'Medicine updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/medicines/:id
app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM medicines WHERE medicine_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Medicine not found' });
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// PRESCRIPTIONS
// =============================================================================

// GET /api/prescriptions
app.get('/api/prescriptions', async (req, res) => {
  try {
    const results = await query(
      `SELECT prescriptions.*,
              patients.patient_name,
              doctors.doctor_name,
              medicines.medicine_name
       FROM prescriptions
       LEFT JOIN patients  ON prescriptions.patient_id  = patients.patient_id
       LEFT JOIN doctors   ON prescriptions.doctor_id   = doctors.doctor_id
       LEFT JOIN medicines ON prescriptions.medicine_id = medicines.medicine_id
       ORDER BY prescribed_date DESC`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/prescriptions
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { patient_id, doctor_id, medicine_id, dosage, prescribed_date, quantity_prescribed } = req.body;
    const results = await query(
      'INSERT INTO prescriptions (patient_id, doctor_id, medicine_id, dosage, prescribed_date, quantity_prescribed) VALUES (?, ?, ?, ?, ?, ?)',
      [
        patient_id,
        doctor_id,
        medicine_id,
        dosage || null,
        prescribed_date || new Date().toISOString().split('T')[0],
        quantity_prescribed || 1
      ]
    );
    res.status(201).json({ message: 'Prescription added successfully', prescription_id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/prescriptions/:id
app.delete('/api/prescriptions/:id', async (req, res) => {
  try {
    const results = await query('DELETE FROM prescriptions WHERE prescription_id = ?', [req.params.id]);
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Prescription not found' });
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// DASHBOARD
// =============================================================================

// GET /api/dashboard/stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [patients]   = await query('SELECT COUNT(*) as total FROM patients');
    const [doctors]    = await query('SELECT COUNT(*) as total FROM doctors');
    const [todayAppts] = await query('SELECT COUNT(*) as total FROM appointments WHERE DATE(appointment_date) = CURDATE()');
    const [appts]      = await query('SELECT COUNT(*) as total FROM appointments');
    const [availRooms] = await query("SELECT COUNT(*) as total FROM rooms WHERE status = 'Available'");
    const [admissions] = await query('SELECT COUNT(*) as total FROM admissions');
    const [medicines]  = await query('SELECT COUNT(*) as total FROM medicines');

    res.json({
      total_patients:      patients ? patients.total : 0,
      totalPatients:       patients ? patients.total : 0,
      total_doctors:       doctors ? doctors.total : 0,
      totalDoctors:        doctors ? doctors.total : 0,
      todays_appointments: todayAppts ? todayAppts.total : 0,
      totalAppointments:   appts ? appts.total : 0,
      available_rooms:     availRooms ? availRooms.total : 0,
      availableRooms:      availRooms ? availRooms.total : 0,
      totalAdmissions:     admissions ? admissions.total : 0,
      totalMedicines:      medicines ? medicines.total : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/dept-stats
app.get('/api/dashboard/dept-stats', async (req, res) => {
  try {
    const results = await query(
      `SELECT departments.dept_name, COUNT(doctors.doctor_id) as doctor_count
       FROM departments
       LEFT JOIN doctors ON departments.dept_id = doctors.dept_id
       GROUP BY departments.dept_id, departments.dept_name
       ORDER BY doctor_count DESC`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/appointment-status
app.get('/api/dashboard/appointment-status', async (req, res) => {
  try {
    const results = await query('SELECT status, COUNT(*) as count FROM appointments GROUP BY status');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// START SERVER
// =============================================================================
app.listen(PORT, () => {
  console.log(`🚀 Hospital Management Server running on http://localhost:${PORT}`);
});
