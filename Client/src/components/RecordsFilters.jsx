import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const filterSections = [
  { id: "personaldetails", label: "Personal Details" },
  { id: "vitals", label: "Vitals" },
  { id: "fitness", label: "Fitness" },
  { id: "medicalhistory", label: "Medical History" },
  { id: "investigations", label: "Investigations" },
  { id: "vaccination", label: "Vaccination" },
  { id: "purpose", label: "Purpose Filter" }
];

const RecordsFilters = () => {
  const accessLevel = localStorage.getItem("accessLevel");
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // New state for role filter

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post("https://occupational-health-center-1.onrender.com/userData");
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchDetails();
  }, []);

  // Function to handle role selection
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

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, employees, selectedRole]); // Add selectedRole to dependency array

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

  const applyFilters = () => {
      let results = [...employees];

      // Role Filter
      if (selectedRole) {
          results = results.filter(employee => employee.role === selectedRole);
      }
       if (selectedFilters.length === 0) {
        setFilteredEmployees([...results]);
        return;
      }

      selectedFilters.forEach((filter) => {
        const key = Object.keys(filter)[0];
        const value = Object.values(filter)[0];
        console.log(key, value);
        results = results.filter((employee) => {
          if (key === "param") {
            // Special handling for vitals
            const { param, from, to } = value;
            if (
              !employee.vitals ||
              employee.vitals[param] === undefined ||
              employee.vitals[param] === null
            ) {
              return false; // If vitals data or the specific parameter is missing, skip this employee
            }

            const paramValue = parseFloat(employee.vitals[param]); // Convert vitals value to a number

            if (isNaN(paramValue)) {
              return false; // Skip if the value is not a number
            }

            const fromValue = parseFloat(from);
            const toValue = parseFloat(to);

            if (isNaN(fromValue) || isNaN(toValue)) {
              return true; // if from or to value is not valid number, skip filtering
            }

            return paramValue >= fromValue && paramValue <= toValue; // Check if the vitals parameter falls within the range
          } else if (key === "investigation") {
            const { form, param, from, to } = value;

            if (
              !employee[form] ||
              employee[form][param] === undefined ||
              employee[form][param] === null
            ) {
              return false;
            }

            const paramValue = parseFloat(employee[form][param]);

            if (isNaN(paramValue)) {
              return false;
            }

            const fromValue = parseFloat(from);
            const toValue = parseFloat(to);

            if (isNaN(fromValue) || isNaN(toValue)) {
              return true;
            }

            return paramValue >= fromValue && paramValue <= toValue;
          } else if (key === "fitness") {
            // Fitness Filter Logic
            if (!employee.fitnessassessment) {
              return false;
            }

            let matchesAll = true; // Assume it matches all filters until proven otherwise

            for (const assessmentKey in value) {
              if (value.hasOwnProperty(assessmentKey)) {
                const filterValue = value[assessmentKey];

                if (filterValue) {
                  // Only filter if there's a filter value
                  if (
                    employee.fitnessassessment[assessmentKey] !== filterValue
                  ) {
                    matchesAll = false; // If ANY filter fails, it's a mismatch
                    break; // No need to check other assessments, exit loop.
                  }
                }
              }
            }
            return matchesAll; // Return true only if ALL the filters match
          } else if (key === "smoking") {
            return employee.msphistory?.personal_history?.smoking?.yesNo === value.toLowerCase();
          } else if (key === "alcohol") {
            return employee.msphistory?.personal_history?.alcohol?.yesNo === value.toLowerCase();
          } else if (key === "paan") {
            return employee.msphistory?.personal_history?.paan?.yesNo === value.toLowerCase();
          } else if (key === "diet") {
            return employee.msphistory?.personal_history?.diet  === value.toLowerCase();
          }else if (key === "drugAllergy") {
            console.log(employee)
            return employee.msphistory?.allergy_fields?.drug?.yesNo === value.toLowerCase();
          } else if (key === "foodAllergy") {
            return employee.msphistory?.allergy_fields?.food?.yesNo === value.toLowerCase();
          } else if (key === "otherAllergies") {
            return employee.msphistory?.allergy_fields?.others?.yesNo === value.toLowerCase();
          } else if (key === "surgicalHistory") {
            if(value === "Yes" && employee.msphistory?.surgical_history?.children?.length > 0 ) return true;
            else if(value === "No" && employee.msphistory?.surgical_history?.children?.length === 0) return true;
            else return false;
          } else if (key === "purpose") {
            // Purpose Filter Logic
            const { type_of_visit, register } = value;

            return results.filter((employee) => {
             if(employee.dashboard){
                if (type_of_visit && employee.dashboard.type_of_visit !== type_of_visit) {
                return false;
              }
              if (register && employee.dashboard.register !== register) {
                return false;
              }
              return true;
             }

              return false;

            })
          }

          else {
            let empValue;
            if(key === "age")
            {
              const age = new Date().getFullYear() - new Date(employee.dob).getFullYear();
              if (typeof age === 'number' && typeof value === 'string' && String(age) === value) {
                empValue = age;
            }
              else empValue = null;
            }

            else empValue = employee[key];
            console.log(empValue)
            if (empValue === null || empValue === undefined) {
              return false;
            }

            if (typeof empValue === "object" ) {
              function checkNestedObject(obj, val) {
                for (const prop in obj) {
                  if (obj.hasOwnProperty(prop)) {
                    const nestedValue = obj[prop];
                    if (nestedValue === value) {
                      return true;
                    }
                  }
                }
                return false;
              }

              return checkNestedObject(empValue, value);
            } else {
              if((typeof empValue === 'number' && typeof value === 'string' ))
                return String(empValue) === value
              return empValue === value
            }
          }
        });
      });

      setFilteredEmployees(results);
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
                {selectedSection === "personaldetails" ? (
                  <PersonalDetails addFilter={addFilter} />
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.emp_no}
                      className="hover:bg-gray-100 transition duration-200"
                    >
                      <td className="px-6 py-4">{emp.emp_no}</td>
                      <td className="px-6 py-4">{emp.name}</td>
                      <td className="px-6 py-4">
                        {emp.dob
                          ? new Date().getFullYear() -
                            new Date(emp.dob).getFullYear()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">{emp.sex}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate("../employeeprofile", {
                              state: { data: emp },
                            })
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No employee found
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
  },
  "Separate (Unhealthy)": {
    "Special Medical Leave SML / Special Disability Leave SDL (2nd Phase)": []
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

const PersonalDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    age: "",
    sex: "",
    bloodgrp: "",
    marital_status: "",
    designation: "",
    department: "",
    moj: "",
    employer:"",
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
    console.log(e.target);
    setformData((prevFormData) => ({ ...prevFormData, [name]: value })); // Updated handleChange
  };

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
      {/* Age Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter age"
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
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Blood Group Input */}
      <div>
        <label htmlFor="bloodgrp" className="block text-sm font-medium text-gray-700">
          Blood Group
        </label>
        <input
          type="text"
          name="bloodgrp"
          value={formData.bloodgrp}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Blood Group"
          />
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
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
  
        {/* designation Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter designation"
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
          <label className="block text-sm font-medium text-gray-700">doj</label>
          <input
            type="date"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter age"
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
            <option value="">Select job_nature</option>
            <option value="Contract">Contract</option>
            <option value="Permanent">Permanent</option>
            <option value="Consultant">Consultant</option>
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
            <option value="">Select mode</option>
            <option value="New Joinee">New Joinee</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>
  
        {/* Employment Status Input */}
        <div>
          <label
            htmlFor="employmentStatus"
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
            <option value="">Select Employer Value</option>
            {Object.entries(employmentOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
  
        {/* Submit Button */}
        <button
          onClick={() => {
            const filteredData = Object.fromEntries(
              Object.entries(formData).filter(([_, value]) => value !== "")
            );
            addFilter(filteredData);
          }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        >
          Add to Filter
        </button>
      </div>
    );
  };
  const Vitals = ({ addFilter }) => {
    const [formData, setFormData] = useState({
      param: "",
      from: "",
      to: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = () => {
      const { param, from, to } = formData;
  
      if (param && from !== "" && to !== "") {
        addFilter({ param: { param, from, to } });
      }
    };
  
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
            <option value="">Select Parameter</option>
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

const VaccinationForm = ({ addFilter }) => {
const [formData, setFormData] = useState({
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
<div className="grid grid-cols-2 gap-6">
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
      <option value="Full">Full</option>
      <option value="Normal Doses">Partial</option>
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