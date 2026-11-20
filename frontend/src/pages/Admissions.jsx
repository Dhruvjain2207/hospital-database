import { useState, useEffect } from 'react';
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  getPatients,
  getDoctors,
  getAvailableRooms,
} from '../api';

const defaultForm = {
  patient_id: '',
  room_id: '',
  doctor_id: '',
  admission_date: '',
  discharge_date: '',
  total_charges: '',
};

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
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
      const [a, p, d, r] = await Promise.all([
        getAdmissions(),
        getPatients(),
        getDoctors(),
        getAvailableRooms(),
      ]);
      setAdmissions(a);
      setPatients(p);
      setDoctors(d);
      setAvailableRooms(r);
    } catch (err) {
      setError('Failed to load admissions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(adm) {
    setEditing(adm.admission_id);
    setFormData({
      patient_id: adm.patient_id || '',
      room_id: adm.room_id || '',
      doctor_id: adm.doctor_id || '',
      admission_date: adm.admission_date ? adm.admission_date.split('T')[0] : '',
      discharge_date: adm.discharge_date ? adm.discharge_date.split('T')[0] : '',
      total_charges: adm.total_charges || '',
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
        await updateAdmission(editing, formData);
      } else {
        await createAdmission(formData);
      }
      await fetchAll();
      closeForm();
    } catch (err) {
      alert('Failed to save admission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this admission record?')) return;
    try {
      await deleteAdmission(id);
      await fetchAll();
    } catch (err) {
      alert('Failed to delete admission.');
    }
  }

  if (loading) return <div className="loading">Loading admissions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Admissions</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Admission
        </button>
      </div>

      {admissions.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Room</th>
                <th>Doctor</th>
                <th>Admission Date</th>
                <th>Discharge Date</th>
                <th>Total Charges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((adm) => (
                <tr key={adm.admission_id}>
                  <td>{adm.admission_id}</td>
                  <td>{adm.patient_name}</td>
                  <td>{adm.room_number}</td>
                  <td>{adm.doctor_name}</td>
                  <td>{adm.admission_date ? adm.admission_date.split('T')[0] : ''}</td>
                  <td>
                    {adm.discharge_date ? (
                      adm.discharge_date.split('T')[0]
                    ) : (
                      <span className="badge badge-warning">Active</span>
                    )}
                  </td>
                  <td>{adm.total_charges ? `$${Number(adm.total_charges).toLocaleString()}` : '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(adm)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(adm.admission_id)} title="Delete">
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
              <h3>{editing ? 'Edit Admission' : 'Add Admission'}</h3>
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
                <label>Room *</label>
                <select name="room_id" value={formData.room_id} onChange={handleChange} required>
                  <option value="">Select Available Room</option>
                  {availableRooms.map((r) => (
                    <option key={r.room_id} value={r.room_id}>
                      {r.room_number} — {r.room_type}
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
                  <label>Admission Date *</label>
                  <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discharge Date</label>
                  <input
                    type="date"
                    name="discharge_date"
                    value={formData.discharge_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Total Charges</label>
                <input
                  type="number"
                  name="total_charges"
                  value={formData.total_charges}
                  onChange={handleChange}
                  placeholder="Total bill amount"
                  min="0"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
