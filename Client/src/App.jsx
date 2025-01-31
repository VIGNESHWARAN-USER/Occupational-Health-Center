import { Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import './index.css'
import Forgot from './Login/Forgot'
import Dashboard from './Nurse/Dashboard'
import Appointment from './Nurse/Appointments/Appointment'
import UploadAppointmentPage from './Nurse/Appointments/UploadAppointment'
import ViewDetails from './Nurse/Appointments/ViewDetails'
import MockDrills from './Nurse/MockDrills'
import EventsAndCamps from './Nurse/EventsAndCamps'
import AddMember from './Admin/addMember'
import AdminDashboard from './Admin/AdminDashboard'
import Dropdowns from './Admin/Dropdowns'
import NewVisit from './Nurse/NewVisit/NewVisit'
import Search from './Nurse/EmployeeProfile.jsx/Search'
import RecordsFilters from './Nurse/RecordsFilters'
import DocAppointments from './Doctor/DocAppointment'
import DocReviewPeople from './Doctor/DocReviewPeople'
import DocRecordsFilters from './Doctor/DocRecordsFilters'
import DocDashboard from './Doctor/DocDashboard'
import DocNewVisit from './Doctor/DocNewVisit/DocNewVisit'
import DocEventsAndCamps from './Doctor/DocEventsAndCamps'
import DocMockDrills from './Doctor/DocMockDrills'
import DocSearch from './Doctor/DocEmployeeProfile/DocSearch'
import DocEmployeeProfile from './Doctor/DocEmployeeProfile/DocEmployeeProfile'
import EmployeeProfile from './Nurse/EmployeeProfile.jsx/EmployeeProfile'

function App() {
  return (
    <div className='bg-blue-100 h-screen'>
      <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/forgot-password' element={<Forgot/>}/>
      <Route path='/dashboard' element = {<Dashboard/>}/>
      <Route path= '/appointments' element = {<Appointment/>}/>
      <Route path = '/uploadAppointment' element = {<UploadAppointmentPage/>}/>
      <Route path = '/viewDetails' element = {<ViewDetails/>}/>
      <Route path = '/mockDrills' element = {<MockDrills/>}/>
      <Route path = '/eventsandcamps' element = {<EventsAndCamps/>}/>
      <Route path = '/addmember' element = {<AddMember/>}/>
      <Route path = '/adminDashboard' element = {<AdminDashboard/>}/>
      <Route path = '/dropdown' element = {<Dropdowns/>}/>
      <Route path = '/newvisit' element = {<NewVisit/>}/>
      <Route path = '/searchEmployee' element = {<Search/>}/>
      <Route path = '/recordsfilters' element = {<RecordsFilters/>}/>
      <Route path = '/docappointments' element = {<DocAppointments/>}/>
      <Route path = '/docreviewpeople' element = {<DocReviewPeople/>}/>
      <Route path = '/docrecordsfilters' element = {<DocRecordsFilters/>}/>
      <Route path = '/docdashboard' element = {<DocDashboard/>}/>
      <Route path = '/docnewvisit' element = {<DocNewVisit/>}/>
      <Route path = '/doceventsandcamps' element = {<DocEventsAndCamps/>}/>
      <Route path = '/docmockdrills' element = {<DocMockDrills/>}/>
      <Route path = '/docsearchEmployee' element = {<DocSearch/>}/>
      <Route path = '/docemployeeprofile' element = {<DocEmployeeProfile/>}/>
      <Route path = '/employeeprofile' element = {<EmployeeProfile/>}/>
    </Routes>
    </div>
    
  )
}

export default App
