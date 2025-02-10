import React from "react";
import Sidebar from "../Sidebar";

function AddMember() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="m-8 w-4/5">
        <h1 className="text-3xl font-bold text-black mb-6">Add Member</h1>
        <div className="bg-white p-8 rounded-lg">
          <form className="space-y-6">
            {/* First Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter employee number</label>
                <input
                  type="text"
                  className="w-full p-2 border border-blue-300 rounded-lg bg-blue-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-blue-300 rounded-lg bg-blue-100"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter designation</label>
                <select className="w-full p-2 border border-blue-300 rounded-lg bg-blue-100">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Mail ID</label>
                <input
                  type="email"
                  className="w-full p-2 border border-blue-300 rounded-lg bg-blue-100"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Enter Role</label>
                <select className="w-full p-2 border border-blue-300 rounded-lg bg-blue-100">
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
                  className="w-full p-2 border border-blue-300 rounded-lg bg-blue-100"
                  defaultValue="2025-01-07"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div>
              <label className="block text-black mb-1">Enter the Date Exited</label>
              <input
                type="date"
                className="w-full p-2 border mb-14 border-blue-300 rounded-lg bg-blue-100"
                defaultValue="2025-01-07"
              />
            </div>
            <div>
              <button className="bg-blue-700 text-white px-4 py-2 absolute -mt-8 right-20 rounded-lg">
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
