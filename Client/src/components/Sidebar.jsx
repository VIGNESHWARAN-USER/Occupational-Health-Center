import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaUsers, FaRegCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdEvent, MdFilterList, MdLibraryAdd } from "react-icons/md";
import img from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const accessLevel = localStorage.getItem("accessLevel");

  // Define menus for different roles
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
      { name: "Dashboard", to: "../docdashboard", icon: <MdDashboard /> },
      { name: "Employee Profile", to: "../docsearchemployee", icon: <FaUsers /> },
      { name: "New Visit", to: "../docnewvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../doceventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../docrecordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../docmockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments", to: "../docappointments", icon: <FaRegCalendarAlt /> },
      { name: "Review People", to: "../docreviewpeople", icon: <FaUsers /> },
    ],
    admin: [
      { name: "Dashboard", to: "../admindashboard", icon: <MdDashboard /> },
      { name: "Add Members", to: "../addmember", icon: <FaUsers /> },
      { name: "Dynamic Dropdown", to: "../dropdown", icon: <MdFilterList /> },
    ],
  };

  // Get current menu based on access level
  const currentMenu = menus[accessLevel] || [];

  return (
    <div className="w-1/5 h-full bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 flex justify-center">
        <img src={img} alt="Logo" className="w-50 shadow-2xl p-4 rounded-lg bg-white" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        {currentMenu.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center space-x-3 p-3 mx-4 my-2 text-lg rounded-lg font-bold transition hover:bg-blue-300 hover:scale-105 hover:text-blue-600"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
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
