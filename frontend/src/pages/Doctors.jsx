import { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, getDepartments } from '../api';

const defaultForm = {
  doctor_name: '',
  specialization: '',
  dept_id: '',
  phone: '',
  email: '',
  salary: '',
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
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
      const [d, depts] = await Promise.all([getDoctors(), getDepartments()]);
      setDoctors(d);
      setDepartments(depts);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(doc) {
    setEditing(doc.doctor_id);
    setFormData({
      doctor_name: doc.doctor_name || '',
      specialization: doc.specialization || '',
      dept_id: doc.dept_id || '',
      phone: doc.phone || '',
      email: doc.email || '',
      salary: doc.salary || '',
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
        await updateDoctor(editing, formData);
      } else {
        await createDoctor(formData);
      }
      await fetchAll();
      closeForm();
    } catch (err) {
      alert('Failed to save doctor. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await deleteDoctor(id);
      await fetchAll();
    } catch (err) {
      alert('Failed to delete doctor.');
    }
  }

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Doctors</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Doctor
        </button>
      </div>

      {doctors.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.doctor_id}>
                  <td>{doc.doctor_id}</td>
                  <td>{doc.doctor_name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.dept_name}</td>
                  <td>{doc.phone}</td>
                  <td>{doc.email}</td>
                  <td>{doc.salary ? `$${Number(doc.salary).toLocaleString()}` : '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(doc)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doc.doctor_id)} title="Delete">
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
              <h3>{editing ? 'Edit Doctor' : 'Add Doctor'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Doctor Name *</label>
                <input
                  type="text"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter doctor name"
                />
              </div>
              <div className="form-group">
                <label>Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select name="dept_id" value={formData.dept_id} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.dept_id} value={d.dept_id}>
                      {d.dept_name}
                    </option>
                  ))}
                </select>
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
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Salary amount"
                  min="0"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
