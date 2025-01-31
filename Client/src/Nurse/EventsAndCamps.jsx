import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

const EventsAndCamps = () => {
  const [campName, setCampName] = useState('');
  const [campDetails, setCampDetails] = useState('');
  const [startDate, setStartDate] = useState('2025-01-07');
  const [endDate, setEndDate] = useState('2025-01-07');
  const [selectedOption, setSelectedOption] = useState('Previous');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ campName, campDetails, startDate, endDate, selectedOption });
  };

  return (
    <div className="h-screen flex">
      <Sidebar/>
      <div className="w-4/5 p-8">
        <h1 className="text-4xl font-bold mb-4">Camps</h1>
        <div className='bg-white p-8 rounded shadow-md'>
        <h2 className="text-2xl mb-6">Add a new camp</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-gray-700">Camp Name</label>
              <input
                type="text"
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-blue-100"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Camp Details</label>
            <textarea
              value={campDetails}
              onChange={(e) => setCampDetails(e.target.value)}
              className="w-full mt-1 p-2 border rounded bg-blue-100 h-32"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-gray-700">Select</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full mt-1 p-2 border rounded bg-blue-100"
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