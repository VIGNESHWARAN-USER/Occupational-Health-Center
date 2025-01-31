import React from 'react';

const BookAppointment = () => {
  return (
    <div className="p-14 rounded-lg bg-white">
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Select the role:", type: "select", options: ["Employee"] },
          { label: "Name:", type: "text", placeholder: "Enter name" },
          { label: "Enter employee ID:", type: "text", placeholder: "Enter employee ID" },
          { label: "Name of Institute / Organization:", type: "text", placeholder: "Enter name of organization" },
          { label: "Aadhar No:", type: "text", placeholder: "Enter Aadhar No" },
          { label: "Name of Contractor:", type: "text", placeholder: "Enter contractor name" },
          { label: "Enter the purpose:", type: "text", placeholder: "Enter purpose" },
          { label: "Date:", type: "date", defaultValue: "2025-01-07" },
          { label: "Enter the date of the appointment:", type: "date", defaultValue: "2025-01-07" },
          { label: "Time:", type: "time", defaultValue: "10:05" },
          { label: "Booked by Nurse:", type: "select", options: ["A"] },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">{field.label}</label>
            {field.type === "select" ? (
              <select className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {field.options.map((option, idx) => (
                  <option key={idx}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder || ""}
                defaultValue={field.defaultValue || ""}
              />
            )}
          </div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book the appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
