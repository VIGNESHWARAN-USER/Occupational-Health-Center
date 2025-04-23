import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../Sidebar"; // Adjust path if needed
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import NewVisit from "./NewVisitProf/NewVisit"; // Adjust path if needed
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";

// --- HealthSummary Content Component ---
const HealthSummaryContent = ({ employeeData, visitData }) => (
    <div className="space-y-4 text-sm">
        <h4 className="font-semibold text-base text-blue-700 mb-2">Visit Health Summaries:</h4>
        {!visitData ? (
             <p className="text-gray-500">Loading visit history...</p>
        ) : visitData.length > 0 ? (
            visitData.map((visit, index) => (
                <div key={visit.id || index} className="p-3 border rounded-md bg-gray-50 shadow-sm mb-3">
                    <p><span className="font-semibold">Visit Date:</span> {visit.entry_date ? new Date(visit.entry_date).toLocaleDateString() : 'N/A'}</p>
                    <p><span className="font-semibold">Visit Summary:</span> {visit.healthsummary || "N/A"}</p>
                </div>
            ))
        ) : (
            <p className="text-gray-500">No visit health summary entries found.</p>
        )}
    </div>
);

// --- Remarks/Defaults Content Component ---
const RemarksDefaultsContent = ({ employeeData, visitData }) => (
    <div className="space-y-4 text-sm">
        <h4 className="font-semibold text-base text-blue-700 mb-2">Visit-Specific Remarks:</h4>
         {!visitData ? (
             <p className="text-gray-500">Loading visit history...</p>
        ) : visitData.length > 0 ? (
            visitData.map((visit, index) => (
                <div key={visit.id || index} className="p-3 border rounded-md bg-gray-50 shadow-sm mb-3">
                    <p><span className="font-semibold">Visit Date:</span> {visit.entry_date ? new Date(visit.entry_date).toLocaleDateString() : 'N/A'}</p>
                    <p><span className="font-semibold">Remarks:</span> {visit.remarks || "None"}</p>
                </div>
            ))
        ) : (
            <p className="text-gray-500">No visit-specific remarks found.</p>
        )}
    </div>
);

// --- Significant Notes Content Component ---
const SignificantNotesContent = ({ employeeData, visitData }) => (
    <div className="space-y-4 text-sm">
        <h4 className="font-semibold text-base text-blue-700 mb-2">Visit-Specific Significant Details:</h4>
         {!visitData ? (
             <p className="text-gray-500">Loading visit history...</p>
        ) : visitData.length > 0 ? (
            visitData.map((visit, index) => (
                <div key={visit.id || index} className="p-3 border rounded-md bg-gray-50 shadow-sm mb-3">
                    <p><span className="font-semibold">Visit Date:</span> {visit.entry_date ? new Date(visit.entry_date).toLocaleDateString() : 'N/A'}</p>
                    {/* Display relevant significant fields from the visit object */}
                    <p><span className="font-semibold">Communicable Disease:</span> {visit.communicable_disease || "N/A"}</p>
                    <p><span className="font-semibold">Notifiable Disease:</span> {visit.notifiable_disease || "N/A"}</p>
                    {/* Check if injury_type exists before displaying */}
                    {visit.injury_type &&
                        <p><span className="font-semibold">Injury:</span> {visit.injury_type} ({visit.injury_cause || "No Cause Specified"})</p>
                    }
                    {/* Add other significant fields as needed from your SignificantNotes model */}
                </div>
            ))
        ) : (
            <p className="text-gray-500">No visit-specific significant details found.</p>
        )}
    </div>
);

// --- EmploymentStatusContent Component (UPDATED with conditional inputs) ---
// (No changes needed in this sub-component itself based on the request,
// it will now just be *used* for all roles)
const EmploymentStatusContent = ({
    employmentHistory,
    isLoadingHistory,
    currentStatus,
    currentDateSince,
    transferredToDetail, // Receive new prop
    otherReasonDetail,   // Receive new prop
    onStatusChange,
    onDateChange,
    onTransferredToChange, // Receive new handler
    onOtherReasonChange,   // Receive new handler
    onSubmit,
    isSubmitting,
    // Added employeeData to potentially customize label if needed later
    employeeData
}) => (
    <div className="space-y-6 text-sm">
        {/* Status History Section */}
        <div>
             {/* Adjust title based on role if needed in future? */}
            <h4 className="font-semibold text-base text-blue-700 mb-3 border-b pb-2">Status History</h4>
            {isLoadingHistory ? (
                <p className="text-gray-500">Loading status history...</p>
            ) : employmentHistory && employmentHistory.length > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                    {employmentHistory
                        // Filter and sort logic remains the same
                        .filter(entry => entry.employee_status || entry.since_date)
                        .sort((a, b) => {
                            const dateA = a.since_date ? new Date(a.since_date).getTime() : 0;
                            const dateB = b.since_date ? new Date(b.since_date).getTime() : 0;
                            if (isNaN(dateA) && isNaN(dateB)) return 0;
                            if (isNaN(dateA)) return 1;
                            if (isNaN(dateB)) return -1;
                            return dateB - dateA;
                        })
                        .map((statusEntry, index) => (
                            <div key={statusEntry.id || index} className="p-3 border rounded-md bg-gray-50 shadow-sm">
                                <p><span className="font-semibold">Status:</span> {statusEntry.employee_status || "N/A"}</p>
                                <p><span className="font-semibold">Date Since:</span> {statusEntry.since_date ? new Date(statusEntry.since_date).toLocaleDateString() : 'N/A'}</p>
                                {/* Optionally display details from history if backend provides them */}
                                {statusEntry.transfer_details && <p><span className="font-semibold">Transfer Details:</span> {statusEntry.transfer_details}</p>}
                                {statusEntry.other_reason_details && <p><span className="font-semibold">Other Reason:</span> {statusEntry.other_reason_details}</p>}
                            </div>
                        ))
                    }
                </div>
            ) : (
                <p className="text-gray-500">No status history found.</p>
            )}
        </div>

        {/* Update Status Form */}
        <form onSubmit={onSubmit} className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-base text-blue-700 mb-2">Update Current Status</h4>
            {/* Select Status */}
            <div className="flex flex-col">
                {/* Adjust label based on role if needed in future? */}
                <label htmlFor="employee_status" className="mb-1 text-gray-700 font-medium">New Status</label>
                <select
                    name="employee_status" id="employee_status" value={currentStatus}
                    onChange={(e) => onStatusChange(e.target.value)} // Use the passed handler
                    required
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2 bg-white"
                >
                     {/* Consider if these statuses make sense for all roles */}
                    <option value="Active">Active</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Unauthorised Absence">Unauthorised Absence</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Retired">Retired</option>
                     {/* Maybe add Contractor-specific statuses? */}
                     {/* <option value="Contract Ended">Contract Ended</option> */}
                     {/* Maybe add Visitor-specific statuses? */}
                     {/* <option value="Visit Completed">Visit Completed</option> */}
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* --- Conditional Input for Transferred --- */}
            {currentStatus === "Transferred" && (
                <div className="flex flex-col">
                    <label htmlFor="transferred_to_detail" className="mb-1 text-gray-700 font-medium">
                        Transferred To (Area/Department) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="transferred_to_detail"
                        value={transferredToDetail}
                        onChange={(e) => onTransferredToChange(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2 bg-white"
                        placeholder="Enter location or department"
                    />
                </div>
            )}

            {/* --- Conditional Input for Other --- */}
            {currentStatus === "Other" && (
                <div className="flex flex-col">
                    <label htmlFor="other_reason_detail" className="mb-1 text-gray-700 font-medium">
                        Reason for 'Other' Status <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="other_reason_detail"
                        value={otherReasonDetail}
                        onChange={(e) => onOtherReasonChange(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2 bg-white"
                        placeholder="Specify reason"
                    />
                </div>
            )}

            {/* Date Since */}
            <div className="flex flex-col">
                <label htmlFor="date_since" className="mb-1 text-gray-700 font-medium">
                    Date Since <span className="text-red-500">*</span>
                </label>
                <input
                    type="date" value={currentDateSince} onChange={(e) => onDateChange(e.target.value)}
                    id="date_since" required
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-3 py-2 bg-white"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit" disabled={isSubmitting}
                className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit New Status'}
            </button>
        </form>
    </div>
);


// --- Modal Component ---
// (No changes needed)
const InfoModal = ({ isOpen, onClose, title, children }) => {
     return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4"
                        onClick={onClose}
                    />
                    {/* Modal Content */}
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.9, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed z-50 bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
                        style={{ top: '15vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close Modal">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5 max-h-[60vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


// --- Main EmployeeProfile Component ---
const EmployeeProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const accessLevel = localStorage.getItem('accessLevel');

    // --- State ---
    const [employeeData, setEmployeeData] = useState(null);
    const [notes, setNotes] = useState(null); // Holds 'data' array (visit notes)
    const [employmentHistoryState, setEmploymentHistoryState] = useState(null); // Holds 'status' array
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false); // Covers loading for notes & status history
    const [error, setError] = useState(null);

    // Form State for Employment Status Modal
    const [employeestatus, setEmployeestatus] = useState("Active");
    const [dateSince, setDateSince] = useState("");
    const [transferredToDetail, setTransferredToDetail] = useState(""); // For 'Transferred' status
    const [otherReasonDetail, setOtherReasonDetail] = useState("");   // For 'Other' status
    const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContentId, setModalContentId] = useState(null);

    // --- Fetch Data Function ---
    // (No changes needed in fetch function logic)
    const fetchNotesAndStatus = useCallback(async (idValue, idType) => {
        if (!idValue || !idType) { console.warn("Missing identifier for fetching data."); setNotes([]); setEmploymentHistoryState([]); return; }
        setIsLoadingNotes(true); setError(null);
        try {
            // Use the identifier provided (emp_no, aadhar, country_id)
            const response = await axios.post(`https://occupational-health-center-1.onrender.com/get_notes/${idValue}`); // Endpoint likely uses the primary ID passed
            console.log("Fetched Notes/Status Data:", response.data);
            if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
                const visitNotes = Array.isArray(response.data.data) ? response.data.data : [];
                const statusHistory = Array.isArray(response.data.status) ? response.data.status : [];
                setNotes(visitNotes); setEmploymentHistoryState(statusHistory);
                if (visitNotes.length === 0 && statusHistory.length === 0 && response.data.message?.includes("No records found")) { console.log("No visit or status records found (via message)."); }
            } else if (Array.isArray(response.data)) { setNotes(response.data); setEmploymentHistoryState([]); console.warn("Received only notes array, no status history."); }
            else { console.warn("Fetched data format unexpected:", response.data); setError("Received unexpected data format."); setNotes([]); setEmploymentHistoryState([]); }
        } catch (err) {
            console.error("Error fetching notes/status:", err);
            if (err.response?.status === 404) { console.log("No records found (404)."); setNotes([]); setEmploymentHistoryState([]); }
            else { const msg = err.response?.data?.message || err.message || "Failed fetch."; setError(msg); setNotes([]); setEmploymentHistoryState([]); }
        } finally { setIsLoadingNotes(false); }
    }, []);

    // --- Handle Status Submission ---
    // (No changes needed in submit logic itself, but added role awareness to backend payload)
    const handleSubmitStatus = async (e) => {
        e.preventDefault();
        // Use the correct identifier based on role for the backend update
        const identifier = employeeData?.emp_no || employeeData?.aadhar || employeeData?.country_id;
        const idType = employeeData?.emp_no ? 'emp_no' : employeeData?.aadhar ? 'aadhar' : employeeData?.country_id ? 'country_id' : null;

        if (!identifier || !idType) { alert("User identifier missing."); return; }
        if (!employeestatus || !dateSince) { alert("Status & Date Since required."); return; }
        if (employeestatus === "Transferred" && !transferredToDetail.trim()) { alert("Enter 'Transferred To' location."); return; }
        if (employeestatus === "Other" && !otherReasonDetail.trim()) { alert("Enter reason for 'Other' status."); return; }

        setIsSubmittingStatus(true);
        // Send identifier and its type, along with status details
        const payload = {
            identifier: identifier,
            id_type: idType,
            employee_status: employeestatus,
            date_since: dateSince
        };
        if (employeestatus === "Transferred") payload.transfer_details = transferredToDetail;
        if (employeestatus === "Other") payload.other_reason_details = otherReasonDetail;

        console.log("Submitting status payload:", payload);

        try {
            // IMPORTANT: Update backend endpoint if needed to handle different identifier types
            const response = await fetch("https://occupational-health-center-1.onrender.com/update_employee_status/", { // Ensure endpoint handles `identifier` and `id_type`
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                alert("Status updated successfully!");
                // Update local state optimistically or refetch
                 setEmployeeData(prevData => ({
                    ...prevData,
                    // Update the status part of employeeData correctly
                    employee_status: {
                        ...(typeof prevData.employee_status === 'object' ? prevData.employee_status : {}), // Handle if status wasn't an object before
                        status: employeestatus,
                        date_since: dateSince
                    }
                }));
                // Refetch history to show the new entry
                fetchNotesAndStatus(identifier, idType);
                closeModal();
                setTransferredToDetail(""); setOtherReasonDetail(""); // Clear form details
            } else { alert(`Error: ${result.message || 'Unknown error'}`); }
        } catch (error) { console.error("Submit status error:", error); alert(`Submit failed: ${error.message}`); }
        finally { setIsSubmittingStatus(false); }
    };

    // --- Initial Data Setup Effect ---
    // (Logic remains similar, just ensures fetch uses the right ID)
    useEffect(() => {
        const initialData = location.state?.data;
        setIsLoadingEmployee(true); setError(null); setNotes(null); setEmploymentHistoryState(null);
        if (initialData && (initialData.emp_no || initialData.aadhar || initialData.country_id)) {
            setEmployeeData(initialData); console.log("Initial Data:", initialData);

            // Determine current status safely
            const currentStatusValue = (typeof initialData.employee_status === 'object' && initialData.employee_status !== null)
                ? initialData.employee_status.status
                : initialData.employee_status; // Handle if it's just a string

            setEmployeestatus(currentStatusValue || "Active"); // Default to Active if null/undefined
            setDateSince(""); // Always clear date on load for new entry
            setIsLoadingEmployee(false);

            // Determine the correct ID and type to use for fetching history
            const id = initialData.emp_no || initialData.aadhar || initialData.country_id;
            const type = initialData.emp_no ? 'emp_no' : initialData.aadhar ? 'aadhar' : 'country_id';
            if (id && type) fetchNotesAndStatus(id, type);
            else { console.warn("No suitable ID found for history fetch."); setIsLoadingNotes(false); }
        } else {
            setError("Required employee/visitor data not found in navigation state.");
            setIsLoadingEmployee(false);
            setIsLoadingNotes(false);
            console.error("Missing data in location.state:", location.state);
        }
    }, [location.state, fetchNotesAndStatus]); // fetchNotesAndStatus is now stable

    // --- Handler to clear detail fields when status changes ---
    // (No changes needed)
    const handleStatusDropdownChange = (newStatus) => {
        setEmployeestatus(newStatus);
        if (newStatus !== "Transferred") setTransferredToDetail("");
        if (newStatus !== "Other") setOtherReasonDetail("");
    };

    // --- Render Logic (Loading, Error, Access Denied) ---
    // (No changes needed here)
     if (isLoadingEmployee) { /* ... loading ... */ return <div className="h-screen w-full flex bg-[#e0f7ff] items-center justify-center"><Sidebar /><div className="flex-1 text-center p-6">Loading Employee Data...</div></div>; }
     if (error && !employeeData) { /* ... error ... */ return <div className="h-screen w-full flex bg-[#e0f7ff] items-center justify-center"><Sidebar /><div className="flex-1 text-center p-6"><h2 className="text-2xl font-bold text-red-600 mb-4">Error!</h2><p className="text-gray-700 mb-6">{error}</p><button onClick={() => navigate(-1)} className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Go Back</button></div></div>; }
     if (!employeeData) { /* ... safety check ... */ return <div className="h-screen w-full flex bg-[#e0f7ff] items-center justify-center"><Sidebar /><div className="flex-1 text-center p-6">Error: Employee data is missing or invalid. Please go back and try again.</div></div>; }
     if (!["nurse", "doctor"].includes(accessLevel)) { /* ... access denied ... */ return <section className="bg-white h-full flex items-center dark:bg-gray-900"><div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6"><div className="mx-auto max-w-screen-sm text-center"><h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-red-500">403</h1><p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Access Denied.</p><p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">You do not have permission to view this page.</p><button onClick={() => navigate(-1)} className="inline-flex text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Go Back</button></div></div></section>; }

    // --- Main Component Render ---
    const cardDetails = [
        { id: 'health', label: 'Health Summary', Component: HealthSummaryContent },
        { id: 'remarks', label: 'Remarks/Defaults', Component: RemarksDefaultsContent },
        { id: 'notes', label: 'Significant Notes', Component: SignificantNotesContent },
        { id: 'employment', label: 'Employment Status', Component: EmploymentStatusContent },
    ];

    const handleButtonClick = (cardId) => { setModalContentId(cardId); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setModalContentId(null); };

    // --- Status Badge Logic (Remains the same, applies mostly to Employees based on typical statuses) ---
    let statusText = 'Unknown';
    let statusBgColor = 'bg-gray-400';
    let statusTextColor = 'text-white';
    // Check both possible structures for current status
    const currentStatusFromData = (typeof employeeData.employee_status === 'object' && employeeData.employee_status !== null)
        ? employeeData.employee_status.status
        : employeeData.employee_status;

    if (currentStatusFromData && typeof currentStatusFromData === 'string') {
        const lowerCaseStatus = currentStatusFromData.toLowerCase();
        statusText = currentStatusFromData; // Display original casing unless overridden
         switch (lowerCaseStatus) {
             case 'active': statusBgColor = 'bg-green-500'; break;
             case 'resigned': statusBgColor = 'bg-orange-500'; break;
             case 'retired': statusBgColor = 'bg-purple-500'; break;
             case 'unauthorised absence': case 'unauthorized absence': statusText = 'Absent'; statusBgColor = 'bg-yellow-500'; statusTextColor = 'text-yellow-900'; break;
             case 'terminated': statusBgColor = 'bg-red-600'; break;
             case 'deceased': statusText = 'Deceased'; statusBgColor = 'bg-gray-700'; break;
             case 'transferred': statusText = 'Transferred'; statusBgColor = 'bg-blue-500'; break;
             case 'other': statusBgColor = 'bg-pink-500'; break; // Style for 'Other'
             // Add cases for Contractor/Visitor specific statuses if needed
             // case 'contract ended': statusBgColor = 'bg-slate-500'; break;
             // case 'visit completed': statusBgColor = 'bg-cyan-500'; break;
             default: break; // Keep gray for unknown statuses
         }
    } else if (employeeData.role !== "Employee") {
        // If not an employee and no specific status found, don't show the employee-centric badge
        statusText = ''; // Clear text so badge doesn't render below
    }


    return (
        <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
            <Sidebar />
            <div className="flex-1 h-screen overflow-y-auto p-6 space-y-6">

                {/* Employee Profile Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row md:space-x-8 items-center transition-all duration-300 hover:shadow-xl border-t-4 border-blue-600 relative">
                    {/* Profile Pic & Basic Info */}
                     <div className="flex flex-col items-center text-center md:w-1/5 space-y-2 mb-4 md:mb-0 flex-shrink-0">
                         {employeeData.profilepic_url ? (
                             <img src={employeeData.profilepic_url} alt={`${employeeData.name}'s profile`} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-blue-200" />
                         ) : (
                             <FaUserCircle className="text-blue-600 text-7xl md:text-9xl" />
                         )}
                         {/* Show status badge if statusText is determined */}
                         {statusText && (
                             <span className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBgColor} ${statusTextColor}`}>
                                 {statusText}
                             </span>
                          )}
                         <h2 className="text-lg md:text-xl font-bold text-blue-800 mt-1">{employeeData.name || 'N/A'}</h2>
                         {/* Display Primary ID based on role */}
                         <span className="text-xs md:text-sm text-gray-500 font-medium">
                             {employeeData.role === "Employee" && `Emp ID: ${employeeData.emp_no || 'N/A'}`}
                             {employeeData.role === "Contractor" && `Aadhar: ${employeeData.aadhar || 'N/A'}`}
                             {employeeData.role === "Visitor" && `Nat. ID / Passport: ${employeeData.country_id || 'N/A'}`}
                             {/* Fallback if role is unexpected */}
                             {!["Employee", "Contractor", "Visitor"].includes(employeeData.role) && `ID: ${employeeData.emp_no || employeeData.aadhar || employeeData.country_id || 'N/A'}`}
                         </span>
                     </div>

                    {/* Details & Buttons Grid */}
                    <div className="w-full md:flex-1">
                         {/* Details Grid - NOW ROLE-AWARE */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm w-full">
                            {/* Common Fields */}
                            <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Worker Type:</span> {employeeData.role || "N/A"}</p>
                            <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Gender:</span> {employeeData.sex || "N/A"}</p>
                            <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Mobile:</span> {employeeData.phone_Personal || "N/A"}</p>
                            <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Blood Group:</span> {employeeData.bloodgrp || "N/A"}</p>

                            {/* Employee Specific Fields */}
                            {employeeData.role === "Employee" && (<>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Employer:</span> {employeeData.employer || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Department:</span> {employeeData.department || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Designation:</span> {employeeData.designation || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500"><span className="font-semibold text-gray-900">Job Nature:</span> {employeeData.job_nature || "N/A"}</p>
                            </>)}

                            {/* Contractor Specific Fields */}
                            {employeeData.role === "Contractor" && (<>
                                {/* Changed Label to Contractor Name */}
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-purple-500"><span className="font-semibold text-gray-900">Contractor Name:</span> {employeeData.employer || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-purple-500"><span className="font-semibold text-gray-900">Department:</span> {employeeData.department || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-purple-500"><span className="font-semibold text-gray-900">Designation:</span> {employeeData.designation || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-purple-500"><span className="font-semibold text-gray-900">Job Nature:</span> {employeeData.job_nature || "N/A"}</p>
                            </>)}

                             {/* Visitor Specific Fields */}
                            {employeeData.role === "Visitor" && (<>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-teal-500"><span className="font-semibold text-gray-900">Nationality:</span> {employeeData.nationality || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-teal-500"><span className="font-semibold text-gray-900">Passport No:</span> {employeeData.passport_number || "N/A"}</p>
                                <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-teal-500"><span className="font-semibold text-gray-900">Organization:</span> {employeeData.organization_name || "N/A"}</p>
                                {/* Add an empty paragraph or adjust grid columns if needed to fill space */}
                                {/* <p className="p-3 bg-transparent"></p>  */}
                            </>)}
                        </div>

                         {/* Action Buttons Grid - NOW APPLIES TO ALL ROLES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm w-full mt-6">
                            {cardDetails.map((card) => (
                                // REMOVED condition: || employeeData.role === "Employee"
                                // Now all buttons show for everyone
                                <button
                                    key={card.id}
                                    onClick={() => handleButtonClick(card.id)}
                                    className="py-2.5 px-4 rounded-lg font-bold transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md ring-blue-300 border border-blue-200"
                                >
                                    {card.label}
                                </button>
                            ))}
                        </div>
                        {/* Loading/Error Status Display */}
                        {isLoadingNotes && <p className="mt-4 text-sm text-gray-600">Loading history data...</p>}
                        {/* Display fetch error only if not loading */}
                        {error && !isLoadingNotes && !isLoadingEmployee && <p className="mt-4 text-sm text-red-600">Error fetching history: {error}</p>}

                    </div>
                </div>

                {/* Modal */}
                <InfoModal isOpen={isModalOpen} onClose={closeModal} title={cardDetails.find(c => c.id === modalContentId)?.label || "Details"}>
                    {(() => {
                        const cardInfo = cardDetails.find(c => c.id === modalContentId);
                        if (!cardInfo) return <p>Loading content...</p>;
                        const CardComponent = cardInfo.Component;

                        // Pass employeeData to all components just in case
                        const props = {
                            employeeData: employeeData,
                            visitData: notes // Pass visit data (notes)
                        };

                        if (cardInfo.id === 'employment') {
                            // Add employment-specific props
                            return <CardComponent
                                {...props} // Spread common props
                                employmentHistory={employmentHistoryState}
                                isLoadingHistory={isLoadingNotes}
                                currentStatus={employeestatus}
                                currentDateSince={dateSince}
                                transferredToDetail={transferredToDetail}
                                otherReasonDetail={otherReasonDetail}
                                onStatusChange={handleStatusDropdownChange}
                                onDateChange={setDateSince}
                                onTransferredToChange={setTransferredToDetail}
                                onOtherReasonChange={setOtherReasonDetail}
                                onSubmit={handleSubmitStatus}
                                isSubmitting={isSubmittingStatus}
                            />;
                        }
                        // For other modals, just pass common props
                        return <CardComponent {...props} />;
                    })()}
                </InfoModal>

                {/* New Visit Component (Remains the same) */}
                <NewVisit data={employeeData} />

            </div>
        </div>
    );
};

export default EmployeeProfile;