import React, { useState } from "react";
import Sidebar from "./Sidebar";

const EventsAndCamps = () => {
  const [formDatas, setformDatas] = useState({
    camp_name: "",
    start_date: "",
    end_date: "",
    camp_details: "",
    select_option: "", // Default value for dropdown
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/add-camp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDatas),
    });

    console.log(response);
    console.log(formDatas);

    if (response.ok) {
      alert("Event & Camp data saved successfully");

      // Resetting the form
      setformDatas({
        camp_name: "",
        start_date: "",
        end_date: "",
        camp_details: "",
        select_option: "",
      });
    } else {
      alert("Error saving data");
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="w-4/5 p-8">
        <h1 className="text-4xl font-bold mb-4">Camps</h1>
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl mb-6">Add a new camp</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-gray-700">Camp Name</label>
                <input
                  type="text"
                  name="camp_name"
                  value={formDatas.camp_name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded bg-blue-100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formDatas.start_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded bg-blue-100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formDatas.end_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded bg-blue-100"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Camp Details</label>
              <textarea
                name="camp_details"
                value={formDatas.camp_details}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded bg-blue-100 h-32"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-gray-700">Select</label>
                <select
                  name="select_option"
                  value={formDatas.select_option}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded bg-blue-100"
                  required
                >
                  <option value="Previous">Previous</option>
                  <option value="Live">Live</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <div className="mt-6 md:mt-0">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventsAndCamps;