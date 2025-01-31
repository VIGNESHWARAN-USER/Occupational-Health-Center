// Basic Details
import React from 'react';

const BasicDetails = () => {
  return (
    <div className="mt-8 p-4">
      <h2 className="text-lg font-medium mb-4">Basic Details</h2>
      <div className="grid grid-cols-3 mb-16 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Date of Birth (dd/mm/yyyy)</label>
          <input
            type="text"
            placeholder="Enter Date of Birth in dd/mm/yyyy"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Sex</label>
          <select
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
            type="text"
            placeholder="Enter 12-digit Aadhar No."
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Blood Group</label>
          <input
            type="text"
            placeholder="e.g., A+, O-"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Identification Marks</label>
          <input
            type="text"
            placeholder="Enter any visible identification marks"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Marital Status</label>
          <select
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
            type="text"
            placeholder="Enter employee number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Employer</label>
          <select
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>JSW steel</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Designation</label>
          <input
            type="text"
            placeholder="Enter job designation"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Department</label>
          <input
            type="text"
            placeholder="Enter department"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Nature of Job</label>
          <input
            type="text"
            placeholder="e.g., Height Works, Fire Works"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Date of Joining</label>
          <input
            type="text"
            placeholder="Enter Date of Joining"
            defaultValue="2025/01/09"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mode of Joining</label>
          <select
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
            type="text"
            placeholder="Enter 10-digit phone number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Personal)</label>
          <input
            type="text"
            placeholder="Enter the personal mail"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Person</label>
          <input
            type="text"
            placeholder="Enter 10-digit mobile number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Phone (Office)</label>
          <input
            type="text"
            placeholder="Enter office mobile number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Office)</label>
          <input
            type="text"
            placeholder="Enter office mail id"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Relation</label>
          <input
            type="text"
            placeholder="e.g.,Father,Spouse"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Emergency Contact Person)</label>
          <input
            type="text"
            placeholder="Enter mail"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Phone</label>
          <input
            type="text"
            placeholder="Enter Emergency Contact number"
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Address</label>
          <textarea
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