import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Employee");
  const [employees, setEmployees] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // State to track if data was fetched from DB (to freeze fields)
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // State to determine if the form is valid (for enabling the button)
  const [isFormValid, setIsFormValid] = useState(false);

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

  // --- Dynamic Field Definitions ---
  // Moved outside the return so we can use them for validation logic
  const commonPurposes = [
    "Pre employment", "Pre employment (Food Handler)", "Pre Placement",
    "Annual / Periodical", "Periodical (Food Handler)", "Camps (Mandatory)",
    "Camps (Optional)", "Special Work Fitness", "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave","Fitness After Personal Long Leave", "Mock Drill", "BP Sugar Check  ( Normal Value)",
    "Follow Up Visits (Preventive)", "Follow Up Visits (Curative)", "Retirement medical examination"
  ];

  const visitorPurposes = [
    "Visitors Outsider Fitness", "Visitors Outsider Patient", 
    "Follow Up Visits (Preventive)", "Follow Up Visits (Curative)"
  ];

  const employeeFields = [
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No", disabled: false },
    { label: "Enter ID:", name: "employeeId", type: "text", placeholder: "Enter employee ID", disabled: isAutoFilled },
    { label: "Name:", name: "name", type: "text", placeholder: "Enter employee name", disabled: isAutoFilled },
    { label: "Name of Institute / Organization:", name: "organization", type: "text", placeholder: "Enter name of organization", disabled: isAutoFilled },
    { label: "Enter the purpose:", name: "purpose", type: "select", options: commonPurposes, disabled: false },
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
    { label: "Enter the purpose:", name: "purpose", type: "select", options: commonPurposes, disabled: false },
    { label: "Appointment Date:", name: "appointmentDate", type: "date" },
    { label: "Time:", name: "time", type: "time" },
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false },
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false },
  ];

  const visitorFields = [
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No", disabled: false },
    { label: "Name:", name: "name", type: "text", placeholder: "Enter name", disabled: isAutoFilled },
    { label: "Organization:", name: "organization", type: "text", placeholder: "Enter organization name", disabled: isAutoFilled },
    { label: "Enter the purpose:", name: "purpose", type: "select", options: visitorPurposes },
    { label: "Appointment Date:", name: "appointmentDate", type: "date" },
    { label: "Time:", name: "time", type: "time" },
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false },
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false },
  ];

  // Helper to get current active fields
  const getCurrentFields = () => {
    switch (role) {
      case "Employee": return employeeFields;
      case "Contractor": return contractorFields;
      case "Visitor": return visitorFields;
      default: return employeeFields;
    }
  };

  // --- Check Form Validity ---
  useEffect(() => {
    const checkValidity = () => {
      const activeFields = getCurrentFields();
      
      for (let field of activeFields) {
        const value = formData[field.name];
        
        // Check 1: Is field empty?
        if (!value || value.trim() === "") {
          setIsFormValid(false);
          return;
        }

        // Check 2: Specific validation for Aadhar
        if (field.name === "aadharNo" && value.length !== 12) {
            setIsFormValid(false);
            return;
        }
      }
      
      // If loop completes, all fields are valid
      setIsFormValid(true);
    };

    checkValidity();
  }, [formData, role, nurses, doctors]); // Re-run when data changes


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
        }));

        setIsAutoFilled(true);
      }
    } catch (error) {
      console.log("Worker not found or error fetching", error);
      setIsAutoFilled(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "aadharNo") {
        // Allow only numbers
        const numericValue = value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, [name]: numericValue }));

      if (numericValue.length === 12) {
        handleAadharLookup(numericValue);
      } else {
        if (isAutoFilled) {
          setIsAutoFilled(false);
          setFormData(prev => ({
            ...prev,
            [name]: numericValue,
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
    setIsAutoFilled(false);
    
    // Reset form but keep defaults for Nurse/Doctor
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
        setDoctors(doctorNames);

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

    // --- Final Validation Check before Submit ---
    const activeFields = getCurrentFields();
    for (let field of activeFields) {
        const value = formData[field.name];
        
        // Empty check
        if (!value || value.trim() === "") {
            alert(`Error: Please fill in the field "${field.label.replace(':', '')}"`);
            return;
        }

        // Aadhar check
        if (field.name === "aadharNo" && value.length !== 12) {
            alert("Error: Aadhar number must be exactly 12 digits.");
            return;
        }
    }

    setLoading(true);
    
    // Fallback defaults if empty (though validation above prevents this)
    if (formData.bookedBy === "" && nurses.length > 0) formData.bookedBy = nurses[0];
    if (formData.submitted_Dr === "" && doctors.length > 0) formData.submitted_Dr = doctors[0];

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
        handleRoleChange({ target: { value: role } }); // Reset form
      } else {
        alert(`${data.message || `Failed. Status: ${response.status}`}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  const displayedFields = getCurrentFields();

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
              {field.label} {field.name === "aadharNo" && "(12 Digits)"}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                className={`px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${field.disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
              >
                {/* Add a default placeholder option to ensure 'change' events and validation work properly */}
                <option value="">Select {field.label.replace(':', '')}</option>
                
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
                className={`px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${field.disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                placeholder={field.placeholder || ""}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                maxLength={field.name === "aadharNo" ? 12 : undefined}
              />
            )}
          </motion.div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            // Button is disabled if loading OR if form is invalid
            disabled={loading || !isFormValid}
            className={`px-6 py-2 text-white rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${loading || !isFormValid 
                    ? 'bg-gray-400 cursor-not-allowed opacity-60' // Disabled style
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' // Active style
                }`}
          >
            {loading ? "Booking appointment..." : "Book appointment"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookAppointment;