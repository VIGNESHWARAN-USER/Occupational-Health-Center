import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import BasicDetails from "./BasicDetails";
import Fitness from "./Fitness";
import Investigation from "./Investigation";
import Vaccination from "./Vaccination";
import Vitals from "./Vitals";
import MedicalHistory from "./MedicalHistory";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Consultation from "./Consultation";
import Referral from "./Referral";
import Prescription from "./Prescription";

const NewVisit = () => {
  const accessLevel = localStorage.getItem('accessLevel');
  const navigate = useNavigate();

  const [type, setType] = useState("Employee");
  const [visit, setVisit] = useState("Preventive");
  const [register, setRegister] = useState("");
  const [purpose, setPurpose] = useState("");
  const [activeTab, setActiveTab] = useState("BasicDetails");
  const [data, setdata] = useState([]);
  const [singleData, setsingleData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({}); // Initialize as empty object
  const [formDataDashboard, setFormDataDashboard] = useState({
    typeofVisit: "Preventive",
    category: "Employee",
    register: "Pre employement",
    purpose: "Medical Examination"
  });

  //New states
  const [annualPeriodicalFields, setAnnualPeriodicalFields] = useState({
    year: "",
    batch: "",
    hospitalName: "",
  });

  const [campFields, setCampFields] = useState({
    campName: "",
    hospitalName: "",
  });



  const dataMapping = {
    Employee: {
      Preventive: {
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
        "Fitness After Long Leave": "Fitness After Long Leave",
        "Mock Drill": "Mock Drill",
        "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)"
      },
      Curative: {
        "Illness": "Outpatient",
        "Over Counter Illness": "Outpatient",
        "Injury": "Outpatient",
        "Over Counter Injury": "Outpatient",
        "Followup Visits": "Outpatient",
        "BP Sugar ( Abnormal Value)": "Outpatient",
        "Injury Outside the Premises": "Outpatient",
        "Over Counter Injury Outside the Premises": "Outpatient",
        "Alcohol Abuse": "Alcohol Abuse"
      }
    },
    Contractor: {
      Preventive: {
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
        "Fitness Long Medical Leave": "Fitness Long Medical Leave",
        "Mock Drill": "Mock Drill",
        "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)"
      },
      Curative: {
        "Illness": "Outpatient",
        "Over Counter Illness": "Outpatient",
        "Injury": "Outpatient",
        "Over Counter Injury": "Outpatient",
        "Followup Visits": "Outpatient",
        "BP Sugar ( Abnormal Value)": "Outpatient",
        "Injury Outside the Premises": "Outpatient",
        "Over Counter Injury Outside the Premises": "Outpatient",
        "Alcohol Abuse": "Alcohol Abuse"
      }
    },
    Visitor: {
      Preventive: {
        "Visitors Outsider Fitness": "Visitors Outsider Fitness"
      },
      Curative: {
        "Visitors Outsider Patient": "Visitors Outsider Patient"
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmitEntries = async (e) => {
    e.preventDefault();

    if (!formData.emp_no) {
      alert("Employee number is required!");
      return;
    }
      let extraData = {};

      if (register === "Annual / Periodical") {
          extraData = { ...annualPeriodicalFields };
      } else if (register.startsWith("Camps")) {
          extraData = { ...campFields };
      }

    try {
      const response = await axios.post("http://localhost:8000/addEntries", {
        formDataDashboard,
        emp_no: formData.emp_no,
        extraData // Send additional data
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        alert("Data submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error); // Show user-friendly message
      } else {
        console.error("Error submitting form:", error);
        alert("Error submitting data!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedformData = {...formData, role: type}
      const response = await axios.post("http://localhost:8000/addbasicdetails", updatedformData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        alert("Data submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting data!");
    }
  };

  const handleSearch = async () => {  // Make handleSearch async
    if (searchId.trim() === "") {
      setFilteredEmployees(employees);
      setdata([]); // Reset data when no input
      localStorage.removeItem("selectedEmployee"); // Remove saved employee
      setFormData({});//clears the input fields
    } else {
      try {
        const filtered = employees.filter(emp =>
          emp.emp_no.toLowerCase() === searchId.toLowerCase()
        );

        if (filtered.length > 0) {
          // Get the latest record by sorting by id (or updated_at)
          const latestEmployee = filtered.sort((a, b) => b.id - a.id)[0];

          setFilteredEmployees([latestEmployee]);
          setdata([latestEmployee]);
          setsingleData([latestEmployee]);
          setFormData(latestEmployee);
          const selectedType = latestEmployee.role;
          setType(selectedType);
          setRegister(""); // Reset register
          setPurpose("");   // Reset purpose
          setFormDataDashboard(prev => ({ ...prev, category: selectedType, register: "", purpose: "" }));
          localStorage.setItem("selectedEmployee", JSON.stringify(latestEmployee)); // Save latest matched employee
        } else {
          alert("Employee not found!");
          setFilteredEmployees([]);
          setdata([]);
          setsingleData([]);
          setFormData({});
          localStorage.removeItem("selectedEmployee");
        }
      } catch (error) {
        console.error("Error during search:", error);
        alert("An error occurred during search.");
      }
    }
  };
  const handleClear = () => {
    localStorage.removeItem("selectedEmployee");
    setdata([]);
    setFormData({}); // Clear the form
    setSearchId("");
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        localStorage.removeItem("selectedEmployee");
        const response = await axios.post("http://localhost:8000/userData");
        setEmployees(response.data.data);                        
        setFilteredEmployees(response.data.data);
        console.log(response.data.data);
                                                                    
        const savedEmployee = localStorage.getItem("selectedEmployee");
        if (savedEmployee) {
          const parsedEmployee = JSON.parse(savedEmployee);
          setdata([parsedEmployee]);
          setFormData(parsedEmployee);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, []);


  // Update Register options and Purpose dynamically
  const getRegisterOptions = () => {
    return Object.keys(dataMapping[type]?.[visit] || {});
  };

  const handleRegisterChange = (e) => {
      const selectedRegister = e.target.value;
      setRegister(selectedRegister);
      const autoPurpose = dataMapping[type]?.[visit]?.[selectedRegister] || "";
      setPurpose(autoPurpose);
      setFormDataDashboard(prev => ({ ...prev, register: selectedRegister, purpose: autoPurpose }));

      // Reset additional fields when register changes
      setAnnualPeriodicalFields({ year: "", batch: "", hospitalName: "" });
      setCampFields({ campName: "", hospitalName: "" });
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setRegister(""); // Reset register
    setPurpose("");   // Reset purpose
    setFormDataDashboard(prev => ({ ...prev, category: selectedType, register: "", purpose: "" })); // Update dashboard data and reset
  };

  const handleVisitChange = (e) => {
    const selectedVisit = e.target.value;
    setVisit(selectedVisit);
    setRegister(""); // Reset register
    setPurpose("");   // Reset purpose
    setFormDataDashboard(prev => ({ ...prev, typeofVisit: selectedVisit, register: "", purpose: "" })); // Update dashboard data and reset
  };

  const tabs = [
    { id: "BasicDetails", label: "Basic Details" },
    { id: "Vitals", label: "Vitals" },
    register !== "Alcohol Abuse" && { id: "MedicalHistory", label: "Medical/Surgical/Personal History" },
    register !== "Alcohol Abuse" && purpose !== "Periodic Work Fitness" && register !== "Fitness After Medical Leave" && (register === "Followup Visits" || visit !== "Curative") && { id: "Investigations", label: "Investigations" },
    register !== "Alcohol Abuse" && { id: "Vaccination", label: "Vaccination" },
    register !== "Alcohol Abuse" && visit === "Preventive" && register !== "Camps (Optional)" && { id: "Fitness", label: "Fitness" },
    register !== "Alcohol Abuse" && visit === "Curative" && { id: "Consultation", label: "Consultation" },
    register !== "Alcohol Abuse" && visit === "Curative" && { id: "Prescription", label: "Prescription" },
    register !== "Alcohol Abuse" && visit === "Preventive" && { id: "Referral", label: "Referral" },
  ].filter(Boolean); // Filter out any `false` or `null` values (from the conditional rendering)


  const renderTabContent = () => {
    switch (activeTab) {
      case "BasicDetails":
        return (
          <div className="mt-8 p-4">
            <h2 className="text-lg font-medium mb-4">Basic Details</h2>
            <div className="grid grid-cols-3 mb-16 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Name</label>
                <input
                  name="name"
                  value={formData.name || ''}  // Handle undefined
                  onChange={handleChange}
                  type="text"
                  placeholder="Initial followed by Full Name"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Date of Birth</label>
                <input
                  name="dob"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Sex</label>
                <select
                  name="sex"
                  value={formData.sex || ""}
                  onChange={handleChange}
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sex</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Aadhar No.</label>
                <input
                  name="aadhar"
                  value={formData.aadhar || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="0000 0000 0000"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Blood Group</label>
                <input
                  name="bloodgrp"
                  value={formData.bloodgrp || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., A Positive"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Identification Mark 1</label>
                <input
                  name="identification_marks1"
                  value={formData.identification_marks1 || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Any visible identification marks"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Identification Mark 2</label>
                <input
                  name="identification_marks2"
                  value={formData.identification_marks2 || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Any visible identification marks"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Marital Status</label>
                <select
                  name="marital_status"
                  value={formData.marital_status || ""}
                  onChange={handleChange}
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Seperated</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>
            </div>

            <h2 className="text-lg font-medium my-4">Employment Details</h2>
            <div className="grid grid-cols-3 mb-16 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Employee Number</label>
                <input
                  name="emp_no"
                  value={formData.emp_no || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter employee number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Employer</label>
                <input
                  name="employer"
                  value={formData.employer || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter employer name"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Designation</label>
                <input
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter job designation"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Department</label>
                <input
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter department"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Nature of Job</label>
                <input
                  name="job_nature"
                  value={formData.job_nature || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., Height Works, Fire Works"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Date of Joining</label>
                <input
                  name="doj"
                  value={formData.doj || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Date of Joining"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Mode of Joining</label>
                <select
                  name="moj"
                  value={formData.moj || ""}
                  onChange={handleChange}
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Mode</option>
                  <option>New Joinee</option>
                  <option>Transfer</option>
                </select>
              </div>
            </div>


            <h2 className="text-lg font-medium my-4">Contact Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Phone (Personal)</label>
                <input
                  name="phone_personal"
                  value={formData.phone_personal || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter 10-digit phone number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Mail Id (Personal)</label>
                <input
                  name="mail_id_Personal"
                  value={formData.mail_id_Personal || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter the personal mail"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Emergency Contact Person</label>
                <input
                  name='emergency_contact_person'
                  value={formData.emergency_contact_person || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Phone (Office)</label>
                <input
                  name='phone_Office'
                  value={formData.phone_Office || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter office mobile number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Mail Id (Office)</label>
                <input
                  name='mail_id_Office'
                  value={formData.mail_id_Office || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter office mail id"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Emergency Contact Relation</label>
                <input
                  name='emergency_contact_relation'
                  value={formData.emergency_contact_relation || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g.,Father,Spouse"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Mail Id (Emergency Contact Person)</label>
                <input
                  name='mail_id_Emergency_Contact_Person'
                  value={formData.mail_id_Emergency_Contact_Person || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter mail"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Emergency Contact Phone</label>
                <input
                  name='emergency_contact_phone'
                  value={formData.emergency_contact_phone || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Emergency Contact number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">Address</label>
                <textarea
                  name='address'
                  value={formData.address || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter full address"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
              Add Basic Details
            </button>

          </div>
        );
      case "Fitness":
        return <Fitness />;
      case "Investigations":
        return <Investigation data={singleData} />;
      case "Vaccination":
        return <Vaccination data={data} />;
      case "Vitals":
        return <Vitals data={data} />;
      case "MedicalHistory":
        return <MedicalHistory data={data} />;
      case "Consultation":
        return <Consultation />;
      case "Referral":
        return <Referral />;
      case "Prescription":
        return <Prescription />;
      default:
        return <div>Unknown Tab</div>;
    }
  };

  if (accessLevel === "nurse") {
    return (
      <div className="h-screen flex bg-[#8fcadd]">
        <Sidebar />
        <div className="w-4/5 p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">New Visit</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-1 overflow-y-auto">
            <motion.div className="bg-white p-8 rounded-lg shadow-lg">

              <div className="bg-white rounded-lg w-full p-6 shadow-lg">
                <div className="w-full flex items-center mb-8 space-x-4">
                  <h1 className="text-2xl font-semibold text-gray-700">Get User</h1>
                  <div className="relative flex-grow">
                    {/* Search Icon */}
                    <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400" />

                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Search by Employee ID"
                      className="w-full bg-white py-3 pl-12 pr-5 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-indigo-400 hover:shadow-md placeholder-gray-400 text-gray-700 transition-all duration-300 ease-in-out"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-grow">
                    <button onClick={handleSearch} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
                      Get
                    </button>
                    <button onClick={handleClear} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ml-2 mr-2">
                      Clear
                    </button>
                    <button onClick={handleSubmitEntries} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
                      Add Entry
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Type
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={type}
                      onChange={handleTypeChange}
                    >
                      <option value="">Select Type</option>
                      <option>Employee</option>
                      <option>Contractor</option>
                      <option>Visitor</option>
                    </select>
                  </div>

                  {/* Visit Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Type of Visit
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={visit}
                      onChange={handleVisitChange}
                    >
                      <option value="">Select Visit Type</option>
                      <option>Preventive</option>
                      <option>Curative</option>
                    </select>
                  </div>

                  {/* Register Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Register
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={register}
                      onChange={handleRegisterChange}
                    >
                      <option value="">Select Register</option>
                      {getRegisterOptions().map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose (Auto-selected) */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={purpose}
                      placeholder="Select the above feilds"
                      readOnly
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                  </div>
                </div>

                  {/* Conditionally Rendered Fields */}
                  {register === "Annual / Periodical" && (
                      <div className="grid grid-cols-3 gap-4 mb-6">
                          <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                              <input
                                  type="text"
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={annualPeriodicalFields.year}
                                  onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, year: e.target.value }))}
                              />
                          </div>
                          <div>
                              <label className="block text-gray-70                                  text-sm font-bold mb-2">Batch</label>
                              <input
                                  type="text"
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={annualPeriodicalFields.batch}
                                  onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, batch: e.target.value }))}
                              />
                          </div>
                          <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                              <input
                                  type="text"
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={annualPeriodicalFields.hospitalName}
                                  onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, hospitalName: e.target.value }))}
                              />
                          </div>
                      </div>
                  )}

                  {register.startsWith("Camps") && (
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">Camp Name</label>
                              <input
                                  type="text"
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={campFields.campName}
                                  onChange={(e) => setCampFields(prev => ({ ...prev, campName: e.target.value }))}
                              />
                          </div>
                          <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                              <input
                                  type="text"
                                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={campFields.hospitalName}
                                  onChange={(e) => setCampFields(prev => ({ ...prev, hospitalName: e.target.value }))}
                              />
                          </div>
                      </div>
                  )}

                <hr className="h-4 text-blue-100" />
                <div className="border-b border-gray-200 mb-4">
                  <nav className="relative flex justify-evenly space-x-4 bg-gray-50 p-3 rounded-lg shadow-sm" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        aria-selected={activeTab === tab.id}
                        className={`relative whitespace-nowrap font-bold py-2 px-3 font-medium text-sm focus:outline-none transition-all duration-300 ease-in-out
        ${activeTab === tab.id
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"}`}
                      >
                        {tab.label}
                        {/* Active Tab Indicator */}
                        <span
                          className={`absolute left-0 bottom-0 h-1 w-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out
          ${activeTab === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                        ></span>
                      </button>
                    ))}
                  </nav>
                  {renderTabContent()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }
  else if (accessLevel === "doctor") {
    const tabs = [
      { id: "BasicDetails", label: "Basic Details" },
      { id: "Vitals", label: "Vitals" },
      register !== "Alcohol Abuse" && { id: "MedicalHistory", label: "Medical/Surgical/Personal History" },
      register !== "Alcohol Abuse" && purpose !== "Periodic Work Fitness" && register !== "Fitness After Medical Leave" && (register === "Followup Visits" || visit !== "Curative") && { id: "Investigations", label: "Investigations" },
      register !== "Alcohol Abuse" && { id: "Vaccination", label: "Vaccination" },
      register !== "Alcohol Abuse" && visit === "Preventive" && register !== "Camps (Optional)" && { id: "Fitness", label: "Fitness" },
      register !== "Alcohol Abuse" && visit === "Curative" && { id: "Consultation", label: "Consultation" },
      register !== "Alcohol Abuse" && visit === "Curative" && { id: "Prescription", label: "Prescription" },
      register !== "Alcohol Abuse" && visit === "Preventive" && { id: "Referral", label: "Referral" },
    ].filter(Boolean);

    return (
      <div className="h-screen flex bg-[#8fcadd]">
        <Sidebar />
        <div className="w-4/5 p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">New Visit</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-1 overflow-y-auto">
            <motion.div className="bg-white p-8 rounded-lg shadow-lg">

              <div className="bg-white rounded-lg w-full p-6 shadow-lg">
                <div className="w-full flex items-center mb-8 space-x-4">
                  <h1 className="text-2xl font-semibold text-gray-700">Get User</h1>
                  <div className="relative flex-grow">
                    {/* Search Icon */}
                    <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400" />

                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Search by Employee ID"
                      className="w-full bg-white py-3 pl-12 pr-5 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-indigo-400 hover:shadow-md placeholder-gray-400 text-gray-700 transition-all duration-300 ease-in-out"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-grow">
                    <button onClick={handleSearch} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
                      Get
                    </button>
                    <button onClick={handleClear} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ml-2 mr-2">
                      Clear
                    </button>
                    <button onClick={handleSubmitEntries} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
                      Add Entry
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Type
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={type}
                      onChange={handleTypeChange}
                    >
                      <option>Employee</option>
                      <option>Contractor</option>
                      <option>Visitor</option>
                    </select>
                  </div>

                  {/* Visit Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Type of Visit
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={visit}
                      onChange={handleVisitChange}
                    >
                      <option>Preventive</option>
                      <option>Curative</option>
                    </select>
                  </div>

                  {/* Register Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Register
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={register}
                      onChange={handleRegisterChange}
                    >
                      <option value="">Select Register</option>
                      {getRegisterOptions().map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose (Auto-selected) */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={purpose}
                      readOnly
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                  </div>
                </div>
                      {/* Conditionally Rendered Fields */}
                      {register === "Annual / Periodical" && (
                          <div className="grid grid-cols-3 gap-4 mb-6">
                              <div>
                                  <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                                  <input
                                      type="text"
                                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                      value={annualPeriodicalFields.year}
                                      onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, year: e.target.value }))}
                                  />
                              </div>
                              <div>
                                  <label className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
                                  <input
                                      type="text"
                                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                      value={annualPeriodicalFields.batch}
                                      onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, batch: e.target.value }))}
                                  />
                              </div>
                              <div>
                                  <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                                  <input
                                      type="text"
                                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                      value={annualPeriodicalFields.hospitalName}
                                      onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, hospitalName: e.target.value }))}
                                  />
                              </div>
                          </div>
                      )}

                      {register.startsWith("Camps") && (
                          <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                  <label className="block text-gray-700 text-sm font-bold mb-2">Camp Name</label>
                                  <input
                                      type="text"
                                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                      value={campFields.campName}
                                      onChange={(e) => setCampFields(prev => ({ ...prev, campName: e.target.value }))}
                                  />
                              </div>
                              <div>
                                  <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                                  <input
                                      type="text"
                                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                      value={campFields.hospitalName}
                                      onChange={(e) => setCampFields(prev => ({ ...prev, hospitalName: e.target.value }))}
                                  />
                              </div>
                          </div>
                      )}

                <hr className="h-4 text-blue-100" />
                <div className="border-b border-gray-200 mb-4">
                  <nav className="relative flex justify-evenly space-x-4 bg-gray-50 p-3 rounded-lg shadow-sm" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        aria-selected={activeTab === tab.id}
                        className={`relative whitespace-nowrap font-bold py-2 px-3 font-medium text-sm focus:outline-none transition-all duration-300 ease-in-out
        ${activeTab === tab.id
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"}`}
                      >
                        {tab.label}
                        {/* Active Tab Indicator */}
                        <span
                          className={`absolute left-0 bottom-0 h-1 w-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out
          ${activeTab === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                        ></span>
                      </button>
                    ))}
                  </nav>
                  {renderTabContent()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }
  else {
    return (
      <section class="bg-white h-full flex items-center dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <button onClick={() => navigate(-1)} class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
          </div>
        </div>
      </section>
    );
  }

};

export default NewVisit;