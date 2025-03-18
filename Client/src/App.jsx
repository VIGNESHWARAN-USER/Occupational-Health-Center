import { Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import React from 'react'
import Login from './components/Login/Login'
import Forgot from './components/Login/Forgot'
import Dashboard from './components/Dashboard'
import AppointmentPage from './components/Appointments/Appointment'
import MockDrills from './components/MockDrills'
import EventsAndCamps from './components/EventsAndCamps'
import AddMember from './components/Admin/AddMember'
import AdminDashboard from './components/Admin/AdminDashboard'
import Dropdowns from './components/Admin/Dropdowns'
import NewVisit from './components/NewVisit/NewVisit'
import Search from './components/EmployeeProfile.jsx/Search'
import RecordsFilters from './components/RecordsFilters'
import EmployeeProfile from './components/EmployeeProfile.jsx/EmployeeProfile'
import ProtectedRoute from './ProtectedRoute'
import PrescriptionPDF from './components/NewVisit/PrescriptionPDF'
import ReviewPeople from './components/ReviewPeople'
import Summary from './components/EmployeeProfile.jsx/Summary'

function App() {
  return (
    <div className='bg-[#8fcadd] h-screen'>
      <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path='/' element={<Login/>}/>
      <Route path='/forgot-password' element={<Forgot/>}/>
      <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path = '/newvisit' element = {<NewVisit/>}/>
          <Route path= '/appointments' element = {<AppointmentPage/>}/>
          <Route path = '/mockDrills' element = {<MockDrills/>}/>
          <Route path = '/eventsandcamps' element = {<EventsAndCamps/>}/>
          <Route path = '/addmember' element = {<AddMember/>}/>
          <Route path = '/adminDashboard' element = {<AdminDashboard/>}/>
          <Route path = '/dropdown' element = {<Dropdowns/>}/>
          <Route path = '/searchEmployee' element = {<Search/>}/>
          <Route path = '/recordsfilters' element = {<RecordsFilters/>}/>
          <Route path = '/employeeprofile' element = {<EmployeeProfile/>}/>
          <Route path = '/pdf' element = {<PrescriptionPDF/>}/>
          <Route path = 'reviewpeople' element = {<ReviewPeople/>}/>
          <Route path = 'summary' element = {<Summary/>}/>
      </Route>
    </Routes>
    </div>
    
  )
}

export default App
