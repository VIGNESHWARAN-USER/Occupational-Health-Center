import React, { useEffect } from 'react'
import img from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
const Sidebar = () => {
  const navigate  = useNavigate()
  const accessLevel = localStorage.getItem('accessLevel')
  console.log(accessLevel)
  if(accessLevel === 'nurse'){
  return (
    <div className="w-1/5 bg-blue-200 h-full text-gray-900 font-medium flex flex-col">
        <div className="">
          <img src = {img} className='w-64 mt-16 mb-8 flex ml-8'/>
        </div>
        <div className='p-2 m-4 rounded-xl'>
            <div className="flex flex-col">
                <Link to= "../dashboard" className="py-2 px-3 hover:bg-blue-300 ms-8 rounded-md">
                Dashboard
                </Link>
                <Link to='../searchemployee' className="py-2  px-3 hover:bg-blue-300 ms-8 mt-2  rounded-md">
                Employee Profile
                </Link>
                <Link  to='../newvisit' className="py-2  px-3 hover:bg-blue-300 ms-8 mt-2  rounded-md">
                New Visit
                </Link>
                <Link to='../eventsandcamps' className="py-2  px-3 hover:bg-blue-300 ms-8 mt-2  rounded-md">
                Events & Camps
                </Link>
                <Link to='../recordsfilters'className="py-2  px-3 hover:bg-blue-300 ms-8 mt-2  rounded-md">
                Records & Filters
                </Link>
                <Link to='../mockdrills' className="py-2  px-3 hover:bg-blue-300 ms-8 mt-2  rounded-md">
                Mock Drills
                </Link>
                <Link to = '../appointments' className="py-2  px-3 hover:bg-blue-300 ms-8 mt-2  rounded-md">
                Appointments
                </Link>
            </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <button onClick={()=>navigate("../login")} className=" py-2 px-8 bg-blue-600 text-white mt-8 font-medium rounded-md">
            Logout
          </button>
        </div>
      </div>
  )}
  else if(accessLevel === 'doctor')
  {
    return (
      <div className="w-1/5 bg-blue-200 h-full text-gray-900 font-medium flex flex-col">
          <div className="">
            <img src = {img} className='w-64 mt-16 mb-8 flex ml-10'/>
          </div>
          <div className='p-2 m-4 rounded-xl'>
              <div className="flex flex-col">
                  <Link to= "../docdashboard" className="py-2 px-3 hover:bg-blue-300 text-center rounded-md">
                  Dashboard
                  </Link>
                  <Link to='../docsearchemployee' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  Employee Profile
                  </Link>
                  <Link  to='../docnewvisit' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  New Visit
                  </Link>
                  <Link to='../doceventsandcamps' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  Events & Camps
                  </Link>
                  <Link to='../docrecordsfilters'className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  Records & Filters
                  </Link>
                  <Link to='../docmockdrills' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  Mock Drills
                  </Link>
                  <Link to = '../docappointments' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  Appointments
                  </Link>
                  <Link to = '../docreviewpeople' className="py-2  px-3 hover:bg-blue-300 text-center mt-2  rounded-md">
                  Review People
                  </Link>
              </div>
          </div>
          <div className="flex items-center justify-center p-4">
            <button onClick={()=>navigate("../login")} className=" py-2 px-8 bg-blue-600 text-white mt-8 font-medium rounded-md">
              Logout
            </button>
          </div>
        </div>
    )
  }
  else{
    return (
        <div className="w-1/5 bg-blue-200 h-full text-gray-900 font-medium flex flex-col">
            <div className="">
              <img src = {img} className='w-64 mt-16 mb-8 flex ml-10'/>
            </div>
            <div className='p-2 m-4 rounded-xl'>
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
              <button onClick={()=>navigate("../login")} className=" py-2 px-8 bg-blue-600 text-white mt-52 font-medium rounded-md">
                Logout
              </button>
            </div>
          </div>
      )
  }
}

export default Sidebar