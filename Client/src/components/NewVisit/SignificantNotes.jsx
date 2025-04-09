import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Helper component to display historical entries (remains the same)
const HistoryList = ({ title, notes, fieldKey, isLoading, error }) => {
    // Sort notes by date descending (most recent first)
    const sortedNotes = [...notes].sort((a, b) => {
        const dateA = a.entry_date ? new Date(a.entry_date) : 0;
        const dateB = b.entry_date ? new Date(b.entry_date) : 0;
        // Handle potential invalid dates gracefully
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1; // Put invalid dates at the end
        if (isNaN(dateB)) return -1; // Put invalid dates at the end
        return dateB - dateA;
    });

    return (
        <div className="h-full flex flex-col"> {/* Ensures the container takes full height */}
            <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">{title}</h4>
            {isLoading && <p className="text-xs text-blue-500 animate-pulse">Loading history...</p>}
            {error && <p className="text-xs text-red-500">Error: {error}</p>}
            {!isLoading && !error && notes.length === 0 && (
                <p className="text-xs text-gray-400 italic">No history available.</p>
            )}
            {!isLoading && !error && notes.length > 0 && (
                 // Check if any note actually has a value for the specific fieldKey
                 sortedNotes.some(note => note[fieldKey]) ? (
                    <div className="overflow-y-auto h-40 md:h-48 border rounded-md p-2 bg-gray-50 flex-grow shadow-inner"> {/* Adjusted height & styling */}
                        <ul className="space-y-2">
                            {/* Filter out entries where the specific field is empty/null */}
                            {sortedNotes.filter(note => note[fieldKey]).map((note, index) => (
                                <li key={note.id || index} className="text-xs border-b last:border-b-0 pb-1">
                                    <span className="font-medium text-gray-500 mr-1">
                                        {note.entry_date ? new Date(note.entry_date).toLocaleDateString() : 'No Date'}:
                                    </span>
                                    <span className="text-gray-700 whitespace-pre-wrap break-words">
                                        {/* Display the value for the specific fieldKey */}
                                        {note[fieldKey]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                 ) : (
                    <p className="text-xs text-gray-400 italic mt-2">No historical entries for {title.toLowerCase()}.</p>
                 )
            )}
        </div>
    );
};


const SignificantNotes = ({ data, type }) => {
  // --- States for current input ---
  const [healthsummary, setHealthsummary] = useState('');
  const [remarks, setRemarks] = useState('');
  const [communicableDisease, setCommunicableDisease] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [incident, setIncident] = useState('');
  const [illnessType, setIllnessType] = useState('');

  // --- State for submission status ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- States for historical data ---
  const [historicalNotes, setHistoricalNotes] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  // --- State for previous communicable disease entry (still useful for quick view) ---
  const [previousCommunicableDisease, setPreviousCommunicableDisease] = useState('');

  // --- Dropdown Options (replace with your actual options) ---
  const communicableDiseaseOptions = [
    { value: '', label: 'Select...' }, // Add a default empty option
    { value: 'CD1', label: 'CD1' },
    { value: 'CD2', label: 'CD2' },
    { value: 'CD1andCD2', label: 'CD1 and CD2' },
  ];
  const incidentTypeOptions = [ { value: '', label: 'Select...' }, { value: 'FAC', label: 'FAC' }, { value: 'LTI', label: 'LTI' }, { value: 'MTC', label: 'MTC' }, { value: 'FATAL', label: 'FATAL' } ];
  const incidentOptions = [ /* ...options... */ { value: '', label: 'Select...' }, {value: 'Occupational Injury', label: 'Occupational Injury'}, {value: 'Domestic Injury', label: 'Domestic Injury'}, {value: 'Communication Injury', label: 'Communication Injury'}, {value: 'Others', label: 'Others'} ];
  const illnessTypeOptions = [ /* ...options... */ { value: '', label: 'Select...' }, {value: 'Occupational Illness', label: 'Occupational Illness'}, {value: 'Occupational Disease', label: 'Occupational Disease'} ];


  // --- Extract employee number and check access level ---
  const emp_no = data && data.length > 0 ? data[0]?.emp_no : null;
  const accessLevel = typeof window !== 'undefined' ? localStorage.getItem('accessLevel') : null; // Check for window object
  const isDoctor = accessLevel === 'doctor' || accessLevel === 'nurse';

  // Function to fetch history and find previous entry (remains mostly the same)
  const fetchHistory = async (employeeNumber) => {
        if (!employeeNumber) return;

        setIsLoadingHistory(true);
        setHistoryError(null);
        setHistoricalNotes([]);
        setPreviousCommunicableDisease(''); // Reset previous value on fetch
        try {
            const response = await axios.post(`https://occupational-health-center-1.onrender.com/get_notes/${employeeNumber}`);
            console.log("Fetched Historical Notes:", response.data);

            // Ensure fetchedNotesArray is always an array
            let fetchedNotesArray = [];
            if (response.data?.data && Array.isArray(response.data.data)) {
                fetchedNotesArray = response.data.data;
            } else if (Array.isArray(response.data)) {
                 fetchedNotesArray = response.data;
            } else {
                 console.warn("Fetched history data is not in expected array format:", response.data);
            }


            // Sort notes descending by date for finding previous entry and for display
            const sortedNotes = [...fetchedNotesArray].sort((a, b) => {
                const dateA = a.entry_date ? new Date(a.entry_date) : 0;
                const dateB = b.entry_date ? new Date(b.entry_date) : 0;
                if (isNaN(dateA) && isNaN(dateB)) return 0;
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;
                return dateB - dateA;
            });

            // Set historical notes state (used by all HistoryList components)
            setHistoricalNotes(sortedNotes);

            // Find the *most recent previous* entry (could be the latest if submitting new)
            // that has a non-empty communicable_disease value
            let prevValue = '';
            // Start from the first entry (index 0) as we want the absolute latest historical value
            for (let i = 0; i < sortedNotes.length; i++) {
                 if (sortedNotes[i]?.communicable_disease) {
                    // Check if the current input field is already populated with this exact latest value
                    // If so, we want the one *before* that.
                    const latestNotes = data && data.length > 0 ? data[0]?.significant_notes : null;
                    if (latestNotes?.communicable_disease === sortedNotes[i].communicable_disease && i + 1 < sortedNotes.length) {
                         // Find the next non-empty one
                         for (let j = i + 1; j < sortedNotes.length; j++) {
                            if (sortedNotes[j]?.communicable_disease) {
                                prevValue = sortedNotes[j].communicable_disease;
                                break;
                            }
                         }
                    } else {
                        prevValue = sortedNotes[i].communicable_disease;
                    }
                    break; // Found the relevant previous value
                 }
            }

             // Update: Simplify finding the 'previous' entry. Show the most recent historical entry.
             // The logic above might be overly complex. Let's just find the first historical entry with a value.
             prevValue = '';
             for (let i = 0; i < sortedNotes.length; i++) {
                if (sortedNotes[i]?.communicable_disease) {
                    prevValue = sortedNotes[i].communicable_disease;
                    break; // Found the most recent non-empty previous value
                }
             }

            setPreviousCommunicableDisease(prevValue);
            // --- End finding previous entry ---

        } catch (err) {
            console.error("Error fetching history:", err);
            setHistoryError(err.response?.data?.detail || err.message || "Failed to fetch history.");
        } finally {
            setIsLoadingHistory(false);
        }
    };


  // --- useEffect to load existing data AND fetch history ---
  useEffect(() => {
    // 1. Set current fields based on the latest entry (if available)
    // This usually represents the *last saved state* or data passed for a new entry.
    const latestNotes = data && data.length > 0 ? data[0]?.significant_notes : null;

    if (latestNotes) {
        setHealthsummary(latestNotes.healthsummary || '');
        setRemarks(latestNotes.remarks || '');
        setCommunicableDisease(latestNotes.communicable_disease || '');
        setIncidentType(latestNotes.incident_type || '');
        setIncident(latestNotes.incident || '');
        setIllnessType(latestNotes.illness_type || '');
    } else {
      // Reset fields if no latest data is passed (e.g., creating a new record)
      setHealthsummary('');
      setRemarks('');
      setCommunicableDisease('');
      setIncidentType('');
      setIncident('');
      setIllnessType('');
    }

    // 2. Fetch historical notes if emp_no is available
    if (emp_no) {
        fetchHistory(emp_no);
    } else {
        // No emp_no, clear history state
        setHistoricalNotes([]);
        setPreviousCommunicableDisease('');
        setIsLoadingHistory(false);
        setHistoryError(null);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, emp_no]); // Rerun when data or emp_no changes


  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emp_no) {
        alert("Employee number is missing. Cannot submit.");
        return;
    }
    // Relax validation: Allow submission even if only dropdowns are selected
    // if (!healthsummary.trim() && !remarks.trim() && !communicableDisease && !incidentType && !incident && !illnessType) {
    //     alert("Please enter at least one piece of information (Summary, Remarks, or select a dropdown value).");
    //     return;
    // }
    setIsSubmitting(true);
    const significantNotesData = {
      emp_no: emp_no,
      healthsummary: healthsummary || null, // Send null if empty
      remarks: remarks || null,
      communicable_disease: communicableDisease || null,
      incident_type: incidentType || null,
      incident: incident || null,
      illness_type: illnessType || null,
    };
    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/significant_notes/add/", significantNotesData);
      if (response.status === 200 || response.status === 201) {
        alert("Significant notes submitted successfully!");
        // Don't clear fields immediately, wait for data refresh? Or clear selectively?
        // For now, let's clear them for a fresh entry feel.
        setHealthsummary(''); setRemarks(''); setCommunicableDisease('');
        setIncidentType(''); setIncident(''); setIllnessType('');

        // IMPORTANT: Refetch history AFTER successful submission to include the new entry
        fetchHistory(emp_no);

        // Optionally: Call a function passed via props to update parent state if needed
        // e.g., onDataUpdateSuccess();

      } else {
        console.error('Error submitting notes:', response.status, response.data);
        alert(`Error submitting significant notes (${response.status}). Please try again.`);
      }
    } catch (error) {
       console.error('Error submitting notes:', error);
       const errorMsg = typeof error.response?.data?.detail === 'string' ? error.response.data.detail
           : typeof error.response?.data === 'string' ? error.response.data
           : 'Please check details and try again.';
       alert(`Server error (${error.response?.status || 'Network Error'}): ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  if (!emp_no && !isLoadingHistory) { // Avoid showing error if history is still loading initially
      return <div className="p-6 text-center text-red-600 bg-white rounded-lg shadow">No employee selected or data available.</div>;
  }
   if (isLoadingHistory && !historicalNotes.length) { // Show loading indicator centered if it's the initial load
       return <div className="p-6 text-center text-blue-500 bg-white rounded-lg shadow">Loading employee data...</div>;
   }


  return (
    <div className="bg-white min-h-screen p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">Significant Notes</h2>

      <form >
        {/* Health Summary Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Column */}
            <div className="flex flex-col"> {/* Fixed height for layout consistency */}
                <label className="block text-gray-700 mb-1 text-sm font-medium" htmlFor="healthsummary">
                    Health Summary
                </label>
                <textarea
                    id="healthsummary"
                    className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm flex-grow resize-none" // Added resize-none
                    placeholder="Enter overall health summary..."
                    onChange={(e) => setHealthsummary(e.target.value)}
                    disabled={!isDoctor}
                ></textarea>
            </div>
            {/* History Column */}
            <div className=""> {/* Fixed height */}
                 <HistoryList
                    title="Health Summary History"
                    notes={historicalNotes}
                    fieldKey="healthsummary"
                    isLoading={isLoadingHistory}
                    error={historyError}
                />
             </div>
        </div>

        {/* Remarks Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Column */}
            <div className="flex flex-col"> {/* Fixed height */}
                <label className="block text-gray-700 mb-1 text-sm font-medium" htmlFor="remarks">
                    Remarks / Defaults
                </label>
                <textarea
                    id="remarks"
                    className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm flex-grow " // Added resize-none
                    placeholder="Enter any relevant remarks..."
                    
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={!isDoctor}
                ></textarea>
            </div>
             {/* History Column */}
            <div className=""> {/* Fixed height */}
                 <HistoryList
                    title="Remarks / Defaults History"
                    notes={historicalNotes}
                    fieldKey="remarks"
                    isLoading={isLoadingHistory}
                    error={historyError}
                />
            </div>
        </div>

         {/* --- Communicable Disease Section --- */}
         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
             {/* Input Column */}
             <div className="flex flex-col"> {/* Removed fixed height for dropdowns */}
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
                    {/* <option value="">Select...</option> // Included in options array */}
                    {communicableDiseaseOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                 </select>
                 {/* --- Display Previous Entry (Quick View) --- */}
                 {!isLoadingHistory && previousCommunicableDisease && communicableDisease !== previousCommunicableDisease && ( // Only show if different from current selection
                    <p className="text-xs text-gray-500 mt-1">
                        Previous Entry: <span className="font-medium text-gray-700">{previousCommunicableDisease}</span>
                    </p>
                 )}
                 {!isLoadingHistory && !previousCommunicableDisease && historicalNotes.length > 0 && (
                    <p className="text-xs text-gray-400 italic mt-1">No previous entry found.</p>
                 )}
                 {/* --- End Display Previous Entry --- */}
             </div>
             {/* History Column */}
             <div className="h-64"> {/* Fixed height for history list consistency */}
                <HistoryList
                    title="Communicable Disease History"
                    notes={historicalNotes}
                    fieldKey="communicable_disease" // Use the correct field key from your API data
                    isLoading={isLoadingHistory}
                    error={historyError}
                />
            </div>
        </div>

         {/* --- Curative Specific Dropdowns Section (Only if type is Curative) --- */}
        {type === "Curative" && (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6">
                 {/* Incident Type */}
                 <div>
                    <label htmlFor="incidentType" className="block text-gray-700 text-sm font-medium mb-1">
                        Incident Type
                    </label>
                    <select id="incidentType" className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm" value={incidentType} onChange={(e) => setIncidentType(e.target.value)} disabled={!isDoctor}>
                        {/* <option value="">Select...</option> // Included in options array */}
                        {incidentTypeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                    </select>
                    {/* TODO: Add HistoryList for incident_type if needed */}
                 </div>
                 {/* Incident */}
                 <div>
                    <label htmlFor="incident" className="block text-gray-700 text-sm font-medium mb-1">
                        Incident
                    </label>
                    <select id="incident" className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm" value={incident} onChange={(e) => setIncident(e.target.value)} disabled={!isDoctor}>
                        {/* <option value="">Select...</option> // Included in options array */}
                        {incidentOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                    </select>
                     {/* TODO: Add HistoryList for incident if needed */}
                 </div>
                 {/* Illness Type */}
                 <div>
                    <label htmlFor="illnessType" className="block text-gray-700 text-sm font-medium mb-1">
                        Illness Type
                    </label>
                    <select id="illnessType" className="w-full p-2 border rounded-md bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm" value={illnessType} onChange={(e) => setIllnessType(e.target.value)} disabled={!isDoctor}>
                       {/* <option value="">Select...</option> // Included in options array */}
                       {illnessTypeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                    </select>
                     {/* TODO: Add HistoryList for illness_type if needed */}
                </div>
            </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
             type="button"
             className={`bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-sm ${(!isDoctor || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
             disabled={!isDoctor || isSubmitting}
          >
            {isSubmitting ? (
                <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>Submitting...</>
            ) : ('Submit Note')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignificantNotes;