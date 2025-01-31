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
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Cigarettes per day"
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label>Alcohol Consumption</label>
            <div className="space-y-2">
              <input type="radio" name="alcohol" value="yes" /> Yes
              <input type="radio" name="alcohol" value="no" /> No
              <input
                type="text"
                placeholder="Years of Drinking"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="How Often (e.g., Occasional)"
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label>Paan/Beetel Chewing</label>
            <div className="space-y-2">
              <input type="radio" name="paan" value="yes" /> Yes
              <input type="radio" name="paan" value="no" /> No
              <input
                type="text"
                placeholder="Years of Chewing"
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label>Diet</label>
            <select className="border p-2 rounded">
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
          <select multiple className="border p-2 rounded w-full">
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
            className="border p-2 rounded w-full"
          ></textarea>
        </div>
      </div>

      {/* Female Worker */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Female Worker</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Obstetric History"
            className="border p-2 rounded w-full"
          ></textarea>
          <textarea
            placeholder="Gynecological History"
            className="border p-2 rounded w-full"
          ></textarea>
        </div>
      </div>

      {/* Surgical History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Surgical History</h2>
        <div className="space-y-4">
          <textarea
            placeholder="Comments"
            className="border p-2 rounded w-full"
          ></textarea>
          <div>
            <label>Children</label>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Number of Children"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Child 1 - Sex"
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Child 1 - DOB"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Child 1 - Status"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Child 1 - Reason (if expired)"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Child 1 - Remarks (Health Condition)"
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Family History */}
      <div className="mb-6">
        <div className="space-y-4">
          <div>
            
          </div>
          {/* Parents and Grandparents Section */}
<div className="mb-6">
  <h2 className="text-xl font-semibold">Parents and Grandparents</h2>
  {[
    { label: "Father" },
    { label: "Paternal Grand Father" },
    { label: "Paternal Grand Mother" },
    { label: "Mother" },
    { label: "Maternal Grand Father" },
    { label: "Maternal Grand Mother" },
  ].map(({ label }) => (
    <div key={label} className="space-y-4">
      <label>{label}</label>
      <input
        type="text"
        placeholder="Status"
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Reason (if expired)"
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Remarks (Health Condition)"
        className="border p-2 rounded w-full"
      />
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
        <select className="border p-2 rounded w-full">
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
          className="border p-2 rounded w-full"
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
      <select className="border p-2 rounded w-full">
        <option value="">Select Nurse</option>
        <option value="nurse1">Nurse 1</option>
        <option value="nurse2">Nurse 2</option>
        <option value="nurse3">Nurse 3</option>
      </select>
    </div>
    <div>
      <label className="block font-medium">Patient Booked to Dr.</label>
      <select className="border p-2 rounded w-full">
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