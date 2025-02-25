//BookAppointment
import React, { useState } from "react";
import { motion } from "framer-motion";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    role: "Employee",
    name: "",
    employeeId: "",
    organization: "",
    aadharNo: "",
    contractorName: "",
    purpose: "",
    date: new Date().toISOString().slice(0, 10),
    appointmentDate: new Date().toISOString().slice(0, 10),
    time: "10:00",
    bookedBy: "A",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://occupational-health-center.onrender.com/bookAppointment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.message || "Appointment booked successfully!");
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="p-6 rounded-lg bg-gray-50 shadow-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Book Appointment
      </h2>
      <form
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        onSubmit={handleSubmit}
      >
        {[
          {
            label: "Select the role:",
            name: "role",
            type: "select",
            options: ["Employee"],
          },
          { label: "Name:", name: "name", type: "text", placeholder: "Enter name" },
          {
            label: "Enter employee ID:",
            name: "employeeId",
            type: "text",
            placeholder: "Enter employee ID",
          },
          {
            label: "Name of Institute / Organization:",
            name: "organization",
            type: "text",
            placeholder: "Enter name of organization",
          },
          {
            label: "Aadhar No:",
            name: "aadharNo",
            type: "text",
            placeholder: "Enter Aadhar No",
          },
          {
            label: "Name of Contractor:",
            name: "contractorName",
            type: "text",
            placeholder: "Enter contractor name",
          },
          {
            label: "Enter the purpose:",
            name: "purpose",
            type: "text",
            placeholder: "Enter purpose",
          },
          { label: "Date:", name: "date", type: "date" },
          {
            label: "Enter the date of the appointment:",
            name: "appointmentDate",
            type: "date",
          },
          { label: "Time:", name: "time", type: "time" },
          {
            label: "Booked by Nurse:",
            name: "bookedBy",
            type: "select",
            options: ["A"],
          },
        ].map((field, index) => (
          <motion.div
            key={index}
            className="flex flex-col"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.07 }}
          >
            <label className="text-gray-700 font-medium mb-2">{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                className="px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[field.name]}
                onChange={handleChange}
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                className="px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder || ""}
                value={formData[field.name]}
                onChange={handleChange}
              />
            )}
          </motion.div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book the appointment
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookAppointment;