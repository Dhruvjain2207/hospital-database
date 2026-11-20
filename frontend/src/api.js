import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Unwrap response data automatically
API.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)

// ── Patients ──────────────────────────────────────────────
export const getPatients      = ()           => API.get('/patients')
export const getPatient       = (id)         => API.get(`/patients/${id}`)
export const createPatient    = (data)       => API.post('/patients', data)
export const updatePatient    = (id, data)   => API.put(`/patients/${id}`, data)
export const deletePatient    = (id)         => API.delete(`/patients/${id}`)

// ── Doctors ───────────────────────────────────────────────
export const getDoctors       = ()           => API.get('/doctors')
export const createDoctor     = (data)       => API.post('/doctors', data)
export const updateDoctor     = (id, data)   => API.put(`/doctors/${id}`, data)
export const deleteDoctor     = (id)         => API.delete(`/doctors/${id}`)

// ── Departments ───────────────────────────────────────────
export const getDepartments   = ()           => API.get('/departments')
export const createDepartment = (data)       => API.post('/departments', data)
export const updateDepartment = (id, data)   => API.put(`/departments/${id}`, data)
export const deleteDepartment = (id)         => API.delete(`/departments/${id}`)

// ── Appointments ──────────────────────────────────────────
export const getAppointments   = ()          => API.get('/appointments')
export const createAppointment = (data)      => API.post('/appointments', data)
export const updateAppointment = (id, data)  => API.put(`/appointments/${id}`, data)
export const deleteAppointment = (id)        => API.delete(`/appointments/${id}`)

// ── Rooms ─────────────────────────────────────────────────
export const getRooms          = ()          => API.get('/rooms')
export const getAvailableRooms = ()          => API.get('/rooms/available')
export const createRoom        = (data)      => API.post('/rooms', data)
export const updateRoom        = (id, data)  => API.put(`/rooms/${id}`, data)
export const deleteRoom        = (id)        => API.delete(`/rooms/${id}`)

// ── Admissions ────────────────────────────────────────────
export const getAdmissions     = ()          => API.get('/admissions')
export const createAdmission   = (data)      => API.post('/admissions', data)
export const updateAdmission   = (id, data)  => API.put(`/admissions/${id}`, data)
export const deleteAdmission   = (id)        => API.delete(`/admissions/${id}`)

// ── Nurses ────────────────────────────────────────────────
export const getNurses         = ()          => API.get('/nurses')
export const createNurse       = (data)      => API.post('/nurses', data)
export const updateNurse       = (id, data)  => API.put(`/nurses/${id}`, data)
export const deleteNurse       = (id)        => API.delete(`/nurses/${id}`)

// ── Staff ─────────────────────────────────────────────────
export const getStaff          = ()          => API.get('/staff')
export const createStaff       = (data)      => API.post('/staff', data)
export const updateStaff       = (id, data)  => API.put(`/staff/${id}`, data)
export const deleteStaff       = (id)        => API.delete(`/staff/${id}`)

// ── Medicines ─────────────────────────────────────────────
export const getMedicines      = ()          => API.get('/medicines')
export const getLowStockMedicines = ()       => API.get('/medicines/low-stock')
export const createMedicine    = (data)      => API.post('/medicines', data)
export const updateMedicine    = (id, data)  => API.put(`/medicines/${id}`, data)
export const deleteMedicine    = (id)        => API.delete(`/medicines/${id}`)

// ── Prescriptions ─────────────────────────────────────────
export const getPrescriptions  = ()          => API.get('/prescriptions')
export const createPrescription = (data)     => API.post('/prescriptions', data)
export const deletePrescription = (id)       => API.delete(`/prescriptions/${id}`)

// ── Dashboard ─────────────────────────────────────────────
export const getDashboardStats    = ()       => API.get('/dashboard/stats')
export const getDeptStats         = ()       => API.get('/dashboard/dept-stats')
export const getAppointmentStatus = ()       => API.get('/dashboard/appointment-status')

export default API
