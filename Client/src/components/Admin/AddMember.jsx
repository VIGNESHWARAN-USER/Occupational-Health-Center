//AddMembe
import React from "react";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";

function AddMember() {
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
          <form className="space-y-6">
            {/* First Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter employee number</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Name</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter designation</label>
                <select className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Mail ID</label>
                <input
                  type="email"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Role</label>
                <select className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Choose an option</option>
                  <option>HR</option>
                  <option>IT</option>
                  <option>Finance</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter the Date Joined</label>
                <input
                  type="date"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="2025-01-07"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div>
              <label className="block text-black mb-1">Enter the Date Exited</label>
              <input
                type="date"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="2025-01-07"
              />
            </div>
            <div>
              <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200">
                Add Member
              </button>
            </div>
          </form>
        </motion.div>
        </div>

        {/* </motion.div> */}
    </div>
  );
}

export default AddMember;