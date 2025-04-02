import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar"; // Keep if you intend to use this
import { useNavigate } from "react-router-dom"; // Keep if you intend to use this
import axios from "axios";

// --- Keep Filter Section Definitions ---
const filterSections = [
    { id: "employementstatus", label: "Employement Status" },
    { id: "personaldetails", label: "Personal Details" },
    { id: "employementdetails", label: "Employement Details" },
    { id: "medicalhistory", label: "Medical History" },
    { id: "vaccination", label: "Vaccination" },
    { id: "purpose", label: "Purpose Filter" },
    { id: "vitals", label: "Vitals" },
    { id: "investigations", label: "Investigations" },
    { id: "diagnosis", label: "Diagnosis and Notable Remarks" },
    { id: "fitness", label: "Fitness" },
    { id:"prescriptions", label: "Prescriptions" },
    { id: "referrals", label: "Referrals" },
    { id: "statutoryforms", label: "Statutory Forms" },
];

// --- Helper function to calculate age ---
const calculateAge = (dobString) => {
    if (!dobString) return 'N/A'; // Handle cases where dob is missing or invalid
    try {
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        // Handle cases where DOB might be in the future or invalid resulting in negative age
        return age >= 0 ? age : 'N/A';
    } catch (error) {
        console.error("Error calculating age from DOB:", dobString, error);
        return 'N/A';
    }
};


const RecordsFilters = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [employees, setEmployees] = useState([]); // <--- State for fetched employees
  const [filteredEmployees, setFilteredEmployees] = useState([]); // State for filtered results (optional for now)
  const [loading, setLoading] = useState(false); // <--- State for loading status
  const [selectedRole, setSelectedRole] = useState("");

  // --- Fetch Data Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        // Make sure the endpoint '/userData' expects a POST request. If it's GET, change axios.post to axios.get
        const response = await axios.post("https://occupational-health-center-1.onrender.com/userData");
        const data = response.data?.data; // Use optional chaining

        if (Array.isArray(data)) {
            setEmployees(data);
            setFilteredEmployees(data); // Initially, show all employees
            console.log("Fetched Data:", data);
        } else {
            console.error("Fetched data is not an array:", data);
            setEmployees([]); // Set to empty array on error
            setFilteredEmployees([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setEmployees([]); // Set to empty array on error
        setFilteredEmployees([]);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount


  // --- Filter Logic (Keep as is for filter functionality) ---
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    // Add filtering logic based on role here if needed immediately
    // For now, we'll just store the role
  };

  const handleFilterClick = (section) => {
    setSelectedSection(section);
  };

  const removeFilter = (filterToRemove) => { // Changed parameter name for clarity
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((item) => item !== filterToRemove) // Compare the actual filter object
    );
    // Optionally re-apply filters here if needed immediately after removal
  };

  const addFilter = (formData) => {
    setSelectedFilters((prevFilters) => {
        const updatedFilters = [...prevFilters];
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) return; // Skip empty values

            let filterKey = key;
            let filterObject = { [key]: value };

            // --- Handle special cases like param, investigation, fitness etc. ---
            if (key === "param" && typeof value === 'object' && value.param) {
                filterKey = `${key}_${value.param}`; // Make key unique based on param type
                filterObject = { [filterKey]: value };
            } else if (key === "investigation" && typeof value === 'object' && value.form && value.param) {
                 filterKey = `${key}_${value.form}_${value.param}`; // More specific key
                 filterObject = { [filterKey]: value };
            } else if (key === "fitness") {
                // No need to change key here, fitness is usually one section
                filterObject = { [key]: value };
            }
            // Add more specific key handling if needed (e.g., for medical history booleans)
            else if (["smoking", "alcohol", "paan", "diet", "drugAllergy", "foodAllergy", "otherAllergies", "surgicalHistory", "purpose"].includes(key)) {
               if (value.length > 0 || (typeof value === 'object' && value !== null)) { // Check if value has content
                 filterObject = { [key]: value };
               } else {
                 return; // Skip if value is empty string or empty object
               }
            }


            // Find existing filter *by the derived specific key*
            const existingIndex = updatedFilters.findIndex(
                (filter) => Object.keys(filter)[0] === filterKey
            );

            if (existingIndex !== -1) {
                // Update existing filter
                updatedFilters[existingIndex] = filterObject;
            } else {
                // Add new filter
                updatedFilters.push(filterObject);
            }
        });
        // Reset selected section after adding filter
        setSelectedSection(null);
        return updatedFilters;
    });
     // Optionally re-apply filters here immediately after adding
  };

  // --- Apply Filters Function (Example - Needs actual implementation) ---
  // This function would run when filters change or a button is clicked
  const applyFiltersToData = () => {
    console.log("Applying filters:", selectedFilters);
    console.log("Selected Role:", selectedRole);
    // Start with all employees
    let currentFilteredData = [...employees];

    // 1. Filter by Role
    if (selectedRole) {
        currentFilteredData = currentFilteredData.filter(emp => emp.type === selectedRole); // Assuming 'type' holds Employee/Contractor/Visitor
    }

    // 2. Filter by selected criteria
    selectedFilters.forEach(filter => {
        const key = Object.keys(filter)[0];
        const value = filter[key];

        // Implement filtering logic based on key and value
        // This will be complex and depend heavily on your data structure
        // Example:
        if (key === 'status') { // From EmployementStatus
            // Need logic to check if employee status matches 'value' (active, resigned etc.)
            // This might involve checking a 'status' field and potentially a date range
        } else if (key === 'ageFrom') {
            currentFilteredData = currentFilteredData.filter(emp => calculateAge(emp.dob) >= value);
        } else if (key === 'ageTo') {
            currentFilteredData = currentFilteredData.filter(emp => calculateAge(emp.dob) <= value);
        } else if (key === 'sex') {
             currentFilteredData = currentFilteredData.filter(emp => emp.sex === value);
        } else if (key === 'bloodgrp') {
             currentFilteredData = currentFilteredData.filter(emp => emp.bloodgrp === value);
        }
        // Add many more 'else if' blocks for every possible filter key...
        // ... handling simple matches, range checks, object comparisons (vitals, investigations) etc.

        console.warn(`Filtering logic for key "${key}" is not fully implemented.`);
    });

    setFilteredEmployees(currentFilteredData);
  };

  // --- Effect to re-apply filters when they change ---
  // You might want to trigger this manually with a button instead
   useEffect(() => {
      applyFiltersToData();
   }, [selectedFilters, selectedRole, employees]); // Re-run when filters, role, or base data change


  // --- Function to get display string for a filter ---
  const getFilterDisplayString = (filter) => {
     const key = Object.keys(filter)[0];
     const value = Object.values(filter)[0];

      // Handle special formats
      if (key.startsWith("param_") && typeof value === 'object') { // Vitals
          return `Vitals: ${value.param.toUpperCase()} ${value.value ? `(${value.value})` : `${value.from} - ${value.to}`}`;
      } else if (key.startsWith("investigation_") && typeof value === 'object') { // Investigations
          return `Invest: ${value.form.toUpperCase()} - ${value.param.toUpperCase()} ${value.from} - ${value.to}`;
      } else if (key === "fitness" && typeof value === 'object') {
          const details = Object.entries(value)
              .map(([k, v]) => `${k.replace(/_/g, ' ').toUpperCase()}: ${v}`)
              .join(", ");
          return `Fitness: ${details}`;
      } else if (key === "purpose" && typeof value === 'object') {
          let str = "Purpose: ";
          if(value.type_of_visit) str += `${value.type_of_visit}`;
          if(value.register) str += ` > ${value.register}`;
          if(value.specificCategory) str += ` > ${value.specificCategory}`;
          if(value.fromDate || value.toDate) str += ` [${value.fromDate || '...'} to ${value.toDate || '...'}]`;
          return str;
      }
      // Default format
       else if (typeof value === 'object' && value !== null){
           // Avoid displaying [object Object] for unexpected objects
           return `${key.toUpperCase()}: Complex Filter`;
       }
      else {
          return `${key.replace(/_/g, ' ').toUpperCase()} : ${value}`;
      }
  };


  return (
    <div className="h-screen bg-[#8fcadd] flex">
      <Sidebar />
      <div className="h-screen overflow-auto flex flex-1 flex-col"> {/* Use flex-1 */}
        {/* --- Selected Filters Display --- */}
        <div className="p-4 flex flex-wrap gap-2 bg-gray-100 rounded-xl border-gray-300 sticky top-0 z-10"> {/* Sticky Filters */}
          {selectedFilters.length > 0 ? (
            selectedFilters.map((filter, index) => (
              <motion.div
                key={index} // Consider a more stable key if possible
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout // Add layout animation
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full shadow text-sm" // Smaller text
              >
                <span>{getFilterDisplayString(filter)}</span>
                <X
                  size={16}
                  className="ml-2 cursor-pointer hover:bg-red-500 rounded-full"
                  onClick={() => removeFilter(filter)}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No filters selected. Add filters below.</p>
          )}
        </div>

        {/* --- Filter Selection Area --- */}
        <div className="flex m-4 gap-4"> {/* Simplified layout */}
            <select
                className="flex-shrink-0 p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Adjust width as needed
                onChange={handleRoleChange}
                value={selectedRole}
            >
                <option value="">Overall Role</option>
                <option value="Employee">Employee</option>
                <option value="Contractor">Contractor</option>
                <option value="Visitor">Visitor</option>
                 {/* Add other roles if necessary */}
            </select>

          <select
            className="flex-grow p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Takes remaining space
            onChange={(e) => {
                handleFilterClick(e.target.value);
                e.target.value = ""; // Reset dropdown after selection
                }}
            value={selectedSection || ""} // Control the select value
          >
            <option value="" disabled>
              Select Filters To Add...
            </option>
            {filterSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        {/* --- Dynamic Filter Form Area --- */}
        <div className="p-4 flex-shrink-0"> {/* Prevent this from growing too much */}
          <AnimatePresence>
            {selectedSection && (
              <motion.div
                key={selectedSection}
                initial={{ opacity: 0, y: -20 }} // Slide down effect
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-white shadow rounded-lg border border-gray-200" // Added border
              >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                    {
                        filterSections.find((f) => f.id === selectedSection)
                        ?.label
                    }
                    </h2>
                    {/* Optional: Add a close button for the filter section */}
                    <button onClick={() => setSelectedSection(null)} className="text-gray-500 hover:text-red-600">
                        <X size={20} />
                    </button>
                </div>
                 {/* --- Render Specific Filter Component --- */}
                 {/* (Your existing switch logic) */}
                {selectedSection === "employementstatus" ? ( <EmployementStatus addFilter={addFilter} /> ) : null}
                {selectedSection === "personaldetails" ? ( <PersonalDetails addFilter={addFilter} /> ) : null}
                {selectedSection === "employementdetails" ? ( <EmploymentDetails addFilter={addFilter} /> ) : null}
                {selectedSection === "vitals" ? ( <Vitals addFilter={addFilter} /> ) : null}
                {selectedSection === "fitness" ? ( <Fitness addFilter={addFilter} /> ) : null}
                {selectedSection === "medicalhistory" ? ( <MedicalHistoryForm addFilter={addFilter} /> ) : null}
                {selectedSection === "investigations" ? ( <Investigations addFilter={addFilter} /> ) : null}
                {selectedSection === "vaccination" ? ( <VaccinationForm addFilter={addFilter} /> ) : null}
                {selectedSection === "purpose" ? ( <PurposeFilter addFilter={addFilter} /> ) : null}
                {selectedSection === "diagnosis" ? ( <Diagnosis addFilter={addFilter} /> ) : null}
                {selectedSection === "prescriptions" ? ( <Prescriptions addFilter={addFilter} /> ) : null}
                {selectedSection === "referrals" ? ( <Referrals addFilter={addFilter} /> ) : null}
                {selectedSection === "statutoryforms" ? ( <StatutoryForms addFilter={addFilter} /> ) : null}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Display Employee Data Table --- */}
        <div className="p-4 flex-grow flex flex-col"> {/* Allow table area to grow */}
          <h2 className="text-xl font-semibold mb-4 flex-shrink-0">Employee Records</h2>
          {/* Optional: Add a manual "Apply Filters" button here */}
          {/* <button onClick={applyFiltersToData} className="mb-4 px-4 py-2 bg-green-500 text-white rounded">Apply Filters</button> */}

          <div className="overflow-auto flex-grow bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200"> {/* Table container grows */}
            <table className="min-w-full bg-white rounded-lg shadow-sm"> {/* Removed shadow-lg for container shadow */}
              <thead className="bg-blue-500 text-white sticky top-0 z-5"> {/* Sticky Header */}
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"> {/* Smaller Header Text */}
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Gender
                  </th>
                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Role/Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500"> {/* Increased colspan */}
                      Loading records...
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id || employee.emp_no} className="hover:bg-gray-50"> {/* Use unique key */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.emp_no || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateAge(employee.dob)} {/* Calculate age */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.sex || 'N/A'}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.type || 'N/A'} {/* Display Role/Type */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Add Action buttons here if needed */}
                        <button
                            onClick={() => navigate(`/employee-details/${employee.emp_no}`)} // Example navigation
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500"> {/* Increased colspan */}
                      No employee records found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Keep all your existing filter components (EmployementStatus, PersonalDetails, etc.) ---
// --- Make sure they call addFilter correctly ---

const EmployementStatus = ({ addFilter }) => {
    const [formData, setFormData] = useState({
        status: "", // Combined status field
        from: "",
        to: "",
        transferred_to: "", // Conditional field for transferred_to
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = () => {
        const { status, from, to, transferred_to } = formData;
        const filteredData = {};

        if (status) filteredData.status = status;
        if (status === 'transferred_to' && transferred_to) {
            filteredData.transferred_to = transferred_to;
        } else if (status && status !== 'transferred_to') {
            if (from) filteredData.from = from;
            if (to) filteredData.to = to;
        }

        if (Object.keys(filteredData).length > 0) {
           addFilter(filteredData);
        }
         // Reset form or provide feedback
        setFormData({ status: "", from: "", to: "", transferred_to: "" });

    };

    const showTransferredTo = formData.status === "transferred_to";
    const showDateRange = formData.status && !showTransferredTo; // Show date range if status is selected and it's not 'transferred_to'


    return (
        <div className="space-y-4"> {/* Use space-y for vertical spacing */}
        {/* Employment Status Dropdown */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
            <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="transferred_to">Transferred To</option>
            <option value="resigned">Resigned</option>
            <option value="retired">Retired</option>
            <option value="deceased">Deceased</option>
            <option value="unauthorized_absence">Unauthorized Absence</option>
            <option value="others">Others</option>
            </select>
        </div>

        {/* Conditional Transferred To Text Input */}
        {showTransferredTo && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transferred To Department/Location</label>
            <input
                type="text"
                name="transferred_to"
                value={formData.transferred_to}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Department or Location"
            />
            </div>
        )}

        {/* Date Range Inputs (Conditional) */}
        {showDateRange && (
            <div className="grid grid-cols-2 gap-4"> {/* Use gap for spacing */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                type="date"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                type="date"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            </div>
        )}

        {/* Submit Button */}
         <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                // Disable button if no status is selected, or if 'transferred_to' is selected but the input is empty
                disabled={!formData.status || (formData.status === 'transferred_to' && !formData.transferred_to)}
            >
                Add Employment Status Filter
            </button>
        </div>
    );
};

const PersonalDetails = ({ addFilter }) => {
  const [formData, setFormData] = useState({ // Corrected state name
    ageFrom: "",
    ageTo: "",
    sex: "",
    bloodgrp: "",
    marital_status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value })); // Corrected state setter name
  };

  const handleSubmit = () => {
    // Filter out only the fields that have values
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "" && value !== null)
    );

    // Check if ageFrom is greater than ageTo
     if (filteredData.ageFrom && filteredData.ageTo && parseInt(filteredData.ageFrom, 10) > parseInt(filteredData.ageTo, 10)) {
      alert("'Age From' cannot be greater than 'Age To'."); // Or handle error more gracefully
      return; // Stop submission
    }


    if (Object.keys(filteredData).length > 0) {
       addFilter(filteredData);
    }
    // Reset form or provide feedback
    setFormData({ ageFrom: "", ageTo: "", sex: "", bloodgrp: "", marital_status: "" });
  };

  return (
    <div className="space-y-4">
      {/* Age Range Input */}
      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age From</label>
            <input
            type="number"
            name="ageFrom"
            value={formData.ageFrom}
            onChange={handleChange}
            min="0" // Prevent negative age
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 25"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age To</label>
            <input
            type="number"
            name="ageTo"
            value={formData.ageTo}
            onChange={handleChange}
            min="0" // Prevent negative age
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 40"
            />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Responsive grid */}
        {/* Sex Input */}
        <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
            Sex
            </label>
            <select
            name="sex"
            id="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Any Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            </select>
        </div>

        {/* Blood Group Input */}
        <div>
            <label htmlFor="bloodgrp" className="block text-sm font-medium text-gray-700 mb-1">
            Blood Group
            </label>
            <select
            name="bloodgrp"
            id="bloodgrp"
            value={formData.bloodgrp}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Any Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            </select>
        </div>

        {/* Marital Status Input */}
        <div>
            <label
            htmlFor="marital_status"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Marital Status
            </label>
            <select
            name="marital_status"
            id="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Any Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Separated">Separated</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            </select>
        </div>
      </div>


      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
         // Disable if no fields are filled
         disabled={Object.values(formData).every(value => value === "")}
      >
        Add Personal Details Filter
      </button>
    </div>
  );
};

const EmploymentDetails = ({ addFilter }) => {
  const [formData, setFormData] = useState({ // Renamed state variable
    designation: "",
    department: "",
    moj: "", // Mode of Joining
    employer: "",
    doj: "", // Date of Joining
    job_nature: "",
  });

  // Static options for dropdowns (can be moved outside if preferred)
  const employerOptions = {
    "JSW Steel": "JSW Steel",
    "JSW Cement": "JSW Cement",
    "JSW Foundation": "JSW Foundation",
    // Add more employers as needed
  };

   const mojOptions = {
    "New Joinee": "New Joinee",
    "Transfer": "Transfer",
    // Add more if needed
   };

   const jobNatureOptions = {
       "Contract": "Contract",
       "Permanent": "Permanent",
       "Consultant": "Consultant",
       // Add more if needed
   };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value })); // Use correct setter
  };

  const handleSubmit = () => {
    // Filter out only the fields that have values
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "" && value !== null)
    );

    if (Object.keys(filteredData).length > 0) {
        addFilter(filteredData);
    }
     // Reset form or provide feedback
     setFormData({ designation: "", department: "", moj: "", employer: "", doj: "", job_nature: "" });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {/* Employer Dropdown */}
        <div>
            <label
            htmlFor="employer"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Employer
            </label>
            <select
            name="employer"
            id="employer"
            value={formData.employer}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Any Employer</option>
            {Object.entries(employerOptions).map(([key, value]) => (
                <option key={key} value={key}>
                {value} {/* Displaying the value */}
                </option>
            ))}
            </select>
        </div>

        {/* Mode of Joining Dropdown */}
        <div>
            <label
            htmlFor="moj"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Mode of Joining
            </label>
            <select
            name="moj"
            id="moj"
            value={formData.moj}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Any Mode</option>
             {Object.entries(mojOptions).map(([key, value]) => (
                <option key={key} value={key}>
                {value}
                </option>
            ))}
            </select>
        </div>

         {/* Job Nature Dropdown */}
         <div>
            <label
            htmlFor="job_nature"
            className="block text-sm font-medium text-gray-700 mb-1"
            >
            Job Nature
            </label>
            <select
            name="job_nature"
            id="job_nature"
            value={formData.job_nature}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Any Nature</option>
              {Object.entries(jobNatureOptions).map(([key, value]) => (
                <option key={key} value={key}>
                {value}
                </option>
            ))}
            </select>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {/* Designation Input */}
        <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
            Designation
            </label>
            <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Engineer"
            />
        </div>

        {/* Department Input */}
        <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
            </label>
            <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., IT"
            />
        </div>

         {/* Date of Joining Input */}
        <div>
            <label htmlFor="doj" className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
            <input
            type="date"
            id="doj"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>


      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
         disabled={Object.values(formData).every(value => value === "")} // Disable if all fields are empty
      >
        Add Employment Details Filter
      </button>
    </div>
  );
};

const Vitals = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    param: "systolic", // Default parameter
    bmiCategory: "",
    from: "",
    to: "",
  });

  const vitalParams = [ // Define params clearly
      { value: "systolic", label: "Systolic BP", type: "range" },
      { value: "diastolic", label: "Diastolic BP", type: "range" },
      { value: "pulse", label: "Pulse Rate", type: "range" },
      { value: "respiratory_rate", label: "Respiratory Rate", type: "range" },
      { value: "temperature", label: "Temperature (°F/°C)", type: "range" }, // Specify units if possible
      { value: "spO2", label: "SpO2 (%)", type: "range" },
      { value: "height", label: "Height (cm/in)", type: "range" }, // Specify units
      { value: "weight", label: "Weight (kg/lbs)", type: "range" }, // Specify units
      { value: "bmi", label: "BMI", type: "category" },
  ];

  const bmiOptions = {
    "Under weight": "Under weight",
    "Normal": "Normal",
    "Over weight": "Over weight",
    "Obese": "Obese",
    "Extremely Obese": "Extremely Obese",
  };

  const selectedParamConfig = vitalParams.find(p => p.value === formData.param);

  const handleChange = (e) => {
    const { name, value } = e.target;
     setFormData(prev => {
         const newState = { ...prev, [name]: value };
         // Reset other fields when param changes
         if (name === 'param') {
             newState.bmiCategory = "";
             newState.from = "";
             newState.to = "";
         }
         return newState;
     });
  };

  const handleSubmit = () => {
    const { param, bmiCategory, from, to } = formData;
    const config = vitalParams.find(p => p.value === param);

    if (!config) return; // Should not happen if param is selected

    let filterPayload = {};

    if (config.type === "category" && param === "bmi" && bmiCategory) {
      filterPayload = { param: param, value: bmiCategory }; // Structure for category
    } else if (config.type === "range" && from !== "" && to !== "") {
       // Validate range
        if (parseFloat(from) > parseFloat(to)) {
            alert("'Range from' cannot be greater than 'Range to'.");
            return;
        }
      filterPayload = { param: param, from: from, to: to }; // Structure for range
    } else {
        alert("Please provide valid inputs for the selected parameter.");
        return; // Don't add incomplete filter
    }

    addFilter({ param: filterPayload }); // Wrap the specific payload under 'param' key

    // Reset form after submission
     setFormData({ param: "systolic", bmiCategory: "", from: "", to: "" });
  };

  const showBmiDropdown = selectedParamConfig?.type === "category" && selectedParamConfig?.value === "bmi";
  const showRangeInputs = selectedParamConfig?.type === "range";

  // Determine if submit should be disabled
   const isSubmitDisabled = !selectedParamConfig ||
        (showBmiDropdown && !formData.bmiCategory) ||
        (showRangeInputs && (formData.from === "" || formData.to === ""));


  return (
    <div className="space-y-4">
        {/* Parameter Selection */}
      <div>
        <label htmlFor="param" className="block text-sm font-medium text-gray-700 mb-1">
          Select Vital Parameter
        </label>
        <select
          name="param"
          id="param"
          value={formData.param}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {vitalParams.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Conditional Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BMI Category Dropdown */}
        {showBmiDropdown && (
            <div className="md:col-span-2"> {/* Span full width on medium screens */}
            <label htmlFor="bmiCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Select BMI Category
            </label>
            <select
                name="bmiCategory"
                id="bmiCategory"
                value={formData.bmiCategory}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select Category</option>
                {Object.entries(bmiOptions).map(([key, value]) => (
                <option key={key} value={key}>
                    {value}
                </option>
                ))}
            </select>
            </div>
        )}

        {/* Range Inputs */}
        {showRangeInputs && (
            <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Range From</label>
                <input
                type="number"
                name="from"
                value={formData.from}
                onChange={handleChange}
                 step="any" // Allow decimals if needed
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 120"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Range To</label>
                <input
                type="number"
                name="to"
                value={formData.to}
                onChange={handleChange}
                step="any" // Allow decimals if needed
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 140"
                />
            </div>
            </>
        )}
      </div>


      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
         disabled={isSubmitDisabled}
      >
        Add Vital Filter ({selectedParamConfig?.label})
      </button>
    </div>
  );
};


const Investigations = ({ addFilter }) => {
    // Define formOptions structure directly
     const formOptions = {
        haematology: ["hemoglobin", "total_rbc", "total_wbc", "neutrophil", /* ... add all params */ "peripheral_blood_smear_others"],
        routine_sugar_tests: ["glucose_f", "glucose_pp", "random_blood_sugar", "estimated_average_glucose", "hba1c"],
        lipid_profile: ["calcium", "triglycerides", "hdl_cholesterol", "ldl_cholesterol", /* ... */ "ldl_hdl_ratio_comments"],
        liver_function_test: ["bilirubin_total", "sgot_ast", "sgpt_alt", /* ... */ "gamma_glutamyl_transferase_comments"],
        thyroid_function_test: ["t3_triiodothyronine", "t4_thyroxine", "tsh_thyroid_stimulating_hormone"],
        renal_function_test_electrolytes: ["urea", "bun", "calcium", "sodium", "potassium", /* ... */ "chloride_comments"],
        //autoimmune_test: ["..."], // Define these params if needed
        coagulation_test: ["prothrombin_time", "pt_inr", "clotting_time", "bleeding_time"],
        enzymes_cardiac_profile: ["acid_phosphatase", "amylase", "ecg", "troponin_t", "cpk_total", "echo", "lipase", "cpk_mb", "tmt_normal"],
        urine_routine: ["colour", "appearance", "reaction_ph", "specific_gravity", "protein_albumin", "glucose_urine", /* ... */ "epithelial_cells_comments"],
        serology: ["screening_hiv", "occult_blood", /* ... */ "others_comments"], // Assuming stool related here based on names
        motion: ["colour_motion", "appearance_motion", "occult_blood", "cyst", "mucus", "pus_cells", "ova", "rbcs", "others"],
        //routine_culture_sensitivity_test: ["urine", "motion", "sputum", "blood"], // These might be boolean flags or text results? Clarify input type.
        mens_pack: ["psa"],
        //womens_pack: [], // Define params if any
        //occupational_profile: [], // Define params if any
        //others_test: [], // Define params if any
        ophthalmic_report: ["vision", "color_vision"],
        //xray: [], // Define specific X-ray types/results if filterable
        usg: ["usg_abdomen", "usg_kub", "usg_pelvis", "usg_neck"],
        //ct: [], // Define specific CT types/results if filterable
        //mri: [], // Define specific MRI types/results if filterable
    };

    // Function to format label (e.g., 'routine_sugar_tests' -> 'Routine Sugar Tests')
    const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const [formData, setFormData] = useState({
        form: "", // e.g., 'haematology'
        param: "", // e.g., 'hemoglobin'
        from: "",
        to: "",
        status: "", // Normal/Abnormal - may apply to some tests
    });

    const selectedFormParams = formData.form ? formOptions[formData.form] || [] : [];

    useEffect(() => {
      // Reset 'param' and other fields when 'form' changes to avoid invalid states
      setFormData((prev) => ({ ...prev, param: "", from: "", to: "", status: "" }));
    }, [formData.form]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
      const { form, param, from, to, status } = formData;

      // Basic validation
      if (!form || !param) {
          alert("Please select both a Form and a Parameter.");
          return;
      }

      // Decide payload based on whether range or status is provided
      let filterPayload = { form, param };
      let hasValue = false;

       if (from !== "" && to !== "") {
            if (parseFloat(from) > parseFloat(to)) {
                alert("'Range from' cannot be greater than 'Range to'.");
                return;
            }
            filterPayload.from = from;
            filterPayload.to = to;
            hasValue = true;
       }

        if (status !== "") {
           filterPayload.status = status;
           hasValue = true;
       }

       if (!hasValue) {
           alert("Please provide either a numeric range (From/To) or a Status (Normal/Abnormal).");
           return;
       }


      addFilter({ investigation: filterPayload }); // Wrap under 'investigation' key

       // Reset form
        setFormData({ form: "", param: "", from: "", to: "", status: "" });
    };

     // Determine if submit should be disabled
    const isSubmitDisabled = !formData.form || !formData.param || (formData.from === "" && formData.to === "" && formData.status === "");


    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form Select */}
            <div>
            <label htmlFor="form" className="block text-sm font-medium text-gray-700 mb-1">
                Select Investigation Form
            </label>
            <select
                name="form"
                id="form"
                value={formData.form}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Select Form --</option>
                {Object.keys(formOptions).map((key) => (
                <option key={key} value={key}>
                    {formatLabel(key)}
                </option>
                ))}
            </select>
            </div>

            {/* Parameter Select */}
            <div>
            <label htmlFor="param" className="block text-sm font-medium text-gray-700 mb-1">
                Select Parameter
            </label>
            <select
                name="param"
                id="param"
                value={formData.param}
                onChange={handleChange}
                disabled={!formData.form || selectedFormParams.length === 0} // Disable if no form or no params for form
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
                <option value="">-- Select Parameter --</option>
                {selectedFormParams.map((param) => (
                    <option key={param} value={param}>
                    {formatLabel(param)}
                    </option>
                ))}
            </select>
            </div>
        </div>

        {/* Range and Status Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Range from */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Range From (Value)</label>
            <input
                type="number"
                name="from"
                value={formData.from}
                onChange={handleChange}
                step="any"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min value"
                // Disable if status is selected? Or allow both? Decide based on backend logic.
                // disabled={formData.status !== ""}
            />
            </div>

            {/* Range to */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Range To (Value)</label>
            <input
                type="number"
                name="to"
                value={formData.to}
                onChange={handleChange}
                step="any"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max value"
                 // disabled={formData.status !== ""}
            />
            </div>

             {/* Status */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 // Disable if range is entered?
                // disabled={formData.from !== "" || formData.to !== ""}
            >
                <option value="">-- Select Status --</option>
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
                 {/* Add other relevant statuses if applicable */}
            </select>
            </div>
        </div>


        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={isSubmitDisabled}
        >
          Add Investigation Filter
        </button>
      </div>
    );
  };

const Fitness = ({ addFilter }) => {
    const [formData, setFormData] = useState({
      tremors: "",
      romberg_test: "",
      acrophobia: "",
      trendelenberg_test: "",
      job_nature: "", // Consider if this overlaps with EmploymentDetails filter
      overall_fitness: "",
    });

    // Options can be defined here or passed as props
    const yesNoOptions = { "": "Any", Positive: "Positive", Negative: "Negative" };
    const jobNatureOptions = { "": "Any", DeskJob: "Desk Job", "Field Work": "Field Work", "Manual Labor": "Manual Labor" }; // Example values
    const fitnessStatusOptions = { "": "Any", Fit: "Fit", "Conditionally Fit": "Conditionally Fit", Unfit: "Unfit" };


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
      // Filter out empty strings before adding
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      if (Object.keys(filteredData).length > 0) {
         addFilter({ fitness: filteredData }); // Wrap the data under 'fitness' key
      } else {
          alert("Please select at least one fitness criterion.");
      }

      // Reset form
       setFormData({ tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "", job_nature: "", overall_fitness: "" });
    };

    // Determine if submit should be disabled
     const isSubmitDisabled = Object.values(formData).every(value => value === "");

    return (
      <div className="space-y-6"> {/* Increased spacing */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Tremors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tremors</label>
            <select
              name="tremors"
              value={formData.tremors}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(yesNoOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {/* Romberg Test */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Romberg Test</label>
            <select
              name="romberg_test"
              value={formData.romberg_test}
              onChange={handleChange}
               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
             {Object.entries(yesNoOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {/* Acrophobia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Acrophobia</label>
            <select
              name="acrophobia"
              value={formData.acrophobia}
              onChange={handleChange}
               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(yesNoOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {/* Trendelenberg Test */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trendelenberg Test</label>
            <select
              name="trendelenberg_test"
              value={formData.trendelenberg_test}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
               {Object.entries(yesNoOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Nature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Nature (Fitness Context)</label>
            <select
              name="job_nature"
              value={formData.job_nature}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
               {Object.entries(jobNatureOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
             </select>
          </div>

          {/* Overall Fitness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Fitness Status</label>
              <select
                name="overall_fitness"
                value={formData.overall_fitness}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(fitnessStatusOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
      </div>

    <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        disabled={isSubmitDisabled}
    >
        Add Fitness Filter
    </button>
</div>);
};

const MedicalHistoryForm = ({ addFilter }) => {
  // Group state logically
  const [personalHabits, setPersonalHabits] = useState({
    smoking: "",
    alcohol: "",
    paan: "",
    diet: "",
  });
  const [personalConditions, setPersonalConditions] = useState({
    condition: "", // Which condition (e.g., HTN, DM)
    status: "", // Yes/No for that condition
  });
   const [familyConditions, setFamilyConditions] = useState({
    condition: "", // Which condition (e.g., HTN, DM)
    status: "", // Yes/No for that condition
    relation: "", // Father, Mother etc.
  });
  const [allergies, setAllergies] = useState({
    drugAllergy: "",
    foodAllergy: "",
    otherAllergies: "",
  });
  const [surgicalHistory, setSurgicalHistory] = useState({
    status: "", // Yes/No
    // details: "" // Optional: add details field later if needed
  });

  // Options
  const habitOptions = { "": "Any", Yes: "Yes", No: "No", Cessated: "Cessated" }; // Corrected spelling
  const yesNoOptions = { "": "Any", Yes: "Yes", No: "No" };
  const dietOptions = { "": "Any", Veg: "Pure Veg", "Non-Veg": "Mixed Diet", Eggetarian: "Eggetarian" };
  const conditionParams = ["", "HTN", "DM", "Epileptic", "Hyper thyroid", "Hypo thyroid", "Asthma", "CVS", "CNS", "RS", "GIT", "KUB", "CANCER", "Defective Colour Vision", "OTHERS", "Obstetric", "Gynaec"];
  const relationOptions = ["", "Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse", "Grandparent", "Other"]; // Added more


  // Handlers (could be combined but separate for clarity)
  const handleHabitChange = (e) => {
    const { name, value } = e.target;
    setPersonalHabits(prev => ({ ...prev, [name]: value }));
  };
  const handlePersonalConditionChange = (e) => {
      const { name, value } = e.target;
      setPersonalConditions(prev => ({...prev, [name]: value}));
  };
  const handleFamilyConditionChange = (e) => {
      const { name, value } = e.target;
      setFamilyConditions(prev => ({...prev, [name]: value}));
  };
  const handleAllergyChange = (e) => {
    const { name, value } = e.target;
    setAllergies(prev => ({ ...prev, [name]: value }));
  };
  const handleSurgicalChange = (e) => {
     const { name, value } = e.target;
     setSurgicalHistory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let combinedFilters = {};

    // Add non-empty habits
    Object.entries(personalHabits).forEach(([key, value]) => {
      if (value) combinedFilters[key] = value;
    });

    // Add allergy status if selected
     Object.entries(allergies).forEach(([key, value]) => {
      if (value) combinedFilters[key] = value;
    });

    // Add surgical history status if selected
    if(surgicalHistory.status) {
        combinedFilters.surgicalHistory = surgicalHistory.status; // Send only Yes/No for now
    }

     // Add personal condition if both condition and status selected
    if (personalConditions.condition && personalConditions.status) {
        combinedFilters[`personal_${personalConditions.condition}`] = personalConditions.status; // e.g., personal_HTN: "Yes"
    }

      // Add family condition if condition, status, and relation selected
    if (familyConditions.condition && familyConditions.status && familyConditions.relation) {
         // Key format: family_{condition}_{relation}: {status} - might be too specific for backend?
         // Alternative: Send as object: familyCondition: { condition: 'HTN', status: 'Yes', relation: 'Father' }
         // Let's use a structured object approach for clarity, assuming backend can handle it:
          combinedFilters.familyCondition = {
              condition: familyConditions.condition,
              status: familyConditions.status,
              relation: familyConditions.relation
          };
         // If backend expects flat keys:
         // combinedFilters[`family_${familyConditions.condition}_${familyConditions.relation}`] = familyConditions.status;
    }


    if (Object.keys(combinedFilters).length > 0) {
        console.log("Adding Medical History Filters:", combinedFilters);
        addFilter(combinedFilters);
    } else {
        alert("Please select at least one medical history criterion.");
    }

    // Reset forms
    setPersonalHabits({ smoking: "", alcohol: "", paan: "", diet: "" });
    setPersonalConditions({ condition: "", status: "" });
    setFamilyConditions({ condition: "", status: "", relation: "" });
    setAllergies({ drugAllergy: "", foodAllergy: "", otherAllergies: "" });
    setSurgicalHistory({ status: "" });
  };

  // Disable submit if no criteria are selected across all sections
    const isSubmitDisabled =
        Object.values(personalHabits).every(v => !v) &&
        (!personalConditions.condition || !personalConditions.status) &&
        (!familyConditions.condition || !familyConditions.status || !familyConditions.relation) &&
        Object.values(allergies).every(v => !v) &&
        !surgicalHistory.status;

  return (
    <div className="space-y-6">
      {/* Personal Habits */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-semibold px-2">Personal Habits</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {Object.keys(personalHabits).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)} {key === 'paan' ? '(Beetel)' : ''} {key === 'diet' ? '(Food Pattern)' : ''}
              </label>
              <select
                name={key}
                value={personalHabits[key]}
                onChange={handleHabitChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(key === 'diet' ? dietOptions : habitOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
              </select>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Personal Medical Conditions */}
      <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2">Personal Medical Conditions</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition Parameter</label>
                  <select
                      name="condition"
                      value={personalConditions.condition}
                      onChange={handlePersonalConditionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  {conditionParams.map(cond => <option key={cond} value={cond}>{cond || '-- Select Condition --'}</option>)}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status (Yes/No)</label>
                  <select
                      name="status"
                      value={personalConditions.status}
                      onChange={handlePersonalConditionChange}
                      disabled={!personalConditions.condition} // Enable only if condition is selected
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                     {Object.entries(yesNoOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
                  </select>
              </div>
          </div>
      </fieldset>


      {/* Allergies */}
       <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-semibold px-2">Allergies</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {Object.keys(allergies).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 {/* Better labels */}
                 {key === 'drugAllergy' ? 'Drug Allergy' : key === 'foodAllergy' ? 'Food Allergy' : 'Other Allergies'}
              </label>
              <select
                name={key}
                value={allergies[key]}
                onChange={handleAllergyChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                 {Object.entries(yesNoOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
              </select>
            </div>
          ))}
        </div>
      </fieldset>

       {/* Surgical History */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-semibold px-2">Surgical History</legend>
        <div className="grid grid-cols-1 gap-4 mt-2"> {/* Simple layout */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Any Past Surgeries?</label>
            <select
                name="status"
                value={surgicalHistory.status}
                onChange={handleSurgicalChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {Object.entries(yesNoOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
            </select>
            </div>
            {/* Optional: Add a text area for details if surgicalHistory.status === 'Yes' */}
        </div>
      </fieldset>

      {/* Family History */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-semibold px-2">Family History</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition Parameter</label>
            <select
              name="condition"
              value={familyConditions.condition}
              onChange={handleFamilyConditionChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {conditionParams.map(cond => <option key={cond} value={cond}>{cond || '-- Select Condition --'}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
            <select
              name="relation"
              value={familyConditions.relation}
              onChange={handleFamilyConditionChange}
               disabled={!familyConditions.condition}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {relationOptions.map(rel => <option key={rel} value={rel}>{rel || '-- Select Relation --'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status (Yes/No)</label>
            <select
              name="status"
              value={familyConditions.status}
              onChange={handleFamilyConditionChange}
              disabled={!familyConditions.condition || !familyConditions.relation}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
               {Object.entries(yesNoOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
            </select>
          </div>
        </div>
      </fieldset>


      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        disabled={isSubmitDisabled}
      >
        Add Medical History Filter(s)
      </button>
    </div>
  );
};


const VaccinationForm = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    disease: "",
    vaccine: "", // Optional: Might be redundant if vaccine name = disease name
    status: "", // Complete/Incomplete
  });

  // Define options (these could come from API later)
  const diseaseOptions = ["", "Covid-19", "Hepatitis B", "Influenza", "Tetanus", "MMR"]; // Added more examples
  const vaccineOptions = { // Link vaccines to diseases if necessary
      "Covid-19": ["", "Covishield", "Covaxin", "Sputnik V", "Moderna", "Pfizer"],
      "Hepatitis B": ["", "Engerix-B", "Recombivax HB"],
      "Influenza": ["", "Fluarix", "Fluzone"],
      "Tetanus": ["", "Tdap", "Td"],
      "MMR": ["", "MMR-II", "Priorix"]
      // Add others...
  };
  const statusOptions = { "": "Any", Complete: "Complete", Incomplete: "Incomplete" };


  const availableVaccines = formData.disease ? vaccineOptions[formData.disease] || [""] : [""];

  const handleChange = (e) => {
    const { name, value } = e.target;
     setFormData(prev => {
         const newState = { ...prev, [name]: value };
         // Reset vaccine if disease changes
         if (name === 'disease') {
             newState.vaccine = "";
         }
         return newState;
     });
  };

  const handleSubmit = () => {
    // Filter out empty values before submitting
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );

    if (Object.keys(filteredData).length > 0) {
        // Decide on the structure to send, e.g., keep it flat
        addFilter(filteredData);
    } else {
        alert("Please select at least one vaccination criterion.");
    }

    // Reset form
     setFormData({ disease: "", vaccine: "", status: "" });
  };

   // Determine if submit should be disabled
   const isSubmitDisabled = !formData.disease && !formData.vaccine && !formData.status;


  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Select Disease */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
          <select
            name="disease"
            value={formData.disease}
            onChange={handleChange}
             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
             {diseaseOptions.map(d => <option key={d} value={d}>{d || '-- Select Disease --'}</option>)}
          </select>
        </div>

        {/* Select Specific Vaccine (Optional/Conditional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specific Vaccine (Optional)</label>
          <select
            name="vaccine"
            value={formData.vaccine}
            onChange={handleChange}
            disabled={!formData.disease} // Enable only if a disease is selected
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {availableVaccines.map(v => <option key={v} value={v}>{v || '-- Any Vaccine --'}</option>)}
          </select>
        </div>

        {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(statusOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
            </select>
          </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        disabled={isSubmitDisabled}
      >
        Add Vaccination Filter
      </button>
    </div>
  );
};

// --- Other Filter Components (PurposeFilter, Diagnosis, Prescriptions, Referrals, StatutoryForms) ---
// --- Ensure they follow the pattern: ---
// --- 1. Manage their own state ---
// --- 2. Call addFilter with a well-structured object ---
// --- 3. Reset their state after submission ---
// --- 4. Disable submit button if inputs are invalid/incomplete ---

// Example Placeholder for StatutoryForms
const StatutoryForms = ({ addFilter }) => {
    const [formType, setFormType] = useState('');
     const handleSubmit = () => {
        if(formType){
            addFilter({ statutoryFormType: formType });
            setFormType('');
        } else {
            alert("Please select a form type.");
        }
    }
     return (
        <div className="space-y-4">
            <p className="text-gray-600">Statutory form filters are not yet fully implemented.</p>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Form Type (Example)</label>
                <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select --</option>
                    <option value="Form3A">Form 3A</option>
                    <option value="Form17">Form 17</option>
                     {/* Add actual form types */}
                </select>
            </div>
             <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={!formType}
                >
                Add Statutory Form Filter
            </button>
        </div>
    );
 }

const data = {
  "Preventive Visit": {
    "Medical Examination": [
      "Pre Employment",
      "Pre Employment (Food Handler)",
      "Pre Placement",
      "Annual / Periodical",
      "Periodical (Food Handler)",
      { "Camps (Mandatory)": ["Hospital Name"] }, // Structure might need clarification for filtering
      "Camps (Optional)"
    ],
    "Periodic Work Fitness": [
      { "Special Work Fitness": ["Nature Of Job"] }, // Structure might need clarification
      { "Special Work Fitness (Renewal)": ["Nature Of Job"] },
    ],
    "Fitness After Medical Leave": ["Fitness After Medical Leave"], // Simple string array
    "Mock Drill": ["Mock Drill"],
    "BP Sugar Check (Normal Value)": ["BP Sugar Check (Normal Value)"]
  },
  "Curative Visit": {
    "Outpatient": [
      "Illness",
      "Over Counter Illness",
      "Injury",
      "Over Counter Injury",
      "Follow-up Visits", // Corrected property name if needed
      "BP Sugar Chart",
      "Injury Outside the Premises",
      "Over Counter Injury Outside the Premises"
    ],
    "Alcohol Abuse": ["Alcohol Abuse"]
  }
};


function PurposeFilter({ addFilter }) {
    const [formData, setFormData] = useState({
        fromDate: "",
        toDate: "",
        purpose: "", // 'Preventive Visit' or 'Curative Visit'
        subcategory: "", // e.g., 'Medical Examination', 'Outpatient'
        specificCategory: "", // e.g., 'Pre Employment', 'Illness'
        // Add fields for nested details if needed (e.g., hospitalName, natureOfJob)
        // hospitalName: "",
        // natureOfJob: "",
    });


    const { fromDate, toDate, purpose, subcategory, specificCategory } = formData;

    const subcategories = purpose ? Object.keys(data[purpose] || {}) : [];
    const specificCategoriesRaw = purpose && subcategory ? (data[purpose]?.[subcategory] || []) : [];

    // Process specific categories to get flat list of strings
    const specificCategoryOptions = specificCategoriesRaw.flatMap(item => {
        if (typeof item === 'string') {
            return item;
        } else if (typeof item === 'object' && item !== null) {
            // For objects like { "Camps (Mandatory)": [...] }, return the key
             return Object.keys(item)[0];
        }
        return []; // Skip unexpected types
    });


     const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            // Reset dependent fields on change
            if (name === 'purpose') {
                newState.subcategory = "";
                newState.specificCategory = "";
            } else if (name === 'subcategory') {
                newState.specificCategory = "";
            }
            return newState;
        });
    };


    const handleSubmit = () => {
        // Construct the filter payload, omitting empty values
        const purposeFilter = {};
        if (fromDate) purposeFilter.fromDate = fromDate;
        if (toDate) purposeFilter.toDate = toDate;
        if (purpose) purposeFilter.type_of_visit = purpose; // Map state name to data field name
        if (subcategory) purposeFilter.register = subcategory; // Map state name to data field name
        if (specificCategory) purposeFilter.specificCategory = specificCategory;
        // Add hospitalName, natureOfJob etc. if they are captured in state

         // Basic date validation
        if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            alert("'From Date' cannot be after 'To Date'.");
            return;
        }


        if (Object.keys(purposeFilter).length > 0) {
            addFilter({ purpose: purposeFilter }); // Wrap under 'purpose' key
        } else {
             alert("Please select at least one purpose criterion or date range.");
        }

         // Reset form
         setFormData({ fromDate: "", toDate: "", purpose: "", subcategory: "", specificCategory: "" });
    };

     // Determine if submit should be disabled
     const isSubmitDisabled = !fromDate && !toDate && !purpose && !subcategory && !specificCategory;


    return (
        <div className="space-y-4">
        {/* Date Range */}
        <fieldset className="border p-4 rounded-md">
             <legend className="text-lg font-semibold px-2">Date Range (Optional)</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={fromDate}
                        onChange={handleChange}
                    />
                </div>
                 <div>
                     <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                        type="date"
                        id="toDate"
                        name="toDate"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={toDate}
                        onChange={handleChange}
                         min={fromDate || undefined} // Prevent selecting To date before From date
                    />
                </div>
            </div>
        </fieldset>


        {/* Purpose Selection */}
         <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">Visit Purpose</legend>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                    <select
                    id="purpose"
                    name="purpose"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={purpose}
                    onChange={handleChange}
                    >
                    <option value="">-- Select Type --</option>
                    {Object.keys(data).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                    </select>
                </div>

                {/* Subcategory Selection */}
                <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Register / Subcategory</label>
                    <select
                    id="subcategory"
                    name="subcategory"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={subcategory}
                    onChange={handleChange}
                    disabled={!purpose} // Disable if no purpose selected
                    >
                    <option value="">-- Select Subcategory --</option>
                    {subcategories.map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                    </select>
                </div>

                {/* Specific Category Selection */}
                <div>
                    <label htmlFor="specificCategory" className="block text-sm font-medium text-gray-700 mb-1">Specific Reason / Category</label>
                    <select
                    id="specificCategory"
                    name="specificCategory"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    value={specificCategory}
                    onChange={handleChange}
                    disabled={!subcategory || specificCategoryOptions.length === 0} // Disable if subcategory not selected or no options
                    >
                    <option value="">-- Select Specific Reason --</option>
                    {specificCategoryOptions.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                    </select>
                     {/* Here you might add conditional inputs based on specificCategory */}
                    {/* e.g., if specificCategory === 'Camps (Mandatory)', show Hospital Name input */}
                </div>
            </div>
        </fieldset>


        {/* Submit Button */}
        <button
            onClick={handleSubmit}
             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isSubmitDisabled} // Disable if nothing is selected/entered
        >
            Add Purpose Filter
        </button>
        </div>
    );
}

const Diagnosis = ({addFilter}) =>{
  const [formData, setFormData] = useState({
    disease: "", // ICD code or disease name
    notable_remarks: "" // Yes/No or specific remark text? Assuming Yes/No for filter
  });

   // Example options - replace with actual data source if possible
   const diseaseOptions = ["", "Covid-19", "Hepatitis B", "Influenza", "Hypertension", "Diabetes Mellitus", "Asthma"]; // Add more
   const remarksOptions = { "": "Any", Yes: "Yes", No: "No" };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default if wrapped in a form
     // Filter out empty values
     const filteredData = Object.fromEntries(
       Object.entries(formData).filter(([_, value]) => value !== "")
     );

     if (Object.keys(filteredData).length > 0) {
        addFilter(filteredData); // Send flat object { disease: "...", notable_remarks: "..." }
     } else {
        alert("Please select a Disease or Notable Remarks status.");
     }

    // Reset form
    setFormData({ disease: "", notable_remarks: "" });
  };

   // Determine if submit should be disabled
   const isSubmitDisabled = !formData.disease && !formData.notable_remarks;

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Disease Selection */}
            <div>
                <label htmlFor="disease" className="block text-sm font-medium text-gray-700 mb-1">
                Disease / Diagnosis
                </label>
                {/* Consider using an Autocomplete component here if list is very long */}
                <select
                name="disease"
                id="disease"
                value={formData.disease}
                onChange={handleChange}
                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                 {diseaseOptions.map(d => <option key={d} value={d}>{d || '-- Select Disease --'}</option>)}
                </select>
            </div>

             {/* Notable Remarks Selection */}
            <div>
                <label htmlFor="notable_remarks" className="block text-sm font-medium text-gray-700 mb-1">
                Notable Remarks Present?
                </label>
                <select
                name="notable_remarks"
                id="notable_remarks"
                value={formData.notable_remarks}
                onChange={handleChange}
                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(remarksOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
                </select>
            </div>
        </div>

      <button
        onClick={handleSubmit}
         className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
         disabled={isSubmitDisabled}
      >
        Add Diagnosis/Remarks Filter
      </button>
    </div>
  );
};

const Prescriptions = ({addFilter}) =>{
  const [formData, setFormData] = useState({
    // Representing as presence filters (Yes/No) or specific drug name?
    // Assuming specific drug name for now. Use Autocomplete for large lists.
    tablets: "",
    injections: "",
    creams: "",
    others: "",
    // notes: "", // Filtering by free text notes is difficult and often slow
  });

   // Example options - replace with actual drug lists (potentially fetched)
   const tabletOptions = ["", "Aspirin", "Ibuprofen", "Paracetamol", "Metformin", "Amlodipine"];
   const injectionOptions = ["", "Insulin", "Adrenaline", "Morphine", "Antibiotic X"];
   const creamOptions = ["", "Hydrocortisone", "Clotrimazole", "Mupirocin"];
   const otherOptions = ["", "Syrup A", "Inhaler B", "Eye Drops C"];


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     // Filter out empty values
     const filteredData = Object.fromEntries(
       Object.entries(formData).filter(([key, value]) => value !== "") // Removed notes filter
     );

      if (Object.keys(filteredData).length > 0) {
        // Send as a flat object, e.g., { tablets: "Aspirin", injections: "Insulin" }
        addFilter(filteredData);
     } else {
        alert("Please select at least one medication type.");
     }

    // Reset form
    setFormData({ tablets: "", injections: "", creams: "", others: "" });
  };

   // Determine if submit should be disabled
    const isSubmitDisabled = Object.values(formData).every(value => value === "");


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Tablets */}
        <div>
            <label htmlFor="tablets" className="block text-sm font-medium text-gray-700 mb-1">
            Tablets Prescribed
            </label>
            <select
            name="tablets"
            id="tablets"
            value={formData.tablets}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            {tabletOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Tablet --'}</option>)}
            </select>
        </div>

         {/* Injections */}
        <div>
            <label htmlFor="injections" className="block text-sm font-medium text-gray-700 mb-1">
            Injections Prescribed
            </label>
            <select
            name="injections"
            id="injections"
            value={formData.injections}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            {injectionOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Injection --'}</option>)}
            </select>
        </div>

         {/* Creams */}
        <div>
            <label htmlFor="creams" className="block text-sm font-medium text-gray-700 mb-1">
            Creams/Ointments Prescribed
            </label>
            <select
            name="creams"
            id="creams"
            value={formData.creams}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
             {creamOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Cream --'}</option>)}
            </select>
        </div>

         {/* Others */}
        <div>
            <label htmlFor="others" className="block text-sm font-medium text-gray-700 mb-1">
            Other Medications Prescribed
            </label>
            <select
            name="others"
            id="others"
            value={formData.others}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            {otherOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Other --'}</option>)}
            </select>
        </div>
      </div>
      {/* Notes field removed for filtering */}
      {/* <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Filtering by notes is generally not feasible)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled // Disable notes for filtering purposes
        ></textarea>
      </div> */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        disabled={isSubmitDisabled}
      >
        Add Prescription Filter
      </button>
    </div>
  );
}

const Referrals = ({ addFilter }) => {
  // Simplified state for filtering purposes
  const [formData, setFormData] = useState({
      referred: "", // Yes/No - Was a referral made?
      caseType: "", // e.g., 'diabetes', 'hypertension'
      speciality: "", // e.g., 'Cardiology', 'Endocrinology'
      hospitalName: "", // Specific hospital name
      // followUpDateFrom: "", // Optional: Date range for follow-up
      // followUpDateTo: "",
  });


  const caseTypeOptions = ["", "Diabetes", "Hypertension", "Cardiac", "Orthopedic", "Neurology", "ENT", "Ophthalmology", "Other"]; // Added more
  const specialityOptions = ["", "Cardiology", "Endocrinology", "Orthopedics", "Neurology", "ENT Specialist", "Ophthalmologist", "General Surgery", "Internal Medicine", "Other"]; // Added more
  const yesNoOptions = { "": "Any", Yes: "Yes", No: "No" };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
     // Filter out empty values
     const filteredData = Object.fromEntries(
       Object.entries(formData).filter(([_, value]) => value !== "")
     );


     if (Object.keys(filteredData).length > 0) {
        // Send as a structured object under 'referrals' key
        addFilter({ referrals: filteredData });
     } else {
        alert("Please select at least one referral criterion.");
     }

     // Reset form
     setFormData({ referred: "", caseType: "", speciality: "", hospitalName: "" });
  };

  // Determine if submit should be disabled
  const isSubmitDisabled = Object.values(formData).every(value => value === "");

  // Note: Removed isDoctor check as this is the filter component, not the data entry form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Referral Made? */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Referral Made?
            </label>
            <select
                name="referred"
                value={formData.referred}
                onChange={handleChange}
                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
             {Object.entries(yesNoOptions).map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
            </select>
        </div>

         {/* Case Type */}
        <div>
          <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">
            Case Type (Reason for Referral)
          </label>
          <select
            id="caseType"
            name="caseType"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.caseType}
            onChange={handleChange}
          >
            {caseTypeOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Case Type --'}</option>)}
          </select>
        </div>
      </div>


       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Speciality */}
           <div>
                <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">
                Referred To Speciality
                </label>
                <select /* Changed input to select */
                id="speciality"
                name="speciality"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.speciality}
                onChange={handleChange}
                >
                 {specialityOptions.map(opt => <option key={opt} value={opt}>{opt || '-- Select Speciality --'}</option>)}
                </select>
            </div>

            {/* Hospital Name */}
            <div>
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                Referred To Hospital
                </label>
                {/* Consider Autocomplete if list is long */}
                <input
                id="hospitalName"
                type="text"
                name="hospitalName"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hospital name (if known)"
                value={formData.hospitalName}
                onChange={handleChange}
                />
            </div>
        </div>

         {/* Optional Follow-up Date Range */}
         {/*
         <fieldset className="border p-4 rounded-md">
             <legend className="text-lg font-semibold px-2">Follow-up Date Range (Optional)</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"> ... date inputs ... </div>
         </fieldset>
         */}


      <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50" disabled={isSubmitDisabled}>
        Add Referral Filter
      </button>
    </form>
  );
};


export default RecordsFilters;
