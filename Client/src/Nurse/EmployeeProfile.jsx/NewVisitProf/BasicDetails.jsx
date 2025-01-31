import React from 'react';

const BasicDetails = ({ data }) => {
  return (
    <div className="mt-8 p-4">
      <h2 className="text-lg font-medium mb-4">Basic Details</h2>
      <div className="grid grid-cols-3 mb-16 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.name || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth (dd/mm/yyyy)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.dob || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sex</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.sex || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Aadhar No.</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.aadhar || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.bloodgrp || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Identification Marks</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.identification_marks || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.marital_status || 'No data available'}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-medium my-4">Employment Details</h2>
      <div className="grid grid-cols-3 mb-16 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Number</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.emp_no || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.employer || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Designation</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.designation || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.department || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nature of Job</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.job_nature || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.doj || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mode of Joining</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.moj || 'No data available'}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-medium my-4">Contact Details</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (Personal)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.phone_Personal || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mail Id (Personal)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.mail_id_Personal || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact Person</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.emergency_contact_person || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (Office)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.phone_Office || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mail Id (Office)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.mail_id_Office || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact Relation</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.emergency_contact_relation || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mail Id (Emergency Contact Person)</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.mail_id_Emergency_Contact_Person || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.emergency_contact_phone || 'No data available'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm min-h-[44px] flex items-center">
            {data.address || 'No data available'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
