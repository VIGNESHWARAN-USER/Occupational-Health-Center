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
  { id: "vaccination", label: "Vaccination" }
];

const RecordsFilters = () => {
  const accessLevel = localStorage.getItem("accessLevel");
  const navigate = useNavigate();
  if (accessLevel === "nurse" || accessLevel == "doctor") {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.post("http://localhost:8000/userData");
          setEmployees(response.data.data);
          console.log(response.data.data);
          setFilteredEmployees(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      };
      fetchDetails();
    }, []);

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
    }, [selectedFilters, employees]);

    const addFilter = (formData) => {
      setSelectedFilters((prevFilters) => {
        const updatedFilters = [...prevFilters];
        Object.entries(formData).forEach(([key, value]) => {
          let existingIndex;

          if (key !== "param" && key !== "investigation" && key !== "fitness") {
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
      if (selectedFilters.length === 0) {
        setFilteredEmployees([...employees]);
        return;
      }

      let results = [...employees];

      selectedFilters.forEach((filter) => {
        const key = Object.keys(filter)[0];
        const value = Object.values(filter)[0];

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
            return matchesAll;  // Return true only if ALL the filters match
          } else {
            let empValue = employee[key];

            if (empValue === null || empValue === undefined) {
              return false;
            }

            if (typeof empValue === "object") {
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
              return empValue === value;
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

          <div className="relative p-4">
            <select
              className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  } else {
    return (
      <section class="bg-white h-full flex items-center dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">
              404
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Something's missing.
            </p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we can't find that page. You'll find lots to explore on
              the home page.
            </p>
            <button
              onClick={() => navigate(-1)}
              class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Back
            </button>
          </div>
        </div>
      </section>
    );
  }
};

const PersonalDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    age: "",
    sex: "",
    bloodgrp: "",
    marital_status: "",
    designation: "",
    department: "",
    doj: "",
    job_nature: "",
    employmentStatus: "", // Added employmentStatus to formData
  });

  const employmentOptions = {
    Employed: "Employed",
    "Self-Employed": "Self-Employed",
    "Not Employed": "Not Employed",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Marital Status Input */}
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
          job_nature
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

      {/* Employment Status Input */}
      <div>
        <label
          htmlFor="employmentStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Employment Status
        </label>
        <select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Employment Status</option>
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
          <option value="repositoryrate">Repository rate</option>
          <option value="temperature">Temperature</option>
          <option value="spo2">SpO2</option>
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

const MedicalHistoryForm = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    smoking: "",
    alcohol: "",
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Medical History Form
      </h2>

      <div className="grid grid-cols-2 gap-6">
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
          </select>
        </div>

        <div>
          <label className="block font-medium">Alcohol Consumption</label>
          <select
            name="alcohol"
            value={formData.alcohol}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
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

const formOptions = {
  haematology: [
    "hemoglobin",
    "hemoglobin_unit",
    "hemoglobin_reference_range",
    "hemoglobin_comments",
    "total_rbc",
    "total_rbc_unit",
    "total_rbc_reference_range",
    "total_rbc_comments",
    "total_wbc",
    "total_wbc_unit",
    "total_wbc_reference_range",
    "total_wbc_comments",
    "neutrophil",
    "neutrophil_unit",
    "neutrophil_reference_range",
    "neutrophil_comments",
    "monocyte",
    "monocyte_unit",
    "monocyte_reference_range",
    "monocyte_comments",
    "pcv",
    "pcv_unit",
    "pcv_reference_range",
    "pcv_comments",
    "mcv",
    "mcv_unit",
    "mcv_reference_range",
    "mcv_comments",
    "mch",
    "mch_unit",
    "mch_reference_range",
    "mch_comments",
    "lymphocyte",
    "lymphocyte_unit",
    "lymphocyte_reference_range",
    "lymphocyte_comments",
    "esr",
    "esr_unit",
    "esr_reference_range",
    "esr_comments",
    "mchc",
    "mchc_unit",
    "mchc_reference_range",
    "mchc_comments",
    "platelet_count",
    "platelet_count_unit",
    "platelet_count_reference_range",
    "platelet_count_comments",
    "rdw",
    "rdw_unit",
    "rdw_reference_range",
    "rdw_comments",
    "eosinophil",
    "eosinophil_unit",
    "eosinophil_reference_range",
    "eosinophil_comments",
    "basophil",
    "basophil_unit",
    "basophil_reference_range",
    "basophil_comments",
    "peripheral_blood_smear_rbc_morphology",
    "peripheral_blood_smear_parasites",
    "peripheral_blood_smear_others",
  ],
  routine_sugar_tests: [
    `glucose_f`,
    `glucose_f_unit`,
    `glucose_f_reference_range`,
    `glucose_f_comments`,
    `glucose_pp`,
    `glucose_pp_unit`,
    `glucose_pp_reference_range`,
    `glucose_pp_comments`,
    `random_blood_sugar`,
    `random_blood_sugar_unit`,
    `random_blood_sugar_reference_range`,
    `random_blood_sugar_comments`,
    `estimated_average_glucose`,
    `estimated_average_glucose_unit`,
    `estimated_average_glucose_reference_range`,
    `estimated_average_glucose_comments`,
    `hba1c`,
    `hba1c_unit`,
    `hba1c_reference_range`,
    `hba1c_comments`,
  ],
  lipid_profile: [
    `calcium`,
    `calcium_unit`,
    `calcium_reference_range`,
    `calcium_comments`,
    `triglycerides`,
    `triglycerides_unit`,
    `triglycerides_reference_range`,
    `triglycerides_comments`,
    `hdl_cholesterol`,
    `hdl_cholesterol_unit`,
    `hdl_cholesterol_reference_range`,
    `hdl_cholesterol_comments`,
    `ldl_cholesterol`,
    `ldl_cholesterol_unit`,
    `ldl_cholesterol_reference_range`,
    `ldl_cholesterol_comments`,
    `chol_hdl_ratio`,
    `chol_hdl_ratio_unit`,
    `chol_hdl_ratio_reference_range`,
    `chol_hdl_ratio_comments`,
    `vldl_cholesterol`,
    `vldl_cholesterol_unit`,
    `vldl_cholesterol_reference_range`,
    `vldl_cholesterol_comments`,
    `ldl_hdl_ratio`,
    `ldl_hdl_ratio_unit`,
    `ldl_hdl_ratio_reference_range`,
    `ldl_hdl_ratio_comments`,
  ],
  liver_function_test: [
    `bilirubin_total`,
    `bilirubin_total_unit`,
    `bilirubin_total_reference_range`,
    `bilirubin_total_comments`,
    `bilirubin_direct`,
    `bilirubin_direct_unit`,
    `bilirubin_direct_reference_range`,
    `bilirubin_direct_comments`,
    `bilirubin_indirect`,
    `bilirubin_indirect_unit`,
    `bilirubin_indirect_reference_range`,
    `bilirubin_indirect_comments`,
    `sgot_ast`,
    `sgot_ast_unit`,
    `sgot_ast_reference_range`,
    `sgot_ast_comments`,
    `sgpt_alt`,
    `sgpt_alt_unit`,
    `sgpt_alt_reference_range`,
    `sgpt_alt_comments`,
    `alkaline_phosphatase`,
    `alkaline_phosphatase_unit`,
    `alkaline_phosphatase_reference_range`,
    `alkaline_phosphatase_comments`,
    `total_protein`,
    `total_protein_unit`,
    `total_protein_reference_range`,
    `total_protein_comments`,
    `albumin_serum`,
    `albumin_serum_unit`,
    `albumin_serum_reference_range`,
    `albumin_serum_comments`,
    `globulin_serum`,
    `globulin_serum_unit`,
    `globulin_serum_reference_range`,
    `globulin_serum_comments`,
    `alb_glob_ratio`,
    `alb_glob_ratio_unit`,
    `alb_glob_ratio_reference_range`,
    `alb_glob_ratio_comments`,
    `gamma_glutamyl_transferase`,
    `gamma_glutamyl_transferase_unit`,
    `gamma_glutamyl_transferase_reference_range`,
    `gamma_glutamyl_transferase_comments`,
  ],
  thyroid_function_test: [
    `emp_no`,
    `t3_triiodothyronine`,
    `t3_unit`,
    `t3_reference_range`,
    `t3_comments`,
    `t4_thyroxine`,
    `t4_unit`,
    `t4_reference_range`,
    `t4_comments`,
    `tsh_thyroid_stimulating_hormone`,
    `tsh_unit`,
    `tsh_reference_range`,
    `tsh_comments`,
  ],
  renal_function_test_electrolytes: [
    `urea`,
    `urea_unit`,
    `urea_reference_range`,
    `urea_comments`,
    `bun`,
    `bun_unit`,
    `bun_reference_range`,
    `bun_comments`,
    `calcium`,
    `calcium_unit`,
    `calcium_reference_range`,
    `calcium_comments`,
    `sodium`,
    `sodium_unit`,
    `sodium_reference_range`,
    `sodium_comments`,
    `potassium`,
    `potassium_unit`,
    `potassium_reference_range`,
    `potassium_comments`,
    `phosphorus`,
    `phosphorus_unit`,
    `phosphorus_reference_range`,
    `phosphorus_comments`,
    `serum_creatinine`,
    `serum_creatinine_unit`,
    `serum_creatinine_reference_range`,
    `serum_creatinine_comments`,
    `uric_acid`,
    `uric_acid_unit`,
    `uric_acid_reference_range`,
    `uric_acid_comments`,
    `chloride`,
    `chloride_unit`,
    `chloride_reference_range`,
    `chloride_comments`,
  ],
  autoimmune_test: [
    `glucose_f`,
    `glucose_f_unit`,
    `glucose_f_reference_range`,
    `glucose_f_comments`,
    `glucose_pp`,
    `glucose_pp_unit`,
    `glucose_pp_reference_range`,
    `glucose_pp_comments`,
    `random_blood_sugar`,
    `random_blood_sugar_unit`,
    `random_blood_sugar_reference_range`,
    `random_blood_sugar_comments`,
    `estimated_average_glucose`,
    `estimated_average_glucose_unit`,
    `estimated_average_glucose_reference_range`,
    `estimated_average_glucose_comments`,
    `hba1c`,
    `hba1c_unit`,
    `hba1c_reference_range`,
    `hba1c_comments`,
  ],
  coagulation_test: [
    `prothrombin_time`,
    `prothrombin_time_unit`,
    `prothrombin_time_reference_range`,
    `prothrombin_time_comments`,
    `pt_inr`,
    `pt_inr_unit`,
    `pt_inr_reference_range`,
    `pt_inr_comments`,
    `clotting_time`,
    `clotting_time_unit`,
    `clotting_time_reference_range`,
    `clotting_time_comments`,
    `bleeding_time`,
    `bleeding_time_unit`,
    `bleeding_time_reference_range`,
    `bleeding_time_comments`,
  ],
  enzymes_cardiac_profile: [
    `acid_phosphatase`,
    `acid_phosphatase_unit`,
    `acid_phosphatase_reference_range`,
    `acid_phosphatase_comments`,
    `adenosine_deaminase`,
    `adenosine_deaminase_unit`,
    `adenosine_deaminase_reference_range`,
    `adenosine_deaminase_comments`,
    `amylase`,
    `amylase_unit`,
    `amylase_reference_range`,
    `amylase_comments`,
    `ecg`,
    `ecg_unit`,
    `ecg_reference_range`,
    `ecg_comments`,
    `troponin_t`,
    `troponin_t_unit`,
    `troponin_t_reference_range`,
    `troponin_t_comments`,
    `cpk_total`,
    `cpk_total_unit`,
    `cpk_total_reference_range`,
    `cpk_total_comments`,
    `echo`,
    `echo_unit`,
    `echo_reference_range`,
    `echo_comments`,
    `lipase`,
    `lipase_unit`,
    `lipase_reference_range`,
    `lipase_comments`,
    `cpk_mb`,
    `cpk_mb_unit`,
    `cpk_mb_reference_range`,
    `cpk_mb_comments`,
    `tmt_normal`,
    `tmt_normal_unit`,
    `tmt_normal_reference_range`,
    `tmt_normal_comments`,
  ],
  urine_routine: [
    `colour`,
    `colour_unit`,
    `colour_reference_range`,
    `colour_comments`,
    `appearance`,
    `appearance_unit`,
    `appearance_reference_range`,
    `appearance_comments`,
    `reaction_ph`,
    `reaction_ph_unit`,
    `reaction_ph_reference_range`,
    `reaction_ph_comments`,
    `specific_gravity`,
    `specific_gravity_unit`,
    `specific_gravity_reference_range`,
    `specific_gravity_comments`,
    `crystals`,
    `crystals_unit`,
    `crystals_reference_range`,
    `crystals_comments`,
    `bacteria`,
    `bacteria_unit`,
    `bacteria_reference_range`,
    `bacteria_comments`,
    `protein_albumin`,
    `protein_albumin_unit`,
    `protein_albumin_reference_range`,
    `protein_albumin_comments`,
    `glucose_urine`,
    `glucose_urine_unit`,
    `glucose_urine_reference_range`,
    `glucose_urine_comments`,
    `ketone_bodies`,
    `ketone_bodies_unit`,
    `ketone_bodies_reference_range`,
    `ketone_bodies_comments`,
    `urobilinogen`,
    `urobilinogen_unit`,
    `urobilinogen_reference_range`,
    `urobilinogen_comments`,
    `casts`,
    `casts_unit`,
    `casts_reference_range`,
    `casts_comments`,
    `bile_salts`,
    `bile_salts_unit`,
    `bile_salts_reference_range`,
    `bile_salts_comments`,
    `bile_pigments`,
    `bile_pigments_unit`,
    `bile_pigments_reference_range`,
    `bile_pigments_comments`,
    `wbc_pus_cells`,
    `wbc_pus_cells_unit`,
    `wbc_pus_cells_reference_range`,
    `wbc_pus_cells_comments`,
    `red_blood_cells`,
    `red_blood_cells_unit`,
    `red_blood_cells_reference_range`,
    `red_blood_cells_comments`,
    `epithelial_cells`,
    `epithelial_cells_unit`,
    `epithelial_cells_reference_range`,
    `epithelial_cells_comments`,
  ],
  serology: [
    `screening_hiv`,
    `screening_hiv_unit`,
    `screening_hiv_reference_range`,
    `screening_hiv_comments`,
    `occult_blood`,
    `occult_blood_unit`,
    `occult_blood_reference_range`,
    `occult_blood_comments`,
    `cyst`,
    `cyst_unit`,
    `cyst_reference_range`,
    `cyst_comments`,
    `mucus`,
    `mucus_unit`,
    `mucus_reference_range`,
    `mucus_comments`,
    `pus_cells`,
    `pus_cells_unit`,
    `pus_cells_reference_range`,
    `pus_cells_comments`,
    `ova`,
    `ova_unit`,
    `ova_reference_range`,
    `ova_comments`,
    `rbcs`,
    `rbcs_unit`,
    `rbcs_reference_range`,
    `rbcs_comments`,
    `others`,
    `others_unit`,
    `others_reference_range`,
    `others_comments`,
  ],
  motion: [
    `colour_motion`,
    `colour_motion_unit`,
    `colour_motion_reference_range`,
    `colour_motion_comments`,
    `appearance_motion`,
    `appearance_motion_unit`,
    `appearance_motion_reference_range`,
    `appearance_motion_comments`,
    `occult_blood`,
    `occult_blood_unit`,
    `occult_blood_reference_range`,
    `occult_blood_comments`,
    `cyst`,
    `cyst_unit`,
    `cyst_reference_range`,
    `cyst_comments`,
    `mucus`,
    `mucus_unit`,
    `mucus_reference_range`,
    `mucus_comments`,
    `pus_cells`,
    `pus_cells_unit`,
    `pus_cells_reference_range`,
    `pus_cells_comments`,
    `ova`,
    `ova_unit`,
    `ova_reference_range`,
    `ova_comments`,
    `rbcs`,
    `rbcs_unit`,
    `rbcs_reference_range`,
    `rbcs_comments`,
    `others`,
    `others_unit`,
    `others_reference_range`,
    `others_comments`,
  ],
  routine_culture_sensitivity_test: [
    `urine`,
    `urine_unit`,
    `urine_reference_range`,
    `urine_comments`,
    `motion`,
    `motion_unit`,
    `motion_reference_range`,
    `motion_comments`,
    `sputum`,
    `sputum_unit`,
    `sputum_reference_range`,
    `sputum_comments`,
    `blood`,
    `blood_unit`,
    `blood_reference_range`,
    `blood_comments`,
  ],
  mens_pack: [`psa`, `psa_unit`, `psa_reference_range`, `psa_comments`],
  womens_pack: [],
  occupational_profile: [],
  others_test: [],
  ophthalmic_report: [
    `vision`,
    `vision_unit`,
    `vision_reference_range`,
    `vision_comments`,
    `color_vision`,
    `color_vision_unit`,
    `color_vision_reference_range`,
    `color_vision_comments`,
  ],
  xray: [],
  usg: [
    `usg_abdomen`,
    `usg_abdomen_unit`,
    `usg_abdomen_reference_range`,
    `usg_abdomen_comments`,
    `usg_kub`,
    `usg_kub_unit`,
    `usg_kub_reference_range`,
    `usg_kub_comments`,
    `usg_pelvis`,
    `usg_pelvis_unit`,
    `usg_pelvis_reference_range`,
    `usg_pelvis_comments`,
    `usg_neck`,
    `usg_neck_unit`,
    `usg_neck_reference_range`,
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
            <option value="Desk Job">Desk Job</option>
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
            <option value="Average">Average</option>
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
    </div>
  );
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
          <option value="Normal Doses">Normal Doses</option>
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