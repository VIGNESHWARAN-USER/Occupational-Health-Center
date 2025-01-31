import React from 'react';
import Sidebar from '../../Sidebar/DocSideBar';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Search = () => {
  return (
    <div className='h-screen flex'>
        <Sidebar />
        <div className='p-8 w-4/5'>
            <h1 className='text-2xl font-bold'>Search By Employee ID</h1>
            <div className='bg-white h-5/6 mt-6 p-8 rounded-lg'>
                <div className='w-full flex items-center space-x-4'>
                    <div className='relative flex-grow'>
                        <FaSearch className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-700' />
                        <input 
                          type="text" 
                          placeholder='Search By Employee ID' 
                          className='w-full bg-blue-100 py-4 pl-10 pr-4 rounded-lg'
                        />
                    </div>
                    <button 
                      className='bg-blue-500 text-white py-4 px-6 rounded-lg font-medium flex-shrink-0 w-1/4'>
                      Search
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Search;
