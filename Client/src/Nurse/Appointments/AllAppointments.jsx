import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8000/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg h-screen overflow-auto p-8">
      {/* Search and Filters */}
      <div className="justify-between rounded-lg flex">
        <div>
          <label>From</label>
          <input type="date" className="px-4 bg-blue-100 py-2 ms-4 mb-8 w-64 border rounded-md shadow-sm" />
          <label className="ms-10">To</label>
          <input type="date" className="px-4 py-2 bg-blue-100 ms-10 border w-64 rounded-md shadow-sm" />
          <button className="px-4 py-2 rounded-lg bg-blue-500 mx-4 w-44 text-white">Apply</button>
        </div>
        <div className="flex flex-col">
          <FaSearch className="relative top-6 left-4 w-5 text-gray-500" />
          <input className="w-96 px-10 py-2 bg-blue-100 rounded-lg" placeholder="Search Patients by ID" type="text" />
        </div>
      </div>

      {/* Table Headers */}
      <div className="flex justify-evenly mt-14 bg-blue-100 rounded-lg p-2">
        <p className="text-blue-500 font-bold">ID</p>
        <p className="text-blue-500 font-bold">Name</p>
        <p className="text-blue-500 font-bold">Role</p>
        <p className="text-blue-500 font-bold">Appointment Date</p>
        <p className="text-blue-500 font-bold">Action</p>
      </div>

      {/* Appointments Data */}
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex justify-evenly mt-2 p-2 border-b border-gray-300">
          <p>{appointment.id}</p>
          <p>{appointment.name}</p>
          <p>{appointment.role}</p>
          <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Cancel</button>
        </div>
      ))}
    </div>
  );
};

export default AllAppointments;