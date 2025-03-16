import React, { useState } from 'react';

const Referral = () => {
    const [referral, setReferral] = useState(null);
    const [caseType, setCaseType] = useState(''); // string for value of selected option
    const [illnessOrInjury, setIllnessOrInjury] = useState(''); // string for radio input value
    const [submittedBy, setSubmittedBy] = useState('');
    const [otherCaseDetails, setOtherCaseDetails] = useState(''); // State for "Others" textarea content
    const [investigationDetails, setInvestigationDetails] = useState('');//State for Investigation

    // Options for the Case Type dropdown
    const caseTypeOptions = [
        { value: 'occupationalillness', label: 'occupational illness' },
        { value: 'occupationalinjury', label: 'occupational injury' },
        { value: 'occ-disease', label: 'Occ Disease' },
        { value: 'non-occupational', label: 'Non-Occupational' },
        { value: 'domestic', label: 'Domestic' },
        { value: 'commutation-injury', label: 'Commutation Injury' },
        { value: 'other', label: 'Other' }, // "Other" as a dropdown option
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Referral</h2>

            <div className="mb-6">
                {/* Case Type Selection */}
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

                {/* Illness/Injury Selection (Conditional Rendering) */}
                

                {/* Others - TextArea (Conditional Rendering) */}
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
                {/* Investigation - Textarea */}
                 <div className="mb-4">
                   <label htmlFor="investigationDetails" className="block text-gray-700 text-lg font-medium mb-2">
                      Investigation
                   </label>
                    <textarea
                      id="investigationDetails"
                      className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                      placeholder="Suggest to do FBS/HBAL"
                      value={investigationDetails}
                      onChange={(e) => setInvestigationDetails(e.target.value)}
                    />
                  </div>
                 <div className="mb-4">
                   <label htmlFor="investigationDetails" className="block text-gray-700 text-lg font-medium mb-2">
                      Advice
                   </label>
                    <textarea
                      id="investigationDetails"
                      className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                      placeholder="Diet/exercise/salt/swep/hydration/BP/Sugar Control/Alcohol Absuse/Fat free/Oil free"
                      value={investigationDetails}
                      onChange={(e) => setInvestigationDetails(e.target.value)}
                    />
                  </div>
                 <div className="mb-4">
                   <label htmlFor="investigationDetails" className="block text-gray-700 text-lg font-medium mb-2">
                      Follow Up(Review Date):
                   </label>
                    <input className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300" type="date" />
                  </div>
            </div>

            {/* Referral Yes/No */}
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
                />
            </div>

            <div className='mb-6 flex items-center gap-6'>
            <div className="mb-6 w-full">
                <label htmlFor="submittedBy" className="block text-gray-700 text-lg font-medium mb-2">
                    Consulted By (Doctor):
                </label>
                <select
                    id="submittedBy"
                    className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="mb-6 w-full">
                <label htmlFor="submittedBy" className="block text-gray-700 text-lg font-medium mb-2">
                    Submitted By (Doctor):
                </label>
                <select
                    id="submittedBy"
                    className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            </div>
            <div className="mt-6 flex justify-end md:mt-0">
              <button
                  type="submit"
                  className="w-1/4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
                    Submit data
              </button>
          </div>
      
        </div>
    );
};

export default Referral;