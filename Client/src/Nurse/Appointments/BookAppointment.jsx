import React, { useState } from "react";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    role: "Employee",
    name: "",
    employeeId: "",
    organization: "",
    aadharNo: "",
    contractorName: "",
    purpose: "",
    date: "2025-01-07",
    appointmentDate: "2025-01-07",
    time: "10:05",
    bookedBy: "A",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/bookAppointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.message || "Appointment booked successfully!");
  };

  return (
    <div className="p-14 rounded-lg bg-white">
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
        {[
          { label: "Select the role:", name: "role", type: "select", options: ["Employee"] },
          { label: "Name:", name: "name", type: "text", placeholder: "Enter name" },
          { label: "Enter employee ID:", name: "employeeId", type: "text", placeholder: "Enter employee ID" },
          { label: "Name of Institute / Organization:", name: "organization", type: "text", placeholder: "Enter name of organization" },
          { label: "Aadhar No:", name: "aadharNo", type: "text", placeholder: "Enter Aadhar No" },
          { label: "Name of Contractor:", name: "contractorName", type: "text", placeholder: "Enter contractor name" },
          { label: "Enter the purpose:", name: "purpose", type: "text", placeholder: "Enter purpose" },
          { label: "Date:", name: "date", type: "date" },
          { label: "Enter the date of the appointment:", name: "appointmentDate", type: "date" },
          { label: "Time:", name: "time", type: "time" },
          { label: "Booked by Nurse:", name: "bookedBy", type: "select", options: ["A"] },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[field.name]}
                onChange={handleChange}
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={field.placeholder || ""}
                value={formData[field.name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="submit"
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