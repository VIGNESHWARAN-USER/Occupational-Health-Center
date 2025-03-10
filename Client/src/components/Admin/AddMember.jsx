import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AddMember() {

  const accessLevel = localStorage.getItem('accessLevel')
  const navigate = useNavigate();
  if(accessLevel === "admin")
  {
  const [formData, setFormData] = useState({
    employee_number: "",
    name: "",
    designation: "Admin",
    email: "",
    role: "HR",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://occupational-health-center.onrender.com/members/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Member added successfully!");
        setFormData({
          employee_number: "",
          name: "",
          designation: "Admin",
          email: "",
          role: "HR",
          date_exited: "2025-01-07",
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  return (
    <div className="flex h-screen bg-[#8fcadd]">
      <Sidebar />
      <div className="m-8 w-4/5">
        <h1 className="text-3xl font-bold text-black mb-6">Add Member</h1>
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Employee Number</label>
                <input
                  type="text"
                  name="employee_number"
                  value={formData.employee_number}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Mail ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>HR</option>
                  <option>IT</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>

           
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200"
              >
                Add Member
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
else{
  return  <section class="bg-white h-full flex items-center dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
          <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
          <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
          <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
          <button onClick={()=>navigate(-1)} class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
      </div>   
  </div>
</section>
}
}

export default AddMember;
