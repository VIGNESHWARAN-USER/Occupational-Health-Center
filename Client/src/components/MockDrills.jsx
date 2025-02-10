import React, { useState } from 'react';
import Sidebar from "./Sidebar";

const MockDrills = () => {
  const [formDatas, setformDatas] = useState({
    date: '',
    time: '',
    department: '',
    location: '',
    scenario: '',
    ambulance_timing: '',
    departure_from_OHC: '',  
    return_to_OHC: '',
    emp_no: '',
    victim_department: '',
    victim_name: '',
    nature_of_job: '',
    age: '',
    mobile_no: '',
    gender: '',
    vitals: '',
    complaints: '',
    treatment: '',
    referal: '',
    ambulance_driver: '',
    staff_name: '',
    OHC_doctor: '',
    staff_nurse: '',
    Responsible: '',
    Action_Completion: '',
  });

  const handleChange = (e) => {
    setformDatas({...formDatas, [e.target.name]: e.target.value });
    //console.log(formDatas);
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch("http://127.0.0.1:8000/save-mockdrills/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDatas),
    });
   
    console.log(response)
    console.log(formDatas)
    
  
    if (response.ok) {
      alert("Mock Drill data saved successfully");
      
      // Resetting to the correct structure
      setformDatas({
        date: '',
        time: '',
        department: '',
        location: '',
        scenario: '',
        ambulance_timing: '',
        departure_from_OHC: '',
        return_to_OHC: '',
        emp_no: '',
        victim_department: '',
        victim_name: '',
        nature_of_job: '',
        age: '',
        mobile_no: '',
        gender: '',
        vitals: '',
        complaints: '',
        treatment: '',
        referal: '',
        ambulance_driver: '',
        staff_name: '',
        OHC_doctor: '',
        staff_nurse: '',
        Responsible: '',
        Action_Completion: '',
      });
  
    } else {
      alert("Error saving data");
    }
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
                value={formDatas.date}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formDatas.time}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Department</label>
              <input type="text" name="department" value={formDatas.department} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Location</label>
              <input type="text" name="location" value={formDatas.location} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Scenario</label>
              <input type="text" name="scenario" value={formDatas.scenario} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Ambulance Timing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Departure from OHC</label>
              <input type="time" name="ambulance_timing" value={formDatas.ambulance_timing} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Return to OHC</label>
              <input type="time" name="return_to_OHC" value={formDatas.returnToOHC} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Victim Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Emp ID</label>
              <input type="text" name="emp_no" value={formDatas.empID} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Victim Name</label>
              <input type="text" name="victim_name" value={formDatas.victimName} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Age</label>
              <input type="number" name="age" value={formDatas.age} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Gender</label>
              <input type="text" name="gender" value={formDatas.gender} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Victim Department</label>
              <input type="text" name="victim_department" value={formDatas.Victim_Department} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Nature of Job</label>
              <input type="text" name="nature_of_job" value={formDatas.Nature_of_Job} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
            <div>
              <label className="block text-gray-700">Mobile No</label>
              <input type="text" name="mobile_no" value={formDatas.Mobile_No} onChange={handleChange} className="w-full p-2 border rounded bg-blue-100" />
            </div>
          </div>
          <div>
          <label className="block text-gray-700">complaints</label>
          <textarea name="complaints" value={formDatas.complaints} onChange={handleChange} placeholder="Complaints" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>
          <div>
          <label className="block text-gray-700">Treatment</label>
          <textarea name="treatment" value={formDatas.Treatment} onChange={handleChange} placeholder="Treatment" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>
          <div>
          <label className="block text-gray-700">Referal</label>
          <textarea name="referal" value={formDatas.Referal} onChange={handleChange} placeholder="Referal" className="w-full p-2 border rounded bg-blue-100 mb-4" />
          </div>


          <h3 className="text-2xl font-semibold mb-4">Ambulance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Ambulance Driver</label>
              <input name="ambulance_driver" value={formDatas.ambulance_driver} onChange={handleChange} placeholder="Ambulance Driver" className="w-full p-2 border rounded bg-blue-100 mb-4" />
              </div>
            <div>
              <label className="block text-gray-700">Staff Name</label>
              <input name="staff_name" value={formDatas.Staff_Name} onChange={handleChange} placeholder="Staff Name" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            
          </div>
        
          <h4 className="text-2xl font-semibold mb-4">OHC</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
              <label className="block text-gray-700">OHC Doctor</label>
              <input name="OHC_doctor" value={formDatas.OHC_doctor} onChange={handleChange} placeholder="OHC Doctor" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            <div>
              <label className="block text-gray-700">Staff Nurse</label>
              <input name="staff_nurse" value={formDatas.Staff_Nurse} onChange={handleChange} placeholder="Staff Nurse" className="w-full p-2 border rounded bg-blue-100 mb-4" />
            </div>
            </div>
            <h4 className="text-2xl font-semibold mb-4">OHC Observation/Action/Follow up</h4>
            <div >
                <div >
                    <label className="block text-gray-700">Vitals</label>
                    <textarea name="vitals" value={formDatas.vitals} onChange={handleChange} placeholder="Vitals" className="w-full p-2 border rounded bg-blue-100 mb-4" />
                </div>
                <div >
                    <label className="block text-gray-700">Action / Completion</label>
                    <textarea name="Action_Completion" value={formDatas.Action_Completion} onChange={handleChange} placeholder="Action / Completion" className="w-full p-2 border rounded bg-blue-100 mb-4" />
                </div>
                <div >
                    <label className="block text-gray-700">Responsible</label>
                    <textarea name="Responsible" value={formDatas.Responsible} onChange={handleChange} placeholder="Responsible" className="w-full p-2 border rounded bg-blue-100 mb-4" />
                </div>
            
            </div>

          <div className="text-right">
            <button type="submit" onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
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