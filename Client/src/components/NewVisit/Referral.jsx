import React, { useState } from 'react'

const Referral = () => {
  
    const [referral, setReferral] = useState(null);
    const [caseType, setCaseType] = useState(null);
    const [submittedBy, setSubmittedBy] = useState('');
    
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Referral</h2>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium">Do you need a referral?</label>
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
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="hospitalName">Hospital Name</label>
        <input
          id="hospitalName"
          type="text"
          className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          placeholder="Enter hospital name..."
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="doctorName">Doctor Name</label>
        <input
          id="doctorName"
          type="text"
          className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          placeholder="Enter doctor name..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium">Select Case Type</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="caseType"
              value="occupational"
              checked={caseType === 'occupational'}
              onChange={() => setCaseType('occupational')}
              className="form-radio text-blue-500"
            />
            Occupational
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="caseType"
              value="non-occupational"
              checked={caseType === 'non-occupational'}
              onChange={() => setCaseType('non-occupational')}
              className="form-radio text-blue-500"
            />
            Non-Occupational
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="caseType"
              value="domestic"
              checked={caseType === 'domestic'}
              onChange={() => setCaseType('domestic')}
              className="form-radio text-blue-500"
            />
            Domestic
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium">Submitted By</label>
        <select
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
  )
};

export default Referral