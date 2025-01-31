import React from 'react'
import img from '../assets/logo.png'
import { Link } from 'react-router-dom'
const AdminSidebar = () => {
  return (
    <div className="w-1/5 bg-blue-200 h-full text-gray-700 flex flex-col">
        <div className="">
          <img src = {img} className='w-64 mt-16 mb-8 flex ml-10'/>
        </div>
        <div className='bg-white p-2 m-4 rounded-xl'>
            <div className="flex flex-col">
                <Link to= "../admindashboard" className="py-2 px-3 hover:bg-blue-300 text-center rounded-md">
                Dashboard
                </Link>
                <Link to="../addmember" className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Add Members
                </Link>
                <Link to="../dropdown" className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Dynamic Dropdown
                </Link>
                
            </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <button className=" py-2 px-8 bg-blue-600 text-white mt-52 font-medium rounded-md">
            Logout
          </button>
        </div>
      </div>
  )
}

export default AdminSidebar