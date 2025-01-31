import React, { useState } from "react";
import BasicDetails from "./DocBasicDetails";
import Fitness from "./DocFitness";
import Investigation from "./DocInvestigation";
import Vaccination from "./DocVaccination";
import Vitals from "./DocVitals";
import MedicalHistory from "./DocMedicalHistory";
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
      <div className="w-full p-6 overflow-auto"> {/* Adjusted width from w-4/5 to w-11/12 */}
        <div className="bg-white rounded-lg w-full p-6 shadow-lg">
          <hr className="h-4 text-blue-100" />
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex justify-evenly space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-m focus:outline-none ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {activeTab === "DocBasicDetails" && <BasicDetails />}
            {activeTab === "DocFitness" && <Fitness />}
            {activeTab === "DocInvestigations" && <Investigation />}
            {activeTab === "DocVaccination" && <Vaccination />}
            {activeTab === "DocVitals" && <Vitals />}
            {activeTab === "DocMedicalHistory" && <MedicalHistory />}
          </div>

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
