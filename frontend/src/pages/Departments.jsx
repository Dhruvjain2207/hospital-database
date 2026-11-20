import { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api';

const defaultForm = {
  dept_name: '',
  dept_head: '',
  location: '',
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    setLoading(true);
    setError('');
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(dept) {
    setEditing(dept.dept_id);
    setFormData({
      dept_name: dept.dept_name || '',
      dept_head: dept.dept_head || '',
      location: dept.location || '',
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
        await updateDepartment(editing, formData);
      } else {
        await createDepartment(formData);
      }
      await fetchDepartments();
      closeForm();
    } catch (err) {
      alert('Failed to save department. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await deleteDepartment(id);
      await fetchDepartments();
    } catch (err) {
      alert('Failed to delete department.');
    }
  }

  if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Departments</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Department
        </button>
      </div>

      {departments.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Department Head</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.dept_id}>
                  <td>{dept.dept_id}</td>
                  <td>{dept.dept_name}</td>
                  <td>{dept.dept_head || '-'}</td>
                  <td>{dept.location || '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(dept)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.dept_id)} title="Delete">
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
              <h3>{editing ? 'Edit Department' : 'Add Department'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  name="dept_name"
                  value={formData.dept_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div className="form-group">
                <label>Department Head</label>
                <input
                  type="text"
                  name="dept_head"
                  value={formData.dept_head}
                  onChange={handleChange}
                  placeholder="Head doctor name"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Building A, Floor 2"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
