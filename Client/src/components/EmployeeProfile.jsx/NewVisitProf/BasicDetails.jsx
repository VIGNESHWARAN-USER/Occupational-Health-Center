import React from 'react';

const BasicDetails = ({ data }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Basic Details</h2>
      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Name', value: data.name },
          { label: 'Date of Birth (dd/mm/yyyy)', value: data.dob },
          { label: 'Sex', value: data.sex },
          { label: 'Aadhar No.', value: data.aadhar },
          { label: 'Blood Group', value: data.bloodgrp },
          { label: 'Identification Marks', value: data.identification_marks },
          { label: 'Marital Status', value: data.marital_status },
        ].map((item, index) => (
          <DetailCard key={index} label={item.label} value={item.value} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Employment Details</h2>
      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Employee Number', value: data.emp_no },
          { label: 'Employer', value: data.employer },
          { label: 'Designation', value: data.designation },
          { label: 'Department', value: data.department },
          { label: 'Nature of Job', value: data.job_nature },
          { label: 'Date of Joining', value: data.doj },
          { label: 'Mode of Joining', value: data.moj },
        ].map((item, index) => (
          <DetailCard key={index} label={item.label} value={item.value} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Contact Details</h2>
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Phone (Personal)', value: data.phone_Personal },
          { label: 'Mail Id (Personal)', value: data.mail_id_Personal },
          { label: 'Emergency Contact Person', value: data.emergency_contact_person },
          { label: 'Phone (Office)', value: data.phone_Office },
          { label: 'Mail Id (Office)', value: data.mail_id_Office },
          { label: 'Emergency Contact Relation', value: data.emergency_contact_relation },
          { label: 'Mail Id (Emergency Contact Person)', value: data.mail_id_Emergency_Contact_Person },
          { label: 'Emergency Contact Phone', value: data.emergency_contact_phone },
          { label: 'Address', value: data.address },
        ].map((item, index) => (
          <DetailCard key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

const DetailCard = ({ label, value }) => (
  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-1">{label}</label>
    <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
      {value || 'No data available'}
    </div>
  </div>
);

export default BasicDetails;
