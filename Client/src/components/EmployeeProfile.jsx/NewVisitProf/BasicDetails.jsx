import React, { useMemo } from 'react';


const DetailCard = ({ label, value, isTextArea = false }) => (
    <div className={`${isTextArea ? 'col-span-3' : ''}`}> {/* Address textareas span full width */}
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <div className={`px-4 py-3 w-full bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-gray-800 text-sm min-h-[44px] flex items-center ${isTextArea ? 'items-start' : ''}`}> {/* Ensure consistent height, align text start for textarea */}
            {value ? (
                isTextArea ? <p className="whitespace-pre-wrap">{value}</p> : value
            ) : (
                <span className="text-gray-400 italic">N/A</span>
            )}
        </div>
    </div>
);

const BasicDetails = ({ data }) => { // Assuming 'data' contains the fetched/saved details

    // Calculate Age - Keep the robust calculation
    const age = useMemo(() => {
        if (!data?.dob) return 'N/A';
        try {
             // Assuming dob is 'YYYY-MM-DD' format from input type="date"
            const birthDate = new Date(data.dob);
            const today = new Date();

            if (isNaN(birthDate.getTime())) {
                 // Handle potential invalid date string format if not YYYY-MM-DD
                 // Basic check for common separators, adapt if needed
                 const parts = data.dob.split(/[-/]/);
                 if (parts.length === 3) {
                     const [p1, p2, p3] = parts.map(Number);
                     // Try YYYY-MM-DD (already attempted), then DD-MM-YYYY, then MM-DD-YYYY
                     let parsedDate = new Date(p1, p2 - 1, p3); // YYYY-MM-DD
                     if(isNaN(parsedDate.getTime())) parsedDate = new Date(p3, p2 - 1, p1); // DD-MM-YYYY
                     if(isNaN(parsedDate.getTime())) parsedDate = new Date(p3, p1 - 1, p2); // MM-DD-YYYY (less common for dob)

                     if (!isNaN(parsedDate.getTime())) {
                         birthDate.setTime(parsedDate.getTime());
                     } else {
                        return 'Invalid Date';
                     }
                 } else {
                    return 'Invalid Format';
                 }
            }

            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            return calculatedAge >= 0 ? calculatedAge : 'Invalid Date'; // Ensure age is non-negative
        } catch (error) {
            console.error("Error calculating age:", error);
            return 'Error';
        }
    }, [data?.dob]);


    // Helper function to render N/A for empty fields (already handled in DetailCard)
    // const renderValue = (value) => value || <span className="text-gray-400 italic">N/A</span>;

    if (!data) {
        return (
             <div className="mt-8 p-4 text-center text-gray-500">
                No basic details available.
            </div>
        )
    }

    return (
        <div className="mt-6 p-4 bg-white rounded-lg shadow"> {/* Added container style */}
            {/* --- Basic Details Section --- */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <DetailCard label="Name" value={data?.name} />
                <DetailCard label="Date of Birth" value={data?.dob} />
                <DetailCard label="Age" value={age} /> {/* Use calculated age */}
                <DetailCard label="Sex" value={data?.sex} />
                <DetailCard label="Aadhar No." value={data?.aadhar} />
                <DetailCard label="Blood Group" value={data?.bloodgrp} />
                <DetailCard label="Identification Marks 1" value={data?.identification_marks1} />
                <DetailCard label="Identification Marks 2" value={data?.identification_marks2} />

                {/* Conditional Fields based on Role */}
                {data?.role === "Visitor" ? (
                    <>
                        <DetailCard label="Other Site ID" value={data?.other_site_id} />
                        <DetailCard label="Country ID" value={data?.country_id} />
                    </>
                ) : (
                     <DetailCard label="Marital Status" value={data?.marital_status} />
                )}
            </div>

            {/* --- Visit Details Section (Visitor Only) --- */}
            {data?.role === "Visitor" && (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 mt-6">Visit Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                        <DetailCard label="Name of Organization" value={data?.organization} />
                        <DetailCard label="Address of Organization" value={data?.addressOrganization} />
                        <DetailCard label="Visiting Department" value={data?.visiting_department} />
                        <DetailCard label="Visiting Date From" value={data?.visiting_date_from} />
                        <DetailCard label="Stay in Guest House" value={data?.stay_in_guest_house} />
                        <DetailCard label="Visiting Purpose" value={data?.visiting_purpose} />
                    </div>
                </>
            )}

            {/* --- Employment Details Section (Employee/Contractor) --- */}
            {(data?.role === "Contractor" || data?.role === "Employee") && (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 mt-6">Employment Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                        <DetailCard label="Employee Number" value={data?.emp_no} />
                        <DetailCard label={data?.role === "Contractor" ? "Contract Employer" : "Employer"} value={data?.employer} />
                        {data?.role === "Employee" && ( // Location only for Employee
                            <DetailCard label="Location" value={data?.location} />
                        )}
                        <DetailCard label="Designation" value={data?.designation} />
                        <DetailCard label="Department" value={data?.department} />
                        <DetailCard label="Nature of Job" value={data?.job_nature} />
                        <DetailCard label="Date of Joining" value={data?.doj} />
                        {data?.role !== "Contractor" && ( // MOJ not for Contractor
                            <DetailCard label="Mode of Joining" value={data?.moj} />
                        )}
                    </div>
                </>
            )}

            {/* --- Contact Details Section --- */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 mt-6">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <DetailCard label="Phone (Personal)" value={data?.phone_Personal} />
                <DetailCard label="Mail ID (Personal)" value={data?.mail_id_Personal} />
                <DetailCard label="Emergency Contact Person" value={data?.emergency_contact_person} />
                <DetailCard label="Phone (Office)" value={data?.phone_Office} />
                <DetailCard label="Mail ID (Office)" value={data?.mail_id_Office} />
                <DetailCard label="Emergency Contact Relation" value={data?.emergency_contact_relation} />
                <DetailCard label="Mail ID (Emergency Contact)" value={data?.mail_id_Emergency_Contact_Person} />
                <DetailCard label="Emergency Contact Phone" value={data?.emergency_contact_phone} />
            </div>

            {/* --- Permanent Address Section --- */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 mt-6">Permanent Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <DetailCard label="Town/City" value={data?.permanent_area} />
                <DetailCard label="State" value={data?.permanent_state} />
                <DetailCard label="Nationality" value={data?.permanent_nationality} />
                {/* Address uses full width */}
                <DetailCard label="Address" value={data?.permanent_address} isTextArea={true} />
            </div>

            {/* --- Residential Address Section --- */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 mt-6">Residential Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <DetailCard label="Town/City" value={data?.residential_area} />
                <DetailCard label="State" value={data?.residential_state} />
                <DetailCard label="Nationality" value={data?.residential_nationality} />
                {/* Address uses full width */}
                <DetailCard label="Address" value={data?.residential_address} isTextArea={true} />
            </div>

        </div>
    );
};

export default BasicDetails;