import { useState, useEffect } from 'react';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatients,
  getDoctors,
} from '../api';

const defaultForm = {
  patient_id: '',
  doctor_id: '',
  appointment_date: '',
  appointment_time: '',
  status: 'Scheduled',
  reason: '',
};

const statusBadge = {
  Scheduled: 'badge-warning',
  Completed: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError('');
    try {
      const [a, p, d] = await Promise.all([
        getAppointments(),
        getPatients(),
        getDoctors(),
      ]);
      setAppointments(a);
      setPatients(p);
      setDoctors(d);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(appt) {
    setEditing(appt.appointment_id);
    setFormData({
      patient_id: appt.patient_id || '',
      doctor_id: appt.doctor_id || '',
      appointment_date: appt.appointment_date ? appt.appointment_date.split('T')[0] : '',
      appointment_time: appt.appointment_time || '',
      status: appt.status || 'Scheduled',
      reason: appt.reason || '',
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setFormData(defaultForm);
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateAppointment(editing, formData);
      } else {
        await createAppointment(formData);
      }
      await fetchAll();
      closeForm();
    } catch (err) {
      alert('Failed to save appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteAppointment(id);
      await fetchAll();
    } catch (err) {
      alert('Failed to delete appointment.');
    }
  }

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Appointments</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.appointment_id}>
                  <td>{appt.appointment_id}</td>
                  <td>{appt.patient_name}</td>
                  <td>{appt.doctor_name}</td>
                  <td>{appt.appointment_date ? appt.appointment_date.split('T')[0] : ''}</td>
                  <td>{appt.appointment_time || '-'}</td>
                  <td>
                    <span className={`badge ${statusBadge[appt.status] || 'badge-secondary'}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>{appt.reason || '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(appt)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(appt.appointment_id)} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Appointment' : 'Add Appointment'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient *</label>
                <select name="patient_id" value={formData.patient_id} onChange={handleChange} required>
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.patient_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor *</label>
                <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.doctor_id} value={d.doctor_id}>
                      {d.doctor_name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Date *</label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Appointment Time</label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Reason for appointment"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
