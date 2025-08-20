// Book Appointment
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const BookAppointment = () => {
  const [role, setRole] = useState("Employee");
  const [employees, setEmployees] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]); // Still fetch IDs, might be useful later (e.g., autocomplete)
  const [nurses, setNurses] = useState([])
  const [doctors, setdoctors] = useState([])
  // const [isEmployeeIdValid, setIsEmployeeIdValid] = useState(false); // REMOVED: No longer needed for restriction

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10), // Consider if this should be today's date always or empty
    role: "Employee", // Initial role value in formData
    employeeId: "",
    aadharNo: "",
    name: "",
    organization: "",
    contractorName: "",
    purpose: "Pre Employment",
    appointmentDate: new Date().toISOString().slice(0, 10),
    time: "",
    bookedBy: "", 
    submitted_by_nurse: "", 
    submitted_Dr: "", 
    consultedDoctor: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData({ ...formData, [name]: value });
  };

  console.log(employees)

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole); // Update the role state
    // Reset form data when role changes, keeping common fields if desired, or resetting all
    setFormData({
        // Reset common fields or all fields based on preference
        date: new Date().toISOString().slice(0, 10),
        role: newRole,
        employeeId: "",
        aadharNo: "",
        name: "",
        organization: "",
        contractorName: "",
        purpose: "Pre Employment", // Reset purpose or keep?
        appointmentDate: new Date().toISOString().slice(0, 10),
        time: "",
        bookedBy: "", // Default or fetch options?
        submitted_by_nurse: "", // Default or fetch options?
        submitted_Dr: "", // Default or fetch options?
        consultedDoctor: "",
    });
    // REMOVED: Resetting validation state
    // setIsEmployeeIdValid(false);
  };
  console.log(doctors)

  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await axios.post("http://localhost:8000/adminData");
            const fetchedEmployees = response.data.data;

            // It's better to update state with the fetched employees first
            setEmployees(fetchedEmployees);

            // Filter and map to create new arrays of nurse and doctor names
            const nurseNames = fetchedEmployees
                .filter(emp => emp.role === "nurse")
                .map(emp => emp.name);

            const doctorNames = fetchedEmployees
                .filter(emp => emp.role === "doctor")
                .map(emp => emp.name);

            // Update the state with the new arrays
            setNurses(nurseNames);
            setdoctors(doctorNames);

            // Extract employee IDs and store them in state
            const extractedEmployeeIds = fetchedEmployees.map(employee => employee.emp_no);
            setEmployeeIds(extractedEmployeeIds);

        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    fetchDetails();
}, []); // The empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    // REMOVED: Validation check before submission
    // if (role === "Employee" && !isEmployeeIdValid) {
    //   alert("Please enter a valid Employee ID.");
    //   return; // Prevent form submission if the employee ID is invalid
    // }

    if(formData.bookedBy === "") formData.bookedBy = nurses[0];
    if(formData.submitted_Dr === "") formData.submitted_Dr = doctors[0];

    console.log("Submitting form data:", formData); // Log data before sending

    try {
      const response = await fetch("http://localhost:8000/bookAppointment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Try parsing JSON regardless of status code for more detailed error info
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Handle cases where response is not valid JSON (e.g., server error page)
        console.error("Error parsing JSON response:", jsonError);
        if (!response.ok) {
           throw new Error(`Server error: ${response.status} ${response.statusText}`);
        } else {
            // Success but no valid JSON? Unlikely for this API but possible
           data = { message: "Appointment booked (non-JSON response)." };
        }
      }
      if (response.ok) {
        alert(data.message || "Appointment booked successfully!");
         // Optionally reset form after successful submission
         // handleRoleChange({ target: { value: role } }); // Re-use role change logic to reset
      } else {
         console.error("Booking failed:", data);
        alert(`${data.message || `Failed to book appointment. Status: ${response.status}`}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(`An error occurred while booking the appointment: ${error.message}`); 
    }
  };

  // Define fields - Remove 'disabled' property tied to isEmployeeIdValid
  const employeeFields = [
    
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No", disabled: false }, 
    { label: "Enter ID:", name: "employeeId", type: "text", placeholder: "Enter employee ID", disabled: false }, 
    { label: "Name:", name: "name", type: "text", placeholder: "Enter employee name", disabled: false }, 
    { label: "Name of Institute / Organization:", name: "organization", type: "text", placeholder: "Enter name of organization", disabled: false }, 
    { label: "Enter the purpose:", name: "purpose", type: "select", options: ["Pre Employment", "Pre Employment (Food Handler)", "Pre Placement",
    "Annual / Periodical", "Periodical (Food Handler)", "Camps (Mandatory)",
    "Camps (Optional)", "Special Work Fitness", "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave", "Mock Drill", "BP Sugar Check  ( Normal Value)"], disabled: false }, 
    { label: "Date of the appointment:", name: "appointmentDate", type: "date", disabled: false }, 
    { label: "Time:", name: "time", type: "time", disabled: false }, 
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false }, 
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false }, 
  ];

  const contractorFields = [
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No" },
    { label: "Enter ID:", name: "employeeId", type: "text", placeholder: "Enter employee ID" },
    { label: "Name:", name: "name", type: "text", placeholder: "Enter employee name", disabled: false }, 
    { label: "Contractor Name:", name: "contractorName", type: "text", placeholder: "Enter contractor name" },
    { label: "Enter the purpose:", name: "purpose", type: "select", options: ["Pre Employment", "Pre Employment (Food Handler)", "Pre Placement",
    "Annual / Periodical","Pre Employment Contract change", "Periodical (Food Handler)", "Camps (Mandatory)",
    "Camps (Optional)", "Special Work Fitness", "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave", "Mock Drill", "BP Sugar Check  ( Normal Value)"] },
    { label: "Appointment Date:", name: "appointmentDate", type: "date" },
    { label: "Time:", name: "time", type: "time" },
    { label: "Booking by (Nurse):", name: "bookedBy", type: "select", options: nurses, disabled: false }, 
    { label: "Submitted_Dr:", name: "Submitted_Dr", type: "select", options: doctors, disabled: false }, 
  ];

  const visitorFields = [
    
    { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No" },
    { label: "Name:", name: "name", type: "text", placeholder: "Enter name" },
    { label: "Organization:", name: "organization", type: "text", placeholder: "Enter organization name" },
    { label: "Enter the purpose:", name: "purpose", type: "select", options: ["Visitors Outsider Fitness", "Visitors Outsider Patient", "Followup Visits"] },
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
          className="px-4 py-2 w-1/2 md:w-1/3 lg:w-1/4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" // Adjusted width
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
            key={`${role}-${field.name}-${index}`} // More specific key when role changes
            className="flex flex-col"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.07 }}
          >
            <label className="text-gray-700 font-medium mb-2 text-sm"> {/* Smaller label */}
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                className={`px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} // Added text-sm
                value={formData[field.options[0]]}
                onChange={handleChange}
                disabled={field.disabled} // Use disabled from field definition
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
                className={`px-4 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} // Added text-sm
                placeholder={field.placeholder || ""}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={field.disabled} // Use disabled from field definition
              />
            )}
          </motion.div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end mt-4"> {/* Added margin-top */}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" // Adjusted style, added disabled style
            // REMOVED: disabled condition based on employee ID validity
            // disabled={role === "Employee" && !isEmployeeIdValid}
          >
            Book appointment
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookAppointment;