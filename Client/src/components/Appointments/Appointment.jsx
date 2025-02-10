import React, { useState } from "react";
import BookAppointment from "./BookAppointment";
import UploadAppointmentPage from "./UploadAppointment";
import AllAppointments from "./AllAppointments";
import Sidebar from "../Sidebar";

const AppointmentPage = () => {


  const [formVal, setformVal] = useState("")

  return (
    <div
      className="flex h-screen overflow-auto"
      
    >
      <Sidebar/>

      
      <div className="w-4/5 p-6 h-screen overflow-auto">
      <h2 className="text-xl mb-8 font-bold">Nurse &nbsp;&gt;&nbsp; Appointment</h2>
        <div className=" mb-6">
          {["Today's Appointments", "Book Appointment", "Upload Appointment"].map((btnText, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-lg bg-blue-500 me-4 text-white"
              onClick={()=> {setformVal(btnText)}}
            >
              {btnText}
            </button>
          ))}
        </div>
        {formVal === "Today's Appointments"?(<AllAppointments/>):(formVal === "Book Appointment"?(<BookAppointment/>):(formVal==="Upload Appointment")?(<UploadAppointmentPage/>):(<AllAppointments></AllAppointments>))}
        
      </div>
    </div>
  );
};

export default AppointmentPage;