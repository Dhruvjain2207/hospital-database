import { useState, useEffect } from 'react';
import { getMedicines, createMedicine, updateMedicine, deleteMedicine } from '../api';

const defaultForm = {
  medicine_name: '',
  category: '',
  quantity_in_stock: '',
  price_per_unit: '',
  supplier: '',
};

const LOW_STOCK_THRESHOLD = 20;

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    setLoading(true);
    setError('');
    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      setError('Failed to load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(med) {
    setEditing(med.medicine_id);
    setFormData({
      medicine_name: med.medicine_name || '',
      category: med.category || '',
      quantity_in_stock: med.quantity_in_stock ?? '',
      price_per_unit: med.price_per_unit || '',
      supplier: med.supplier || '',
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
        await updateMedicine(editing, formData);
      } else {
        await createMedicine(formData);
      }
      await fetchMedicines();
      closeForm();
    } catch (err) {
      alert('Failed to save medicine. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await deleteMedicine(id);
      await fetchMedicines();
    } catch (err) {
      alert('Failed to delete medicine.');
    }
  }

  const lowStockCount = medicines.filter(
    (m) => Number(m.quantity_in_stock) < LOW_STOCK_THRESHOLD
  ).length;

  if (loading) return <div className="loading">Loading medicines...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Medicines</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Medicine
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="alert alert-danger">
          ⚠️ <strong>Low Stock Alert:</strong> {lowStockCount} medicine{lowStockCount > 1 ? 's' : ''} with quantity below {LOW_STOCK_THRESHOLD} units.
        </div>
      )}

      {medicines.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Quantity in Stock</th>
                <th>Price/Unit</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => {
                const isLow = Number(med.quantity_in_stock) < LOW_STOCK_THRESHOLD;
                return (
                  <tr key={med.medicine_id}>
                    <td>{med.medicine_id}</td>
                    <td>{med.medicine_name}</td>
                    <td>{med.category || '-'}</td>
                    <td style={{ color: isLow ? '#dc3545' : 'inherit', fontWeight: isLow ? '600' : 'normal' }}>
                      {med.quantity_in_stock}
                      {isLow && ' ⚠️'}
                    </td>
                    <td>{med.price_per_unit ? `$${Number(med.price_per_unit).toFixed(2)}` : '-'}</td>
                    <td>{med.supplier || '-'}</td>
                    <td className="action-buttons">
                      <button className="btn btn-sm btn-warning" onClick={() => openEdit(med)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(med.medicine_id)} title="Delete">
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Medicine' : 'Add Medicine'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Medicine Name *</label>
                <input
                  type="text"
                  name="medicine_name"
                  value={formData.medicine_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter medicine name"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity in Stock</label>
                  <input
                    type="number"
                    name="quantity_in_stock"
                    value={formData.quantity_in_stock}
                    onChange={handleChange}
                    placeholder="Qty"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Price per Unit</label>
                  <input
                    type="number"
                    name="price_per_unit"
                    value={formData.price_per_unit}
                    onChange={handleChange}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Supplier name"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
