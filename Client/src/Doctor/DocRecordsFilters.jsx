import React, { useState } from "react";
import Sidebar from '../Sidebar/DocSideBar';

const RecordsFilters = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleButtonClick = (section) => {
    setSelectedSection(section);
  };

  

  return (
    <div className="h-screen flex">
      <Sidebar/>
      <div className="flex justify-center items-center flex-wrap space-x-4 absolute top-0 left-0 w-full mt-4 ml-20">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("position")}
        >
          Position
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("personaldetails")}
        >
          Personal Details
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("employmentdetails")}
        >
          Employment Details
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("medicalhistory")}
        >
          Medical History
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("vaccination")}
        >
          Vaccination
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("employmentstatus")}
        >
          Employment Status
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("preventive")}
        >
          Preventive
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => handleButtonClick("curative")}
        >
          Curative
        </button>
      </div>

      {/* Conditionally Render Content Based on Selected Section */}
      <div className="mt-4">
      {selectedSection === "position" && (
  <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-16">
    <h2 className="text-xl font-semibold mb-4">Position</h2>
    <div className="space-y-4">
      {/* Employee */}
      <div>
        <input
          type="radio"
          id="employee"
          name="position"
          value="employee"
          className="mr-2"
        />
        <label htmlFor="employee" className="text-sm font-medium">
          Employee
        </label>
      </div>

      {/* Contractor */}
      <div>
        <input
          type="radio"
          id="contractor"
          name="position"
          value="contractor"
          className="mr-2"
        />
        <label htmlFor="contractor" className="text-sm font-medium">
          Contractor
        </label>
      </div>

      {/* Visitor */}
      <div>
        <input
          type="radio"
          id="visitor"
          name="position"
          value="visitor"
          className="mr-2"
        />
        <label htmlFor="visitor" className="text-sm font-medium">
          Visitor
        </label>
      </div>
    </div>
  </div>
)}

        {selectedSection === "personaldetails" && (
             <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-16">
             <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
             
             <label className="block text-sm font-medium text-gray-700">
  Age
</label>
<div className="flex items-center space-x-4">
  <div className="flex items-center space-x-2">
    <span className="text-gray-700">From</span>
    <input
      type="number"
      min="18"
      max="100"
      className="mt-1 p-2 border border-gray-300 rounded w-24"
      placeholder="18"
    />
  </div>
  <div className="flex items-center space-x-2">
    <span className="text-gray-700">To</span>
    <input
      type="number"
      min="18"
      max="100"
      className="mt-1 p-2 border border-gray-300 rounded w-24"
      placeholder="100"
    />
  </div>
</div>

       
               {/* Sex Input */}
               <div>
                 <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                   Sex
                 </label>
                 <select
                   className="mt-1 p-2 border border-gray-300 rounded w-full"
                 >
                   <option value="">Select Sex</option>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
       
               {/* Blood Group Input */}
               <div>
                 <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                   Blood Group
                 </label>
                 <input
                
                   className="mt-1 p-2 border border-gray-300 rounded w-full"
                   placeholder="Enter Blood Group"
                 />
               </div>
       
               {/* Marital Status Input */}
               <div>
                 <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                   Marital Status
                 </label>
                 <select
                   className="mt-1 p-2 border border-gray-300 rounded w-full"
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
                   
                   className="mt-1 p-2 border border-gray-300 rounded w-full"
                   placeholder="Enter BMI"
                 />
               </div>
       
               <button
                 type="submit"
                 className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
               >
                 Submit
               </button>
            
           </div>
        )}
        {selectedSection === "employmentdetails" && (
          <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-4">Employment Details</h2>
          
            {/* Employer Dropdown */}
            <div>
              <label

                className="block text-sm font-medium text-gray-700"
              >
                Employer
              </label>
              <select>
                <option value="">Select Employer</option>
                <option value="JSW Steel">JSW Steel</option>
                <option value="JSW Cement">JSW Cement</option>
                <option value="JSW Energy">JSW Energy</option>
              </select>
            </div>
    
            {/* Mode of Joining Dropdown */}
            <div>
              <label
                htmlFor="modeOfJoining"
                className="block text-sm font-medium text-gray-700"
              >
                Mode of Joining
              </label>
              <select
                
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Mode of Joining</option>
                <option value="New Joinee">New Joinee</option>
                <option value="Transfer from other JSW Sites">
                  Transfer from other JSW Sites
                </option>
              </select>
            </div>
    
            {/* Date of Joining */}
            <div>
              <label
                htmlFor="dateOfJoining"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Joining
              </label>
              <input
              
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
    
            {/* Designation Dropdown */}
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-gray-700"
              >
                Designation
              </label>
              <select
                
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Designation</option>
                <option value="Manager">Manager</option>
                <option value="Engineer">Engineer</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
    
            {/* Department Dropdown */}
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <select
                
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
    
            {/* Nature of Job Dropdown */}
            <div>
              <label
                htmlFor="natureOfJob"
                className="block text-sm font-medium text-gray-700"
              >
                Nature of Job
              </label>
              <select
          
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Nature of Job</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contractual">Contractual</option>
              </select>
            </div>
    
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
            >
              Submit
            </button>
          
        </div>
        )}
        {selectedSection === "medicalhistory" && (
          <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-4">Medical History</h2>
         
            {/* Personal History */}
            <div>
              <h3 className="text-xl font-semibold">Personal History</h3>
              <div className="space-y-2">
                {/* Smoker */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Smoker</label>
                  <div className="flex space-x-4">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        
                       
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        
                        
                      />
                      No
                    </label>
                  </div>
                </div>
    
                {/* Alcoholic */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Alcoholic</label>
                  <div className="flex space-x-4">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        
                        
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        
                        
                      />
                      No
                    </label>
                  </div>
                </div>
    
                {/* Paan Beetke Chewer */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Paan Beetke Chewer
                  </label>
                  <div className="flex space-x-4">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        
                        
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        
                        
                      />
                      No
                    </label>
                  </div>
                </div>
    
                {/* Diet Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Diet Type</label>
                  <select
                   
                  
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">Select Diet Type</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Mixed Diet">Mixed Diet</option>
                  </select>
                </div>
              </div>
            </div>
    
            {/* Surgical History */}
            <div>
              <h3 className="text-xl font-semibold">Surgical History</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    From Date
                  </label>
                  <input
                    type="date"
                  
                    
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
    
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    To Date
                  </label>
                  <input
                    type="date"
                   
                   
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
              </div>
            </div>
    
            {/* Allergy History */}
            <div>
              <h3 className="text-xl font-semibold">Allergy History</h3>
              <div className="space-y-2">
                {/* Drug Allergy */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Drug Allergy
                  </label>
                  <input
                    type="text"
                  
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    placeholder="Enter drug allergy details"
                  />
                </div>
    
                {/* Food Allergy */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Food Allergy
                  </label>
                  <input
                    type="text"
                 
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    placeholder="Enter food allergy details"
                  />
                </div>
    
                {/* Other Allergy */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Other Allergy
                  </label>
                  <input
                    type="text"
                  
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    placeholder="Enter other allergy details"
                  />
                </div>
              </div>
            </div>
    
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
              >
                Submit
              </button>
            </div>
         
        </div>
        )}
        {selectedSection === "vaccination" && (
          <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-16">
          <h2 className="text-xl font-semibold mb-4">Vaccination</h2>
    
          {/* Disease Dropdown */}
          <div className="mb-4">
            <label htmlFor="disease" className="block text-sm font-medium mb-2">
              Select Disease
            </label>
            <select
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select a disease
              </option>
            </select>
          </div>
    
          {/* Status (Partial/Completed) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Vaccination Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                />
                Partial
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                />
                Completed
              </label>
            </div>
          </div>
    
          {/* Dose Dropdown */}
          <div className="mb-4">
            <label htmlFor="dose" className="block text-sm font-medium mb-2">
              Select Vaccine Name
            </label>
            <select
              className="w-full p-2 border rounded"
            >
            </select>
          </div>
        </div>
        )}
        {selectedSection === "employmentstatus" && (
          <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-16">
          <h2 className="text-xl font-semibold mb-4">Employment Status</h2>
    
          {/* Dropdown for Employment Status */}
          <div className="mb-4">
            <label htmlFor="employmentStatus" className="block text-sm font-medium mb-2">
              Select Employment Status
            </label>
            <select
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value="active">Active</option>
              <option value="transferred">Transferred</option>
              <option value="resigned">Resigned</option>
              <option value="retired">Retired</option>
              <option value="deceased">Deceased</option>
              <option value="unauthorized_absence">Unauthorized Absence</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        )}
        {selectedSection === "preventive" && (
  <div className="mt-16">
    <h2 className="text-xl font-semibold mb-4">Preventive Status</h2>
    <div className="flex flex-wrap gap-4 mt-4">
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleButtonClick("medicalexamination")}>
        Medical Examination
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleButtonClick("periodicworkfitness")}>
        Periodic Work Fitness
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleButtonClick("fitnessaftermedicalleave")}
      >Fitness After Medical Leave
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleButtonClick("mockdrill")}>
        Mock Drill
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleButtonClick("bpsugarcheck")}>
        BP Sugar Check
      </button>
    </div>
  </div>
)}
{selectedSection === "medicalexamination" && (
          <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-16">
          <h2 className="text-xl font-semibold mb-4">Medical Examination</h2>
    
          {/* Dropdown for Employment Status */}
          <div className="mb-4">
            <label htmlFor="employmentStatus" className="block text-sm font-medium mb-2">
              Select Medical Examination
            </label>
            <select
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="active">Preemployment</option>
              <option value="transferred">Preemployment (Food Handler)</option>
              <option value="resigned">Preplacement</option>
              <option value="retired">Annual / Periodical</option>
              <option value="deceased">Periodical (Food Handler)</option>
              <option value="unauthorized_absence">Camps (Mandatory)</option>
              <option value="others">Camps (Optional)</option>
            </select>
          </div>
        </div>
        )}
        {selectedSection === "periodicworkfitness" && (
  <div className="p-6 max-w-lg mx-auto bg-white shadow rounded mt-16">
    <h2 className="text-2xl font-semibold mb-4">Periodic Work Fitness</h2>

    {/* Select Periodic Work Fitness Type */}
    <div className="mb-4">
      <label htmlFor="fitnessType" className="block text-sm font-medium mb-2">
        Select Periodic Work Fitness
      </label>
      <select
        id="fitnessType"
        className="w-full p-2 border rounded"
      >
        <option value="" disabled>
          Select a type
        </option>
        <option value="special">Special Work Fitness</option>
        <option value="renewal">Special Work Fitness (Renewal)</option>
      </select>
    </div>

    {/* Additional Dropdown for Specific Types */}
    <div className="mb-4">
      <label htmlFor="specificFitness" className="block text-sm font-medium mb-2">
        Select Specific Work Fitness
      </label>
      <select
        id="specificFitness"
        className="w-full p-2 border rounded"
      >
        <option value="" disabled>
          Select a category
        </option>
        <option value="height">Height</option>
        <option value="gasLine">Gas Line</option>
        <option value="confinedSpace">Confined Space</option>
        <option value="scbaRescue">SCBA Rescue</option>
        <option value="fireRescue">Fire Rescue</option>
        <option value="lone">Lone</option>
        <option value="fisherMan">Fisher Man</option>
        <option value="snakeCatcher">Snake Catcher</option>
      </select>
    </div>

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
      >
        Submit
      </button>
    </div>
  </div>
)}

        {selectedSection === "fitnessaftermedicalleave" && (
  <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-16">
    <h2 className="text-2xl font-semibold mb-4">Fitness After Medical Leave</h2>
    
    {/* Fitness Confirmation */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Are you fit for work?
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="fitnessStatus"
            value="yes"
            className="mr-2"
          />
          Yes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="fitnessStatus"
            value="no"
            className="mr-2"
          />
          No
        </label>
      </div>
    </div>

    {/* Date of Fitness Evaluation */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date of Fitness Evaluation
      </label>
      <input
        type="date"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Comments */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Comments
      </label>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Add any additional details or comments..."
      ></textarea>
    </div>

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
      >
        Submit
      </button>
    </div>
  </div>
)}
{selectedSection === "mockdrill" && (
  <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-16">
    <h2 className="text-2xl font-semibold mb-4">Mockdrill</h2>
    
    {/* Fitness Confirmation */}
    <div className="mb-4">
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="yes"
            className="mr-2"
          />
          Yes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="no"
            className="mr-2"
          />
          No
        </label>
      </div>
    </div>

    {/* Date of Fitness Evaluation */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date of Mockdrill
      </label>
      <input
        type="date"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
    <div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
      >
        Submit
      </button>
    </div>
  </div>
)}
{selectedSection === "bpsugarcheck" && (
  <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-16">
    <h2 className="text-2xl font-semibold mb-4">BP and Sugar Check</h2>

    {/* Blood Pressure Input */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Blood Pressure (mmHg)
      </label>
      <input
        type="range"
        min="80"
        max="200"
        step="1"
        className="w-full"
        id="bpRange"
        onChange={(e) =>
          document.getElementById("bpValue").innerText = e.target.value
        }
      />
      <p className="text-sm text-gray-600 mt-1">
        Value: <span id="bpValue">120</span> mmHg
      </p>
    </div>

    {/* Sugar Level Input */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sugar Level (mg/dL)
      </label>
      <input
        type="range"
        min="50"
        max="300"
        step="1"
        className="w-full"
        id="sugarRange"
        onChange={(e) =>
          document.getElementById("sugarValue").innerText = e.target.value
        }
      />
      <p className="text-sm text-gray-600 mt-1">
        Value: <span id="sugarValue">100</span> mg/dL
      </p>
    </div>

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
      >
        Submit
      </button>
    </div>
  </div>
)}
{selectedSection === "curative" && (
  <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-16">
    <h2 className="text-xl font-semibold mb-4">Curative</h2>

    {/* Illness */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Illness</label>
      <div>
        <input type="radio" id="illnessYes" name="illness" value="yes" />
        <label htmlFor="illnessYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="illnessNo" name="illness" value="no" />
        <label htmlFor="illnessNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* Over Counter Illness */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Over Counter Illness</label>
      <div>
        <input type="radio" id="overCounterIllnessYes" name="overCounterIllness" value="yes" />
        <label htmlFor="overCounterIllnessYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="overCounterIllnessNo" name="overCounterIllness" value="no" />
        <label htmlFor="overCounterIllnessNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* Injury */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Injury</label>
      <div>
        <input type="radio" id="injuryYes" name="injury" value="yes" />
        <label htmlFor="injuryYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="injuryNo" name="injury" value="no" />
        <label htmlFor="injuryNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* Over Counter Injury */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Over Counter Injury</label>
      <div>
        <input type="radio" id="overCounterInjuryYes" name="overCounterInjury" value="yes" />
        <label htmlFor="overCounterInjuryYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="overCounterInjuryNo" name="overCounterInjury" value="no" />
        <label htmlFor="overCounterInjuryNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* Follow-up Visits */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Follow-up Visits</label>
      <div>
        <input type="radio" id="followupYes" name="followupVisits" value="yes" />
        <label htmlFor="followupYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="followupNo" name="followupVisits" value="no" />
        <label htmlFor="followupNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* BP Sugar Chart */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">BP Sugar Chart</label>
      <div className="flex gap-4">
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="From"
          min="0"
        />
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="To"
          min="0"
        />
      </div>
    </div>

    {/* Injury Outside the Premises */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Injury Outside the Premises</label>
      <div>
        <input type="radio" id="injuryOutsideYes" name="injuryOutside" value="yes" />
        <label htmlFor="injuryOutsideYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="injuryOutsideNo" name="injuryOutside" value="no" />
        <label htmlFor="injuryOutsideNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* Over Counter Injury Outside the Premises */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Over Counter Injury Outside the Premises
      </label>
      <div>
        <input
          type="radio"
          id="overCounterInjuryOutsideYes"
          name="overCounterInjuryOutside"
          value="yes"
        />
        <label htmlFor="overCounterInjuryOutsideYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="overCounterInjuryOutsideNo"
          name="overCounterInjuryOutside"
          value="no"
        />
        <label htmlFor="overCounterInjuryOutsideNo" className="ml-2">
          No
        </label>
      </div>
    </div>

    {/* Alcohol Abuse */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Alcohol Abuse</label>
      <div>
        <input type="radio" id="alcoholYes" name="alcoholAbuse" value="yes" />
        <label htmlFor="alcoholYes" className="ml-2">
          Yes
        </label>
      </div>
      <div>
        <input type="radio" id="alcoholNo" name="alcoholAbuse" value="no" />
        <label htmlFor="alcoholNo" className="ml-2">
          No
        </label>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default RecordsFilters;
