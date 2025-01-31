import React, { useState } from 'react';
import Sidebar from '../Sidebar/DocSideBar';

const MockDrills = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    department: '',
    location: '',
    scenario: '',
    callReceived: '',
    departureFromOHC: '',
    returnToOHC: '',
    empID: '',
    victimDepartment: '',
    victimName: '',
    natureOfJob: '',
    age: '',
    mobileNo: '',
    gender: '',
    vitals: '',
    complaints: '',
    treatment: '',
    referral: '',
    ambulanceDriver: '',
    staffName: '',
    ohcDoctor: '',
    staffNurse: '',
    observation: '',
    actionCompletion: '',
    responsible: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Form submitted successfully');
  };

  return (
    <div className="h-screen flex bg-blue-100">
    <Sidebar/>
    <div className="w-4/5">
    
      <div className= " h-screen overflow-auto">
      <h2 className="text-3xl font-bold mt-8 ml-8 mb-4">Mock Drill</h2>
      <div className='bg-white p-8 m-8 rounded shadow-md'>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Scenario</label>
              <input type="text" name="scenario" value={formData.scenario} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Ambulance Timing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Departure from OHC</label>
              <input type="time" name="departureFromOHC" value={formData.departureFromOHC} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Return to OHC</label>
              <input type="time" name="returnToOHC" value={formData.returnToOHC} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Victim Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Emp ID</label>
              <input type="text" name="empID" value={formData.empID} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Victim Name</label>
              <input type="text" name="victimName" value={formData.victimName} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Victim Department</label>
              <input type="text" name="Victim_Department" value={formData.Victim_Department} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Nature of Job</label>
              <input type="text" name="Nature_of_Job" value={formData.Nature_of_Job} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Mobile No</label>
              <input type="text" name="Mobile_No" value={formData.Mobile_No} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
          </div>
          <div >
          <label className="block text-gray-700">Vitals</label>
          <textarea name="vitals" value={formData.vitals} onChange={handleChange} placeholder="Vitals" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>
          <div>
          <label className="block text-gray-700">complaints</label>
          <textarea name="complaints" value={formData.complaints} onChange={handleChange} placeholder="Complaints" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>
          <div>
          <label className="block text-gray-700">Treatment</label>
          <textarea name="Treatment" value={formData.Treatment} onChange={handleChange} placeholder="Treatment" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>
          <div>
          <label className="block text-gray-700">Referal</label>
          <textarea name="Referal" value={formData.Referal} onChange={handleChange} placeholder="Referal" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>


          <h3 className="text-2xl font-semibold mb-4">Ambulance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Ambulance Driver</label>
              <input name="Ambulance Drive" value={formData.Ambulance_Drive} onChange={handleChange} placeholder="Ambulance Drive" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            <div>
              <label className="block text-gray-700">Staff Name</label>
              <input name="Staff Name" value={formData.Staff_Name} onChange={handleChange} placeholder="Staff Name" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            
          </div>
        
          <h4 className="text-2xl font-semibold mb-4">OHC</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
              <label className="block text-gray-700">OHC Doctor</label>
              <input name="OHC Doctor" value={formData.OHC_Doctor} onChange={handleChange} placeholder="OHC Doctor" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            <div>
              <label className="block text-gray-700">Staff Nurse</label>
              <input name="Staff Nurse" value={formData.Staff_Nurse} onChange={handleChange} placeholder="Staff Nurse" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            </div>
            <h4 className="text-2xl font-semibold mb-4">OHC Observation/Action/Follow up</h4>
            <div >
                <div >
                    <label className="block text-gray-700">Vitals</label>
                    <textarea name="vitals" value={formData.vitals} onChange={handleChange} placeholder="Vitals" className="w-full p-2 border rounded bg-blue-100 mb-4" />
                </div>
                <div >
                    <label className="block text-gray-700">Action / Completion</label>
                    <textarea name="Action / Completion" value={formData.Action_Completion} onChange={handleChange} placeholder="Action / Completion" className="w-full p-2 border rounded bg-blue-100 mb-4" />
                </div>
                <div >
                    <label className="block text-gray-700">Responsible</label>
                    <textarea name="Responsible" value={formData.Responsible} onChange={handleChange} placeholder="Responsible" className="w-full p-2 border rounded bg-blue-100 mb-4" />
                </div>
            
            </div>

          <div className="text-right">
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDrills;