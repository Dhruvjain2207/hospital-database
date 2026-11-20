import { useState, useEffect } from 'react';
import {
  getPrescriptions,
  createPrescription,
  getPatients,
  getDoctors,
  getMedicines,
} from '../api';

const defaultForm = {
  patient_id: '',
  doctor_id: '',
  medicine_id: '',
  dosage: '',
  quantity_prescribed: '',
  prescribed_date: new Date().toISOString().split('T')[0],
};

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError('');
    try {
      const [pr, p, d, m] = await Promise.all([
        getPrescriptions(),
        getPatients(),
        getDoctors(),
        getMedicines(),
      ]);
      setPrescriptions(pr);
      setPatients(p);
      setDoctors(d);
      setMedicines(m);
    } catch (err) {
      setError('Failed to load prescriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setFormData(defaultForm);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setFormData(defaultForm);
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPrescription(formData);
      await fetchAll();
      closeForm();
    } catch (err) {
      alert('Failed to save prescription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="loading">Loading prescriptions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Prescriptions</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          + New Prescription
        </button>
      </div>

      <div className="info-note">
        ℹ️ Prescription records are immutable medical records and cannot be edited or deleted.
      </div>

      {prescriptions.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Qty Prescribed</th>
                <th>Prescribed Date</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((pr) => (
                <tr key={pr.prescription_id}>
                  <td>{pr.prescription_id}</td>
                  <td>{pr.patient_name}</td>
                  <td>{pr.doctor_name}</td>
                  <td>{pr.medicine_name}</td>
                  <td>{pr.dosage || '-'}</td>
                  <td>{pr.quantity_prescribed ?? '-'}</td>
                  <td>{pr.prescribed_date ? pr.prescribed_date.split('T')[0] : ''}</td>
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
              <h3>New Prescription</h3>
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
              <div className="form-group">
                <label>Medicine *</label>
                <select name="medicine_id" value={formData.medicine_id} onChange={handleChange} required>
                  <option value="">Select Medicine</option>
                  {medicines.map((m) => (
                    <option key={m.medicine_id} value={m.medicine_id}>
                      {m.medicine_name} ({m.category || 'General'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    placeholder="e.g. 1 tablet twice daily"
                  />
                </div>
                <div className="form-group">
                  <label>Quantity Prescribed</label>
                  <input
                    type="number"
                    name="quantity_prescribed"
                    value={formData.quantity_prescribed}
                    onChange={handleChange}
                    placeholder="Quantity"
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Prescribed Date *</label>
                <input
                  type="date"
                  name="prescribed_date"
                  value={formData.prescribed_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
