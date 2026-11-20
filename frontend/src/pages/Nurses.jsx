import { useState, useEffect } from 'react';
import { getNurses, createNurse, updateNurse, deleteNurse, getDepartments } from '../api';

const defaultForm = {
  nurse_name: '',
  dept_id: '',
  phone: '',
  shift: '',
};

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
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
      const [n, d] = await Promise.all([getNurses(), getDepartments()]);
      setNurses(n);
      setDepartments(d);
    } catch (err) {
      setError('Failed to load nurses. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(nurse) {
    setEditing(nurse.nurse_id);
    setFormData({
      nurse_name: nurse.nurse_name || '',
      dept_id: nurse.dept_id || '',
      phone: nurse.phone || '',
      shift: nurse.shift || '',
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
        await updateNurse(editing, formData);
      } else {
        await createNurse(formData);
      }
      await fetchAll();
      closeForm();
    } catch (err) {
      alert('Failed to save nurse record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this nurse record?')) return;
    try {
      await deleteNurse(id);
      await fetchAll();
    } catch (err) {
      alert('Failed to delete nurse record.');
    }
  }

  if (loading) return <div className="loading">Loading nurses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Nurses</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Nurse
        </button>
      </div>

      {nurses.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Shift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nurses.map((nurse) => (
                <tr key={nurse.nurse_id}>
                  <td>{nurse.nurse_id}</td>
                  <td>{nurse.nurse_name}</td>
                  <td>{nurse.dept_name}</td>
                  <td>{nurse.phone || '-'}</td>
                  <td>{nurse.shift || '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(nurse)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(nurse.nurse_id)} title="Delete">
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
              <h3>{editing ? 'Edit Nurse' : 'Add Nurse'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nurse Name *</label>
                <input
                  type="text"
                  name="nurse_name"
                  value={formData.nurse_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter nurse name"
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
                <label>Shift</label>
                <select name="shift" value={formData.shift} onChange={handleChange}>
                  <option value="">Select Shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Nurse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
