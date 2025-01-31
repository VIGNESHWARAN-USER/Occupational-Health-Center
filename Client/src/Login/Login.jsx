import React, { useState } from "react";
import leftlogin from '../assets/login-left.png';
import jswlogo from '../assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const login = async(e) => {
    e.preventDefault();
    if (name.length === 0) setErr("Enter username");
    else if (pass.length === 0) setErr("Enter password");
    else{
      try{
          const response =await axios.post("http://localhost:8000/login",{name:name});
          console.log(response.data);
          if(response.data.password === pass)
          {
            if(response.data.accessLevel === 'admin')
              navigate("../addmember")
            else if(response.data.accessLevel === 'doctor')
              navigate("../docdashboard")
            else if(response.data.accessLevel === 'nurse')
              navigate("../dashboard")
          }else
          setErr("Password incorrect")
      }catch(error)
      {
        setErr("Invaild details");
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      <div
        className="md:w-2/5 w-full h-1/3 md:h-full bg-center bg-cover"
        style={{ backgroundImage: `url(${leftlogin})` }}
      >
        <div className="flex items-end justify-center h-full pb-5 md:pb-10">
          <img src={jswlogo} alt="JSW Logo" className="w-40 md:w-96" />
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-3/5 w-full h-full flex items-center justify-center bg-blue-50">
        <div className="w-full sm:w-4/5 md:w-3/4 max-w-md p-6 md:p-8">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Login</h2>
          <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
            Welcome to JSW OHC
          </p>
          <form onSubmit={login}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-2 text-sm md:text-base">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2 text-sm md:text-base">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => setPass(e.target.value)}
                  value={pass}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <Link to="../forgot-password" className="text-blue-900 text-sm md:text-base">
                Forgot Password?
              </Link>
            </div>
            <p className="text-red-600 font-medium text-sm md:text-base mb-4">{err}</p>
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
