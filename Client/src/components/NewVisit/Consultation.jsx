// Cosultation.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileUpload } from 'react-icons/fa';

const Consultation = () => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [referral, setReferral] = useState(null);
  const [caseType, setCaseType] = useState(null);
  const [submittedBy, setSubmittedBy] = useState('');

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    setSelectedFiles((prevFiles) => ({ ...prevFiles, [type]: file }));
  };

  const handleBrowseClick = (type) => {
    document.getElementById(type).click();
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8">Consultation</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="remarks">Remarks</label>
        <textarea
          id="remarks"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your remarks here..."
        ></textarea>
      </div>

      {['SelfDeclaration', 'FCExternal', 'Reports'].map((type) => (
        <motion.div
          key={type}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-white shadow-md hover:shadow-lg transition duration-300"
          onClick={() => handleBrowseClick(type)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFileUpload className="text-4xl text-blue-500 mb-2" />
          <p className="text-gray-700 font-medium">Upload {type.replace(/([A-Z])/g, ' $1')}</p>
          <p className="text-xs text-gray-500">Click or drag file here</p>
          <input
            type="file"
            id={type}
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, type)}
          />
          {selectedFiles[type] && (
            <p className="mt-2 text-sm text-gray-600">{selectedFiles[type].name}</p>
          )}
        </motion.div>
      ))}
      
      <br/>
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
      
      <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Submit</button>
    </div>
  );
};

export default Consultation;