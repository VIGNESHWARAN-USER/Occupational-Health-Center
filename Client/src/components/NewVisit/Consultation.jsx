// Consultation.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileUpload } from 'react-icons/fa';
import axios from 'axios';

const Consultation = ({data}) => {
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notifiableRemarks, setNotifiableRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const emp_no = data[0].emp_no;
  useEffect(()=>{
    const setData = async () => {
      try {
        setComplaints(data[0].consultation.complaints);
        setDiagnosis(data[0].consultation.diagnosis);
        setNotifiableRemarks(data[0].consultation.notifiable_remarks);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setData();
  },[])
  const handleSubmit = async () => {
    setIsSubmitting(true); // Disable the button and indicate submission

    try {
      console.log(emp_no);
      const response = await axios.post("http://localhost:8000/consultations/add/", {
          emp_no: emp_no,
          complaints: complaints,
          diagnosis: diagnosis,
          notifiable_remarks: notifiableRemarks,
        });
        console.log(response);
      if (response.status === 200) {
        const data = await response.data;
        alert("Consultation data submitted successfully!");
        // console.log('Success:', data);

      } else {
        console.error('Error:', response.status);
        //Handle error here
      }
    } catch (error) {
      console.error('Error:', error);
      //Handle error here
    } finally {
      setIsSubmitting(false); // Re-enable button after submission (success or error)
    }
  };


  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8">Consultation</h2>

     
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="complaints">Complaints</label>
        <textarea
          id="complaints"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your comments here..."
          value={complaints}
          onChange={(e) => setComplaints(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="diagnosis">Diagnosis</label>
        <textarea
          id="diagnosis"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your comments here..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-lg font-medium" htmlFor="notifiableRemarks">Notifiable Remarks</label>
        <textarea
          id="notifiableRemarks"
          className="w-full p-4 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-300"
          rows="4"
          placeholder="Enter your poor/Irregular comments  here..."
          value={notifiableRemarks}
          onChange={(e) => setNotifiableRemarks(e.target.value)}
        ></textarea>
      </div>

      <div className="flex justify-end"> {/* Container for right-alignment */}
        <button
          className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition text-sm ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : '' // Disable during submission
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting} //Disable when isSubmitting is true
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Consultation;