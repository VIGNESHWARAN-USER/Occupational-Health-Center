import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SignificantNotes from './SignificantNotes'; // Assuming this component exists

const Consultation = ({ data, type }) => {
  // --- State Variables ---
  const [complaints, setComplaints] = useState('');
  const [examination, setExamination] = useState('');
  const [lexamination, setLexamination] = useState('');
  const [diagnosis, setDiagnosis] = useState(''); // Renamed from procedure notes in form
  const [obsnotes, setObsnotes] = useState('');
  const [notifiableRemarks, setNotifiableRemarks] = useState(''); // For potential future use
  const [caseType, setCaseType] = useState('');
  const [illnessOrInjury, setIllnessOrInjury] = useState(''); // For potential future use
  const [otherCaseDetails, setOtherCaseDetails] = useState(''); // For potential future use
  const [investigationDetails, setInvestigationDetails] = useState('');
  const [adviceDetails, setAdviceDetails] = useState(''); // Added state for Advice
  const [referral, setReferral] = useState(null); // Changed initial state to null for better radio handling
  const [hospitalName, setHospitalName] = useState('');
  const [speaciality, setSpeciality] = useState(''); // Corrected typo
  const [doctorName, setDoctorName] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [systematic, setSystematic] = useState(''); // Added for systematic examination
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedByNurse, setSubmittedByNurse] = useState(''); // If needed

  // --- Derived Data & Constants ---
  const emp_no = data && data[0]?.emp_no; // Safer access
  const patientData = data && data[0]; // Reference to the main patient data object
  const submittedByDoctor = localStorage.getItem('userData') || 'Unknown Doctor'; // Get doctor name/ID
  const accessLevel = localStorage.getItem('accessLevel');
  const isDoctor = accessLevel === 'doctor';

  // Unused in current logic, but kept for potential expansion
  const caseTypeOptions = [
    { value: 'occupationalillness', label: 'Occupational Illness' },
    { value: 'occupationalinjury', label: 'Occupational Injury' },
    { value: 'occ-disease', label: 'Occ Disease' },
    { value: 'non-occupational', label: 'Non-Occupational' },
    { value: 'domestic', label: 'Domestic' },
    { value: 'commutation-injury', label: 'Commutation Injury' },
    { value: 'other', label: 'Other' },
  ];

  // --- useEffect for Auto-filling ---
  useEffect(() => {
    if (patientData && patientData.consultation) {
      const consult = patientData.consultation;
      setComplaints(consult.complaints || '');
      setExamination(consult.examination || '');
      setLexamination(consult.lexamination || '');
      setDiagnosis(consult.diagnosis || ''); // Use 'diagnosis' field for procedure notes area
      setObsnotes(consult.obsnotes || '');
      setNotifiableRemarks(consult.notifiable_remarks || ''); // Field from backend model
      setCaseType(consult.case_type || '');
      setIllnessOrInjury(consult.illness_or_injury || '');
      setOtherCaseDetails(consult.other_case_details || '');
      setInvestigationDetails(consult.investigation_details || '');
      setAdviceDetails(consult.advice || ''); // Assuming 'advice' field in backend model
      setReferral(consult.referral || null); // 'yes'/'no' or null
      setHospitalName(consult.hospital_name || '');
      setSpeciality(consult.speaciality || ''); // Corrected typo
      setDoctorName(consult.doctor_name || '');
      setFollowUpDate(consult.follow_up_date || '');
      setSystematic(consult.systematic || ''); // Added for systematic examination
      // Assuming nurse info might be stored if needed
      // setSubmittedByNurse(consult.submitted_by_nurse || '');
    } else {
      // Reset fields if no consultation data exists for this entry
      setComplaints('');
      setExamination('');
      setLexamination('');
      setDiagnosis('');
      setObsnotes('');
      setNotifiableRemarks('');
      setSystematic(''); // Added for systematic examination
      setCaseType('');
      setIllnessOrInjury('');
      setOtherCaseDetails('');
      setInvestigationDetails('');
      setAdviceDetails('');
      setReferral(null);
      setHospitalName('');
      setSpeciality('');
      setDoctorName('');
      setFollowUpDate('');
    }
  }, [patientData]); // Depend on the patientData object

  // --- Handle Consultation Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emp_no || !isDoctor) {
      alert("Cannot submit. Ensure you are logged in as a doctor and patient data is loaded.");
      return;
    }
    setIsSubmitting(true);

    const consultationPayload = {
      emp_no: emp_no,
      entry_date: patientData?.entry_date, // Include entry_date if needed for update/create logic
      complaints: complaints,
      examination: examination,
      lexamination: lexamination,
      diagnosis: diagnosis, // Send data from 'Procedure Notes' textarea
      obsnotes: obsnotes,
      notifiable_remarks: notifiableRemarks,
      case_type: caseType, // Include if using these fields
      illness_or_injury: illnessOrInjury, // Include if using these fields
      other_case_details: otherCaseDetails, // Include if using these fields
      investigation_details: investigationDetails,
      advice: adviceDetails, // Send advice data
      referral: referral, // 'yes' or 'no' or null
      hospital_name: hospitalName,
      speaciality: speaciality, // Corrected typo
      doctor_name: doctorName,
      submitted_by_doctor: submittedByDoctor,
      submitted_by_nurse: submittedByNurse, // Include if needed
      follow_up_date: followUpDate || null, // Send null if empty
    };

    try {
      // --- Submit Consultation Data ---
      const response = await axios.post("https://occupational-health-center-1.onrender.com/consultations/add/", consultationPayload);

      if (response.status === 200 || response.status === 201) { // Handle create (201) or update (200)
        alert("Consultation data submitted successfully!");

        // --- Check and Book Follow-up Appointment ---
        if (followUpDate) {
          console.log("Follow-up date detected, attempting to book appointment...");
          const appointmentPayload = {
            role: patientData?.type || 'Unknown', // Get role from patient data
            name: patientData?.name || 'N/A', // Get name
            employeeId: emp_no,
            organization: (patientData?.type === 'Employee' || patientData?.type === 'Visitor') ? (patientData?.employer || patientData?.organization || 'N/A') : null, // Org for Employee/Visitor
            aadharNo: patientData?.aadhar || null, // Aadhar
            contractorName: patientData?.type === 'Contractor' ? (patientData?.employer || 'N/A') : null, // Contractor name if applicable
            purpose: "Follow Up", // Specific purpose for follow-up
            appointmentDate: followUpDate, // The follow-up date
            time: "10:00", // Default time for auto-booking, adjust if needed
            bookedBy: submittedByDoctor, // Or a system user/nurse if appropriate
            consultedDoctor: submittedByDoctor, // Assume same doctor initially
          };

          try {
            const apptResponse = await axios.post("https://occupational-health-center-1.onrender.com/bookAppointment/", appointmentPayload);
            if (apptResponse.status === 200 || apptResponse.status === 201) {
              alert(`Follow-up appointment booked successfully! ${apptResponse.data.message || ''}`);
            } else {
               console.error('Appointment Booking Error:', apptResponse.data);
               alert(`Consultation saved, but failed to book follow-up appointment: ${apptResponse.data.error || 'Unknown error'}`);
            }
          } catch (apptError) {
            console.error('Error booking follow-up appointment:', apptError);
            let errorMsg = "Consultation saved, but an error occurred while booking the follow-up appointment.";
            if (apptError.response && apptError.response.data && apptError.response.data.error) {
                errorMsg += ` Error: ${apptError.response.data.error}`;
            }
            alert(errorMsg);
          }
        }
        // --- End Appointment Booking ---

      } else {
        console.error('Consultation Submission Error:', response.data);
        alert(`Error submitting consultation data: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
       let errorMsg = "An unexpected error occurred during consultation submission.";
        if (error.response && error.response.data && error.response.data.error) {
            errorMsg += ` Error: ${error.response.data.error}`;
        }
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (!patientData) {
    return <div className="p-6">Loading patient data or no data available...</div>; // Handle loading/no data case
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8">Consultation</h2>

      <form onSubmit={handleSubmit}>
        {/* --- Input Fields --- */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="complaints">Complaints</label>
          <textarea
            id="complaints"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter complaints here..."
            value={complaints}
            onChange={(e) => setComplaints(e.target.value)}
            disabled={!isDoctor}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="examination">General Examination</label>
          <textarea
            id="examination"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter general examination details here..."
            value={examination}
            onChange={(e) => setExamination(e.target.value)}
            disabled={!isDoctor}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="examination">Systematic Examination</label>
          <textarea
            id="systematic"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter systematic examination details here (CVS, RS, GIT, etc)"
            value={systematic}
            onChange={(e) => setSystematic(e.target.value)}
            disabled={!isDoctor}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="lexamination">Local Examination</label>
          <textarea
            id="lexamination"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter local examination details here..."
            value={lexamination}
            onChange={(e) => setLexamination(e.target.value)}
            disabled={!isDoctor}
          />
        </div>

        {/* Changed label to match functionality */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="diagnosis">Diagnosis / Procedure Notes</label>
          <textarea
            id="diagnosis"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter diagnosis / procedure notes here..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            disabled={!isDoctor}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="obsnotes">Observation Notes</label>
          <textarea
            id="obsnotes"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter observation notes here..."
            value={obsnotes}
            onChange={(e) => setObsnotes(e.target.value)}
            disabled={!isDoctor}
          />
        </div>

         {/* Section for Investigation, Advice, Follow-up */}
         <div className="border-t pt-6 mt-6">
             <h3 className="text-xl font-semibold mb-4">Plan</h3>
             <div className="mb-4">
                 <label htmlFor="investigationDetails" className="block text-gray-700 text-lg font-medium mb-2">
                     Investigation
                 </label>
                 <textarea
                     id="investigationDetails"
                     className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                     placeholder="Suggest investigations (e.g., FBS/HBA1c, CBC...)"
                     value={investigationDetails}
                     onChange={(e) => setInvestigationDetails(e.target.value)}
                     disabled={!isDoctor}
                     rows="3"
                 />
             </div>

             <div className="mb-4">
                 <label htmlFor="adviceDetails" className="block text-gray-700 text-lg font-medium mb-2">
                     Advice
                 </label>
                 <textarea
                     id="adviceDetails"
                     className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                     placeholder="Enter advice (e.g., Diet/exercise/medication adherence...)"
                     value={adviceDetails}
                     onChange={(e) => setAdviceDetails(e.target.value)}
                     disabled={!isDoctor}
                     rows="3"
                 />
             </div>

             <div className="mb-4">
                 <label htmlFor="followUpDate" className="block text-gray-700 text-lg font-medium mb-2">
                     Follow Up (Review Date):
                 </label>
                 <input
                     type="date"
                     id="followUpDate"
                     className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                     value={followUpDate}
                     onChange={(e) => setFollowUpDate(e.target.value)}
                     disabled={!isDoctor}
                     // Optional: Add min date to prevent past dates
                     min={new Date().toISOString().split('T')[0]}
                 />
             </div>
         </div>


        {/* Referral Section - Conditionally Rendered based on type */}
        {type !== 'Visitor' && (
          <div className="border-t pt-6 mt-6">
             <h3 className="text-xl font-semibold mb-4">Referral (Optional)</h3>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-medium mb-2">
                Do you need a referral?
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="referral"
                    value="yes"
                    checked={referral === 'yes'}
                    onChange={() => setReferral('yes')}
                    className="form-radio text-blue-500 h-5 w-5"
                    disabled={!isDoctor}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="referral"
                    value="no"
                    checked={referral === 'no'}
                    onChange={() => setReferral('no')}
                    className="form-radio text-blue-500 h-5 w-5"
                    disabled={!isDoctor}
                  />
                  No
                </label>
                 <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="referral"
                    value="" // Represents 'null' or 'not selected'
                    checked={referral === null || referral === ''}
                    onChange={() => setReferral(null)} // Set state to null
                    className="form-radio text-gray-500 h-5 w-5"
                    disabled={!isDoctor}
                  />
                  N/A
                </label>
              </div>
            </div>

            {/* Show referral details only if 'yes' is selected */}
            {referral === 'yes' && (
                <>
                 <div className="mb-6">
                    <label htmlFor="hospitalName" className="block text-gray-700 text-lg font-medium mb-2">
                    Hospital Name
                    </label>
                    <input
                        id="hospitalName"
                        type="text"
                        className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter hospital name..."
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        disabled={!isDoctor}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="speciality" className="block text-gray-700 text-lg font-medium mb-2">
                    Speciality
                    </label>
                    <input
                        id="speciality"
                        type="text"
                        className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter speciality (e.g., Cardiology, Orthopedics)..."
                        value={speaciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        disabled={!isDoctor}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="doctorName" className="block text-gray-700 text-lg font-medium mb-2">
                    Referred Doctor Name (Optional)
                    </label>
                    <input
                        id="doctorName"
                        type="text"
                        className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter referred doctor's name if known..."
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        disabled={!isDoctor}
                    />
                </div>
                </>
            )}
          </div>
        )}

        {/* Significant Notes Component */}
        <div className="border-t pt-6 mt-6">
             <SignificantNotes data={data} type={type} />
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className={`min-w-[150px] bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ${(!isDoctor || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isDoctor || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Consultation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Consultation;