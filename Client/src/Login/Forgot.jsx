import React, { useState } from 'react'
import leftlogin from '../assets/login-left.png'
import jswlogo from '../assets/logo.png'
const Forgot = () => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen">
          <div className="w-2/5 bg-center" style={{ backgroundImage: `url(${leftlogin})` }}>
            <div className="flex items-end justify-center h-full pb-10">
              <img src={jswlogo} alt="JSW Logo" className="w-96" />
            </div>
          </div>
          <div className="w-3/5 flex items-center justify-center bg-blue-50">
            <div className="w-3/4 max-w-md p-8">
              <h2 className="text-4xl font-bold text-center mb-4">Login</h2>
              <p className="text-center text-gray-600 mb-6">Welcome to JSW OHC</p>
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
    
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 mt-6 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
  )
}

export default Forgot