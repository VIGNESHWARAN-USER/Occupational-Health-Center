import React, { useState } from "react";
import BookAppointment from "./bookAppointment";
import UploadAppointmentPage from "./UploadAppointment";
import ViewDetails from "./ViewDetails";
import AllAppointments from "./AllAppointments";
import Sidebar from "../Sidebar";

const AppointmentPage = () => {


  const [formVal, setformVal] = useState("Appointments")

  return (
    <div
      className="flex h-screen overflow-auto"
      
    >
      <Sidebar/>

      
      <div className="w-4/5 p-6 h-screen overflow-auto">
      <h2 className="text-xl mb-8 font-bold">Nurse &nbsp;&gt;&nbsp; Dashboard</h2>
        <div className=" mb-6">
          {["Appointments", "Book Appointment", "Upload Appointment"].map((btnText, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-lg bg-blue-500 me-4 text-white"
              onClick={()=> {setformVal(btnText)}}
            >
              {btnText}
            </button>
          ))}
        </div>
        {formVal === "Appointments"?(<AllAppointments/>):(formVal === "Book Appointment"?(<BookAppointment/>):(<UploadAppointmentPage/>))}
        
      </div>
    </div>
  );
};

export default AppointmentPage;