import React, { useState } from "react";
import BasicDetails from "./BasicDetails";
import Fitness from "./Fitness";
import Investigation from "./Investigation";
import Vaccination from "./Vaccination";
import Vitals from "./Vitals";
import MedicalHistory from "./MedicalHistory";
import Sidebar from "../../Sidebar";
import VIsitHistory from "../VIsitHistory";

const NewVisit = ({data}) => {
  const [activeTab, setActiveTab] = useState("DocBasicDetails");
  const tabs = [
    { id: "DocBasicDetails", label: "Basic Details" },
    { id: "DocVitals", label: "Vitals" },
    { id: "DocMedicalHistory", label: "Medical/Surgical/Personal History" },
    { id: "DocInvestigations", label: "Investigations" },
    { id: "DocVaccination", label: "Vaccination" },
    { id: "DocFitness", label: "Fitness" },
    { id: "Visithistory", label: "Visit History" },
  ];

  return (
    <div className="h-screen w-full flex bg-[#8fcadd]">
      
      <div className="w-full mt-4 overflow-auto"> {/* Adjusted width from w-4/5 to w-11/12 */}
        
        <div className="bg-white rounded-lg w-full p-6 shadow-lg">
          <hr className="h-4 text-blue-100" />
          <div className="border-b border-gray-200 mb-4">
            <nav className="relative flex justify-evenly space-x-4 bg-gray-50 p-3 rounded-lg shadow-sm" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap py-2 px-4 font-medium text-sm focus:outline-none transition-all duration-300 ease-in-out
                    ${activeTab === tab.id 
                      ? "text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {activeTab === "DocBasicDetails" && <BasicDetails data={data}/>}
            {activeTab === "DocFitness" && <Fitness data={data.fitnessassessment}/>}
            {activeTab === "DocInvestigations" && <Investigation data={data}/>}
            {activeTab === "DocVaccination" && <Vaccination data={data.vaccination}/>}
            {activeTab === "DocVitals" && <Vitals data={data.vitals}/>}
            {activeTab === "DocMedicalHistory" && <MedicalHistory data={data}/>}
            {activeTab === "Visithistory" && <VIsitHistory data={data}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVisit;