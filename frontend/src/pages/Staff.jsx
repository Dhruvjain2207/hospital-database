import { useState, useEffect } from 'react';
import { getStaff, createStaff, updateStaff, deleteStaff, getDepartments } from '../api';

const defaultForm = {
  staff_name: '',
  role: '',
  dept_id: '',
  phone: '',
  salary: '',
};

export default function Staff() {
  const [staff, setStaff] = useState([]);
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
      const [s, d] = await Promise.all([getStaff(), getDepartments()]);
      setStaff(s);
      setDepartments(d);
    } catch (err) {
      setError('Failed to load staff. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(member) {
    setEditing(member.staff_id);
    setFormData({
      staff_name: member.staff_name || '',
      role: member.role || '',
      dept_id: member.dept_id || '',
      phone: member.phone || '',
      salary: member.salary || '',
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
        await updateStaff(editing, formData);
      } else {
        await createStaff(formData);
      }
      await fetchAll();
      closeForm();
    } catch (err) {
      alert('Failed to save staff record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await deleteStaff(id);
      await fetchAll();
    } catch (err) {
      alert('Failed to delete staff member.');
    }
  }

  if (loading) return <div className="loading">Loading staff...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Staff</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Staff
        </button>
      </div>

      {staff.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.staff_id}>
                  <td>{member.staff_id}</td>
                  <td>{member.staff_name}</td>
                  <td>{member.role}</td>
                  <td>{member.dept_name}</td>
                  <td>{member.phone || '-'}</td>
                  <td>{member.salary ? `$${Number(member.salary).toLocaleString()}` : '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(member)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(member.staff_id)} title="Delete">
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
              <h3>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Staff Name *</label>
                <input
                  type="text"
                  name="staff_name"
                  value={formData.staff_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter staff name"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Receptionist, Cleaner, Security"
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
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
