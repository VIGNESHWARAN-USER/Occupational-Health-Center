import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const filterSections = [
  { id: "position", label: "Position" },
  { id: "personaldetails", label: "Personal Details" },
  { id: "employmentdetails", label: "Employment Details" },
  { id: "medicalhistory", label: "Medical History" },
  { id: "vaccination", label: "Vaccination" },
  { id: "employmentstatus", label: "Employment Status" },
  { id: "preventive", label: "Preventive" },
  { id: "curative", label: "Curative" },
  { id: "employeeData", label: "Employee Data" },
];

const RecordsFilters = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/userData");
        setEmployees(response.data.data);
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
        const existingIndex = updatedFilters.findIndex(
          (filter) => Object.keys(filter)[0] === key
        );

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
      // If no filters are selected, show all employees
      setFilteredEmployees([...employees]);
      return;
    }

    let results = [...employees];

    selectedFilters.forEach((filter) => {
      const key = Object.keys(filter)[0];
      const value = Object.values(filter)[0];

      results = results.filter((employee) => {
        let empValue = employee[key];

        if (empValue === null || empValue === undefined) {
          return false;
        }

        if (typeof empValue === "object") {
          function checkNestedObject(obj, val) {
            for (const prop in obj) {
              if (obj.hasOwnProperty(prop)) {
                const nestedValue = obj[prop];
                if (nestedValue === value) { // Strict equality check here
                  return true;
                }
              }
            }
            return false;
          }

          return checkNestedObject(empValue, value);
        } else {
          return empValue === value; // Strict equality check here
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
                {`${Object.entries(filter)[0][0].toUpperCase()} : ${
                  Object.entries(filter)[0][1]
                }`}
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
                  {filterSections.find((f) => f.id === selectedSection)?.label}
                </h2>
                {selectedSection === "personaldetails" ? (
                  <PersonalDetails addFilter={addFilter} />
                ) : null}
                {selectedSection === "position" ? (
                  <Position addFilter={addFilter} />
                ) : null}
                {selectedSection === "employmentdetails" ? (
                  <EmploymentDetails addFilter={addFilter} />
                ) : null}
                {selectedSection === "medicalhistory" ? (
                  <MedicalHistoryForm addFilter={addFilter} />
                ) : null}
                {selectedSection === "vaccination" ? (
                  <VaccinationForm addFilter={addFilter} />
                ) : null}
                {selectedSection === "preventive" ? (
                  <Preventive addFilter={addFilter} />
                ) : null}
                {selectedSection === "curative" ? (
                  <Curative addFilter={addFilter} />
                ) : null}
                {selectedSection === "employmentstatus" ? (
                  <EmploymentStatus addFilter={addFilter} />
                ) : null}
                {selectedSection === "employeeData" ? (
                  <EmployeeData employees={employees} addFilter={addFilter} />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Display Employee Data in Table */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Employee Records</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Employee Number</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Gender</th>
                    {/* Add more headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.emp_no} className="hover:bg-gray-50">
                      <td className="p-2 border">{employee.emp_no}</td>
                      <td className="p-2 border">{employee.name}</td>
                      <td className="p-2 border">{employee.sex}</td>
                      {/* Add more data cells as needed */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Remaining components (PersonalDetails, Position, etc.) remain the same...

export default RecordsFilters;

const PersonalDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    age: "",
    gender: "",
    bloodgrp: "",
    marital_status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
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
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Sex
        </label>
        <select
          name="gender"
          value={formData.gender}
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
        <label
          htmlFor="bloodgrp"
          className="block text-sm font-medium text-gray-700"
        >
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
const Position = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    designation: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
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

const EmploymentDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    doj: "",
    job_nature: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
      {/* Age Input */}
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

      {/* Sex Input */}
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

const VaccinationForm = ({ addFilter }) => {
  const [formData, setFormData] = useState({
    vaccine: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Vaccination Information
      </h2>

      {/* Select Vaccine */}
      <div>
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
      <div className="mt-4">
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

      {/* Submit Button */}
      <button
        onClick={() => {
          const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== "")
          );
          addFilter(filteredData);
        }}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Add to Filter
      </button>
    </div>
  );
};

const Preventive = ({ addFilter }) => {
  const preventiveOptions = {
    "Pre employment": "Medical Examination",
    "Annual / Periodical": "Medical Examination",
    "Fitness After Medical Leave": "Fitness After Medical Leave",
    "Mock Drill": "Mock Drill",
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedList, setSelectedList] = useState([]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddFilter = () => {
    if (selectedOption && !selectedList.includes(selectedOption)) {
      const updatedList = [...selectedList, selectedOption];
      setSelectedList(updatedList);
      addFilter && addFilter({preventive:updatedList.join(',')});
      setSelectedOption(""); // Reset dropdown after selection
    }
  };

  return (
    <div className="p-4">
      <label className="block font-medium text-gray-700">
        Select Preventive Examination
      </label>
      <select
        value={selectedOption}
        onChange={handleChange}
        className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select</option>
        {Object.entries(preventiveOptions).map(([key, value]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddFilter}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>

      {/* Display selected options */}
      {selectedList.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700">Selected Filters:</h3>
          <ul className="list-disc pl-5">
            {selectedList.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Curative = ({ addFilter }) => {
  const curativeOptions = {
    "Illness": "Outpatient",
    "Injury": "Outpatient",
    "Followup Visits": "Outpatient",
    "BP Sugar ( Abnormal Value)": "Outpatient",
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedList, setSelectedList] = useState([]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddFilter = () => {
    if (selectedOption && !selectedList.includes(selectedOption)) {
      const updatedList = [...selectedList, selectedOption];
      setSelectedList(updatedList);
      addFilter && addFilter({curative:updatedList.join(',')});
      setSelectedOption(""); // Reset dropdown after selection
    }
  };

  return (
    <div className="p-4">
      <label className="block font-medium text-gray-700">
        Select Curative Examination
      </label>
      <select
        value={selectedOption}
        onChange={handleChange}
        className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select</option>
        {Object.entries(curativeOptions).map(([key, value]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddFilter}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>

      {/* Display selected options */}
      {selectedList.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700">Selected Filters:</h3>
          <ul className="list-disc pl-5">
            {selectedList.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const EmploymentStatus = ({ addFilter }) => {
  const employmentOptions = {
    "Employed":"Employed",
    "Self-Employed": "Self-Employed",
    "Not Employed": "Not Employed",
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedList, setSelectedList] = useState([]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddFilter = () => {
    if (selectedOption && !selectedList.includes(selectedOption)) {
      const updatedList = [...selectedList, selectedOption];
      setSelectedList(updatedList);
      addFilter && addFilter({EmploymentStatus:updatedList.join(',')});
      setSelectedOption(""); // Reset dropdown after selection
    }
  };

  return (
    <div className="p-4">
      <label className="block font-medium text-gray-700">
        Select Employment Status
      </label>
      <select
        value={selectedOption}
        onChange={handleChange}
        className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select</option>
        {Object.entries(employmentOptions).map(([key, value]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <button
        onClick={handleAddFilter}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>

      {/* Display selected options */}
      {selectedList.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700">Selected Filters:</h3>
          <ul className="list-disc pl-5">
            {selectedList.map((item, index) => (
              <li key={index} className="text-gray-800">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const EmployeeData = ({ employees, addFilter }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleAddFilter = () => {
    if (selectedEmployeeId) {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(selectedEmployeeId));
      if (selectedEmployee) {
        addFilter({ emp_no: selectedEmployee.emp_no });
      }
    }
  };

  return (
    <div className="p-4">
      <label className="block font-medium text-gray-700">
        Select Employee
      </label>
      <select
        value={selectedEmployeeId}
        onChange={handleEmployeeChange}
        className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
      >
        <option value="">Select an employee</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name} (ID: {employee.id})
          </option>
        ))}
      </select>

      <button
        onClick={handleAddFilter}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add Employee Data as Filter
      </button>
      {selectedEmployeeId && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700">Employee Details:</h3>
            {employees.find(emp => emp.id === parseInt(selectedEmployeeId)) && (
              <pre>{JSON.stringify(employees.find(emp => emp.id === parseInt(selectedEmployeeId)), null, 2)}</pre>
            )}
          </div>
        )}

    </div>
  );
};