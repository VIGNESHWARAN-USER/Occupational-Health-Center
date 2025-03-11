import React, { useState } from 'react';
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
const MockDrills = () => {

  const accessLevel = localStorage.getItem('accessLevel');
  const navigate = useNavigate();
  if(accessLevel === "nurse")
  {
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
  
    const response = await fetch("https://occupational-health-center-1.onrender.com/save-mockdrills/", {
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
    <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div className="w-4/5 h-screen overflow-auto p-8"> 

        <h2 className="text-4xl font-bold mt-8 ml-8 mb-4">Mock Drill</h2>
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formDatas.date}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formDatas.time}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formDatas.department}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formDatas.location}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Scenario</label>
                <input
                  type="text"
                  name="scenario"
                  value={formDatas.scenario}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Ambulance Timing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Departure from OHC</label>
                <input
                  type="time"
                  name="ambulance_timing"
                  value={formDatas.ambulance_timing}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Return to OHC</label>
                <input
                  type="time"
                  name="returnToOHC" 
                  value={formDatas.returnToOHC}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Victim Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Emp ID</label>
                <input
                  type="text"
                  name="empID"
                  value={formDatas.empID}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Victim Name</label>
                <input
                  type="text"
                  name="victimName"
                  value={formDatas.victimName}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formDatas.age}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formDatas.gender}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Victim Department</label>
                <input
                  type="text"
                  name="Victim_Department"
                  value={formDatas.Victim_Department}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nature of Job</label>
                <input
                  type="text"
                  name="Nature_of_Job"
                  value={formDatas.Nature_of_Job}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mobile No</label>
                <input
                  type="text"
                  name="Mobile_No"
                  value={formDatas.Mobile_No}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Complaints</label>
              <textarea
                name="complaints"
                value={formDatas.complaints}
                onChange={handleChange}
                placeholder="Complaints"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Treatment</label>
              <textarea
                name="Treatment"
                value={formDatas.Treatment}
                onChange={handleChange}
                placeholder="Treatment"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Referral</label>
              <textarea
                name="Referral" 
                value={formDatas.Referral}
                onChange={handleChange}
                placeholder="Referral"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Ambulance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Ambulance Driver</label>
                <input
                  name="ambulance_driver"
                  value={formDatas.ambulance_driver}
                  onChange={handleChange}
                  placeholder="Ambulance Driver"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Staff Name</label>
                <input
                  name="Staff_Name"
                  value={formDatas.Staff_Name}
                  onChange={handleChange}
                  placeholder="Staff Name"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h4 className="text-2xl font-semibold mb-6 text-gray-700">OHC</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">OHC Doctor</label>
                <input
                  name="OHC_doctor"
                  value={formDatas.OHC_doctor}
                  onChange={handleChange}
                  placeholder="OHC Doctor"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Staff Nurse</label>
                <input
                  name="Staff_Nurse"
                  value={formDatas.Staff_Nurse}
                  onChange={handleChange}
                  placeholder="Staff Nurse"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <h4 className="text-2xl font-semibold mb-6 text-gray-700">OHC Observation/Action/Follow up</h4>
            <div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Vitals</label>
                <textarea
                  name="vitals"
                  value={formDatas.vitals}
                  onChange={handleChange}
                  placeholder="Vitals"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Action / Completion</label>
                <textarea
                  name="Action_Completion"
                  value={formDatas.Action_Completion}
                  onChange={handleChange}
                  placeholder="Action / Completion"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Responsible</label>
                <textarea
                  name="Responsible"
                  value={formDatas.Responsible}
                  onChange={handleChange}
                  placeholder="Responsible"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </form>
          
        </motion.div>
      </div>
    </div>
  );
}
else if(accessLevel === "doctor")
{
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
  
    const response = await fetch("https://occupational-health-center-1.onrender.com/save-mockdrills/", {
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
    <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div className="w-4/5 h-screen overflow-auto p-8"> 

        <h2 className="text-4xl font-bold mt-8 ml-8 mb-4">Mock Drill</h2>
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formDatas.date}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formDatas.time}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formDatas.department}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formDatas.location}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Scenario</label>
                <input
                  type="text"
                  name="scenario"
                  value={formDatas.scenario}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Ambulance Timing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Departure from OHC</label>
                <input
                  type="time"
                  name="ambulance_timing"
                  value={formDatas.ambulance_timing}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Return to OHC</label>
                <input
                  type="time"
                  name="returnToOHC" 
                  value={formDatas.returnToOHC}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Victim Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Emp ID</label>
                <input
                  type="text"
                  name="empID"
                  value={formDatas.empID}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Victim Name</label>
                <input
                  type="text"
                  name="victimName"
                  value={formDatas.victimName}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formDatas.age}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formDatas.gender}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Victim Department</label>
                <input
                  type="text"
                  name="Victim_Department"
                  value={formDatas.Victim_Department}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Nature of Job</label>
                <input
                  type="text"
                  name="Nature_of_Job"
                  value={formDatas.Nature_of_Job}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Mobile No</label>
                <input
                  type="text"
                  name="Mobile_No"
                  value={formDatas.Mobile_No}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Complaints</label>
              <textarea
                name="complaints"
                value={formDatas.complaints}
                onChange={handleChange}
                placeholder="Complaints"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Treatment</label>
              <textarea
                name="Treatment"
                value={formDatas.Treatment}
                onChange={handleChange}
                placeholder="Treatment"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Referral</label>
              <textarea
                name="Referral" 
                value={formDatas.Referral}
                onChange={handleChange}
                placeholder="Referral"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Ambulance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Ambulance Driver</label>
                <input
                  name="ambulance_driver"
                  value={formDatas.ambulance_driver}
                  onChange={handleChange}
                  placeholder="Ambulance Driver"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Staff Name</label>
                <input
                  name="Staff_Name"
                  value={formDatas.Staff_Name}
                  onChange={handleChange}
                  placeholder="Staff Name"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h4 className="text-2xl font-semibold mb-6 text-gray-700">OHC</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">OHC Doctor</label>
                <input
                  name="OHC_doctor"
                  value={formDatas.OHC_doctor}
                  onChange={handleChange}
                  placeholder="OHC Doctor"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Staff Nurse</label>
                <input
                  name="Staff_Nurse"
                  value={formDatas.Staff_Nurse}
                  onChange={handleChange}
                  placeholder="Staff Nurse"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <h4 className="text-2xl font-semibold mb-6 text-gray-700">OHC Observation/Action/Follow up</h4>
            <div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Vitals</label>
                <textarea
                  name="vitals"
                  value={formDatas.vitals}
                  onChange={handleChange}
                  placeholder="Vitals"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Action / Completion</label>
                <textarea
                  name="Action_Completion"
                  value={formDatas.Action_Completion}
                  onChange={handleChange}
                  placeholder="Action / Completion"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Responsible</label>
                <textarea
                  name="Responsible"
                  value={formDatas.Responsible}
                  onChange={handleChange}
                  placeholder="Responsible"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </form>
          
        </motion.div>
      </div>
    </div>
  );
}
else{
  return(
    <section class="bg-white h-full flex items-center dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <button onClick={()=>navigate(-1)} class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
        </div>   
    </div>
</section>
  );
}
};

export default MockDrills;