import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const BookAppointment = () => {
  const [role, setRole] = useState("Employee");
  const [employees, setEmployees] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setdoctors] = useState([]);
  
  // State to track if data was fetched from DB (to freeze fields)
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    role: "Employee",
    employeeId: "",
    aadharNo: "",
    name: "",
    organization: "",
    contractorName: "",
    purpose: "",
    appointmentDate: new Date().toISOString().slice(0, 10),
    time: "",
    bookedBy: "",
    submitted_Dr: "",
    consultedDoctor: "",
  });

  // --- NEW: Function to fetch worker details ---
  const handleAadharLookup = async (aadhar) => {
    if (aadhar.length !== 12) return;

    try {
      const response = await axios.post("http://localhost:8000/get_worker_by_aadhar/", {
        aadhar: aadhar
      });

      if (response.data.success) {
        const worker = response.data.data;
        
        setFormData(prev => ({
          ...prev,
          name: worker.name || "",
          employeeId: worker.employeeId || "",
          organization: worker.organization || "",
          contractorName: worker.contractorName || "",
          // Optional: You can also auto-switch the role if the backend returns it
          // role: worker.role 
        }));
        
        setIsAutoFilled(true); // Lock the fields
        // alert("Worker details autofilled!"); 
      }
    } catch (error) {
      console.log("Worker not found or error fetching", error);
      // Don't alert error here, just let user type manually if not found
      setIsAutoFilled(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update State
    setFormData(prev => ({ ...prev, [name]: value }));

    // Logic for Aadhar Auto-fill
    if (name === "aadharNo") {
      if (value.length === 12) {
        handleAadharLookup(value);
      } else {
        // If user changes Aadhar after autofill, unlock fields and clear them
        if (isAutoFilled) {
          setIsAutoFilled(false);
          setFormData(prev => ({
            ...prev,
            [name]: value, // Keep the aadhar being typed
            name: "",
            employeeId: "",
            organization: "",
            contractorName: ""
          }));
        }
      }
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setIsAutoFilled(false); // Unfreeze fields on role switch
    setFormData({
        date: new Date().toISOString().slice(0, 10),
        role: newRole,
        employeeId: "",
        aadharNo: "",
        name: "",
        organization: "",
        contractorName: "",
        purpose: "", 
        appointmentDate: new Date().toISOString().slice(0, 10),
        time: "",
        bookedBy: nurses.length > 0 ? nurses[0] : "",
        submitted_Dr: doctors.length > 0 ? doctors[0] : "",
        consultedDoctor: "",
    });
  };

  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await axios.post("http://localhost:8000/adminData");
            const fetchedEmployees = response.data.data;
            setEmployees(fetchedEmployees);

            const nurseNames = fetchedEmployees
                .filter(emp => emp.role === "nurse")
                .map(emp => emp.name);

            const doctorNames = fetchedEmployees
                .filter(emp => emp.role === "doctor")
                .map(emp => emp.name);

            setNurses(nurseNames);
            setdoctors(doctorNames);
            
            // Set defaults for bookedBy/submitted_Dr if available
            setFormData(prev => ({
              ...prev,
              bookedBy: nurseNames[0] || "",
              submitted_Dr: doctorNames[0] || ""
            }));

        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    fetchDetails();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.bookedBy === "" && nurses.length > 0) formData.bookedBy = nurses[0];
    if(formData.submitted_Dr === "" && doctors.length > 0) formData.submitted_Dr = doctors[0];

    try {
      const response = await fetch("http://localhost:8000/bookAppointment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        data = { message: "Appointment booked." };
      }

      if (response.ok) {
        alert(data.message || "Appointment booked successfully!");
        // Reset form completely
        handleRoleChange({ target: { value: role } }); 
      } else {
        alert(`${data.message || `Failed. Status: ${response.status}`}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`); 
    }
  };

  // --- Dynamic Field Definitions ---
  // Note: 'disabled: isAutoFilled' is applied to fields we fetch from DB

  const employeeFields = [
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No", disabled: false }, 
    { label: "Enter ID:", name: "employeeId", type: "text", placeholder: "Enter employee ID", disabled: isAutoFilled }, 
    { label: "Name:", name: "name", type: "text", placeholder: "Enter employee name", disabled: isAutoFilled }, 
    { label: "Name of Institute / Organization:", name: "organization", type: "text", placeholder: "Enter name of organization", disabled: isAutoFilled }, 
    { label: "Enter the purpose:", name: "purpose", type: "select", options: ["Pre Employment", "Pre Employment (Food Handler)", "Pre Placement",
    "Annual / Periodical", "Periodical (Food Handler)", "Camps (Mandatory)",
    "Camps (Optional)", "Special Work Fitness", "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave", "Mock Drill", "BP Sugar Check  ( Normal Value)", "Follow Up Visits (Preventive)", "Follow Up Visits (Curative)"], disabled: false }, 
    { label: "Date of the appointment:", name: "appointmentDate", type: "date", disabled: false }, 
    { label: "Time:", name: "time", type: "time", disabled: false }, 
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false }, 
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false }, 
  ];

  const contractorFields = [
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No", disabled: false },
    { label: "Enter ID:", name: "employeeId", type: "text", placeholder: "Enter employee ID", disabled: isAutoFilled },
    { label: "Name:", name: "name", type: "text", placeholder: "Enter employee name", disabled: isAutoFilled }, 
    { label: "Contractor Name:", name: "contractorName", type: "text", placeholder: "Enter contractor name", disabled: isAutoFilled },
    { label: "Enter the purpose:", name: "purpose", type: "select", options: ["Pre Employment", "Pre Employment (Food Handler)", "Pre Placement",
    "Annual / Periodical","Pre Employment Contract change", "Periodical (Food Handler)", "Camps (Mandatory)",
    "Camps (Optional)", "Special Work Fitness", "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave", "Mock Drill", "BP Sugar Check  ( Normal Value)", "Follow Up Visits (Preventive)", "Follow Up Visits (Curative)"] },
    { label: "Appointment Date:", name: "appointmentDate", type: "date" },
    { label: "Time:", name: "time", type: "time" },
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false }, 
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false }, 
  ];

  const visitorFields = [
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No", disabled: false },
    { label: "Name:", name: "name", type: "text", placeholder: "Enter name", disabled: isAutoFilled },
    { label: "Organization:", name: "organization", type: "text", placeholder: "Enter organization name", disabled: isAutoFilled },
    { label: "Enter the purpose:", name: "purpose", type: "select", options: ["Visitors Outsider Fitness", "Visitors Outsider Patient","Follow Up Visits (Preventive)", "Follow Up Visits (Curative)"] },
    { label: "Appointment Date:", name: "appointmentDate", type: "date" },
    { label: "Time:", name: "time", type: "time" },
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false }, 
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false }, 
  ];

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  let displayedFields;
  switch (role) {
    case "Employee": displayedFields = employeeFields; break;
    case "Contractor": displayedFields = contractorFields; break;
    case "Visitor": displayedFields = visitorFields; break;
    default: displayedFields = employeeFields;
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
          className="px-4 py-2 w-1/2 md:w-1/3 lg:w-1/4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            key={`${role}-${field.name}-${index}`}
            className="flex flex-col"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.07 }}
          >
            <label className="text-gray-700 font-medium mb-2 text-sm">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                className={`px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${field.disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
              >
                {/* Handle case where options might be undefined initially */}
                {field.options && field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                // Visual feedback for disabled fields: bg-gray-100 and opacity
                className={`px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${field.disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                placeholder={field.placeholder || ""}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                // maxLength for Aadhar
                maxLength={field.name === "aadharNo" ? 12 : undefined} 
              />
            )}
          </motion.div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book appointment
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookAppointment;