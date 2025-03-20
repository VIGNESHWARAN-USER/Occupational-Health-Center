// Consultation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Consultation = ({ data }) => {
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notifiableRemarks, setNotifiableRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referral, setReferral] = useState(null);
  const [caseType, setCaseType] = useState('');
  const [illnessOrInjury, setIllnessOrInjury] = useState('');
  const [submittedByDoctor, setSubmittedByDoctor] = useState('');
  const [submittedByNurse, setSubmittedByNurse] = useState('');
  const [otherCaseDetails, setOtherCaseDetails] = useState('');
  const [investigationDetails, setInvestigationDetails] = useState('');
  const [examination, setExamination] = useState('');
  const [lexamination, setLexamination] = useState('');
  const [obsnotes, setObsnotes] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [speaciality, setSpeciality] = useState('');

  const caseTypeOptions = [
    { value: 'occupationalillness', label: 'Occupational Illness' },
    { value: 'occupationalinjury', label: 'Occupational Injury' },
    { value: 'occ-disease', label: 'Occ Disease' },
    { value: 'non-occupational', label: 'Non-Occupational' },
    { value: 'domestic', label: 'Domestic' },
    { value: 'commutation-injury', label: 'Commutation Injury' },
    { value: 'other', label: 'Other' },
  ];

  const emp_no = data[0]?.emp_no;

  useEffect(() => {
    const setData = async () => {
      try {
        setComplaints(data[0].consultation.complaints || '');
        setDiagnosis(data[0].consultation.diagnosis || '');
        setNotifiableRemarks(data[0].consultation.notifiable_remarks || '');
      } catch (error) {
        console.error('Error:', error);
      }
    };
    setData();
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    const consultationData = {
      emp_no: emp_no,
      complaints: complaints,
      diagnosis: diagnosis,
      notifiable_remarks: notifiableRemarks,
      examination: examination,
      lexamination: lexamination,
      obsnotes: obsnotes,
      case_type: caseType,
      illness_or_injury: illnessOrInjury,
      other_case_details: otherCaseDetails,
      investigation_details: investigationDetails,
      referral: referral,
      hospital_name: hospitalName,
      doctor_name: doctorName,
      submitted_by_doctor: submittedByDoctor,
      submitted_by_nurse: submittedByNurse,
      follow_up_date: followUpDate,
      speaciality: speaciality
    };
    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/consultations/add/", consultationData);
      if (response.status === 200) {
        alert("Consultation data submitted successfully!");
      } else {
        console.error('Error:', response.status);
        alert("Error submitting consultation data. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8">Consultation</h2>

      <form onSubmit={handleSubmit}> {/* Wrap form around content */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="complaints">Complaints</label>
          <textarea
            id="complaints"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter complaints here..."
            value={complaints}
            onChange={(e) => setComplaints(e.target.value)}
          ></textarea>
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
          ></textarea>
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
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="diagnosis">Procedure Notes</label>
          <textarea
            id="diagnosis"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter diagnosis/procedure notes here..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          ></textarea>
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
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="notifiableRemarks">Notable Remarks</label>
          <textarea
            id="notifiableRemarks"
            className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            rows="4"
            placeholder="Enter any notable remarks here..."
            value={notifiableRemarks}
            onChange={(e) => setNotifiableRemarks(e.target.value)}
          ></textarea>
        </div>

        <h2 className="text-3xl font-bold mb-4">Referral</h2>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="caseType" className="block text-gray-700 text-lg font-medium mb-2">
              Case Type
            </label>
            <select
              id="caseType"
              className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
            >
              <option value="">Select Case Type</option>
              {caseTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {caseType === 'other' && (
            <div className="mb-4">
              <label htmlFor="otherDetails" className="block text-gray-700 text-lg font-medium mb-2">
                Other Case Details
              </label>
              <textarea
                id="otherDetails"
                className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter other case details..."
                value={otherCaseDetails}
                onChange={(e) => setOtherCaseDetails(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="investigationDetails" className="block text-gray-700 text-lg font-medium mb-2">
              Investigation
            </label>
            <textarea
              id="investigationDetails"
              className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
              placeholder="Suggest to do FBS/HBAL..."
              value={investigationDetails}
              onChange={(e) => setInvestigationDetails(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="adviceDetails" className="block text-gray-700 text-lg font-medium mb-2">
              Advice
            </label>
            <textarea
              id="adviceDetails"
              className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
              placeholder="Diet/exercise/salt/swep/hydration/BP/Sugar Control/Alcohol Absuse/Fat free/Oil free..."
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
            />
          </div>
        </div>

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
                className="form-radio text-blue-500"
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
                className="form-radio text-blue-500"
              />
              No
            </label>
          </div>
        </div>

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
          />
        </div>

        <div className="mb-6">
          <label htmlFor="doctorName" className="block text-gray-700 text-lg font-medium mb-2">
            Speciality
          </label>
          <input
            id="speciality"
            type="text"
            className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            placeholder="Enter speaciality..."
            value={speaciality}
            onChange={(e) => setSpeciality(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="doctorName" className="block text-gray-700 text-lg font-medium mb-2">
            Doctor Name
          </label>
          <input
            id="doctorName"
            type="text"
            className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
            placeholder="Enter doctor name..."
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>

        <div className='mb-6 flex items-center gap-6'>
          <div className="mb-6 w-full">
            <label htmlFor="submittedByDoctor" className="block text-gray-700 text-lg font-medium mb-2">
              Consulted By (Doctor):
            </label>
            <select
              id="submittedByDoctor"
              className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
              value={submittedByDoctor}
              onChange={(e) => setSubmittedByDoctor(e.target.value)}
            >
              <option value="">Select</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-6 w-full">
            <label htmlFor="submittedByNurse" className="block text-gray-700 text-lg font-medium mb-2">
              Submitted By (Nurse):
            </label>
            <select
              id="submittedByNurse"
              className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
              value={submittedByNurse}
              onChange={(e) => setSubmittedByNurse(e.target.value)}
            >
              <option value="">Select</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="w-1/4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Submitting...' : 'Submit Data'} {/* Show 'Submitting...' when submitting */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Consultation;