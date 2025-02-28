import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserMd, FaUsers, FaRegCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdEvent, MdFilterList, MdLibraryAdd } from "react-icons/md";
import img from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessLevel = localStorage.getItem("accessLevel");

  const menus = {
    nurse: [
      { name: "Dashboard", to: "../dashboard", icon: <MdDashboard /> },
      { name: "Employee Profile", to: "../searchemployee", icon: <FaUsers /> },
      { name: "New Visit", to: "../newvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../eventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../recordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../mockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments", to: "../appointments", icon: <FaRegCalendarAlt /> },
    ],
    doctor: [
      { name: "Dashboard", to: "../dashboard", icon: <MdDashboard /> },
      { name: "Employee Profile", to: "../searchemployee", icon: <FaUsers /> },
      { name: "New Visit", to: "../newvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../eventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../recordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../mockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments", to: "../appointments", icon: <FaRegCalendarAlt /> },
      { name: "Review People", to: "../reviewpeople", icon: <FaUsers /> },
    ],
    admin: [
      { name: "Dashboard", to: "../admindashboard", icon: <MdDashboard /> },
      { name: "Add Members", to: "../addmember", icon: <FaUsers /> },
      { name: "Dynamic Dropdown", to: "../dropdown", icon: <MdFilterList /> },
    ],
  };

  const currentMenu = menus[accessLevel] || [];

  return (
    <div className="w-1/5 h-full bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 flex justify-center">
        <img src={img} alt="Logo" className="w-50 shadow-2xl p-4 rounded-lg bg-white" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        {currentMenu.map((item, index) => {
          const isActive = location.pathname.includes(item.to.replace("..", ""));
          return (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center space-x-3 p-3 mx-4 my-2 text-lg rounded-lg font-bold transition ${
                isActive ? "bg-white text-blue-600 scale-105 shadow-md" : "hover:bg-blue-300 hover:scale-105 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={() => navigate("../login")}
          className="w-full flex items-center justify-center space-x-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;