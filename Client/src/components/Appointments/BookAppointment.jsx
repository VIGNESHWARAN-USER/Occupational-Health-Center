// BookAppointment
import React, { useState } from "react";
import { motion } from "framer-motion";

const BookAppointment = () => {
  const [role, setRole] = useState("Employee");  // State for the selected role
  const [formData, setFormData] = useState({
    role: "Employee", // Initial role value in formData
    name: "",
    employeeId: "",
    organization: "",
    aadharNo: "",
    contractorName: "",
    purpose: "Pre Employment",
    date: new Date().toISOString().slice(0, 10),
    appointmentDate: new Date().toISOString().slice(0, 10),
    time: "10:00",
    bookedBy: "A",
    consultedDoctor: "A",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);  // Update the role state
    setFormData({...formData, role: e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/bookAppointment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
          alert(data.message || "Appointment booked successfully!");
      } else {
          alert(data.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment.");
    }
  };


  const employeeFields = [
    {
      label: "Enter ID:",
      name: "employeeId",
      type: "text",
      placeholder: "Enter employee ID",
    },
    {
      label: "Aadhar No:",
      name: "aadharNo",
      type: "text",
      placeholder: "Enter Aadhar No",
    },
    {
      label: "Name of Institute / Organization:",
      name: "organization",
      type: "text",
      placeholder: "Enter name of organization",
    },
    
    {
      label: "Enter the purpose:",
      name: "purpose",
      type: "select",
      options: ["Pre employment",
        "Pre employment (Food Handler)",
        "Pre Placement",
        "Annual / Periodical",
        "Periodical (Food Handler)",
        "Camps (Mandatory)",
        "Camps (Optional)",
        "Special Work Fitness", 
        "Special Work Fitness (Renewal)",
        "Fitness After Medical Leave", 
        "Fitness After Long Leave",
        "Mock Drill",
        "BP Sugar Check  ( Normal Value)"
        ]
    },
    {
      label: "Date of the appointment:",
      name: "appointmentDate",
      type: "date",
    },
    { label: "Time:", name: "time", type: "time" },
    {
      label: "Booking by (Nurse):",
      name: "bookedBy",
      type: "select",
      options: ["A"],
    },
    {
      label: "Consulting Doctor:",
      name: "consultedDoctor",
      type: "select",
      options: ["A"],
    },
  ];

  const contractorFields = [
    {
      label: "Enter ID:",
      name: "employeeId",
      type: "text",
      placeholder: "Enter employee ID",
    },
    {
      label: "Aadhar No:",
      name: "aadharNo",
      type: "text",
      placeholder: "Enter Aadhar No",
    },
    {
      label: "Contractor Name:",
      name: "contractorName",
      type: "text",
      placeholder: "Enter contractor name",
    },
    
    {
      label: "Enter the purpose:",
      name: "purpose",
      type: "select",
      options: ["Pre employment",
        "Pre employment (Food Handler)",
        "Pre Placement",
        "Annual / Periodical",
        "Periodical (Food Handler)",
        "Camps (Mandatory)",
        "Camps (Optional)",
        "Special Work Fitness", 
        "Special Work Fitness (Renewal)",
        "Fitness After Medical Leave", 
        "Fitness After Long Leave",
        "Mock Drill",
        "BP Sugar Check  ( Normal Value)"
        ]
    },
    {
      label: "Appointment Date:",
      name: "appointmentDate",
      type: "date",
    },
    { label: "Time:", name: "time", type: "time" },
    {
      label: "Booking by (Nurse):",
      name: "bookedBy",
      type: "select",
      options: ["A"],
    },
    {
      label: "Consulting Doctor:",
      name: "consultedDoctor",
      type: "select",
      options: ["A"],
    },
  ];

  const visitorFields = [
    { label: "Name:", name: "name", type: "text", placeholder: "Enter name" },
    {
      label: "Organization:",
      name: "organization",
      type: "text",
      placeholder: "Enter organization name",
    },
    {
      label: "Aadhar No:",
      name: "aadharNo",
      type: "text",
      placeholder: "Enter Aadhar No",
    },
    {
      label: "Enter the purpose:",
      name: "purpose",
      type: "select",
      options: ["Pre employment",
        "Pre employment (Food Handler)",
        "Pre Placement",
        "Annual / Periodical",
        "Periodical (Food Handler)",
        "Camps (Mandatory)",
        "Camps (Optional)",
        "Special Work Fitness", 
        "Special Work Fitness (Renewal)",
        "Fitness After Medical Leave", 
        "Fitness After Long Leave",
        "Mock Drill",
        "BP Sugar Check  ( Normal Value)"
        ]
    },
    {
      label: "Appointment Date:",
      name: "appointmentDate",
      type: "date",
    },
    { label: "Time:", name: "time", type: "time" },
    {
      label: "Booking by (Nurse):",
      name: "bookedBy",
      type: "select",
      options: ["A"],
    },
    {
      label: "Consulting Doctor:",
      name: "consultedDoctor",
      type: "select",
      options: ["A"],
    },
  ];

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    
  };

  let displayedFields;
  switch (role) {
    case "Employee":
      displayedFields = employeeFields;
      break;
    case "Contractor":
      displayedFields = contractorFields;
      break;
    case "Visitor":
      displayedFields = visitorFields;
      break;
    default:
      displayedFields = employeeFields;
  }

  return (
    <motion.div
      className="p-6 rounded-lg bg-gray-50 shadow-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
        <select
          value={role}
          onChange={handleRoleChange}
          className="px-4 py-2 w-1/2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Employee">Employee</option>
          <option value="Contractor">Contractor</option>
          <option value="Visitor">Visitor</option>
        </select>
      </div>
      <form
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        onSubmit={handleSubmit}
      >
        {displayedFields.map((field, index) => (
          <motion.div
            key={index}
            className="flex flex-col"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.07 }}
          >
            <label className="text-gray-700 font-medium mb-2">
              {field.label}
            </label>
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