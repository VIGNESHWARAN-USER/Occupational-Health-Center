import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserMd, FaUsers, FaRegCalendarAlt, FaSignOutAlt, FaPills } from "react-icons/fa";
import { MdDashboard, MdDelete, MdEvent, MdFilterList, MdInventory, MdLibraryAdd, MdReceipt, MdWarning } from "react-icons/md";
import img from "../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessLevel = localStorage.getItem("accessLevel");

  const menus = {
    nurse: [
      { name: "Dashboard", to: "../dashboard", icon: <MdDashboard /> },
      { name: "Worker Profile", to: "../searchemployee", icon: <FaUsers /> },
      { name: "New Visit", to: "../newvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../eventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../recordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../mockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments and Reviews", to: "../appointments", icon: <FaRegCalendarAlt /> },
      { name: "Instrument Calibration", to: "../instrumentcalibration", icon: <FaRegCalendarAlt /> },
    ],
    doctor: [
      { name: "Dashboard", to: "../dashboard", icon: <MdDashboard /> },
      { name: "Worker Profile", to: "../searchemployee", icon: <FaUsers /> },
      { name: "New Visit", to: "../newvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../eventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../recordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../mockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments and Reviews", to: "../appointments", icon: <FaRegCalendarAlt /> },
      { name: "Instrument Calibration", to: "../instrumentcalibration", icon: <FaRegCalendarAlt /> },
    ],
    admin: [
      { name: "Dashboard", to: "../admindashboard", icon: <MdDashboard /> },
      { name: "Add Members", to: "../addmember", icon: <FaUsers /> },
    ],
    pharmacy: [
      { name: "View / Issue Prescription", to: "../viewprescription", icon: <FaPills /> },
      { name: "Add Stock", to: "../addstock", icon: <MdInventory /> },
      { name: "Current Stock", to: "../currentstock", icon: <MdDashboard /> },
      { name: "Current Expiry", to: "../currentexpiry", icon: <MdWarning /> },
      { name: "Expiry Register", to: "../expiryregister", icon: <MdWarning /> },
      { name: "Discard/Damaged", to: "../discarddamaged", icon: <MdDelete /> },
      { name: "Ward Consumable", to: "../wardconsumable", icon: <MdInventory /> },
    ],
  };

  const currentMenu = menus[accessLevel] || [];

  return (
    // --- Apply scrollbar hiding classes here ---
    <div className="w-1/5 h-full overflow-y-auto bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Firefox scrollbar hidden */}
      {/* Webkit (Chrome, Safari, Edge) scrollbar hidden */}

      {/* Logo */}
      <div className="p-6 flex justify-center flex-shrink-0"> {/* Prevent logo from shrinking */}
        <img src={img} alt="Logo" className="w-auto max-w-[80%] h-auto shadow-2xl p-4 rounded-lg bg-white" /> {/* Adjust size as needed */}
      </div>

      {/* Menu Items */}
      {/* Make sure the nav itself can grow if needed, but the parent div scrolls */}
      <nav className="flex-1 px-4 py-2"> {/* Added some padding */}
        {currentMenu.map((item, index) => {
          // Use location.pathname for exact match or includes for partial match
           const isActive = location.pathname === item.to || (item.to !== '../dashboard' && item.to !== '../admindashboard' && location.pathname.startsWith(item.to.replace("..", "")));
           // Example refinement: Check if current path starts with the link's path, avoiding root dashboard match for subpages
           // const isActive = location.pathname.startsWith(item.to.replace("..", ""));

          return (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center space-x-3 p-3 mx-0 my-1 text-base rounded-lg font-medium transition duration-200 ease-in-out transform ${ // Adjusted size/margin/font
                isActive
                  ? "bg-white text-blue-600 scale-100 shadow-md font-semibold" // Adjusted active style
                  : "hover:bg-blue-500 hover:text-white hover:scale-105" // Adjusted hover style
              }`}
            >
              <span className="flex-shrink-0 w-5 h-5">{item.icon}</span> {/* Ensure icon size is consistent */}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
        <p className="flex justify-center font-bold tracking-wider text-lg">Login as : {accessLevel.toUpperCase()}</p>
      {/* Logout Button */}
      <div className="p-4 mt-auto flex-shrink-0"> {/* Ensure logout stays at bottom */}
        <button
          onClick={() => {
              localStorage.clear(); // Clear local storage on logout
              navigate("../login");
            }
          }
          className="w-full flex items-center justify-center space-x-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 ease-in-out"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;