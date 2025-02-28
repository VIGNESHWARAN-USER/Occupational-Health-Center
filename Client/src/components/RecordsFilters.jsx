import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import axios from "axios";

const filterSections = [
  { id: "position", label: "Position" },
  { id: "personaldetails", label: "Personal Details" },
  { id: "employmentdetails", label: "Employment Details" },
  { id: "medicalhistory", label: "Medical History" },
  { id: "vaccination", label: "Vaccination" },
  { id: "employmentstatus", label: "Employment Status" },
  { id: "preventive", label: "Preventive" },
  { id: "curative", label: "Curative" },
];



const RecordsFilters = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [data, setdata] = useState({})

useEffect(
  ()=>{
    const fetchAllDetails = () =>{
      const response = axios.post("http://localhost:8000/fetchAllData")
      console.log(response)
    }
    fetchAllDetails();
  },[]
)

  const handleFilterClick = (section) => {
    
    setSelectedSection(section);
  };

  const removeFilter = (section) => {
    setSelectedFilters(selectedFilters.filter((item) => item !== section));
    if (selectedSection === section) {
      setSelectedSection(null);
    }
  };

  const addFilter = (formData) => {
    const filteredData = Object.entries(formData)
      .filter(([_, value]) => value !== "") // Remove empty values
      .map(([key, value]) => ({ [key]: value })); // Convert to an array of key-value objects
  
    setSelectedFilters((prevFilters) => {
      const updatedFilters = [...prevFilters]; // Clone existing filters
  
      filteredData.forEach((newFilter) => {
        const [newKey] = Object.keys(newFilter);
        const existingIndex = updatedFilters.findIndex(
          (filter) => Object.keys(filter)[0] === newKey
        );
  
        if (existingIndex !== -1) {
          // Override existing key-value pair
          updatedFilters[existingIndex] = newFilter;
        } else {
          // Add new key-value pair
          updatedFilters.push(newFilter);
        }
      });
  
      return updatedFilters;
    });
  };
  

  return (
    <div className="h-screen bg-[#8fcadd] flex">
      <Sidebar />
      <div className="h-screen overflow-auto flex w-4/5 flex-col">
      {/* Selected Filters Display */}
      <div className="p-4 flex flex-wrap gap-2 bg-gray-100 rounded-xl border-gray-300">
        {selectedFilters.length > 0 ? (
          selectedFilters.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full shadow"
            >
              {`${Object.entries(filter)[0][0].toUpperCase()} : ${Object.entries(filter)[0][1]}`}
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

      {/* Dropdown Filter Selector */}
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


      {/* Filter Sections - Conditionally Rendered */}
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
              {(selectedSection === "personaldetails")? <PersonalDetails addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "position")? <Position addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "employmentdetails")? <Position addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "medicalhistory")? <MedicalHistoryForm addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "vaccination")? <VaccinationForm addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "preventive")? <Preventive addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "curative")? <Curative addFilter={addFilter}/>:selectedSection }
              {(selectedSection === "employmentstatus")? <EmploymentStatus addFilter={addFilter}/>:selectedSection }
            </motion.div>
          )}
        </AnimatePresence>
      </div></div>
    </div>
  );
};

export default RecordsFilters;


const PersonalDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    age: "",
    gender: "",
    bloodgroup: "",
    marital_status: "",
    bmi: "",
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
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="bloodgroup" className="block text-sm font-medium text-gray-700">
          Blood Group
        </label>
        <input
          type="text"
          name="bloodgroup"
          value={formData.bloodgroup}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Blood Group"
        />
      </div>

      {/* Marital Status Input */}
      <div>
        <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
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

      {/* BMI Input */}
      <div>
        <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">
          BMI (Body Mass Index)
        </label>
        <input
          type="number"
          name="bmi"
          value={formData.bmi}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter BMI"
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
}
  const Position = ({ addFilter }) => {
    const [formData, setFormData] = useState({
      job_title: "",
      department: "",
      employment_type: "",
      experience: "",
      location: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    return (
      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
        {/* Job Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Job Title"
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
  
        {/* Employment Type Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employment Type
          </label>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Employment Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
  
        {/* Experience Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Years of Experience"
          />
        </div>
  
        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Location"
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


  const MedicalHistoryForm = ({ addFilter }) => {
    const [formData, setFormData] = useState({
      smoking: "",
      years_smoking: "",
      cigarettes_per_day: "",
      alcohol: "",
      years_drinking: "",
      drinks_per_day: "",
      diet: "",
      medical_conditions: [],
      medical_comments: "",
      family_health: {
        father: { status: "", reason: "", remarks: "" },
        paternal_grandfather: { status: "", reason: "", remarks: "" },
        paternal_grandmother: { status: "", reason: "", remarks: "" },
        mother: { status: "", reason: "", remarks: "" },
        maternal_grandfather: { status: "", reason: "", remarks: "" },
        maternal_grandmother: { status: "", reason: "", remarks: "" },
      },
    });
  
    const medicalOptions = [
      "HTN",
      "DM",
      "Epileptic",
      "Hyper Thyroid",
      "Hypo Thyroid",
      "CVS",
      "CNS",
      "Asthma",
      "RS",
      "GIT",
      "KUB",
      "Cancer",
      "Others",
    ];
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
  
      setFormData((prevData) => {
        if (type === "checkbox") {
          return {
            ...prevData,
            medical_conditions: checked
              ? [...prevData.medical_conditions, value]
              : prevData.medical_conditions.filter((item) => item !== value),
          };
        } else if (name.includes("_status") || name.includes("_reason") || name.includes("_remarks")) {
          const [member, field] = name.split("_");
          return {
            ...prevData,
            family_health: {
              ...prevData.family_health,
              [member]: { ...prevData.family_health[member], [field]: value },
            },
          };
        } else {
          return { ...prevData, [name]: value };
        }
      });
    };
  
    const handleSubmit = () => {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          if (Array.isArray(value)) return value.length > 0;
          return value !== "";
        })
      );
  
      addFilter(filteredData);
    };
  
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical History Form</h2>
  
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
  
          {formData.smoking === "Yes" && (
            <>
              <div>
                <label className="block font-medium">Years of Smoking</label>
                <input
                  type="number"
                  name="years_smoking"
                  value={formData.years_smoking}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium">Cigarettes per day</label>
                <input
                  type="number"
                  name="cigarettes_per_day"
                  value={formData.cigarettes_per_day}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}
  
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
  
          {formData.alcohol === "Yes" && (
            <>
              <div>
                <label className="block font-medium">Years of Drinking</label>
                <input
                  type="number"
                  name="years_drinking"
                  value={formData.years_drinking}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium">Drinks per day</label>
                <input
                  type="number"
                  name="drinks_per_day"
                  value={formData.drinks_per_day}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}
  
          <div>
            <label className="block font-medium">Diet</label>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Diet</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
        </div>
  
        <div className="mt-6">
          <label className="block font-medium">Medical Conditions</label>
          <div className="grid grid-cols-3 gap-3">
            {medicalOptions.map((condition) => (
              <label key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  value={condition}
                  checked={formData.medical_conditions.includes(condition)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {condition}
              </label>
            ))}
          </div>
        </div>
  
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Family Health History</h3>
          {Object.keys(formData.family_health).map((member) => (
            <div key={member} className="mt-4">
              <h4 className="font-medium capitalize">{member.replace("_", " ")}</h4>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Status"
                  name={`${member}_status`}
                  value={formData.family_health[member].status}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Reason (if expired)"
                  name={`${member}_reason`}
                  value={formData.family_health[member].reason}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Health Remarks"
                  name={`${member}_remarks`}
                  value={formData.family_health[member].remarks}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ))}
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
    doses: Array(5).fill({ date: "", name: "" }),
    boosters: Array(5).fill({ date: "", name: "" }),
  });

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "dose") {
      const newDoses = [...formData.doses];
      newDoses[index][name] = value;
      setFormData({ ...formData, doses: newDoses });
    } else if (type === "booster") {
      const newBoosters = [...formData.boosters];
      newBoosters[index][name] = value;
      setFormData({ ...formData, boosters: newBoosters });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

      {/* Doses */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Dose Information</h3>
        {formData.doses.map((dose, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mt-2">
            <input
              type="date"
              name="date"
              value={dose.date}
              onChange={(e) => handleChange(e, index, "dose")}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="name"
              placeholder={`Dose ${index + 1} Name`}
              value={dose.name}
              onChange={(e) => handleChange(e, index, "dose")}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Booster Doses */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Booster Doses</h3>
        {formData.boosters.map((booster, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mt-2">
            <input
              type="date"
              name="date"
              value={booster.date}
              onChange={(e) => handleChange(e, index, "booster")}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="name"
              placeholder={`Booster ${index + 1} Name`}
              value={booster.name}
              onChange={(e) => handleChange(e, index, "booster")}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={() => addFilter(formData)}
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
    "Pre employment (Food Handler)": "Medical Examination",
    "Pre Placement": "Medical Examination",
    "Annual / Periodical": "Medical Examination",
    "Periodical (Food Handler)": "Medical Examination",
    "Camps (Mandatory)": "Medical Examination",
    "Camps (Optional)": "Medical Examination",
    "Special Work Fitness": "Periodic Work Fitness",
    "Special Work Fitness (Renewal)": "Periodic Work Fitness",
    "Fitness After Medical Leave": "Fitness After Medical Leave",
    "Mock Drill": "Mock Drill",
    "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)",
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
      addFilter && addFilter(updatedList);
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
          <option key={key} value={value}>
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



const Curative = ({ addFilter }) => {
  const curativeOptions = {
    "Illness": "Outpatient",
    "Over Counter Illness": "Outpatient",
    "Injury": "Outpatient",
    "Over Counter Injury": "Outpatient",
    "Followup Visits": "Outpatient",
    "BP Sugar ( Abnormal Value)": "Outpatient",
    "Injury Outside the Premises": "Outpatient",
    "Over Counter Injury Outside the Premises": "Outpatient",
    "Alcohol Abuse": "Alcohol Abuse",
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
      addFilter && addFilter(updatedList);
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
          <option key={key} value={value}>
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

const EmploymentStatus = ({ addFilter }) => {
  const employmentOptions = {
    "Full-Time": "Employed",
    "Part-Time": "Employed",
    "Contract": "Employed",
    "Intern": "Employed",
    "Freelancer": "Self-Employed",
    "Consultant": "Self-Employed",
    "Unemployed": "Not Employed",
    "Retired": "Not Employed",
    "Student": "Not Employed",
    "Self-Employed": "Self-Employed",
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
      addFilter && addFilter(updatedList);
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
          <option key={key} value={value}>
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
