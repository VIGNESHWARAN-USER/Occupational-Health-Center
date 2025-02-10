import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";;
import BasicDetails from "./BasicDetails";
import Fitness from "./Fitness";
import Investigation from "./Investigation";
import Vaccination from "./Vaccination";
import Vitals from "./Vitals";
import MedicalHistory from "./MedicalHistory"
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const NewVisit = () => {
  const [type, setType] = useState("Employee");
  const [visit, setVisit] = useState("Preventive");
  const [register, setRegister] = useState("");
  const [purpose, setPurpose] = useState("");
  const [activeTab, setActiveTab] = useState("BasicDetails");
  const tabs = [
    { id: "BasicDetails", label: "Basic Details" },
    { id: "Vitals", label: "Vitals" },
    { id: "MedicalHistory", label: "Medical/Surgical/Personal History" },
    { id: "Investigations", label: "Investigations" },
    { id: "Vaccination", label: "Vaccination" },
    { id: "Fitness", label: "Fitness" },
  ];
  const [data, setdata] = useState([])
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState(""); 
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log(formData.menspack);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/addEmployee", formData, {
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleSearch = () => {
    if (searchId.trim() === "") {
        setFilteredEmployees(employees);
        setdata([]); // Reset data when no input
        localStorage.removeItem("selectedEmployee"); // Remove saved employee
    } else {
        const filtered = employees.filter(emp => 
            emp.emp_no.toLowerCase() === searchId.toLowerCase()
        );

        if (filtered.length > 0) {
            // Get the latest record by sorting by `id` (or `updated_at`)
            const latestEmployee = filtered.sort((a, b) => b.id - a.id)[0];

            setFilteredEmployees([latestEmployee]);
            setdata([latestEmployee]);
            setFormData(latestEmployee);  
            localStorage.setItem("selectedEmployee", JSON.stringify(latestEmployee)); // Save latest matched employee
            // hot reload Basic detail child
            
        }
    }
};

  const handleClear = ()=>{
    localStorage.removeItem("selectedEmployee");
    setdata([]);
    setFormData([]);
  }

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        
        localStorage.removeItem("selectedEmployee");
        const response = await axios.post("http://localhost:8000/userData");
        setEmployees(response.data.data);
        console.log(response.data.data)
        setFilteredEmployees(response.data.data);
  
        // Retrieve saved employee if exists
        const savedEmployee = localStorage.getItem("selectedEmployee");
        if (savedEmployee) {
          setdata([JSON.parse(savedEmployee)]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchDetails();
  }, []);
  

  // Mapping of Type, Visit, Register, and corresponding Purpose
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
        "Special Work Fitness" :"Periodic Work Fitness",
        "Special Work Fitness (Renewal)":"Periodic Work Fitness",
        "Fitness After Medical Leave":"Fitness After Medical Leave",
        "Mock Drill":"Mock Drill",
        "BP Sugar Check  ( Normal Value)":"BP Sugar Check  ( Normal Value)"

      },
      Curative: {
        "Illness" : "Outpatient",
        "Over Counter Illness" : "Outpatient",
        "Injury" : "Outpatient",
        "Over Counter Injury" : "Outpatient",
        "Followup Visits" : "Outpatient",
        "BP Sugar ( Abnormal Value)" : "Outpatient",
        "Injury Outside the Premises" : "Outpatient",
        "Over Counter Injury Outside the Premises" : "Outpatient",
        "Alcohol Abuse" : "Alcohol Abuse",

      },
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
        "Special Work Fitness" :"Periodic Work Fitness",
        "Special Work Fitness (Renewal)":"Periodic Work Fitness",
        "Fitness After Medical Leave":"Fitness After Medical Leave",
        "Mock Drill":"Mock Drill",
        "BP Sugar Check  ( Normal Value)":"BP Sugar Check  ( Normal Value)"

      },
      Curative: {
        "Illness" : "Outpatient",
        "Over Counter Illness" : "Outpatient",
        "Injury" : "Outpatient",
        "Over Counter Injury" : "Outpatient",
        "Followup Visits" : "Outpatient",
        "BP Sugar ( Abnormal Value)" : "Outpatient",
        "Injury Outside the Premises" : "Outpatient",
        "Over Counter Injury Outside the Premises" : "Outpatient",
        "Alcohol Abuse" : "Alcohol Abuse",

      },
    },
    Visitor: {
      Preventive: {
        "Visitors Outsider Fitness": "Visitors Outsider Fitness",

      },
      Curative: {
        "Visitors Outsider Patient" : "Visitors Outsider Patient",

      },
    },
  };

  // Update Register options and Purpose dynamically
  const getRegisterOptions = () => {
    return Object.keys(dataMapping[type]?.[visit] || {});
  };

  const handleRegisterChange = (e) => {
    const selectedRegister = e.target.value;
    setRegister(selectedRegister);
    const autoPurpose = dataMapping[type]?.[visit]?.[selectedRegister] || "";
    setPurpose(autoPurpose);
  };

  return (
    <div className="h-screen w-full flex">
      <Sidebar/>
      <div className="w-4/5 p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4">New Visit</h2>
        <div className="bg-white rounded-lg w-full p-6 shadow-lg">
          <div className="w-full flex items-center mb-8 space-x-4">
            <h1 className="text-2xl font-bold">Get User</h1>
            <div className="relative flex-grow">
              <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-700" />
              <input
                type="text"
                placeholder="Search By Employee ID"
                className="w-full bg-blue-100 py-2 pl-10 pr-4 rounded-lg"
                value={searchId}
                onChange={(e)=>{setSearchId(e.target.value)}}
              />
            </div>
            <div className="flex">
            <button onClick={handleSearch} className="bg-blue-500 text-white h-14 py-2 px-4 w-20 rounded-lg font-medium flex-shrink-0 w-1/4">
              Get
            </button>
            <button onClick={handleClear} className="bg-blue-500 text-white h-14 w-20 ms-4 rounded-lg font-medium flex-shrink-0 w-1/4">
              Clear
            </button>
            <div className="flex justify-end">
            <button onClick={handleSubmit} className="bg-blue-500 text-white h-14 w-20 ms-4 rounded-lg font-medium flex-shrink-0 w-1/4">
              Add Data
            </button>
          </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Type
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setType(e.target.value)}
              >
                <option>Employee</option>
                <option>Contractor</option>
                <option>Visitor</option>
              </select>
            </div>

            {/* Visit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Type of Visit
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setVisit(e.target.value)}
              >
                <option>Preventive</option>
                <option>Curative</option>
              </select>
            </div>

            {/* Register Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Register
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={register}
                onChange={handleRegisterChange}
              >
                {getRegisterOptions().map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Purpose (Auto-selected) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
          
          <hr className="h-4 text-blue-100"/>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex justify-evenly space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium  text-m focus:outline-none ${activeTab === tab.id? "border-blue-500 text-blue-600": "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                {tab.label}
              </button>
            ))}
          </nav>
          {activeTab === "BasicDetails" && (
             <div className="mt-8 p-4">
             <h2 className="text-lg font-medium mb-4">Basic Details</h2>
             <div className="grid grid-cols-3 mb-16 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Name</label>
                 <input
                   name = "name"
                   value={formData.name}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter your full name"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Date of Birth (dd/mm/yyyy)</label>
                 <input
                   name = "dob"
                   value={formData.dob}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter Date of Birth in dd/mm/yyyy"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Sex</label>
                 <select
                   name="sex"
                   value={formData.sex || ""}
                   onChange={handleChange}
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option>Male</option>
                   <option>Female</option>
                   <option>Other</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Aadhar No.</label>
                 <input
                   name = "aadhar"
                   value={formData.aadhar}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter 12-digit Aadhar No."
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Blood Group</label>
                 <input
                   name = "bloodgrp"
                   value={formData.bloodgrp}
                   onChange={handleChange}
                   type="text"
                   placeholder="e.g., A+, O-"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Identification Marks</label>
                 <input
                   name = "identification_marks"
                   value={formData.identification_marks}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter any visible identification marks"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Marital Status</label>
                 <select
                   name="marital_status"
                   value={formData.marital_status || ""}
                   onChange={handleChange}
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option>Single</option>
                   <option>Married</option>
                   <option>Other</option>
                 </select>
               </div>
             </div>
       
             <h2 className="text-lg font-medium my-4">Employment Details</h2>
             <div className="grid grid-cols-3 mb-16 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Employee Number</label>
                 <input
                   name = "emp_no"
                   value={formData.emp_no}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter employee number"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700">Employer</label>
                   <input
                     name="employer"
                     value={formData.employer || ""}
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter employer name"
                     className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Designation</label>
                 <input
                   name = "designation"
                   value={formData.designation}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter job designation"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Department</label>
                 <input
                   name = "department"
                   value={formData.department}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter department"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Nature of Job</label>
                 <input
                   name = "job_nature"
                   value={formData.job_nature}
                   onChange={handleChange}
                   type="text"
                   placeholder="e.g., Height Works, Fire Works"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Date of Joining</label>
                 <input
                   name = "doj"
                   value={formData.doj}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter Date of Joining"
                   defaultValue="2025/01/09"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Mode of Joining</label>
                 <select
                 name="moj"
                 value={formData.moj || ""}
                 onChange={handleChange}
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option>New Joinee</option>
                   <option>Transfer</option>
                 </select>
               </div>
             </div>
       
       
             <h2 className="text-lg font-medium my-4">Contact Details</h2>
             <div className="grid grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Phone (Personal)</label>
                 <input
                 name = "phone_personal"
                   value={formData.phone_Personal}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter 10-digit phone number"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Mail Id (Personal)</label>
                 <input
                 name = "mail_id_Personal"
                   value={formData.mail_id_Personal}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter the personal mail"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Person</label>
                 <input
                 name='emergency_contact_person'
                   value={formData.emergency_contact_person}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter 10-digit mobile number"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Phone (Office)</label>
                 <input
                 name='phone_Office'
                   value={formData.phone_Office}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter office mobile number"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Mail Id (Office)</label>
                 <input
                 name = 'mail_id_Office'
                   value={formData.mail_id_Office}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter office mail id"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Relation</label>
                 <input
                 name='emergency_contact_relation'
                   value={formData.emergency_contact_relation}
                   onChange={handleChange}
                   type="text"
                   placeholder="e.g.,Father,Spouse"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Mail Id (Emergency Contact Person)</label>
                 <input
                 name='mail_id_Emergency_Contact_Person'
                   value={formData.mail_id_Emergency_Contact_Person}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter mail"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Phone</label>
                 <input
                 name='emergency_contact_phone'
                   value={formData.emergency_contact_phone}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter Emergency Contact number"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 ">Address</label>
                 <textarea
                 name = 'address'
                   value={formData.address}
                   onChange={handleChange}
                   type="text"
                   placeholder="Enter full address"
                   className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
             </div>
             
             
           </div>
          )}
          {activeTab === "Fitness" && <Fitness/>}
          {activeTab === "Investigations" && <Investigation data={data}/>}
          {activeTab === "Vaccination" && <Vaccination data={data}/>}
          {activeTab === "Vitals" && <Vitals data={data.vitals}/>}
          {activeTab === "MedicalHistory" && <MedicalHistory data={data}/>}
        </div>
        </div>
      </div>
    </div>
  );
};

export default NewVisit;


