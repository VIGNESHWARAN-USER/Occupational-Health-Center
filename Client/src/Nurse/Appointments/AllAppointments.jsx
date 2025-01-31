import React from 'react'
import { FaSearch } from "react-icons/fa";
const AllAppointments = () => {
  return (
    <div className='bg-white rounded-lg h-screen overflow-auto p-8'>
    <div className='justify-between rounded-lg flex'>
      <div>
          <div>
            <label>From</label>
            <input type="date" className="px-4 bg-blue-100 py-2 ms-4 mb-8 w-64 border rounded-md shadow-sm"/>
            <button className="px-4 py-2 rounded-lg bg-blue-500 mx-4 w-44 text-white">Apply</button>
          </div>
          <div>
            <label>To</label>
            <input type="date" className="px-4 py-2 bg-blue-100 ms-10 border w-64 rounded-md shadow-sm"/>
          </div>
          
      </div>
      <div className='flex flex-col'>
        <select className='w-96 px-4 py-2 bg-blue-100 mb-4 rounded-lg'>
          <option disabled>Select Option</option>
          <option>Pre Employeement</option>
        </select>
        <FaSearch className='relative top-6 w-10'/>
        <input className='w-96 px-4 py-2 bg-blue-100 rounded-lg' placeholder='     Search Patients by ID' type='text'>
        </input>
      </div>
    </div>
    <div className='flex justify-evenly mt-14 bg-blue-100 rounded-lg p-2'>
      <div>
        <p className='text-blue-500 font-bold'>ID</p>
      </div>
      <div>
        <p className='text-blue-500 font-bold'>Name</p>
      </div>
      <div>
       <p className='text-blue-500 font-bold'>Role</p>
      </div>
      <div>
        <p className='text-blue-500 font-bold'>Appoint Date</p>
      </div>
      <div>
        <p className='text-blue-500 font-bold'>Action</p>
      </div>
  </div>
  </div>
  )
}

export default AllAppointments