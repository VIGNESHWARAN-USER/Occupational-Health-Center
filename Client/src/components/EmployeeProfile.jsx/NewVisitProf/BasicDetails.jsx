import React, { useMemo } from 'react';

const BasicDetails = ({  data }) => {

    const age = useMemo(() => {
    if (!data?.dob) return 'N/A';

      const birthDateParts = data.dob.split('-');

    if (birthDateParts.length !== 3) {
      return 'Invalid Date Format'; // Handle cases where the date format is incorrect
    }

    const [year, month, day] = birthDateParts.map(Number);

    // Check for valid date components.
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return 'Invalid Date'; // Handle cases where date components are not numbers
    }

    const birthDate = new Date(year, month - 1, day); // month is 0-indexed
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return 'Invalid Date';  //Date constructor fails to parse
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }, [data?.dob]);

  return (
    <div className="mt-8 p-4">
      <h2 className="text-lg font-medium mb-4">Basic Details</h2>
      <div className="grid grid-cols-3 mb-16 gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 ">Name</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.name || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Date of Birth</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.dob || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Age</label>
          <div className="px-4 py-2 w-full bg-gray-200 border border-gray-300 rounded-md shadow-sm">
            {age || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Sex</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.sex || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Aadhar No.</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.aadhar || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Blood Group</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.bloodgrp || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Identification Marks 1</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.identification_marks1 || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Identification Marks 2</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.identification_marks2 || 'N/A'}
          </div>
        </div>

        {data?.role === "Visitor" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 ">Other site ID</label>
            <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
              {data?.other_site_id || 'N/A'}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 ">Marital Status</label>
            <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
              {data?.marital_status || 'N/A'}
            </div>
          </div>
        )}
      </div>

      {data?.role === "Visitor" && (
        <>
          <h2 className="text-lg font-medium my-4">Visit Details</h2>
          <div className="grid grid-cols-3 mb-16 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Name of Organization</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.organization || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address of Organization</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.addressOrganization || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Visiting Department</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.visiting_department || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Visiting Date From</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.visiting_date_from || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Stay in Guest House</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.stay_in_guest_house || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Visiting Purpose</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.visiting_purpose || 'N/A'}
              </div>
            </div>
          </div>
        </>
      )}

      {(data?.role === "Contractor" || data?.role === "Employee") && (
        <>
          <h2 className="text-lg font-medium my-4">Employment Details</h2>
          <div className="grid grid-cols-3 mb-16 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Employee Number</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.emp_no || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {data?.role === "Contractor" ? "Contract Employer" : "Employer"}
              </label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.employer || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Designation</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.designation || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Department</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.department || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Nature of Job</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.job_nature || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Date of Joining</label>
              <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                {data?.doj || 'N/A'}
              </div>
            </div>
            {data?.role !== "Contractor" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Mode of Joining</label>
                <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
                  {data?.moj || 'N/A'}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <h2 className="text-lg font-medium my-4">Contact Details</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Phone (Personal)</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.phone_Personal || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Personal)</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.mail_id_Personal || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Person</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.emergency_contact_person || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Phone (Office)</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.phone_Office || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Office)</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.mail_id_Office || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Relation</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.emergency_contact_relation || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Mail Id (Emergency Contact Person)</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.mail_id_Emergency_Contact_Person || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Phone</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.emergency_contact_phone || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Area</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.area || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">State</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.state || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Nationality</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.nationality || 'N/A'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Address</label>
          <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {data?.address || 'N/A'}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BasicDetails;