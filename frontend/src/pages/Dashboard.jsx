import { useState, useEffect } from 'react';
import { getDashboardStats, getDeptStats, getAppointmentStatus } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [apptStatus, setApptStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError('');
    try {
      const [s, d, a] = await Promise.all([
        getDashboardStats(),
        getDeptStats(),
        getAppointmentStatus(),
      ]);
      setStats(s);
      setDeptStats(d);
      setApptStatus(a);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const statCards = [
    {
      label: 'Total Patients',
      value: stats?.total_patients ?? 0,
      icon: '👥',
      color: 'stat-blue',
    },
    {
      label: 'Total Doctors',
      value: stats?.total_doctors ?? 0,
      icon: '🩺',
      color: 'stat-green',
    },
    {
      label: "Today's Appointments",
      value: stats?.todays_appointments ?? 0,
      icon: '📅',
      color: 'stat-orange',
    },
    {
      label: 'Available Rooms',
      value: stats?.available_rooms ?? 0,
      icon: '🛏️',
      color: 'stat-purple',
    },
  ];

  const statusColor = {
    Scheduled: 'badge-warning',
    Completed: 'badge-success',
    Cancelled: 'badge-danger',
  };

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>

      {/* Stat Cards */}
      <div className="stat-cards">
        {statCards.map((card) => (
          <div key={card.label} className={`card stat-card ${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <p className="stat-value">{card.value}</p>
              <p className="stat-label">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Department Stats */}
      <div className="dashboard-section">
        <div className="card">
          <h3 className="section-title">Department-wise Doctor Count</h3>
          {deptStats.length === 0 ? (
            <p>No department data available.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Number of Doctors</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map((row, i) => (
                    <tr key={i}>
                      <td>{row.dept_name}</td>
                      <td>{row.doctor_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointment Status */}
        <div className="card">
          <h3 className="section-title">Appointment Status Breakdown</h3>
          {apptStatus.length === 0 ? (
            <p>No appointment data available.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {apptStatus.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`badge ${statusColor[row.status] || 'badge-secondary'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
