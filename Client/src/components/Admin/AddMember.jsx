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
    const [searchAadhar, setSearchAadhar] = useState('');
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
        setSearchAadhar('');
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
        if (!searchAadhar.trim() || !/^\d{12}$/.test(searchAadhar)) {
            setSearchStatus({ type: 'error', message: "Please enter a valid 12-digit Aadhar number." });
            return;
        }
        setIsSearching(true);
        setSearchStatus({ type: null, message: null });
        setSubmitStatus({ type: null, message: null });
        setShowForm(false);
        setMemberId(null);
        setMemberType('');
        setOHCFormData(initialOHCState);
        setExternalFormData(initialExternalState);

        try {
            const searchUrl = `http://localhost:8000/find_member_by_aadhar/?aadhar=${encodeURIComponent(searchAadhar)}`;
            const response = await axios.get(searchUrl);
            const data = response.data;

            if (data.error) {
                setSearchStatus({ type: 'error', message: data.message || 'An error occurred during search.' });
                return;
            }

            if (data.found && data.member) {
                const memberData = data.member;
                const determinedType = memberData.memberTypeDetermined;
                console
                setMemberId(memberData.id);
                setMemberType(determinedType);

                const commonData = {
                    name: memberData.name || "",
                    designation: memberData.designation || "",
                    email: memberData.email || "",
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
                        aadhar: memberData.aadhar || searchAadhar,
                    });
                }
                setShowForm(true);
                setSearchStatus({
                    type: 'success',
                    message: `Member found (ID: ${memberData.id}). Details pre-filled for update`
                });
            } else {
                setMemberId(null);
                setShowForm(true);
                setSearchStatus({ 
                    type: 'info', 
                    message: `Member not found. Select type below to add a new member.` 
                });
                setOHCFormData({ ...initialOHCState });
                setExternalFormData({ ...initialExternalState, aadhar: searchAadhar });
            }
        } catch (error) {
            console.error("Error searching member:", error);
            const errorMessage = error.response?.data?.message || 
                               "Failed to search for member. Please check your network connection and try again.";
            setSearchStatus({ 
                type: 'error', 
                message: errorMessage
            });
            setMemberId(null);
            setShowForm(false);
        } finally {
            setIsSearching(false);
        }
    }, [searchAadhar]);

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
            dataToSend = { 
                ...ohcFormData, 
                role: rolesForApi, 
                memberType: 'ohc',
                aadhar: searchAadhar // Ensure Aadhar is included
            };
        } else if (memberType === 'external') {
            rolesForApi = externalFormData.role ? externalFormData.role.map(option => option.value) : [];
            dataToSend = { 
                ...externalFormData, 
                role: rolesForApi, 
                memberType: 'external',
                aadhar: searchAadhar // Ensure Aadhar is included
            };
        }

        // Determine API endpoint and method
        if (memberId) {
            // UPDATE mode
            url = `http://localhost:8000/members/update/${memberId}/`;
            method = 'put';
        } else {
            // ADD mode
            url = "http://localhost:8000/members/add/";
            method = 'post';
        }

        try {
            const response = await axios({ method, url, data: dataToSend });
            const successMessage = memberId 
                ? "Member details updated successfully!" 
                : "New member added successfully!";
            setSubmitStatus({ type: 'success', message: successMessage });
            
            // If it was an update, refresh the form with new data
            if (memberId) {
                handleSearch(); // Re-fetch the updated data
            } else {
                // For new members, reset the form after a delay
                setTimeout(handleResetToSearch, 2000);
            }
        } catch (error) {
            console.error(`Error ${memberId ? 'updating' : 'adding'} member:`, error);
            const errorMsg = error.response?.data?.message ||
                `Failed to ${memberId ? 'update' : 'add'} member. Please try again.`;
            setSubmitStatus({ type: 'error', message: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    }, [memberType, memberId, ohcFormData, externalFormData, searchAadhar, handleResetToSearch, handleSearch]);

    // --- Enhanced Form Field Rendering ---
    const renderOHCStaffFields = () => (
        <>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">OHC Staff Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee Number *</label>
                        <input
                            type="text"
                            name="employee_number"
                            value={ohcFormData.employee_number}
                            onChange={handleChange}
                            required
                            readOnly={!!memberId}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                memberId ? 'bg-gray-100' : ''
                            }`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={ohcFormData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation *</label>
                        <input
                            type="text"
                            name="designation"
                            value={ohcFormData.designation}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={ohcFormData.email}
                            onChange={handleChange}
                            required
                            readOnly={!!memberId}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                memberId ? 'bg-gray-100' : ''
                            }`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Joining *</label>
                        <input
                            type="date"
                            name="doj"
                            value={ohcFormData.doj}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={ohcFormData.phone_number}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Nature</label>
                        <input
                            type="text"
                            name="job_nature"
                            value={ohcFormData.job_nature}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role (Access) *</label>
                        <Select
                            name="role"
                            isMulti
                            options={roleOptions}
                            value={ohcFormData.role}
                            onChange={handleSelectChange}
                            required
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>
        </>
    );

    const renderExternalHospitalFields = () => (
        <>
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">External Hospital Staff Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={externalFormData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hospital Name *</label>
                        <input
                            type="text"
                            name="hospital_name"
                            value={externalFormData.hospital_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation *</label>
                        <input
                            type="text"
                            name="designation"
                            value={externalFormData.designation}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={externalFormData.email}
                            onChange={handleChange}
                            required
                            readOnly={!!memberId}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                                memberId ? 'bg-gray-100' : ''
                            }`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={externalFormData.phone_number}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Nature</label>
                        <input
                            type="text"
                            name="job_nature"
                            value={externalFormData.job_nature}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role (Access) *</label>
                        <Select
                            name="role"
                            isMulti
                            options={roleOptions}
                            value={externalFormData.role}
                            onChange={handleSelectChange}
                            required
                            className="mt-1"
                        />
                    </div>
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
                            <label htmlFor="searchAadhar" className="block text-gray-700 mb-1 text-sm font-medium">
                                Enter Member Aadhar Number to Search or Add
                            </label>
                            <input
                                id="searchAadhar"
                                type="text"
                                value={searchAadhar}
                                onChange={(e) => setSearchAadhar(e.target.value)}
                                placeholder="e.g., 123456789012"
                                pattern="\d{12}"
                                maxLength={12}
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSearching}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={isSearching || !searchAadhar}
                            className={`bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors duration-200 ${isSearching || !searchAadhar ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                        {isSubmitting ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
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