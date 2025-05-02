import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SignificantNotes from './SignificantNotes'; // Assuming this component exists

const Consultation = ({ data, type }) => {
  // --- State Variables ---
  const [complaints, setComplaints] = useState('');
  const [examination, setExamination] = useState(''); // General Exam
  const [systematic, setSystematic] = useState(''); // Systematic Exam
  const [lexamination, setLexamination] = useState(''); // Local Exam
  const [diagnosis, setDiagnosis] = useState(''); // Diagnosis Notes
  const [procedureNotes, setProcedureNotes] = useState(''); // Procedure Notes
  const [obsnotes, setObsnotes] = useState(''); // Observation/Ward Notes
  const [notifiableRemarks, setNotifiableRemarks] = useState('');
  const [caseType, setCaseType] = useState('');
  const [illnessOrInjury, setIllnessOrInjury] = useState('');
  const [otherCaseDetails, setOtherCaseDetails] = useState('');
  const [investigationDetails, setInvestigationDetails] = useState('');
  const [adviceDetails, setAdviceDetails] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [specialCases, setSpecialCases] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedByNurse, setSubmittedByNurse] = useState(''); // Keep if needed

  // Referral State
  const [referral, setReferral] = useState(null); // 'yes', 'no', or null
  const [hospitalName, setHospitalName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [doctorName, setDoctorName] = useState('');

  // --- NEW: Shifting State ---
  const [shiftingRequired, setShiftingRequired] = useState(null); // 'yes', 'no', or null
  const [shiftingNotes, setShiftingNotes] = useState('');
  const [ambulanceDetails, setAmbulanceDetails] = useState('');
  // --- END: Shifting State ---

  // --- Derived Data & Constants ---
  const emp_no = data && data[0]?.aadhar; // Use aadhar as the primary identifier
  const patientData = data && data[0];
  const submittedByDoctor = localStorage.getItem('userData') || 'Unknown Doctor';
  const accessLevel = localStorage.getItem('accessLevel');
  const isDoctor = accessLevel === 'doctor';

  // --- useEffect for Auto-filling ---
  useEffect(() => {
    if (patientData && patientData.consultation) {
      const consult = patientData.consultation;
      setComplaints(consult.complaints || '');
      setExamination(consult.examination || '');
      setSystematic(consult.systematic || '');
      setLexamination(consult.lexamination || '');
      setDiagnosis(consult.diagnosis || '');
      setProcedureNotes(consult.procedure_notes || '');
      setObsnotes(consult.obsnotes || '');
      setNotifiableRemarks(consult.notifiable_remarks || '');
      setCaseType(consult.case_type || '');
      setIllnessOrInjury(consult.illness_or_injury || '');
      setOtherCaseDetails(consult.other_case_details || '');
      setInvestigationDetails(consult.investigation_details || '');
      setAdviceDetails(consult.advice || '');
      setFollowUpDate(consult.follow_up_date || '');
      setSpecialCases(consult.special_cases || '');

      // Populate Referral State
      setReferral(consult.referral || null);
      setHospitalName(consult.hospital_name || '');
      setSpeciality(consult.speciality || '');
      setDoctorName(consult.doctor_name || '');

      // --- NEW: Populate Shifting State ---
      setShiftingRequired(consult.shifting_required || null);
      setShiftingNotes(consult.shifting_notes || '');
      setAmbulanceDetails(consult.ambulance_details || '');
      // --- END: Populate Shifting State ---

      // setSubmittedByNurse(consult.submitted_by_nurse || ''); // If needed
    } else {
      // Reset fields if no consultation data exists
      setComplaints('');
      setExamination('');
      setSystematic('');
      setLexamination('');
      setDiagnosis('');
      setProcedureNotes('');
      setObsnotes('');
      setNotifiableRemarks('');
      setCaseType('');
      setIllnessOrInjury('');
      setOtherCaseDetails('');
      setInvestigationDetails('');
      setAdviceDetails('');
      setFollowUpDate('');
      setSpecialCases('');
      setSubmittedByNurse('');

      // Reset Referral State
      setReferral(null);
      setHospitalName('');
      setSpeciality('');
      setDoctorName('');

      // --- NEW: Reset Shifting State ---
      setShiftingRequired(null);
      setShiftingNotes('');
      setAmbulanceDetails('');
      // --- END: Reset Shifting State ---
    }
  }, [patientData]); // Depend on the entire patientData object

  // --- Handle Consultation Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emp_no || !isDoctor) {
      alert("Cannot submit. Ensure you are logged in as a doctor and patient data is loaded.");
      return;
    }
    setIsSubmitting(true);

    const consultationPayload = {
      aadhar: emp_no,
      complaints: complaints,
      examination: examination,
      systematic: systematic,
      lexamination: lexamination,
      diagnosis: diagnosis,
      procedure_notes: procedureNotes,
      obsnotes: obsnotes,
      notifiable_remarks: notifiableRemarks,
      case_type: caseType,
      illness_or_injury: illnessOrInjury,
      other_case_details: otherCaseDetails,
      investigation_details: investigationDetails,
      advice: adviceDetails,
      special_cases: specialCases,
      submitted_by_doctor: submittedByDoctor,
      follow_up_date: followUpDate || null,

      // Referral Data (Conditional)
      referral: referral,
      hospital_name: referral === 'yes' ? hospitalName : '',
      speciality: referral === 'yes' ? speciality : '',
      doctor_name: referral === 'yes' ? doctorName : '',

      // --- NEW: Shifting Data (Conditional) ---
      shifting_required: shiftingRequired, // Send 'yes', 'no', or null
      shifting_notes: shiftingRequired === 'yes' ? shiftingNotes : '', // Send only if shifting
      ambulance_details: shiftingRequired === 'yes' ? ambulanceDetails : '', // Send only if shifting
      // --- END: Shifting Data ---

      // submitted_by_nurse: submittedByNurse, // Include if relevant
    };

    console.log("Submitting Payload:", consultationPayload); // Log payload before sending

    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/consultations/add/", consultationPayload);

      if (response.status === 200 || response.status === 201) {
        alert("Consultation data submitted successfully!");

        // --- Check and Book Follow-up Appointment (Keep existing logic) ---
        if (followUpDate) {
          // ... (existing appointment booking logic remains here) ...
             console.log("Follow-up date detected, attempting to book appointment...");
             const appointmentPayload = {
                 role: patientData?.type || 'Unknown',
                 name: patientData?.name || 'N/A',
                 employeeId: patientData?.emp_no || '', // Send original emp_no if available for legacy/display
                 organization: (patientData?.type === 'Employee' || patientData?.type === 'Visitor') ? (patientData?.employer || patientData?.organization || 'N/A') : null,
                 aadharNo: emp_no, // Use aadhar as primary identifier
                 contractorName: patientData?.type === 'Contractor' ? (patientData?.employer || 'N/A') : null, // Adjust logic as needed
                 purpose: "Follow Up",
                 appointmentDate: followUpDate,
                 time: "10:00", // Consider making this configurable or dynamic
                 bookedBy: submittedByDoctor,
                 consultedDoctor: submittedByDoctor,
                 // Include employer field if needed by backend for appointment
                 employer: patientData?.employer || '',
             };

             try {
                 const apptResponse = await axios.post("https://occupational-health-center-1.onrender.com/bookAppointment/", appointmentPayload);
                 if (apptResponse.status === 200 || apptResponse.status === 201) {
                 alert(`Follow-up appointment booked successfully! ${apptResponse.data.message || ''}`);
                 } else {
                 console.error('Appointment Booking Error Response:', apptResponse);
                 alert(`Consultation saved, but failed to book follow-up appointment: ${apptResponse.data?.error || apptResponse.statusText || 'Unknown error'}`);
                 }
             } catch (apptError) {
                 console.error('Error booking follow-up appointment:', apptError);
                 let errorMsg = "Consultation saved, but an error occurred while booking the follow-up appointment.";
                 if (apptError.response?.data?.error) {
                     errorMsg += ` Error: ${apptError.response.data.error}`;
                 } else if (apptError.message) {
                     errorMsg += ` Error: ${apptError.message}`;
                 }
                 alert(errorMsg);
             }
        }
        // --- End Appointment Booking ---

      } else {
        console.error('Consultation Submission Error Response:', response);
        alert(`Error submitting consultation data: ${response.data?.error || response.statusText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
       let errorMsg = "An unexpected error occurred during consultation submission.";
        if (error.response?.data?.error) {
            errorMsg += ` Error: ${error.response.data.error}`;
        } else if (error.message) {
             errorMsg += ` Error: ${error.message}`;
        }
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (!patientData) {
    return <div className="p-6 text-center text-gray-500">Loading patient data or no data available...</div>;
  }

  // Common textarea class
  const textAreaClasses = `w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed`;
  const inputClasses = `w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed`;
  const labelClasses = "block text-gray-700 mb-2 text-lg font-medium";
  const radioLabelClasses = "flex items-center gap-2 cursor-pointer";
  const radioInputClasses = "form-radio text-blue-500 h-5 w-5 disabled:opacity-50 disabled:cursor-not-allowed";
  const sectionHeadingClasses = "text-xl font-semibold mb-2";

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 border-b pb-3">Consultation</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Input Fields --- */}
        <div>
          <label className={labelClasses} htmlFor="complaints">Complaints</label>
          <textarea id="complaints" className={textAreaClasses} rows="4"
            placeholder="Enter complaints here..." value={complaints}
            onChange={(e) => setComplaints(e.target.value)} disabled={!isDoctor}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="examination">General Examination</label>
          <textarea id="examination" className={textAreaClasses} rows="4"
            placeholder="Enter general examination details here..." value={examination}
            onChange={(e) => setExamination(e.target.value)} disabled={!isDoctor}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="systematic">Systemic Examination</label>
          <textarea id="systematic" className={textAreaClasses} rows="4"
            placeholder="Enter systematic examination details here (CVS, RS, GIT, CNS etc)" value={systematic}
            onChange={(e) => setSystematic(e.target.value)} disabled={!isDoctor}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="lexamination">Local Examination</label>
          <textarea id="lexamination" className={textAreaClasses} rows="4"
            placeholder="Enter local examination details here..." value={lexamination}
            onChange={(e) => setLexamination(e.target.value)} disabled={!isDoctor}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="diagnosis">Diagnosis Notes</label>
          <textarea id="diagnosis" className={textAreaClasses} rows="4"
            placeholder="Enter diagnosis notes here..." value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)} disabled={!isDoctor}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="procedureNotes">Procedure Notes</label>
          <textarea id="procedureNotes" className={textAreaClasses} rows="4"
            placeholder="Enter procedure notes here (if any)..." value={procedureNotes}
            onChange={(e) => setProcedureNotes(e.target.value)} disabled={!isDoctor}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor="obsnotes">Observation / Ward Notes</label>
          <textarea id="obsnotes" className={textAreaClasses} rows="4"
            placeholder="Enter observation notes here..." value={obsnotes}
            onChange={(e) => setObsnotes(e.target.value)} disabled={!isDoctor}
          />
        </div>

         {/* Section for Investigation, Advice, Follow-up */}
         <div className="border-t pt-6 space-y-4">
             <div>
                 <label htmlFor="investigationDetails" className={labelClasses}>
                     Investigation
                 </label>
                 <textarea id="investigationDetails" className={textAreaClasses} rows="3"
                     placeholder="Suggest investigations (e.g., CBC, LFT, RFT, FBS, HBA1C)" value={investigationDetails}
                     onChange={(e) => setInvestigationDetails(e.target.value)} disabled={!isDoctor}
                 />
             </div>

             <div>
                 <label htmlFor="adviceDetails" className={labelClasses}>
                     Advice
                 </label>
                 <textarea id="adviceDetails" className={textAreaClasses} rows="3"
                     placeholder="Enter advice (e.g., Diet/exercise/medication adherence...)" value={adviceDetails}
                     onChange={(e) => setAdviceDetails(e.target.value)} disabled={!isDoctor}
                 />
             </div>

             <div>
                 <label htmlFor="followUpDate" className={labelClasses}>
                     Follow Up (Review Date):
                 </label>
                 <input type="date" id="followUpDate" className={inputClasses}
                     value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
                     disabled={!isDoctor} min={new Date().toISOString().split('T')[0]}
                 />
             </div>
         </div>

        {/* --- NEW: Shifting In Ambulance Section --- */}
        {type !== '' && ( // Conditionally render based on `type` if needed, or remove if always shown
          <div className="border-t pt-6 space-y-4">
            <h3 className={sectionHeadingClasses}>Shifting In Ambulance</h3>
            <div>
              <label className={labelClasses}>Is shifting required?</label>
              <div className="flex items-center gap-4 md:gap-6">
                <label className={radioLabelClasses}>
                  <input type="radio" name="shiftingRequired" value="yes" // Use unique name
                    checked={shiftingRequired === 'yes'} onChange={() => setShiftingRequired('yes')}
                    className={radioInputClasses} disabled={!isDoctor}
                  /> Yes
                </label>
                <label className={radioLabelClasses}>
                  <input type="radio" name="shiftingRequired" value="no"
                    checked={shiftingRequired === 'no'} onChange={() => setShiftingRequired('no')}
                    className={radioInputClasses} disabled={!isDoctor}
                  /> No
                </label>
                 <label className={radioLabelClasses}>
                  <input type="radio" name="shiftingRequired" value=""
                    checked={shiftingRequired === null || shiftingRequired === ''} onChange={() => setShiftingRequired(null)}
                    className={radioInputClasses.replace('blue','gray')} disabled={!isDoctor} // Slightly grayed out for N/A
                  /> N/A
                </label>
              </div>
            </div>

            {/* Show shifting details only if 'yes' is selected */}
            {shiftingRequired === 'yes' && (
                <div className="space-y-4 pl-2 border-l-2 border-blue-200 ml-1">
                 <div>
                    <label htmlFor="shiftingNotes" className={labelClasses}>Shifting Notes</label>
                    <textarea id="shiftingNotes" className={textAreaClasses} rows="3"
                        placeholder="Enter reason for shifting, patient condition, etc..." value={shiftingNotes}
                        onChange={(e) => setShiftingNotes(e.target.value)} disabled={!isDoctor} required={shiftingRequired === 'yes'}
                    />
                </div>

                <div>
                    <label htmlFor="ambulanceDetails" className={labelClasses}>Ambulance Details / Consumables Used</label>
                    <textarea id="ambulanceDetails" className={textAreaClasses} rows="3"
                        placeholder="Enter ambulance number, driver, consumables used..." value={ambulanceDetails}
                        onChange={(e) => setAmbulanceDetails(e.target.value)} disabled={!isDoctor} required={shiftingRequired === 'yes'}
                    />
                </div>
                </div>
            )}
          </div>
        )}
        {/* --- END: Shifting In Ambulance Section --- */}

        {/* Referral Section - Kept separate */}
        {type !== '' && ( // Conditionally render based on `type` if needed, or remove if always shown
          <div className="border-t pt-6 space-y-4">
            <h3 className={sectionHeadingClasses}>Referral</h3>
            <div>
              <label className={labelClasses}>Do you need a referral?</label>
              <div className="flex items-center gap-4 md:gap-6">
                <label className={radioLabelClasses}>
                  <input type="radio" name="referral" value="yes" // Keep name="referral"
                    checked={referral === 'yes'} onChange={() => setReferral('yes')}
                    className={radioInputClasses} disabled={!isDoctor}
                  /> Yes
                </label>
                <label className={radioLabelClasses}>
                  <input type="radio" name="referral" value="no"
                    checked={referral === 'no'} onChange={() => setReferral('no')}
                    className={radioInputClasses} disabled={!isDoctor}
                  /> No
                </label>
                 <label className={radioLabelClasses}>
                  <input type="radio" name="referral" value=""
                    checked={referral === null || referral === ''} onChange={() => setReferral(null)}
                    className={radioInputClasses.replace('blue','gray')} disabled={!isDoctor}
                  /> N/A
                </label>
              </div>
            </div>

            {/* Show referral details only if 'yes' is selected */}
            {referral === 'yes' && (
                <div className="space-y-4 pl-2 border-l-2 border-blue-200 ml-1">
                 <div>
                    <label htmlFor="hospitalName" className={labelClasses}>Hospital Name</label>
                    <input id="hospitalName" type="text" className={inputClasses}
                        placeholder="Enter hospital name..." value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)} disabled={!isDoctor} required={referral === 'yes'}
                    />
                </div>

                <div>
                    <label htmlFor="speciality" className={labelClasses}>Speciality</label>
                    <input id="speciality" type="text" className={inputClasses}
                        placeholder="Enter speciality (e.g., Cardiology)..." value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)} disabled={!isDoctor} required={referral === 'yes'}
                    />
                </div>

                <div>
                    <label htmlFor="doctorName" className={labelClasses}>Referred Doctor Name (Optional)</label>
                    <input id="doctorName" type="text" className={inputClasses}
                        placeholder="Enter referred doctor's name if known..." value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)} disabled={!isDoctor}
                    />
                </div>
                </div>
            )}
          </div>
        )}

        {/* --- Special Cases Section (Kept as is) --- */}
        <div className="border-t pt-6 space-y-2">
          <label className={labelClasses}>Special Cases</label>
          <div className="flex items-center gap-4 md:gap-6">
            {["Yes", "No", "N/A"].map((value) => (
              <label key={value} className={radioLabelClasses}>
                <input
                  type="radio"
                  name="specialCases"
                  value={value}
                  checked={specialCases === value}
                  onChange={(e) => setSpecialCases(e.target.value)}
                  className={radioInputClasses}
                  disabled={!isDoctor || isSubmitting}
                />
                {value}
              </label>
            ))}
          </div>
        </div>
        {/* --- End Special Cases Section --- */}

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className={`min-w-[150px] bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ${(!isDoctor || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isDoctor || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Consultation'}
          </button>
        </div>
      </form>
      {/* Significant Notes Component */}
      <div className="border-t pt-6 mt-8"> {/* Added margin-top */}
             <SignificantNotes data={data} type={type} />
        </div>
    </div>
  );
};

export default Consultation;