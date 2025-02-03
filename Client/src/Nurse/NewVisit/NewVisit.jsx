import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import BasicDetails from "./BasicDetails";
import Fitness from "./Fitness";
import Investigation from "./Investigation";
import Vaccination from "./Vaccination";
import Vitals from "./Vitals";
import MedicalHistory from "./MedicalHistory"
import { FaSearch } from "react-icons/fa";


const NewVisit = ({data}) => {
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
      <Sidebar />
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
              />
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium flex-shrink-0 w-1/4">
              Search
            </button>
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
          {activeTab === "DocBasicDetails" && <BasicDetails data={data}/>}
            {activeTab === "DocFitness" && <Fitness data={data}/>}
            {activeTab === "DocInvestigations" && <Investigation data={data}/>}
            {activeTab === "DocVaccination" && <Vaccination data={data}/>}
            {activeTab === "DocVitals" && <Vitals data={data.vitals}/>}
            {activeTab === "DocMedicalHistory" && <MedicalHistory data={data}/>}
        </div>

        
        {/* Add content for other tabs (Vitals, Medical/Surgical History, etc.) similarly */}
        {/* { id: "BasicDetails", label: "Basic Details" },
    { id: "Vitals", label: "Vitals" },
    { id: "MedicalHistory", label: "Medical/Surgical/Personal History" },
    { id: "Investigations", label: "Investigations" },
    { id: "Vaccination", label: "Vaccination" },
    { id: "Fitness", label: "Fitness" } */}
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
              Add Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVisit;


