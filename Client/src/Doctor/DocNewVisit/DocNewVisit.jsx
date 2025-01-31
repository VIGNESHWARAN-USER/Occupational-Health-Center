import React, { useState } from "react";
import Sidebar from "../../Sidebar/DocSideBar";
import BasicDetails from "./DocBasicDetails";
import Fitness from "./DocFitness";
import Investigation from "./DocInvestigation";
import Vaccination from "./DocVaccination";
import Vitals from "./DocVitals";
import MedicalHistory from "./DocMedicalHistory"
import { FaSearch } from "react-icons/fa";

const NewVisit = () => {
  const [activeTab, setActiveTab] = useState("DocBasicDetails");
  
  const tabs = [
    { id: "DocBasicDetails", label: "Basic Details" },
    { id: "DocVitals", label: "Vitals" },
    { id: "DocMedicalHistory", label: "Medical/Surgical/Personal History" },
    { id: "DocInvestigations", label: "Investigations" },
    { id: "DocVaccination", label: "Vaccination" },
    { id: "DocFitness", label: "Fitness" },
  ];

  return (
    <div className="h-screen w-full flex">
    <Sidebar/>
      <div className="w-4/5 p-6 overflow-auto">
      <h2 className="text-xl font-bold mb-4">New Visit</h2>
        <div className="bg-white rounded-lg w-full p-6 shadow-lg">
          <div className='w-full flex items-center mb-8 space-x-4'>
            <h1 className="text-2xl font-bold">Get User</h1>
            <div className='relative flex-grow'>
                <FaSearch className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-700' />
                <input 
                  type="text" 
                  placeholder='Search By Employee ID' 
                  className='w-full bg-blue-100 py-2 pl-10 pr-4 rounded-lg'
                />
            </div>
            <button 
              className='bg-blue-500 text-white py-2 px-4 rounded-lg font-medium flex-shrink-0 w-1/4'>
              Search
            </button>
        </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Type</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>Employee</option>
              <option>Contractor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Type of Visit</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>Preventive</option>
              <option>Curative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Purpose</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>Medical Examination</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Register</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>Pre Employment</option>
            </select>
          </div>
        </div>
        <hr className="h-4 text-blue-100"/>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex justify-evenly space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium  text-m focus:outline-none ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          {activeTab === "DocBasicDetails" && (<BasicDetails/>)}
          {activeTab === "DocFitness" && (<Fitness/>)}
          {activeTab === "DocInvestigations" && (<Investigation/>)}
          {activeTab === "DocVaccination" && (<Vaccination/>)}
          {activeTab === "DocVitals" && (<Vitals/>)}
          {activeTab === "DocMedicalHistory" && (<MedicalHistory/>)}
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
