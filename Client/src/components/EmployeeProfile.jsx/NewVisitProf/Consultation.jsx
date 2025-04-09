// ConsultationDisplay.jsx
import React, { useEffect, useState } from 'react';
import moment from 'moment'; // For date formatting

// --- Reusable Detail Item Component ---
// Renders a label and its value in a consistent styled format.
// Handles empty values and multi-line text appropriately.
const DetailItem = ({ label, value, isFullWidth = false, isTextArea = false }) => (
    <div className={isFullWidth ? "md:col-span-2" : ""}> {/* Span 2 cols on medium screens if full width */}
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className={`px-3 py-2 w-full bg-gray-50 border border-gray-200 rounded-md shadow-sm text-gray-800 text-sm min-h-[38px] ${isTextArea ? 'whitespace-pre-wrap' : 'flex items-center'}`}>
            {value !== null && value !== undefined && value !== '' ? (
                 value
            ) : (
                <span className="text-gray-400 italic">N/A</span>
            )}
        </div>
    </div>
);

// --- Main Consultation Display Component ---
const ConsultationDisplay = ({ data, type }) => {
    console.log(data)
    // State to hold the processed data for display
    const [displayData, setDisplayData] = useState(data.consultation || null);

    // Map case type values to readable labels (optional but good for display)
    const caseTypeLabels = {
        'occupationalillness': 'Occupational Illness',
        'occupationalinjury': 'Occupational Injury',
        'occ-disease': 'Occ Disease',
        'non-occupational': 'Non-Occupational',
        'domestic': 'Domestic',
        'commutation-injury': 'Commutation Injury',
        'other': 'Other',
    };

    // Process the incoming prop data when it's available or changes
    useEffect(() => {
        if (data) {
            setDisplayData({
                complaints: displayData.complaints || "N/A",
                examination: displayData.examination || "N/A", // General Examination
                lexamination: displayData.lexamination || "N/A", // Local Examination
                diagnosis: displayData.diagnosis || "N/A", // Procedure Notes
                obsnotes: displayData.obsnotes || "N/A", // Observation Notes
                // Assuming 'advice' will be saved in the future based on entry form UI
                advice: displayData.advice || "N/A", // Placeholder for Advice
                case_type: caseTypeLabels[displayData.case_type] || displayData.case_type || "N/A", // Use label or raw value
                illness_or_injury: displayData.illness_or_injury || "N/A", // This might need linking to case_type logic
                other_case_details: displayData.other_case_details || "N/A",
                investigation_details: displayData.investigation_details || "N/A", // Investigation
                referral: displayData.referral ? (displayData.referral === 'yes' ? 'Yes' : 'No') : 'N/A', // Convert boolean/string to Yes/No
                hospital_name: displayData.hospital_name || "N/A",
                speaciality: displayData.speaciality || "N/A", // Speciality
                doctor_name: displayData.doctor_name || "N/A", // Referred Doctor Name
                follow_up_date: displayData.follow_up_date ? moment(displayData.follow_up_date).format('LL') : 'N/A', // Format date
                submitted_by_doctor: displayData.submitted_by_doctor || "N/A",
                submitted_by_nurse: displayData.submitted_by_nurse || "N/A",
                // Notifiable remarks might be sensitive or internal, display if needed
                // notifiable_remarks: consultationData.notifiable_remarks || "N/A",
            });
        } else {
            setDisplayData(null); // Reset if no data
        }
    }, [data]); // Re-run effect if the input data prop changes

    // Render loading or no data message
    if (!displayData) {
        return (
            <div className="mt-6 p-6 bg-white rounded-lg shadow text-center text-gray-500">
                No consultation data available to display.
            </div>
        );
    }

    // Determine if the original case type was 'other' for conditional display
    const wasOtherCaseType = data?.case_type === 'other';
    // Determine if referral was 'yes' for conditional display
    const needsReferral = data?.referral === 'yes';
    // Determine if the type is visitor to hide referral section
    const isVisitor = type === 'Visitor';


    return (
        <div className="mt-6 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Consultation Details</h2>

            {/* Core Consultation Notes Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <DetailItem label="Complaints" value={displayData.complaints} isTextArea={true} isFullWidth={true} />
                <DetailItem label="General Examination" value={displayData.examination} isTextArea={true} isFullWidth={true} />
                <DetailItem label="Local Examination" value={displayData.lexamination} isTextArea={true} isFullWidth={true} />
                <DetailItem label="Procedure Notes" value={displayData.diagnosis} isTextArea={true} isFullWidth={true} />
                <DetailItem label="Observation Notes" value={displayData.obsnotes} isTextArea={true} isFullWidth={true} />
            </div>

            {/* Case Details Section */}
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-t pt-4">Case Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <DetailItem label="Case Type" value={displayData.case_type} />
                {/* Conditionally display 'Other Case Details' */}
                {wasOtherCaseType && (
                    <DetailItem label="Other Case Details" value={displayData.other_case_details} isFullWidth={true} />
                )}
                {/* You might want to display illness_or_injury depending on your logic */}
                {/* <DetailItem label="Illness/Injury Type" value={displayData.illness_or_injury} /> */}
            </div>

             {/* Actions / Recommendations Section */}
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-t pt-4">Recommendations & Follow-up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <DetailItem label="Investigation" value={displayData.investigation_details} isTextArea={true} isFullWidth={true} />
                 {/* Display Advice if it's saved */}
                 <DetailItem label="Advice" value={displayData.advice} isTextArea={true} isFullWidth={true} />
                 <DetailItem label="Follow Up Date" value={displayData.follow_up_date} />
            </div>

            {/* Referral Section - Conditionally Rendered */}
            {!isVisitor && ( // Hide this whole section for visitors
                <>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 border-t pt-4">Referral Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                        <DetailItem label="Referral Needed?" value={displayData.referral} />
                        {/* Only show hospital/doctor details if referral is 'Yes' */}
                        {needsReferral && (
                            <>
                                <DetailItem label="Referred Hospital" value={displayData.hospital_name} />
                                <DetailItem label="Referred Speciality" value={displayData.speaciality} />
                                <DetailItem label="Referred Doctor" value={displayData.doctor_name} />
                            </>
                        )}
                    </div>
                </>
            )}
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-t pt-4">Submission Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Consulted By (Doctor)" value={displayData.submitted_by_doctor} />
                <DetailItem label="Submitted By (Nurse)" value={displayData.submitted_by_nurse} />
            </div>

        </div>
    );
};

export default ConsultationDisplay;