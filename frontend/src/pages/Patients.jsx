import { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../api';

const defaultForm = {
  patient_name: '',
  age: '',
  gender: '',
  phone: '',
  address: '',
  blood_group: '',
  registered_date: new Date().toISOString().split('T')[0],
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    setError('');
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(patient) {
    setEditing(patient.patient_id);
    setFormData({
      patient_name: patient.patient_name || '',
      age: patient.age || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      address: patient.address || '',
      blood_group: patient.blood_group || '',
      registered_date: patient.registered_date
        ? patient.registered_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
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
        await updatePatient(editing, formData);
      } else {
        await createPatient(formData);
      }
      await fetchPatients();
      closeForm();
    } catch (err) {
      alert('Failed to save patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await deletePatient(id);
      await fetchPatients();
    } catch (err) {
      alert('Failed to delete patient.');
    }
  }

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Patients</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Patient
        </button>
      </div>

      {patients.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.patient_id}>
                  <td>{p.patient_id}</td>
                  <td>{p.patient_name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.blood_group}</td>
                  <td>{p.phone}</td>
                  <td>{p.address}</td>
                  <td>{p.registered_date ? p.registered_date.split('T')[0] : ''}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(p)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.patient_id)} title="Delete">
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
              <h3>{editing ? 'Edit Patient' : 'Add Patient'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="0"
                    max="150"
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select name="blood_group" value={formData.blood_group} onChange={handleChange}>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
              <div className="form-group">
                <label>Registered Date</label>
                <input
                  type="date"
                  name="registered_date"
                  value={formData.registered_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
