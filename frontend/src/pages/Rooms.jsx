import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../api';

const defaultForm = {
  room_number: '',
  room_type: '',
  charges_per_day: '',
  status: 'Available',
};

const statusBadge = {
  Available: 'badge-success',
  Occupied: 'badge-danger',
  Maintenance: 'badge-warning',
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    setLoading(true);
    setError('');
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEdit(room) {
    setEditing(room.room_id);
    setFormData({
      room_number: room.room_number || '',
      room_type: room.room_type || '',
      charges_per_day: room.charges_per_day || '',
      status: room.status || 'Available',
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
        await updateRoom(editing, formData);
      } else {
        await createRoom(formData);
      }
      await fetchRooms();
      closeForm();
    } catch (err) {
      alert('Failed to save room. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      await fetchRooms();
    } catch (err) {
      alert('Failed to delete room.');
    }
  }

  const displayedRooms = filterAvailable
    ? rooms.filter((r) => r.status === 'Available')
    : rooms;

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Rooms</h2>
        <div className="header-actions">
          <button
            className={`btn ${filterAvailable ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterAvailable((prev) => !prev)}
          >
            {filterAvailable ? '✅ Available Rooms' : 'Show Available Rooms'}
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Room
          </button>
        </div>
      </div>

      {displayedRooms.length === 0 ? (
        <p>{filterAvailable ? 'No available rooms.' : 'No records found.'}</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Charges/Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.room_id}</td>
                  <td>{room.room_number}</td>
                  <td>{room.room_type}</td>
                  <td>
                    <span className={`badge ${statusBadge[room.status] || 'badge-secondary'}`}>
                      {room.status}
                    </span>
                  </td>
                  <td>{room.charges_per_day ? `$${Number(room.charges_per_day).toLocaleString()}` : '-'}</td>
                  <td className="action-buttons">
                    <button className="btn btn-sm btn-warning" onClick={() => openEdit(room)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(room.room_id)} title="Delete">
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
              <h3>{editing ? 'Edit Room' : 'Add Room'}</h3>
              <button className="modal-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room Number *</label>
                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 101"
                />
              </div>
              <div className="form-group">
                <label>Room Type *</label>
                <select name="room_type" value={formData.room_type} onChange={handleChange} required>
                  <option value="">Select Room Type</option>
                  <option value="General">General</option>
                  <option value="Private">Private</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Operation Theater">Operation Theater</option>
                </select>
              </div>
              <div className="form-group">
                <label>Charges per Day</label>
                <input
                  type="number"
                  name="charges_per_day"
                  value={formData.charges_per_day}
                  onChange={handleChange}
                  placeholder="Daily charges"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
