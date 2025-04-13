import React, { useState, useCallback } from "react"; // Removed useEffect as it wasn't strictly needed here
import Select from 'react-select';
import Sidebar from "../Sidebar"; // Assuming correct path
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// --- Initial Form States ---
const initialOHCState = {
    employee_number: "", name: "", designation: "", email: "", role: [],
    doj: "", date_exited: "", job_nature: "", phone_number: ""
};
const initialExternalState = {
    name: "", designation: "", email: "", role: [], hospital_name: "",
    aadhar: "", phone_number: "", // do_access: "", // Uncomment if needed
    date_exited: "", job_nature: ""
};

// --- Role Options ---
const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'registration', label: 'Registration' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'pharmacy', label: 'Pharmacy' },
];

// --- Helper: Convert role values to select options ---
const mapRolesToOptions = (roleValues = []) => {
    if (!Array.isArray(roleValues)) return [];
    return roleValues
        .map(value => roleOptions.find(option => option.value === value))
        .filter(Boolean); // Filter out undefined/null if a role value doesn't match
};

// --- Helper: Format date for input type="date" ---
const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ""; // Invalid date
        // Ensure timezone issues don't shift the date back
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return "";
    }
};


function AddMember() {
    const accessLevel = localStorage.getItem('accessLevel');
    const navigate = useNavigate();

    // --- Component State ---
    const [searchEmail, setSearchEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState({ type: null, message: null }); // type: 'success', 'error', 'info' | message: string
    const [showForm, setShowForm] = useState(false);
    const [memberId, setMemberId] = useState(null); // ID of member being updated
    const [memberType, setMemberType] = useState(''); // 'ohc' or 'external'
    const [ohcFormData, setOHCFormData] = useState(initialOHCState);
    const [externalFormData, setExternalFormData] = useState(initialExternalState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: null, message: null }); // type: 'success', 'error' | message: string

    // --- Reset Handler ---
    const handleResetToSearch = useCallback(() => {
        setSearchEmail('');
        setSearchStatus({ type: null, message: null });
        setSubmitStatus({ type: null, message: null });
        setShowForm(false);
        setMemberId(null);
        setMemberType('');
        setOHCFormData(initialOHCState);
        setExternalFormData(initialExternalState);
        setIsSubmitting(false);
        setIsSearching(false);
    }, []); // Empty dependency array as it only uses setters

    // --- Email Search Handler ---
    const handleSearch = useCallback(async () => {
        if (!searchEmail.trim() || !/\S+@\S+\.\S+/.test(searchEmail)) { // Basic email format check
            setSearchStatus({ type: 'error', message: "Please enter a valid email address." });
            return;
        }
        setIsSearching(true);
        setSearchStatus({ type: null, message: null });
        setSubmitStatus({ type: null, message: null });
        setShowForm(false); // Hide form during new search
        setMemberId(null);
        setMemberType('');
        setOHCFormData(initialOHCState);
        setExternalFormData(initialExternalState);

        // --- Adjust API endpoint as needed ---
        const searchUrl = `http://localhost:8000/find_member_by_email/?email=${encodeURIComponent(searchEmail)}`;

        try {
            const response = await axios.get(searchUrl);

            if (response.data.found) {
                const memberData = response.data.member;
                const determinedType = memberData.memberTypeDetermined;
                setMemberId(memberData.id); // Store ID for update
                setMemberType(determinedType);

                // Pre-fill the correct form
                const commonData = {
                    name: memberData.name || "",
                    designation: memberData.designation || "",
                    email: memberData.email || searchEmail, // Use found or searched email
                    role: mapRolesToOptions(memberData.role),
                    date_exited: formatDateForInput(memberData.date_exited),
                    job_nature: memberData.job_nature || "",
                    phone_number: memberData.phone_number || ""
                };

                if (determinedType === 'ohc') {
                    setOHCFormData({
                        ...commonData,
                        employee_number: memberData.employee_number || "",
                        doj: formatDateForInput(memberData.doj),
                    });
                } else if (determinedType === 'external') {
                    setExternalFormData({
                        ...commonData,
                        hospital_name: memberData.hospital_name || "",
                        aadhar: memberData.aadhar || "",
                        // do_access: formatDateForInput(memberData.do_access), // Uncomment if needed
                    });
                }
                setShowForm(true);
                setSearchStatus({ type: 'success', message: `Member found (ID: ${memberData.id}). Details pre-filled for update.` });

            } else {
                // Member not found, prepare for adding new
                setMemberId(null);
                setShowForm(true); // Show form to allow adding
                setSearchStatus({ type: 'info', message: "Member not found. Select type below to add a new member." });
                // Pre-fill email in both potential forms
                setOHCFormData({ ...initialOHCState, email: searchEmail });
                setExternalFormData({ ...initialExternalState, email: searchEmail });
            }
        } catch (error) {
            console.error("Error searching member:", error);
            const message = error.response?.data?.message || "Failed to search for member due to a network or server error.";
            setSearchStatus({ type: 'error', message });
            setMemberId(null);
            // Optionally allow adding even if search fails? Decide based on UX.
            // setShowForm(true);
            // setOHCFormData({ ...initialOHCState, email: searchEmail });
            // setExternalFormData({ ...initialExternalState, email: searchEmail });
        } finally {
            setIsSearching(false);
        }
    }, [searchEmail]); // Dependency: re-run if searchEmail changes

    // --- Form Input Handlers ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const setter = memberType === 'ohc' ? setOHCFormData : setExternalFormData;
        setter(prev => ({ ...prev, [name]: value }));
    }, [memberType]); // Dependency: memberType determines which state to update

    const handleSelectChange = useCallback((selectedOptions, actionMeta) => {
        const { name } = actionMeta; // Get field name from react-select action
        const setter = memberType === 'ohc' ? setOHCFormData : setExternalFormData;
        // Ensure selectedOptions is always an array (for isMulti) or null/object (for single)
        setter(prev => ({ ...prev, [name]: selectedOptions || [] }));
    }, [memberType]); // Dependency: memberType

    // --- Form Submit Handler (Add or Update) ---
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!memberType) {
            setSubmitStatus({ type: 'error', message: "Cannot submit: Member type not determined." });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: null }); // Clear previous submit status

        let dataToSend = {};
        let rolesForApi = [];
        let url = "";
        let method = "";

        // Prepare data based on member type
        if (memberType === 'ohc') {
            rolesForApi = ohcFormData.role ? ohcFormData.role.map(option => option.value) : [];
            dataToSend = { ...ohcFormData, role: rolesForApi, memberType: 'ohc' };
        } else if (memberType === 'external') {
            rolesForApi = externalFormData.role ? externalFormData.role.map(option => option.value) : [];
            dataToSend = { ...externalFormData, role: rolesForApi, memberType: 'external' };
        }

        // Determine API endpoint and method
        if (memberId) {
            // UPDATE mode
            url = `http://localhost:8000/members/update/${memberId}/`; // Adjust endpoint as needed
            method = 'put';
            // Optionally remove fields not intended for update (like email, emp_no)
            // delete dataToSend.email;
            // delete dataToSend.employee_number;
        } else {
            // ADD mode
            url = "http://localhost:8000/members/add/"; // Adjust endpoint as needed
            method = 'post';
        }

        console.log(`Submitting (${method.toUpperCase()}) to ${url} with data:`, dataToSend); // Debug log

        try {
            const response = await axios({ method, url, data: dataToSend });
            const successMessage = response.data?.message || (memberId ? "Member updated successfully!" : "Member added successfully!");
            setSubmitStatus({ type: 'success', message: successMessage });
            // alert(successMessage); // Optional: replace with better feedback
            setTimeout(handleResetToSearch, 1500); // Reset after a short delay to show success message

        } catch (error) {
            console.error(`Error ${memberId ? 'updating' : 'adding'} member:`, error);
            // Try to get specific error message from backend response
            const errorMsg = error.response?.data?.message || `Failed to ${memberId ? 'update' : 'add'} member. Please check details or server logs.`;
            setSubmitStatus({ type: 'error', message: errorMsg });
            // alert(`Error: ${errorMsg}`); // Optional: replace with better feedback
        } finally {
            setIsSubmitting(false);
        }
    }, [memberType, memberId, ohcFormData, externalFormData, handleResetToSearch]); // Dependencies

    // --- Conditional Rendering for Form Fields ---
    // Wrap field rendering in useCallback if they become complex, but usually not needed
    const renderOHCStaffFields = () => (
         <>
            {/* Row 1: Emp No (ReadOnly if Update), Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="employee_number" className="block text-gray-700 mb-1 text-sm font-medium">Employee Number *</label>
                    <input id="employee_number" type="text" name="employee_number" value={ohcFormData.employee_number} onChange={handleChange} required
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                </div>
                <div>
                    <label htmlFor="name_ohc" className="block text-gray-700 mb-1 text-sm font-medium">Name *</label>
                    <input id="name_ohc" type="text" name="name" value={ohcFormData.name} onChange={handleChange} required
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                </div>
            </div>
             {/* Row 2: Designation, Phone, Email (ReadOnly if Update) */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                 <div>
                    <label htmlFor="designation_ohc" className="block text-gray-700 mb-1 text-sm font-medium">Designation *</label>
                    <input id="designation_ohc" type="text" name="designation" value={ohcFormData.designation} onChange={handleChange} required
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                 <div>
                    <label htmlFor="phone_number_ohc" className="block text-gray-700 mb-1 text-sm font-medium">Phone No. *</label>
                    <input id="phone_number_ohc" type="tel" name="phone_number" value={ohcFormData.phone_number} onChange={handleChange} required pattern="[0-9]{10,15}" title="Enter 10-15 digits"
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                 <div>
                    <label htmlFor="email_ohc" className="block text-gray-700 mb-1 text-sm font-medium">Email ID *</label>
                    <input id="email_ohc" type="email" name="email" value={ohcFormData.email} onChange={handleChange} required
                           readOnly={!!memberId} aria-readonly={!!memberId}
                           className={`w-full p-2 border rounded-md ${!!memberId ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'} focus:ring-1 focus:ring-blue-400`} />
                 </div>
             </div>
             {/* Row 3: DOJ *, DO(Exit) */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <div>
                    <label htmlFor="doj" className="block text-gray-700 mb-1 text-sm font-medium">DOJ *</label>
                    <input id="doj" type="date" name="doj" value={ohcFormData.doj} onChange={handleChange} required max={new Date().toISOString().split("T")[0]} // Prevent future DOJ
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                 <div>
                    <label htmlFor="date_exited_ohc" className="block text-gray-700 mb-1 text-sm font-medium">DO (Exit)</label>
                    <input id="date_exited_ohc" type="date" name="date_exited" value={ohcFormData.date_exited} onChange={handleChange} min={ohcFormData.doj || undefined} // Exit date must be after DOJ
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
             </div>
             {/* Row 4: Job Nature, Role * */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <div>
                    <label htmlFor="job_nature_ohc" className="block text-gray-700 mb-1 text-sm font-medium">Job Nature</label>
                    <input id="job_nature_ohc" type="text" name="job_nature" value={ohcFormData.job_nature} onChange={handleChange}
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                 <div>
                    <label htmlFor="role_ohc" className="block text-gray-700 mb-1 text-sm font-medium">Role (Access) *</label>
                    <Select inputId="role_ohc" name="role" isMulti options={roleOptions} value={ohcFormData.role}
                            onChange={handleSelectChange} required // Basic required, more complex validation might be needed
                            className="w-full basic-multi-select" classNamePrefix="select"/>
                     {ohcFormData.role.length === 0 && <p className="text-xs text-red-500 mt-1">Role is required.</p>} {/* Simple validation message */}
                 </div>
            </div>
         </>
    );

    const renderExternalHospitalFields = () => (
         <>
             {/* Row 1: Name *, Hospital * */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="name_ext" className="block text-gray-700 mb-1 text-sm font-medium">Name *</label>
                    <input id="name_ext" type="text" name="name" value={externalFormData.name} onChange={handleChange} required
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                </div>
                <div>
                    <label htmlFor="hospital_name" className="block text-gray-700 mb-1 text-sm font-medium">Name of Hospital *</label>
                    <input id="hospital_name" type="text" name="hospital_name" value={externalFormData.hospital_name} onChange={handleChange} required
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                </div>
            </div>
             {/* Row 2: Designation *, Aadhar * */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <div>
                    <label htmlFor="designation_ext" className="block text-gray-700 mb-1 text-sm font-medium">Designation *</label>
                    <input id="designation_ext" type="text" name="designation" value={externalFormData.designation} onChange={handleChange} required
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                 <div>
                    <label htmlFor="aadhar" className="block text-gray-700 mb-1 text-sm font-medium">Aadhar *</label>
                    <input id="aadhar" type="text" name="aadhar" value={externalFormData.aadhar} onChange={handleChange} required pattern="\d{12}" title="Enter 12 digit Aadhar number"
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
             </div>
             {/* Row 3: Email (ReadOnly if Update), Phone * */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="email_ext" className="block text-gray-700 mb-1 text-sm font-medium">Mail ID *</label>
                    <input id="email_ext" type="email" name="email" value={externalFormData.email} onChange={handleChange} required
                           readOnly={!!memberId} aria-readonly={!!memberId}
                           className={`w-full p-2 border rounded-md ${!!memberId ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'} focus:ring-1 focus:ring-blue-400`}/>
                </div>
                <div>
                    <label htmlFor="phone_number_ext" className="block text-gray-700 mb-1 text-sm font-medium">Phone No. *</label>
                    <input id="phone_number_ext" type="tel" name="phone_number" value={externalFormData.phone_number} onChange={handleChange} required pattern="[0-9]{10,15}" title="Enter 10-15 digits"
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                </div>
            </div>
             {/* Row 4: DO Access (Uncomment if used), DO Exit */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Uncomment if do_access field exists and is needed
                  <div>
                     <label htmlFor="do_access" className="block text-gray-700 mb-1 text-sm font-medium">DO Access</label>
                     <input id="do_access" type="date" name="do_access" value={externalFormData.do_access} onChange={handleChange} max={new Date().toISOString().split("T")[0]}
                            className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                  </div>
                  */}
                 <div>
                    <label htmlFor="date_exited_ext" className="block text-gray-700 mb-1 text-sm font-medium">DO (Exit)</label>
                    <input id="date_exited_ext" type="date" name="date_exited" value={externalFormData.date_exited} onChange={handleChange}
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                  {/* Add spacer if DO Access is commented out */}
                  {/* <div></div> */}
             </div>
             {/* Row 5: Job Nature, Role * */}
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <div>
                    <label htmlFor="job_nature_ext" className="block text-gray-700 mb-1 text-sm font-medium">Job Nature</label>
                    <input id="job_nature_ext" type="text" name="job_nature" value={externalFormData.job_nature} onChange={handleChange}
                           className="w-full p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-400"/>
                 </div>
                 <div>
                     <label htmlFor="role_ext" className="block text-gray-700 mb-1 text-sm font-medium">Role (Access) *</label>
                     <Select inputId="role_ext" name="role" isMulti options={roleOptions} value={externalFormData.role}
                            onChange={handleSelectChange} required
                            className="w-full basic-multi-select" classNamePrefix="select"/>
                      {externalFormData.role.length === 0 && <p className="text-xs text-red-500 mt-1">Role is required.</p>} {/* Simple validation message */}
                 </div>
            </div>
         </>
    );

    // --- Main Render ---
    if (accessLevel !== "admin") {
        return (
            <section className="bg-white h-full flex items-center dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">403</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Access Denied</p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, you do not have permission to access this page.</p>
                        <button onClick={() => navigate(-1)} className="inline-flex text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4">Go Back</button>
                    </div>
                </div>
            </section>
        );
    }

    // Determine status colors dynamically
    const searchStatusColor = searchStatus.type === 'success' ? 'text-green-600' : searchStatus.type === 'error' ? 'text-red-600' : 'text-blue-600';
    const submitStatusColor = submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600';

    return (
        <div className="flex h-screen bg-gray-100"> {/* Changed background */}
            <Sidebar />
            <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden"> {/* Adjusted padding */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex-shrink-0 border-b pb-2">
                    {memberId ? 'Update Member Information' : 'Add New Member'} {/* Dynamic Title */}
                </h1>

                {/* Search Section */}
                <motion.div
                    className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 flex-shrink-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-wrap items-end gap-4"> {/* Use gap for spacing */}
                        <div className="flex-grow min-w-[250px]"> {/* Ensure input doesn't get too small */}
                            <label htmlFor="searchEmail" className="block text-gray-700 mb-1 text-sm font-medium">
                                Enter Member Email to Search or Add
                            </label>
                            <input
                                id="searchEmail"
                                type="email"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="e.g., user@example.com"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSearching}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={isSearching || !searchEmail}
                            className={`bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors duration-200 ${isSearching || !searchEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSearching ? ( /* Spinner SVG */ <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : null}
                            {isSearching ? 'Searching...' : 'Search / Find'}
                        </button>
                        <button
                            type="button"
                            onClick={handleResetToSearch}
                            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200"
                            title="Clear Search and Form"
                        >
                            Reset
                        </button>
                    </div>
                    {searchStatus.message && (
                        <p className={`mt-2 text-sm font-medium ${searchStatusColor}`}>
                           {searchStatus.message}
                        </p>
                    )}
                </motion.div>

                 {/* Form Section - Conditionally Rendered */}
                {showForm && (
                    <motion.div
                        className="bg-white p-4 md:p-6 rounded-lg shadow-md overflow-y-auto flex-grow" // Allows scrolling within the form area
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <form className="space-y-5" onSubmit={handleSubmit} noValidate> {/* Add noValidate to rely on custom/backend validation */}
                            {/* Member Type Selection (Only if adding new and not found) */}
                            {!memberId && searchStatus.type !== 'success' && (
                                <div>
                                    <label htmlFor="memberTypeSelect" className="block text-gray-700 mb-1 text-sm font-medium">Select Member Type *</label>
                                    <select
                                        id="memberTypeSelect"
                                        value={memberType}
                                        onChange={(e) => setMemberType(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="" disabled>-- Select Type --</option>
                                        <option value="ohc">OHC Staff</option>
                                        <option value="external">External Hospital</option>
                                    </select>
                                    {!memberType && <p className="text-xs text-red-500 mt-1">Please select a member type.</p>}
                                </div>
                            )}

                             {/* Show Member Type Info if updating */}
                             {memberId && (
                                 <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                                     <p className="font-medium text-gray-800">
                                         Updating Member Type: <span className="font-semibold">{memberType === 'ohc' ? 'OHC Staff' : 'External Hospital'}</span>
                                     </p>
                                     <p className="text-xs text-gray-600">Email is read-only.</p>
                                 </div>
                             )}

                            {/* Render form fields based on memberType */}
                            {memberType === 'ohc' && renderOHCStaffFields()}
                            {memberType === 'external' && renderExternalHospitalFields()}

                            {/* Submit/Status Area (Only show if a type is selected/determined) */}
                            {memberType && (
                                <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-gray-200 mt-4 gap-4">
                                     {/* Submit Status Message */}
                                     <div className="flex-grow text-center sm:text-left">
                                        {submitStatus.message && (
                                            <p className={`text-sm font-medium ${submitStatusColor}`}>
                                                {submitStatus.message}
                                            </p>
                                        )}
                                     </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition-all duration-200 w-full sm:w-auto ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                         {isSubmitting ? ( /* Spinner SVG */ <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : null}
                                        {isSubmitting ? 'Processing...' : (memberId ? 'Update Information' : 'Add New Member')}
                                    </button>
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default AddMember;