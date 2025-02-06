import axios from 'axios';
import React, { useState } from 'react';

const BasicDetails = () => {
  const initialData = JSON.parse(localStorage.getItem("selectedEmployee")) || {};
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  

  return (
    <div className="mt-8 p-4">
      <h2 className="text-lg font-medium mb-4">Basic Details</h2>
      <div className="grid grid-cols-3 mb-16 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Name</label>
          <input
            name = "name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter your full name"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Date of Birth (dd/mm/yyyy)</label>
          <input
            name = "dob"
            value={formData.dob}
            onChange={handleChange}
            type="text"
            placeholder="Enter Date of Birth in dd/mm/yyyy"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Sex</label>
          <select
            name="sex"
            value={formData.sex || ""}
            onChange={handleChange}
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Aadhar No.</label>
          <input
            name = "aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            type="text"
            placeholder="Enter 12-digit Aadhar No."
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Blood Group</label>
          <input
            name = "bloodgrp"
            value={formData.bloodgrp}
            onChange={handleChange}
            type="text"
            placeholder="e.g., A+, O-"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Identification Marks</label>
          <input
            name = "identification_marks"
            value={formData.identification_marks}
            onChange={handleChange}
            type="text"
            placeholder="Enter any visible identification marks"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Marital Status</label>
          <select
            name="marital_status"
            value={formData.marital_status || ""}
            onChange={handleChange}
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Single</option>
            <option>Married</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <h2 className="text-lg font-medium my-4">Employment Details</h2>
      <div className="grid grid-cols-3 mb-16 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Employee Number</label>
          <input
            name = "emp_no"
            value={formData.emp_no}
            onChange={handleChange}
            type="text"
            placeholder="Enter employee number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Employer</label>
            <input
              name="employer"
              value={formData.employer || ""}
              onChange={handleChange}
              type="text"
              placeholder="Enter employer name"
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Designation</label>
          <input
            name = "designation"
            value={formData.designation}
            onChange={handleChange}
            type="text"
            placeholder="Enter job designation"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Department</label>
          <input
            name = "department"
            value={formData.department}
            onChange={handleChange}
            type="text"
            placeholder="Enter department"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Nature of Job</label>
          <input
            name = "job_nature"
            value={formData.job_nature}
            onChange={handleChange}
            type="text"
            placeholder="e.g., Height Works, Fire Works"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Date of Joining</label>
          <input
            name = "doj"
            value={formData.doj}
            onChange={handleChange}
            type="text"
            placeholder="Enter Date of Joining"
            defaultValue="2025/01/09"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mode of Joining</label>
          <select
          name="moj"
          value={formData.moj || ""}
          onChange={handleChange}
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>New Joinee</option>
            <option>Transfer</option>
          </select>
        </div>
      </div>


      <h2 className="text-lg font-medium my-4">Contact Details</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Phone (Personal)</label>
          <input
          name = "phone_personal"
            value={formData.phone_Personal}
            onChange={handleChange}
            type="text"
            placeholder="Enter 10-digit phone number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Personal)</label>
          <input
          name = "mail_id_Personal"
            value={formData.mail_id_Personal}
            onChange={handleChange}
            type="text"
            placeholder="Enter the personal mail"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Person</label>
          <input
          name='emergency_contact_person'
            value={formData.emergency_contact_person}
            onChange={handleChange}
            type="text"
            placeholder="Enter 10-digit mobile number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Phone (Office)</label>
          <input
          name='phone_Office'
            value={formData.phone_Office}
            onChange={handleChange}
            type="text"
            placeholder="Enter office mobile number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Office)</label>
          <input
          name = 'mail_id_Office'
            value={formData.mail_id_Office}
            onChange={handleChange}
            type="text"
            placeholder="Enter office mail id"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Relation</label>
          <input
          name='emergency_contact_relation'
            value={formData.emergency_contact_relation}
            onChange={handleChange}
            type="text"
            placeholder="e.g.,Father,Spouse"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Emergency Contact Person)</label>
          <input
          name='mail_id_Emergency_Contact_Person'
            value={formData.mail_id_Emergency_Contact_Person}
            onChange={handleChange}
            type="text"
            placeholder="Enter mail"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Phone</label>
          <input
          name='emergency_contact_phone'
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            type="text"
            placeholder="Enter Emergency Contact number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Address</label>
          <textarea
          name = 'address'
            value={formData.address}
            onChange={handleChange}
            type="text"
            placeholder="Enter full address"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      
    </div>
  );
};

export default BasicDetails;