import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const MedicalHistory = () => {
  const [personalHistory, setPersonalHistory] = useState({
    smoking: { yesNo: "", years: "", perDay: "" },
    alcohol: { yesNo: "", years: "", frequency: "" },
    paan: { yesNo: "", years: "" },
    diet: "",
  });

  const [medicalHistory, setMedicalHistory] = useState({
    selectedConditions: [],
    comments: "",
  });

  const [femaleWorker, setFemaleWorker] = useState({
    obstetricHistory: "",
    gynecologicalHistory: "",
  });

  const [surgicalHistory, setSurgicalHistory] = useState({
    comments: "",
    children: [],
  });

  const [familyHistory, setFamilyHistory] = useState({
    father: { status: "", reason: "", remarks: "" },
    paternalGrandFather: { status: "", reason: "", remarks: "" },
    paternalGrandMother: { status: "", reason: "", remarks: "" },
    mother: { status: "", reason: "", remarks: "" },
    maternalGrandFather: { status: "", reason: "", remarks: "" },
    maternalGrandMother: { status: "", reason: "", remarks: "" },
  });

  const [healthConditions, setHealthConditions] = useState({
    conditions: [],
    remarks: "",
  });

  const [submissionDetails, setSubmissionDetails] = useState({
    submittedBy: "",
    bookedTo: "",
  });

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Medical History Form</h1>

      {/* Personal History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Personal History</h2>
        <div className="space-y-4">
          <div>
            <label>Smoking</label>
            <div className="flex items-center space-x-4">
              <input type="radio" name="smoking" value="yes" /> Yes
              <input type="radio" name="smoking" value="no" /> No
              <input
                type="text"
                placeholder="Years of Smoking"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Cigarettes per day"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
          <div>
            <label>Alcohol Consumption</label>
            <div className="flex items-center space-x-4">
              <input type="radio" name="smoking" value="yes" /> Yes
              <input type="radio" name="smoking" value="no" /> No
              <input
                type="text"
                placeholder="Years of Drinking"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Consuming per day"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          </div>
          <div>
            <label>Paan/Beetle Chewer</label>
            <div className="flex items-center space-x-4">
              <input type="radio" name="smoking" value="yes" /> Yes
              <input type="radio" name="smoking" value="no" /> No
              <input
                type="text"
                placeholder="Years of Chewing"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
             
            </div>
          </div>
          <div>
            <label>Diet</label>
            <select className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Diet</option>
              <option value="mixed">Mixed</option>
              <option value="veg">Pure Veg</option>
              <option value="egg">Eggetarian</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Medical History</h2>
        <div className="space-y-4">
          <label>Select Conditions</label>
          <select multiple className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
            <option value="htn">HTN</option>
            <option value="dm">DM</option>
            <option value="epileptic">Epileptic</option>
            <option value="hyperThyroid">Hyper Thyroid</option>
            <option value="hypoThyroid">Hypo Thyroid</option>
            <option value="cvs">CVS</option>
            <option value="cns">CNS</option>
            <option value="asthma">Asthma</option>
            <option value="rs">RS</option>
            <option value="git">GIT</option>
            <option value="kub">KUB</option>
            <option value="cancer">Cancer</option>
            <option value="others">Others</option>
          </select>
          <textarea
            placeholder="Comments"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          ></textarea>
        </div>
      </div>

      {/* Female Worker */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Female Worker</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Obstetric History"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          ></textarea>
          <textarea
            placeholder="Gynecological History"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          ></textarea>
        </div>
      </div>

      {/* Surgical History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Surgical History</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Comments"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          ></textarea>
          <div>
  <label>Children</label>
  <div className="space-y-4">
    <input
      type="number"
      placeholder="Number of Children"
      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {/* Row for first three fields */}
    <div className="flex space-x-4">
      <input
        type="text"
        placeholder="Child 1 - Sex"
        className="px-4 py-2 w-1/3 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        placeholder="Child 1 - DOB"
        className="px-4 py-2 w-1/3 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Child 1 - Status"
        className="px-4 py-2 w-1/3 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    {/* Remaining fields */}
    <input
      type="text"
      placeholder="Child 1 - Reason (if expired)"
      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="text"
      placeholder="Child 1 - Remarks (Health Condition)"
      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

          </div>
        </div>
      </div>

      {/* Family History */}
      <div className="mb-6">
        <div className="space-y-4">
          
          {/* Parents and Grandparents Section */}
          <div className="mb-6">
  <h2 className="text-xl font-semibold mb-4">Parents and Grandparents</h2>
  {[
    { label: "Father" },
    { label: "Paternal Grand Father" },
    { label: "Paternal Grand Mother" },
    { label: "Mother" },
    { label: "Maternal Grand Father" },
    { label: "Maternal Grand Mother" },
  ].map(({ label }) => (
    <div key={label} className="mb-6">
      {/* Label */}
      <label className="block mb-2 font-medium text-gray-700">{label}</label>
      
      {/* Input Fields in a Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Status"
          className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Reason (if expired)"
          className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Remarks (Health Condition)"
          className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  ))}
</div>

{/* Health Conditions Section */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Health Conditions</h2>
  {[
    "HTN",
    "DM",
    "Epileptic",
    "Hyperthyroid",
    "Hypothyroid",
    "Asthma",
    "CVS",
    "CNS",
    "RS",
    "GIT",
    "KUB",
    "Cancer",
    "Others",
  ].map((condition) => (
    <div key={condition} className="mb-4">
      <label className="block font-medium mb-2">{condition}</label>
      <div className="flex space-x-4">
        <select className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
          <option value="">Select Relationship</option>
          <option value="father_bp">Father BP</option>
          <option value="father_dm">Father DM</option>
          <option value="mother_bp">Mother BP</option>
          <option value="mother_dm">Mother DM</option>
          <option value="others">Others</option>
        </select>
        <input
          type="text"
          placeholder="Remarks"
          className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>
    </div>
  ))}
</div>

{/* Submission Details */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Submission Details</h2>
  <div className="space-y-4">
    <div>
      <label className="block font-medium">Submitted By Nurse</label>
      <select className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
        <option value="">Select Nurse</option>
        <option value="nurse1">Nurse 1</option>
        <option value="nurse2">Nurse 2</option>
        <option value="nurse3">Nurse 3</option>
      </select>
    </div>
    <div>
      <label className="block font-medium">Patient Booked to Dr.</label>
      <select className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
        <option value="">Select Doctor</option>
        <option value="dr1">Dr. Smith</option>
        <option value="dr2">Dr. John</option>
        <option value="dr3">Dr. Emily</option>
      </select>
    </div>
  </div>
</div>
</div>
</div>
</div>
  )
}
export default MedicalHistory;