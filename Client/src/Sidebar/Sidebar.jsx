import React from 'react'
import img from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className="w-1/5 bg-blue-200 h-full text-gray-700 flex flex-col">
        <div className="">
          <img src = {img} className='w-64 mt-16 mb-8 flex ml-10'/>
        </div>
        <div className='bg-white p-2 m-4 rounded-xl'>
            <div className="flex flex-col">
                <Link to= "../dashboard" className="py-2 px-3 hover:bg-blue-300 text-center rounded-md">
                Dashboard
                </Link>
                <Link to='../searchemployee' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Employee Profile
                </Link>
                <Link  to='../newvisit' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                New Visit
                </Link>
                <Link to='../eventsandcamps' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Events & Camps
                </Link>
                <Link to='../recordsfilters'className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Records & Filters
                </Link>
                <Link to='../mockdrills' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Mock Drills
                </Link>
                <Link to = '../appointments' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                Appointments
                </Link>
            </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <button onClick={()=>useNavigate("./login")} className=" py-2 px-8 bg-blue-600 text-white mt-8 font-medium rounded-md">
            Logout
          </button>
        </div>
      </div>
  )
}

export default Sidebar