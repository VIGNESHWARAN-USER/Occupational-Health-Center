//AppointmentPage
import React, { useState } from "react";
import BookAppointment from "./BookAppointment";
import UploadAppointmentPage from "./UploadAppointment";
import AllAppointments from "./AllAppointments";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";

const AppointmentPage = () => {
  const [formVal, setformVal] = useState("");
  const accessLevel = localStorage.getItem('accessLevel');
  if(accessLevel === "nurse")
  {
    return (
      <div className="flex h-screen bg-[#8fcadd] overflow-auto">
        <Sidebar />
  
        <div className="w-4/5 p-6 h-screen overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Appointments</h2>
            <div>
              {["Today's Appointments", "Book Appointment", "Upload Appointment"].map(
                (btnText, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 rounded-lg bg-blue-500 me-4 text-white"
                    onClick={() => {
                      setformVal(btnText);
                    }}
                  >
                    {btnText}
                  </button>
                )
              )}
            </div>
          </div>
  
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {formVal === "Today's Appointments" ? (
              <AllAppointments />
            ) : formVal === "Book Appointment" ? (
              <BookAppointment />
            ) : formVal === "Upload Appointment" ? (
              <UploadAppointmentPage />
            ) : (
              <AllAppointments />
            )}
          </motion.div>
        </div>
      </div>
    );
  }
  else if(accessLevel === "doctor")
  {
    return (
      <div className="flex h-screen bg-[#8fcadd] overflow-auto">
        <Sidebar />
  
        <div className="w-4/5 p-6 h-screen overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Appointments</h2>
          </div>
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            
              <AllAppointments />
          </motion.div>
        </div>
      </div>
    );
  }
};

export default AppointmentPage;