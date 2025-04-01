import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SignificantNotes = ({ data }) => {
  // --- States requested by the user ---
  const [healthsummary, setHealthsummary] = useState('');
  const [remarks, setRemarks] = useState('');
  const [communicableDisease, setCommunicableDisease] = useState(''); // Use empty string for default select value
  const [incidentType, setIncidentType] = useState('');             // Use empty string
  const [incident, setIncident] = useState('');                     // Use empty string
  const [illnessType, setIllnessType] = useState('');               // Use empty string (corrected variable name)

  // --- State for submission status ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Options for dropdowns ---
  const communicableDiseaseOptions = [
    { value: 'CD1', label: 'CD1' }, // Corrected values to match labels for simplicity
    { value: 'CD2', label: 'CD2' },
    { value: 'Unknown', label: 'Unknown' }, // Corrected value
  ];

  const incidentTypeOptions = [
    { value: 'FAC', label: 'Fac' },
    { value: 'LTI', label: 'LTI' },
    { value: 'MTC', label: 'MTC' },
    { value: 'FATAL', label: 'Fatal' },
  ];

  const incidentOptions = [
    { value: 'Occupational Injury', label: 'Occupational Injury' },
    { value: 'Domestic Injury', label: 'Domestic Injury' },
    { value: 'Communication Injury', label: 'Communication Injury' },
    { value: 'Other Injury', label: 'Other Injury' },
  ];

  const illnessTypeOptions = [
    { value: 'Occupational Illness', label: 'Occupational Illness' },
    { value: 'Occupational Disease', label: 'Occupational Disease' },
  ];

  // --- Extract employee number and check access level ---
  const emp_no = data && data.length > 0 ? data[0]?.emp_no : null; // Safer access
  const accessLevel = localStorage.getItem('accessLevel');
  const isDoctor = accessLevel === 'doctor' || accessLevel === 'nurse';

  // --- useEffect to potentially load existing data ---
  useEffect(() => {
    // Assuming the significant notes might be nested in the data object
    // Adjust the path (e.g., data[0]?.significant_notes) if needed
    const existingNotes = data && data.length > 0 ? data[0]?.significant_notes : null; // Example path

    if (existingNotes) {
      setHealthsummary(existingNotes.healthsummary || '');
      setRemarks(existingNotes.remarks || '');
      setCommunicableDisease(existingNotes.communicable_disease || ''); // Adjust key names if different in backend data
      setIncidentType(existingNotes.incident_type || '');
      setIncident(existingNotes.incident || '');
      setIllnessType(existingNotes.illness_type || '');
    } else {
      // Optionally reset fields if data structure changes or employee changes
      setHealthsummary('');
      setRemarks('');
      setCommunicableDisease('');
      setIncidentType('');
      setIncident('');
      setIllnessType('');
    }
  }, [data]); // Rerun when data prop changes

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!emp_no) {
        alert("Employee number is missing. Cannot submit.");
        return;
    }
    setIsSubmitting(true);

    // --- Prepare payload with only the requested fields ---
    const significantNotesData = {
      emp_no: emp_no,
      health_summary: healthsummary, // Use snake_case matching typical backend conventions
      remarks: remarks,
      communicable_disease: communicableDisease,
      incident_type: incidentType,
      incident: incident,
      illness_type: illnessType,
      // Add submitted_by field if needed by backend (e.g., doctor's ID)
      // submitted_by: isDoctor ? localStorage.getItem('userId') : null, // Example
    };

    try {
      // *** IMPORTANT: Update the URL to your actual endpoint for saving significant notes ***
      // The previous URL '/consultations/add/' might be incorrect for this specific data.
      const response = await axios.post("http://localhost:8000/significant_notes/add/", significantNotesData); // Example URL

      if (response.status === 200 || response.status === 201) { // Check for 201 Created as well
        alert("Significant notes submitted successfully!");
        // Optionally clear the form or perform other actions on success
      } else {
        console.error('Error submitting notes:', response.status, response.data);
        alert(`Error submitting significant notes (${response.status}). Please try again.`);
      }
    } catch (error) {
      console.error('Error submitting notes:', error);
      if (error.response) {
        // Server responded with a status code outside 2xx range
        console.error("Server Error Data:", error.response.data);
        console.error("Server Error Status:", error.response.status);
        alert(`Server error (${error.response.status}): ${error.response.data.detail || 'Please check details and try again.'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        alert("Could not connect to the server. Please check your connection.");
      } else {
        // Something else happened in setting up the request
        console.error("Request Setup Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form only if emp_no is available
  if (!emp_no) {
      return <div className="p-6 text-center text-red-600">No employee selected or data available.</div>;
  }

  return (
    <div className="bg-white min-h-screen p-6 rounded-lg"> {/* Added shadow/rounded */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Significant Notes</h2> {/* Adjusted heading */}

      <form onSubmit={handleSubmit}>
        {/* Health Summary */}
        <div className="mb-4"> {/* Reduced margin */}
          <label className="block text-gray-700 mb-1 text-sm font-medium" htmlFor="healthsummary"> {/* Adjusted label style */}
            Health Summary
          </label>
          <textarea
            id="healthsummary"
            className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm" /* Adjusted style */
            rows="4"
            placeholder="Enter overall health summary..."
            value={healthsummary}
            onChange={(e) => setHealthsummary(e.target.value)}
            disabled={!isDoctor}
          ></textarea>
        </div>

        {/* Remarks */}
        <div className="mb-16">
          <label className="block text-gray-700 mb-1 text-sm font-medium" htmlFor="remarks">
            Remarks / Defaults
          </label>
          <textarea
            id="remarks"
            className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
            rows="4"
            placeholder="Enter any relevant remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={!isDoctor}
          ></textarea>
        </div>

        {/* Dropdowns in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 mt-16 gap-4 mb-4">
          {/* Communicable Disease */}
          <div>
            <label htmlFor="communicableDisease" className="block text-gray-700 text-sm font-medium mb-1">
              Communicable Disease
            </label>
            <select
              id="communicableDisease"
              className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
              value={communicableDisease}
              onChange={(e) => setCommunicableDisease(e.target.value)}
              disabled={!isDoctor}
            >
              <option value="">Select...</option>
              {communicableDiseaseOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Incident Type */}
          <div>
            <label htmlFor="incidentType" className="block text-gray-700 text-sm font-medium mb-1">
              Incident Type
            </label>
            <select
              id="incidentType"
              className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              disabled={!isDoctor}
            >
              <option value="">Select...</option>
              {incidentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Incident */}
          <div>
            <label htmlFor="incident" className="block text-gray-700 text-sm font-medium mb-1">
              Incident
            </label>
            <select
              id="incident"
              className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              disabled={!isDoctor}
            >
              <option value="">Select...</option>
              {incidentOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Illness Type */}
          <div>
            <label htmlFor="illnessType" className="block text-gray-700 text-sm font-medium mb-1">
              Illness Type
            </label>
            <select
              id="illnessType"
              className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
              value={illnessType}
              onChange={(e) => setIllnessType(e.target.value)} // Corrected state setter
              disabled={!isDoctor}
            >
              <option value="">Select...</option>
              {illnessTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-sm ${(!isDoctor || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isDoctor || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignificantNotes;