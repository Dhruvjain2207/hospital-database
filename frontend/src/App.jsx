import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'

import Dashboard     from './pages/Dashboard'
import Patients      from './pages/Patients'
import Doctors       from './pages/Doctors'
import Departments   from './pages/Departments'
import Appointments  from './pages/Appointments'
import Rooms         from './pages/Rooms'
import Admissions    from './pages/Admissions'
import Nurses        from './pages/Nurses'
import Staff         from './pages/Staff'
import Medicines     from './pages/Medicines'
import Prescriptions from './pages/Prescriptions'

const navItems = [
  { to: '/',             label: 'Dashboard',     icon: '📊' },
  { to: '/patients',     label: 'Patients',      icon: '🧑‍⚕️' },
  { to: '/doctors',      label: 'Doctors',       icon: '👨‍⚕️' },
  { to: '/departments',  label: 'Departments',   icon: '🏢' },
  { to: '/appointments', label: 'Appointments',  icon: '📅' },
  { to: '/rooms',        label: 'Rooms',         icon: '🛏️' },
  { to: '/admissions',   label: 'Admissions',    icon: '🚑' },
  { to: '/nurses',       label: 'Nurses',        icon: '👩‍⚕️' },
  { to: '/staff',        label: 'Staff',         icon: '👥' },
  { to: '/medicines',    label: 'Medicines',     icon: '💊' },
  { to: '/prescriptions',label: 'Prescriptions', icon: '📋' },
]

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop overlay to close on outside click */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Close menu backdrop"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">🏥</span>
            <span className="sidebar-title">Hospital MS</span>
          </div>
          {/* Close button inside sidebar visible on mobile screens */}
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map(({ to, label, icon }) => {
              const isActive =
                to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to)
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={isActive ? 'nav-link active' : 'nav-link'}
                    onClick={onClose}
                  >
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-label">{label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

function Header({ onToggleSidebar, isOpen }) {
  const location = useLocation()
  const current = navItems.find(({ to }) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
  )

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Hamburger button visible only on phone/tablet screens */}
        <button
          className={`hamburger-btn ${isOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <h1 className="header-title">🏥 Hospital Management System</h1>
      </div>
      {current && (
        <span className="header-breadcrumb">
          {current.icon} {current.label}
        </span>
      )}
    </header>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Automatically close sidebar when navigating to a new route
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Header
          isOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="page-body">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/patients"      element={<Patients />} />
            <Route path="/doctors"       element={<Doctors />} />
            <Route path="/departments"   element={<Departments />} />
            <Route path="/appointments"  element={<Appointments />} />
            <Route path="/rooms"         element={<Rooms />} />
            <Route path="/admissions"    element={<Admissions />} />
            <Route path="/nurses"        element={<Nurses />} />
            <Route path="/staff"         element={<Staff />} />
            <Route path="/medicines"     element={<Medicines />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
