// Cosultation.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileUpload } from 'react-icons/fa';

const Consultation = () => {
  
  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8">Consultation</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="remarks">Complaints</label>
        <textarea
          id="remarks"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your comments here..."
        ></textarea>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="remarks">Diagnosis</label>
        <textarea
          id="remarks"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your comments here..."
        ></textarea>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="remarks">Notifiable Remarks</label>
        <textarea
          id="remarks"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your poor/Irregular comments  here..."
        ></textarea>
      </div>
      
      <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Submit</button> 
    </div>
  );
};

export default Consultation;