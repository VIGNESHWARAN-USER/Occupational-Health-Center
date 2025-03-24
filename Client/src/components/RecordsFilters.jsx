import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar"; // Keep if you intend to use this
import { useNavigate } from "react-router-dom"; // Keep if you intend to use this

const filterSections = [
  { id: "employementstatus", label: "Employement Status" },
  { id: "personaldetails", label: "Personal Details" },
  { id: "employementdetails", label: "Employement Details" },
  { id: "medicalhistory", label: "Medical History" },
  { id: "vaccination", label: "Vaccination" },
  { id: "purpose", label: "Purpose Filter" },
  { id: "vitals", label: "Vitals" },
  { id: "investigations", label: "Investigations" },
  { id: "diagnosis", label: "Diagnosis" },
  { id: "fitness", label: "Fitness" },
  { id:"prescriptions", label: "Prescriptions" },
  { id: "referrals", label: "Referrals" },
  { id: "notableremarks", label: "Notable Remarks" },
  { id: "statutoryforms", label: "Statutory Forms" },
];

const RecordsFilters = () => {
  //const accessLevel = localStorage.getItem("accessLevel"); // Remove backend reference
  const navigate = useNavigate(); // Keep if you intend to use this
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  //const [employees, setEmployees] = useState([]);  // Remove backend reference
  //const [filteredEmployees, setFilteredEmployees] = useState([]); // Remove backend reference
  //const [loading, setLoading] = useState(false); // Remove backend reference
  const [selectedRole, setSelectedRole] = useState("");

  // Remove useEffect and axios calls

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleFilterClick = (section) => {
    setSelectedSection(section);
  };

  const removeFilter = (section) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((item) => item !== section)
    );
  };

  // Removed the useEffect that calls applyFilters
  // Removed the applyFilters function

  const addFilter = (formData) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = [...prevFilters];
      Object.entries(formData).forEach(([key, value]) => {
        let existingIndex;
        if (
          key !== "param" &&
          key !== "investigation" &&
          key !== "fitness" &&
          key !== "smoking" &&
          key !== "alcohol" &&
          key !== "paan" &&
          key !== "diet" &&
          key !== "drugAllergy" &&
          key !== "foodAllergy" &&
          key !== "otherAllergies" &&
          key !== "surgicalHistory" &&
          key != "purpose"
        ) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key

          );
        } else if (key === "param") {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === value.form
          );
        } else if (key === "investigation") {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === value.form
          );
        } else if (key === "fitness") {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        }  else if (key === "smoking" && value.length > 0) {
          console.log(value)
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "alcohol" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "paan" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "diet" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "drugAllergy" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "foodAllergy" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "otherAllergies" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "surgicalHistory" && value.length > 0) {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        } else if (key === "purpose") {
          existingIndex = updatedFilters.findIndex(
            (filter) => Object.keys(filter)[0] === key
          );
        }
        if (existingIndex !== -1) {
          updatedFilters[existingIndex] = { [key]: value };
        } else {
          updatedFilters.push({ [key]: value });
        }
      });
      return updatedFilters;
    });
  };


  return (
    <div className="h-screen bg-[#8fcadd] flex">
      <Sidebar />
      <div className="h-screen overflow-auto flex w-4/5 flex-col">
        <div className="p-4 flex flex-wrap gap-2 bg-gray-100 rounded-xl border-gray-300">
          {selectedFilters.length > 0 ? (
            selectedFilters.map((filter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full shadow"
              >
                {(() => {
                  const filterKey = Object.keys(filter)[0];
                  const filterValue = Object.values(filter)[0];

                  if (filterKey === "param") {
                    return `${filterKey.toUpperCase()}: ${filterValue.param} ${filterValue.from} - ${filterValue.to}`;
                  } else if (filterKey == "investigation") {
                    return `investigation : ${filterValue.form} ${filterValue.param} ${filterValue.from} - ${filterValue.to}`;
                  } else if (filterKey === "fitness") {
                    const fitnessDetails = Object.entries(filterValue)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ");
                    return `Fitness: ${fitnessDetails}`;
                  } else if (filterKey === "smoking") {
                    return `Smoking: ${filterValue}`;
                  } else if (filterKey === "alcohol") {
                    return `Alcohol: ${filterValue}`;
                  } else if (filterKey === "paan") {
                    return `Paan: ${filterValue}`;
                  } else if (filterKey === "diet") {
                    return `Diet: ${filterValue}`;
                  } else if (filterKey === "drugAllergy") {
                    return `Drug Allergy: ${filterValue}`;
                  } else if (filterKey === "foodAllergy") {
                    return `Food Allergy: ${filterValue}`;
                  } else if (filterKey === "otherAllergies") {
                    return `Other Allergies: ${filterValue}`;
                  } else if (filterKey === "surgicalHistory") {
                    return `Surgical History: ${filterValue}`;
                  } else {
                    return `${filterKey.toUpperCase()} : ${filterValue}`;
                  }
                })()}
                <X
                  size={16}
                  className="ml-2 cursor-pointer"
                  onClick={() => removeFilter(filter)}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No filters selected</p>
          )}
        </div>

        <div className="flex m-4 me-8 gap-4 my-4"> {/* Modified grid layout */}
            <select
                className="w-1/4 p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleRoleChange}
                value={selectedRole}
            >
                <option value="">Overall</option>
                <option value="Employee">Employee</option>
                <option value="Contractor">Contractor</option>
                <option value="Visitor">Visitor</option>
            </select>
          
          <select
            className="w-4/5 p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterClick(e.target.value)}
          >
            <option value="" disabled selected>
              Select Filters
            </option>
            {filterSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4">
          <AnimatePresence>
            {selectedSection && (
              <motion.div
                key={selectedSection}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-white shadow rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {
                    filterSections.find((f) => f.id === selectedSection)
                      ?.label
                  }
                </h2>
                {selectedSection === "employementstatus" ? (
                  <EmployementStatus addFilter={addFilter} /> 
                ) : null}
                {selectedSection === "personaldetails" ? (
                  <PersonalDetails addFilter={addFilter} />
                ) : null}
                {selectedSection === "employementdetails" ? (
                  <EmploymentDetails addFilter={addFilter} />
                ) : null}
                {selectedSection === "vitals" ? (
                  <Vitals addFilter={addFilter} />
                ) : null}
                {selectedSection === "fitness" ? (
                  <Fitness addFilter={addFilter} />
                ) : null}
                {selectedSection === "medicalhistory" ? (
                  <MedicalHistoryForm addFilter={addFilter} />
                ) : null}
                {selectedSection === "investigations" ? (
                  <Investigations addFilter={addFilter} />
                ) : null}
                {selectedSection === "vaccination" ? (
                  <VaccinationForm addFilter={addFilter} />
                ) : null}
                {selectedSection === "purpose" ? (
                  <PurposeFilter addFilter={addFilter} />
                ) : null}
                {selectedSection === "diagnosis" ? (
                  <Diagnosis addFilter={addFilter} />
                ) : null}
                {selectedSection === "prescriptions" ? (
                  <Prescriptions addFilter={addFilter} />
                ) : null}
                {selectedSection === "referrals" ? (
                  <Referrals addFilter={addFilter} />
                ) : null}
                {selectedSection === "notableremarks" ? (
                  <NotableRemarks addFilter={addFilter} />
                ) : null}
                {selectedSection === "statutoryforms" ? (
                  <StatutoryForms addFilter={addFilter} />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Display Employee Data in Table */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Employee Records</h2>
          <div className="mt-6 overflow-auto max-h-[400px] bg-gray-50 rounded-lg p-4 shadow-md">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
               
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No employee found
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


const data = {
  "Preventive Visit": {
    "Medical Examination": [
      "Pre Employment",
      "Pre Employment (Food Handler)",
      "Pre Placement",
      "Annual / Periodical",
      "Periodical (Food Handler)",
      { "Camps (Mandatory)": ["Hospital Name"] },
      "Camps (Optional)"
    ],
    "Periodic Work Fitness": [
      { "Special Work Fitness": ["Nature Of Job"] },
      { "Special Work Fitness (Renewal)": ["Nature Of Job"] },
    ],
    "Fitness After Medical Leave": ["Fitness After Medical Leave"],
    "Mock Drill": ["Mock Drill"],
    "BP Sugar Check (Normal Value)": ["BP Sugar Check (Normal Value)"]
  },
  "Curative Visit": {
    "Outpatient": [
      "Illness",
      "Over Counter Illness",
      "Injury",
      "Over Counter Injury",
      "Follow-up Visits",
      "BP Sugar Chart",
      "Injury Outside the Premises",
      "Over Counter Injury Outside the Premises"
    ],
    "Alcohol Abuse": ["Alcohol Abuse"]
  }
};

function PurposeFilter({ addFilter }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [specificCategory, setSpecificCategory] = useState("");

  const handleSubmit = () => {
    const purposeFilter = {
      type_of_visit: purpose,
      register: subcategory,
      specificCategory: specificCategory,
      fromDate: fromDate,
      toDate: toDate
    };

    addFilter({ purpose: purposeFilter });
  };

  const handleFilterClick = () => {
    handleSubmit();
  }

  const getSpecificCategories = () => {
    if (!purpose || !subcategory) return [];

    const subcategoryData = data[purpose][subcategory];

    if (!subcategoryData) return [];

    const categories = subcategoryData.flatMap(item => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'object' && item !== null) {
        return Object.keys(item);
      }
      return [];
    });

    return categories;
  };


  return (
    <div className="">
      

      {/* Date Range */}
      <div className="space-y-2">
        <label htmlFor="dateRange" className="block text-gray-700 text-sm font-bold">Date Range</label>
        <div className="flex space-x-4">
          <input
            type="date"
            id="fromDate"
            className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            id="toDate"
            className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>
    <div className="flex justify-between items-center py-4">
      {/* Purpose Selection */}
      <div className="space-y-2">
        <label htmlFor="purpose" className="block text-gray-700 text-sm font-bold">Purpose</label>
        <select
          id="purpose"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
          }}
        >
          <option value="">Select Purpose</option>
          {Object.keys(data).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* Subcategory Selection */}
      <div className="space-y-2">
        <label htmlFor="subcategory" className="block text-gray-700 text-sm font-bold">Subcategory</label>
        <select
          id="subcategory"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={subcategory}
          onChange={(e) => {
            setSubcategory(e.target.value);
          }}
          disabled={!purpose} // Disable if no purpose selected
        >
          <option value="">Select Subcategory</option>
          {purpose && Object.keys(data[purpose]).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* Specific Category Selection */}
      <div className="space-y-2">
        <label htmlFor="specificCategory" className="block text-gray-700 text-sm font-bold">Specific Category</label>
        <select
          id="specificCategory"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={specificCategory}
          onChange={(e) => setSpecificCategory(e.target.value)}
          disabled={!purpose || !subcategory || getSpecificCategories().length === 0} // Disable if purpose or subcategory not selected or no specific categories
        >
          <option value="">Select Specific Category</option>
          {getSpecificCategories().map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      </div>
      {/* Submit Button */}
      <button
        onClick={handleFilterClick}
        className="w-full py-3 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={!purpose} // Disable if no purpose is selected
      >
        Apply Filter
      </button>
    </div>
  );
}



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
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
    addFilter(filteredData);
  };

  const showTransferredTo = formData.status === "transferred_to";

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6">
      {/* Employment Status Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Employment Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700">Transferred To</label>
          <input
            type="text"
            name="transferred_to"
            value={formData.transferred_to}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Department"
          />
        </div>
      )}

      {/* Date Range Inputs (Conditional) */}
      {!showTransferredTo && (
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="date"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="date"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        disabled={formData.status === "" && formData.transferred_to ==="" && formData.from === ""}
      >
        Add to Filter
      </button>
    </div>
  );
};


const Diagnosis = ({addFilter}) =>{

}

const Prescriptions = ({addFilter}) =>{

}

const Referrals = ({addFilter}) =>{

}

const NotableRemarks = ({addFilter}) =>{

}

const StatutoryForms = ({addFilter}) =>{

}

const PersonalDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    ageFrom: "",
    ageTo: "",
    sex: "",
    bloodgrp: "",
    marital_status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = () => {
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
    addFilter(filteredData);
  };

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
      {/* Age Range Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Age From</label>
        <input
          type="number"
          name="ageFrom"
          value={formData.ageFrom}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="From Age"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Age To</label>
        <input
          type="number"
          name="ageTo"
          value={formData.ageTo}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="To Age"
        />
      </div>

      {/* Sex Input */}
      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
          Sex
        </label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Others</option>
        </select>
      </div>

      {/* Blood Group Input */}
      <div>
        <label htmlFor="bloodgrp" className="block text-sm font-medium text-gray-700">
          Blood Group
        </label>
        <select
          name="bloodgrp"
          value={formData.bloodgrp}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Blood Group</option>
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

      <div>
        <label
          htmlFor="marital_status"
          className="block text-sm font-medium text-gray-700"
        >
          Marital Status
        </label>
        <select
          name="marital_status"
          value={formData.marital_status}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Separated">Separated</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>
    </div>
  );
};




const EmploymentDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    designation: "",
    department: "",
    moj: "",
    employer: "",
    doj: "",
    job_nature: "",
  });

  const employmentOptions = {
    "JSW Steel": "JSW Steel",
    "JSW Cement": "JSW Cement",
    "JSW Foundation": "JSW Foundation",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = () => {
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
    addFilter(filteredData);
  };

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">

    {/* Employment Status Input */}
    <div>
        <label
          htmlFor="employer"
          className="block text-sm font-medium text-gray-700"
        >
          Employer
        </label>
        <select
          name="employer"
          value={formData.employer}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Employer</option>
          {Object.entries(employmentOptions).map(([key, value]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="job_nature"
          className="block text-sm font-medium text-gray-700"
        >
          Mode of Joining
        </label>
        <select
          name="moj"
          value={formData.moj}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Mode of Joining</option>
          <option value="New Joinee">New Joinee</option>
          <option value="Transfer">Transfer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
        <input
          type="date"
          name="doj"
          value={formData.doj}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* designation Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Designation
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Designation"
        />
      </div>

      {/* Department Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Department"
        />
      </div>

      <div>
        <label
          htmlFor="job_nature"
          className="block text-sm font-medium text-gray-700"
        >
          Job Nature
        </label>
        <select
          name="job_nature"
          value={formData.job_nature}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Job Nature</option>
          <option value="Contract">Contract</option>
          <option value="Permanent">Permanent</option>
          <option value="Consultant">Consultant</option>
        </select>
      </div>

      

      

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>
    </div>
  );
};



const Vitals = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    param: "systolic",
    bmiCategory: "", // New state for BMI category
    from: "", // Keep for other numerical vitals
    to: "", // Keep for other numerical vitals
  });

  const bmiOptions = {
    "Under weight": "Under weight",
    Normal: "Normal",
    "Over weight": "Over weight",
    Obese: "Obese",
    "Extremely Obese": "Extremely Obese",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { param, bmiCategory, from, to } = formData;

    if (param === "bmi" && bmiCategory) {
      addFilter({ param: { param, value: bmiCategory } }); // Send only category for BMI
    } else if (param && param !== "bmi" && from && to) {
      // For other numerical vitals
      addFilter({ param: { param, from, to } });
    }
  };

  const showBmiDropdown = formData.param === "bmi";
  const showRangeInputs = formData.param !== "bmi" && formData.param !== "";

  return (
    <div className="grid grid-cols-3 gap-x-10 gap-y-6">
      <div>
        <label htmlFor="param" className="block text-sm font-medium text-gray-700">
          Select Parameter
        </label>
        <select
          name="param"
          value={formData.param}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="systolic">Systolic</option>
          <option value="diastolic">Diastolic</option>
          <option value="pulse">Pulse</option>
          <option value="respiratory_rate">Respiratory rate</option>
          <option value="temperature">Temperature</option>
          <option value="spO2">SpO2</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
          <option value="bmi">BMI</option>
        </select>
      </div>

      {/* BMI Category Dropdown */}
      {showBmiDropdown && (
        <div>
          <label htmlFor="bmiCategory" className="block text-sm font-medium text-gray-700">
            Select BMI Category
          </label>
          <select
            name="bmiCategory"
            value={formData.bmiCategory}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select BMI Category</option>
            {Object.entries(bmiOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      )}

      {showRangeInputs && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Range from</label>
            <input
              type="number"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Range to</label>
            <input
              type="number"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To"
            />
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        disabled={formData.param === "" || (formData.param === "bmi" && !formData.bmiCategory) || (formData.param !== "bmi" && (!formData.from || !formData.to))}
      >
        Add to Filter
      </button>
    </div>
  );
};

  
  
  const formOptions = {
    haematology: [
      "hemoglobin",
      "hemoglobin_comments",
      "total_rbc",
      "total_rbc_comments",
      "total_wbc",
      "total_wbc_comments",
      "neutrophil",
      "neutrophil_comments",
      "monocyte",
      "monocyte_comments",
      "pcv",
      "pcv_comments",
      "mcv",
      "mcv_comments",
      "mch",
      "mch_comments",
      "lymphocyte",
      "lymphocyte_comments",
      "esr",
      "esr_comments",
      "mchc",
      "mchc_comments",
      "platelet_count",
      "platelet_count_comments",
      "rdw",
      "rdw_comments",
      "eosinophil",
      "eosinophil_comments",
      "basophil",
      "basophil_comments",
      "peripheral_blood_smear_rbc_morphology",
      "peripheral_blood_smear_parasites",
      "peripheral_blood_smear_others",
    ],
    routine_sugar_tests: [
      `glucose_f`,
      `glucose_f_comments`,
      `glucose_pp`,
      `glucose_pp_comments`,
      `random_blood_sugar`,
      `random_blood_sugar_comments`,
      `estimated_average_glucose`,
      `estimated_average_glucose_comments`,
      `hba1c`,
      `hba1c_comments`,
    ],
    lipid_profile: [
      `calcium`,
      `calcium_comments`,
      `triglycerides`,
      `triglycerides_comments`,
      `hdl_cholesterol`,
      `hdl_cholesterol_comments`,
      `ldl_cholesterol`,
      `ldl_cholesterol_comments`,
      `chol_hdl_ratio`,
      `chol_hdl_ratio_comments`,
      `vldl_cholesterol`,
      `vldl_cholesterol_comments`,
      `ldl_hdl_ratio`,
      `ldl_hdl_ratio_comments`,
    ],
    liver_function_test: [
      `bilirubin_total`,
      `bilirubin_total_comments`,
      `bilirubin_direct`,
      `bilirubin_direct_comments`,
      `bilirubin_indirect`,
      `bilirubin_indirect_comments`,
      `sgot_ast`,
      `sgot_ast_comments`,
      `sgpt_alt`,
      `sgpt_alt_comments`,
      `alkaline_phosphatase`,
      `alkaline_phosphatase_comments`,
      `total_protein`,
      `total_protein_comments`,
      `albumin_serum`,
      `albumin_serum_comments`,
      `globulin_serum`,
      `globulin_serum_comments`,
      `alb_glob_ratio`,
      `alb_glob_ratio_comments`,
      `gamma_glutamyl_transferase`,
      `gamma_glutamyl_transferase_comments`,
    ],
    thyroid_function_test: [
      `emp_no`,
      `t3_triiodothyronine`,
      `t3_comments`,
      `t4_thyroxine`,
      `t4_comments`,
      `tsh_thyroid_stimulating_hormone`,
      `tsh_comments`,
    ],
    renal_function_test_electrolytes: [
      `urea`,
      `urea_comments`,
      `bun`,
      `bun_comments`,
      `calcium`,
      `calcium_comments`,
      `sodium`,
      `sodium_comments`,
      `potassium`,
      `potassium_comments`,
      `phosphorus`,
      `phosphorus_comments`,
      `serum_creatinine`,
      `serum_creatinine_comments`,
      `uric_acid`,
      `uric_acid_comments`,
      `chloride`,
      `chloride_comments`,
    ],
    autoimmune_test: [
      `glucose_f`,
      `glucose_f_comments`,
      `glucose_pp`,
      `glucose_pp_comments`,
      `random_blood_sugar`,
      `random_blood_sugar_comments`,
      `estimated_average_glucose`,
      `estimated_average_glucose_comments`,
      `hba1c`,
      `hba1c_comments`,
    ],
    coagulation_test: [
      `prothrombin_time`,
      `prothrombin_time_comments`,
      `pt_inr`,
      `pt_inr_comments`,
      `clotting_time`,
      `clotting_time_comments`,
      `bleeding_time`,
      `bleeding_time_comments`,
    ],
    enzymes_cardiac_profile: [
      `acid_phosphatase`,
      `acid_phosphatase_comments`,
      `adenosine_deaminase`,
      `adenosine_deaminase_comments`,
      `amylase`,
      `amylase_comments`,
      `ecg`,
      `ecg_comments`,
      `troponin_t`,
      `troponin_t_comments`,
      `cpk_total`,
      `cpk_total_comments`,
      `echo`,
      `echo_comments`,
      `lipase`,
      `lipase_comments`,
      `cpk_mb`,
      `cpk_mb_comments`,
      `tmt_normal`,
      `tmt_normal_comments`,
    ],
    urine_routine: [
      `colour`,
      `colour_comments`,
      `appearance`,
      `appearance_comments`,
      `reaction_ph`,
      `reaction_ph_comments`,
      `specific_gravity`,
      `specific_gravity_comments`,
      `crystals`,
      `crystals_comments`,
      `bacteria`,
      `bacteria_comments`,
      `protein_albumin`,
      `protein_albumin_comments`,
      `glucose_urine`,
      `glucose_urine_comments`,
      `ketone_bodies`,
      `ketone_bodies_comments`,
      `urobilinogen`,
      `urobilinogen_comments`,
      `casts`,
      `casts_comments`,
      `bile_salts`,
      `bile_salts_comments`,
      `bile_pigments`,
      `bile_pigments_comments`,
      `wbc_pus_cells`,
      `wbc_pus_cells_comments`,
      `red_blood_cells`,
      `red_blood_cells_comments`,
      `epithelial_cells`,
      `epithelial_cells_comments`,
    ],
    serology: [
      `screening_hiv`,
      `screening_hiv_comments`,
      `occult_blood`,
      `occult_blood_comments`,
      `cyst`,
      `cyst_comments`,
      `mucus`,
      `mucus_comments`,
      `pus_cells`,
      `pus_cells_comments`,
      `ova`,
      `ova_comments`,
      `rbcs`,
      `rbcs_comments`,
      `others`,
      `others_comments`,
    ],
    motion: [
      `colour_motion`,
      `colour_motion_comments`,
      `appearance_motion`,
      `appearance_motion_comments`,
      `occult_blood`,
      `occult_blood_comments`,
      `cyst`,
      `cyst_comments`,
      `mucus`,
      `mucus_comments`,
      `pus_cells`,
      `pus_cells_comments`,
      `ova`,
      `ova_comments`,
      `rbcs`,
      `rbcs_comments`,
      `others`,
      `others_comments`,
    ],
    routine_culture_sensitivity_test: [
      `urine`,
      `urine_comments`,
      `motion`,
      `motion_comments`,
      `sputum`,
      `sputum_comments`,
      `blood`,
      `blood_comments`,
    ],
    mens_pack: [`psa`, `psa_comments`],
    womens_pack: [],
    occupational_profile: [],
    others_test: [],
    ophthalmic_report: [
      `vision`,
      `vision_comments`,
      `color_vision`,
      `color_vision_comments`,
    ],
    xray: [],
    usg: [
      `usg_abdomen`,
      `usg_abdomen_comments`,
      `usg_kub`,
      `usg_kub_comments`,
      `usg_pelvis`,
      `usg_pelvis_comments`,
      `usg_neck`,
      `usg_neck_comments`,
    ],
    ct: [],
    mri: [],
  };
  
  const Investigations = ({ addFilter }) => {
    const [formData, setFormData] = useState({
      form: "",
      param: "",
      from: "",
      to: "",
      status: "",
    });
  
    useEffect(() => {
      // Reset 'param' when 'form' changes
      setFormData((prev) => ({ ...prev, param: "" }));
    }, [formData.form]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = () => {
      const { form, param, from, to } = formData;
      if (param && from !== "" && to !== "") {
        addFilter({ investigation: { form, param, from, to } });
      }
    };
  
    return (
      <div className="grid grid-cols-3 gap-x-10 gap-y-6">
        {/* Form Select */}
        <div>
          <label htmlFor="form" className="block text-sm font-medium text-gray-700">
            Select Form
          </label>
          <select
            name="form"
            value={formData.form}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Form</option>
            {Object.keys(formOptions).map((key) => (
              <option key={key} value={key}>
                {key.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
  
        {/* Parameter Select */}
        <div>
          <label htmlFor="param" className="block text-sm font-medium text-gray-700">
            Select Parameter
          </label>
          <select
            name="param"
            value={formData.param}
            onChange={handleChange}
            disabled={!formData.form}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
          >
            <option value="">Select Parameter</option>
            {formData.form &&
              formOptions[formData.form].map((param) => (
                <option key={param} value={param}>
                  {param.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
          </select>
        </div>
  
        {/* Range from */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Range from</label>
          <input
            type="number"
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="From"
          />
        </div>
  
        {/* Range to */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Range to</label>
          <input
            type="number"
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="To"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="normal">Normal</option>
            <option value="abnormal">Abnormal</option>
          </select>
              </div>
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        >
          Add to Filter
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
      job_nature: "",
      overall_fitness: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = () => {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );
      addFilter({ fitness: filteredData });
    };
  
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Fitness Assessment
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Tremors */}
          <div>
            <label className="block font-medium">Tremors</label>
            <select
              name="tremors"
              value={formData.tremors}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
  
          {/* Romberg Test */}
          <div>
            <label className="block font-medium">Romberg Test</label>
            <select
              name="romberg_test"
              value={formData.romberg_test}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
  
          {/* Acrophobia */}
          <div>
            <label className="block font-medium">Acrophobia</label>
            <select
              name="acrophobia"
              value={formData.acrophobia}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
  
          {/* Trendelenberg Test */}
          <div>
            <label className="block font-medium">Trendelenberg Test</label>
            <select
              name="trendelenberg_test"
              value={formData.trendelenberg_test}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
  
          {/* Job Nature */}
          <div>
            <label className="block font-medium">Job Nature</label>
            <select
              name="job_nature"
              value={formData.job_nature}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select</option>
              <option value="DeskJob">Desk Job</option>
<option value="Field Work">Field Work</option>
<option value="Manual Labor">Manual Labor</option>
</select>
</div>

{/* Overall Fitness */}
    <div>
      <label className="block font-medium">Overall Fitness</label>
      <select
        name="overall_fitness"
        value={formData.overall_fitness}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select</option>
        <option value="Fit">Fit</option>
        <option value="Conditionally Fit">Conditionally Fit</option>
        <option value="Unfit">Unfit</option>
      </select>
    </div>
  </div>

  <button
    onClick={handleSubmit}
    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
  >
    Add to Filter
  </button>
</div>);
};

const MedicalHistoryForm = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    smoking: "",
    alcohol: "",
    paan: "",
    diet: "",
    drugAllergy: "",
    foodAllergy: "",
    otherAllergies: "",
    surgicalHistory: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
    addFilter(filteredData);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 my-4">
        Personal History
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {/* Smoking */}
        <div>
          <label className="block font-medium">Smoking</label>
          <select
            name="smoking"
            value={formData.smoking}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Cessased">Cessased</option>
          </select>
        </div>

        {/* Alcohol */}
        <div>
          <label className="block font-medium">Alcohol</label>
          <select
            name="alcohol"
            value={formData.alcohol}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Cessased">Cessased</option>
          </select>
        </div>

        {/* Paan */}
        <div>
          <label className="block font-medium">Paan, beetal chewer</label>
          <select
            name="paan"
            value={formData.paan}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Cessased">Cessased</option>  
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="block font-medium">Food Pattern</label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Veg">Pure Veg</option>
            <option value="Non-Veg">Mixed Diet</option>
            <option value="Eggetarian">Eggetarian</option>
          </select>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">Personal Conditions Parameters</label>
          <select
            name="personalconditions"
            value={formData.personalconditions}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="HTN">HTN</option>
            <option value="DM">DM</option>
            <option value="Epileptic">Epileptic</option>
            <option value="Hyper thyroid">Hyper thyroid</option>
            <option value="Hypo thyroid">Hypo thyroid</option>
            <option value="Asthma">Asthma</option>
            <option value="CVS">CVS</option>
            <option value="CNS">CNS</option>
            <option value="RS">RS</option>
            <option value="GIT">GIT</option>
            <option value="KUB">KUB</option>
            <option value="CANCER">CANCER</option>
            <option value="Defective Colour Vision">Defective Colour Vision</option>
            <option value="OTHERS">OTHERS</option>
            <option value="Obstetric">Obstetric</option>
            <option value="Gynaec">Gynaec</option>    
          </select>
        </div>

        <div>
          <label className="block font-medium">Personal Conditions</label>
          <select
            name="personalconditionsans"
            value={formData.personalconditionsans}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        </div>
          {/* Surgical History */}
          <h2 className="text-xl font-semibold text-gray-800 my-4">
        Surgical History
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">Surgical History</label>
          <select
            name="surgicalHistory"
            value={formData.surgicalHistory}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
        <h2 className="text-xl font-semibold text-gray-800 my-4">
        Allergical History
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Drug Allergy */}
        <div>
          <label className="block font-medium">Drug Allergy</label>
          <select
            name="drugAllergy"
            value={formData.drugAllergy}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Food Allergy */}
        <div>
          <label className="block font-medium">Food Allergy</label>
          <select
            name="foodAllergy"
            value={formData.foodAllergy}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Other Allergies */}
        <div>
          <label className="block font-medium">Other Allergies</label>
          <select
            name="otherAllergies"
            value={formData.otherAllergies}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 my-4">
        Family History
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Family Conditions Parameters</label>
          <select
            name="personalconditions"
            value={formData.personalconditions}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="HTN">HTN</option>
            <option value="DM">DM</option>
            <option value="Epileptic">Epileptic</option>
            <option value="Hyper thyroid">Hyper thyroid</option>
            <option value="Hypo thyroid">Hypo thyroid</option>
            <option value="Asthma">Asthma</option>
            <option value="CVS">CVS</option>
            <option value="CNS">CNS</option>
            <option value="RS">RS</option>
            <option value="GIT">GIT</option>
            <option value="KUB">KUB</option>
            <option value="CANCER">CANCER</option>
            <option value="Defective Colour Vision">Defective Colour Vision</option>
            <option value="OTHERS">OTHERS</option>
            <option value="Obstetric">Obstetric</option>
            <option value="Gynaec">Gynaec</option>    
          </select>
        </div>
        
        <div>
          <label className="block font-medium">Family Conditions</label>
          <select
            name="personalconditionsans"
            value={formData.personalconditionsans}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Relation</label>
          <select
            name="personalconditionsans"
            value={formData.personalconditionsans}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
          </select>
        </div>
        </div>
      

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>
    </div>
  );
};

const VaccinationForm = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    disease: "",
    vaccine: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );

    addFilter(filteredData);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Vaccination Information
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Select Vaccine */}
        <div >
          <label className="block font-medium">Select Disease</label>
          <select
            name="disease"
            value={formData.disease}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Covid-19">Covid-19</option>
            <option value="Hepatitis B">Hepatitis B</option>
            <option value="Influenza">Influenza</option>
          </select>
        </div>

        {/* Select Vaccine */}
        <div >
          <label className="block font-medium">Select Vaccine</label>
          <select
            name="vaccine"
            value={formData.vaccine}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Covid-19">Covid-19</option>
            <option value="Hepatitis B">Hepatitis B</option>
            <option value="Influenza">Influenza</option>
          </select>
        </div>

        {/* Status */}
          <div className="">
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select</option>
              <option value="Full">Complete</option>
              <option value="Normal Doses">Incomplete</option>
            </select>
          </div>
          </div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add to Filter
          </button>
        </div>
  );
};

export default RecordsFilters;