import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUserMd,
  FaUsers,
  FaRegCalendarAlt,
  FaSignOutAlt,
  FaPills,
  FaBars, // Added for hamburger icon
  FaTimes,
  FaAmbulance,
  FaUpload, // Added for close icon
} from "react-icons/fa";
import {
  MdDashboard,
  MdEvent,
  MdFilterList,
  MdLibraryAdd,
  MdInventory,
  MdWarning,
  MdDelete,
  MdReceipt,
} from "react-icons/md";
import axios from "axios";
import img from "../assets/logo.png"; // Make sure this path is correct

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessLevel = localStorage.getItem("accessLevel") || "unknown"; // Provide default
  const [pendingCount, setPendingCount] = useState(null); // Assuming you might want these back
  const [expiryCount, setExpiryCount] = useState(null); // Assuming you might want these back
  const [isOpen, setIsOpen] = useState(false); // State for mobile sidebar visibility

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // --- Fetch counts logic (Optional: Keep if you still need badges) ---
  useEffect(() => {
    // Example: Only fetch if user needs badges
    if (accessLevel === 'nurse' || accessLevel === 'doctor' || accessLevel === 'pharmacy') {
       fetchPendingCount();
       fetchExpiryCount();
    }
  }, [accessLevel]); // Re-fetch if accessLevel changes (though unlikely mid-session)

  const fetchPendingCount = async () => {
    // Only fetch if relevant for the current user type or specific routes
    if (accessLevel === 'nurse' || accessLevel === 'doctor') {
        try {
        const response = await axios.get("https://occupational-health-center-1.onrender.com/get_red_status_count/");
        setPendingCount(response.data.red_count);
        } catch (error) {
        console.error("Error fetching red count:", error);
        setPendingCount(0); // Default to 0 on error
        }
    } else {
        setPendingCount(0); // Not applicable
    }
  };

  const fetchExpiryCount = async () => {
     // Only fetch if relevant for the current user type or specific routes
     if (accessLevel === 'pharmacy') {
        try {
            const response = await axios.get(
                "https://occupational-health-center-1.onrender.com/get_current_expiry_count/"
            );
            setExpiryCount(response.data.count);
        } catch (error) {
            console.error("Error fetching expiry count:", error);
            setExpiryCount(0); // Default to 0 on error
        }
     } else {
         setExpiryCount(0); // Not applicable
     }
  };
  // --- End Fetch counts logic ---

  const menus = {
    nurse: [
      { name: "Dashboard", to: "../dashboard", icon: <MdDashboard /> },
      { name: "Worker Profile", to: "../searchemployee", icon: <FaUsers /> }, // Changed name
      { name: "New Visit", to: "../newvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../eventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../recordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../mockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments and Reviews", to: "../appointments", icon: <FaRegCalendarAlt /> },
      { name: "Data Upload", to: "../dataupload", icon: <FaUpload /> },
      { name: "Instrument Calibration", to: "../instrumentcalibration", icon: <FaRegCalendarAlt />, badgeName: 'pending' }, // Added badge identifier
    ],
    doctor: [
      // Assuming same changes for doctor as nurse based on the provided code
      { name: "Dashboard", to: "../dashboard", icon: <MdDashboard /> },
      { name: "Worker Profile", to: "../searchemployee", icon: <FaUsers /> }, // Changed name
      { name: "New Visit", to: "../newvisit", icon: <FaUserMd /> },
      { name: "Events & Camps", to: "../eventsandcamps", icon: <MdEvent /> },
      { name: "Records & Filters", to: "../recordsfilters", icon: <MdFilterList /> },
      { name: "Mock Drills", to: "../mockdrills", icon: <MdLibraryAdd /> },
      { name: "Appointments and Reviews", to: "../appointments", icon: <FaRegCalendarAlt /> },
      { name: "Instrument Calibration", to: "../instrumentcalibration", icon: <FaRegCalendarAlt />, badgeName: 'pending' }, // Added badge identifier
    ],
    admin: [
      { name: "Dashboard", to: "../admindashboard", icon: <MdDashboard /> },
      { name: "Add Members", to: "../addmember", icon: <FaUsers /> },
    ],
    pharmacy: [
      // Missing "Prescription Issued / Prescribed Out" from your specific code, added it back
      { name: "View / Issue Prescription", to: "../viewprescription", icon: <FaPills /> },
      { name: "Add Stock", to: "../addstock", icon: <MdInventory /> },
      { name: "Current Stock", to: "../currentstock", icon: <MdDashboard /> },
      { name: "Prescription Issued / Prescribed Out", to: "../prescribedout", icon: <MdReceipt /> }, // Re-added based on previous version logic might imply it's needed
      { name: "Current Expiry", to: "../currentexpiry", icon: <MdWarning />, badgeName: 'expiry' }, // Added badge identifier
      { name: "Expiry Register", to: "../expiryregister", icon: <MdWarning /> },
      { name: "Discard/Damaged", to: "../discarddamaged", icon: <MdDelete /> },
      { name: "Ward Consumable", to: "../wardconsumable", icon: <MdInventory /> },
      { name: "Ambulance Consumable", to: "../ambulanceconsumable", icon: <FaAmbulance /> },
    ],
  };

  const currentMenu = menus[accessLevel] || [];

  // Optional: Badge rendering logic if needed
  const renderBadge = (badgeName) => {
    let count = null;
    let isLoading = false;

    if (badgeName === "pending") {
      count = pendingCount;
      isLoading = pendingCount === null;
    } else if (badgeName === "expiry") {
      count = expiryCount;
      isLoading = expiryCount === null;
    } else {
      return null; // No badge for this item
    }

    // Simple badge style, adjust as needed
    return (
      <>
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-auto"></div>
        ) : count > 0 ? (
          <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-tight ml-auto">
            {count}
          </span>
        ) : (
           <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-tight ml-auto">
            0
          </span>
        )}
      </>
    );
  };


  return (
    <>
      {/* --- Mobile Toggle Button (Position absolute/fixed in your main layout/header) --- */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-md" // Added shadow
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* --- Overlay for Mobile --- */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true" // Added aria-hidden
        ></div>
      )}

      {/* --- Sidebar --- */}
      {/* Apply exact styles from user request + responsive classes */}
      <div
        id="sidebar"
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 h-screen overflow-y-auto bg-gradient-to-b from-blue-600 to-blue-400
          text-white flex flex-col shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-1/5 md:h-full md:flex md:shrink-0 {/* Adjust md:w-1/5 as per request */}
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden {/* Scrollbar hiding */}
          `}
        // On medium screens and up (md:):
        // - md:relative: Reset positioning
        // - md:translate-x-0: Ensure it's visible
        // - md:w-1/5: Set requested width for desktop (Note: w-64 might be more common)
        // - md:h-full: Use h-full for relative positioning context on desktop
        // - md:flex: Ensure it's displayed
        // - md:shrink-0: Prevent shrinking
      >
        {/* --- Logo --- */}
        {/* Apply exact styles from user request */}
        <div className="p-6 flex justify-center flex-shrink-0 relative"> {/* Kept relative for potential close button */}
           {/* Optional: Close button inside sidebar for mobile */}
           <button
              className="md:hidden absolute top-2 right-2 p-2 text-white hover:text-gray-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
            >
              <FaTimes size={24} />
            </button>
          <img
            src={img}
            alt="Logo"
            // Apply exact styles from user request
            className="w-auto max-w-[80%] h-auto shadow-2xl p-4 rounded-lg bg-white"
          />
        </div>

        {/* --- Menu Items --- */}
        {/* Apply exact styles from user request */}
        <nav className="flex-1 px-4 py-2"> {/* Adjusted padding */}
          {currentMenu.map((item, index) => {
             // Refined isActive check
             const absoluteBaseUrl = window.location.origin + location.pathname.substring(0, location.pathname.lastIndexOf('/'));
             const absoluteItemPath = new URL(item.to, absoluteBaseUrl + '/').pathname;
             // Check for exact match or if it's a parent path (but not the root if others exist)
             const isActive = location.pathname === absoluteItemPath ||
                             (location.pathname.startsWith(absoluteItemPath + '/') );


            return (
              <Link
                key={index}
                to={item.to}
                // Apply exact styles from user request
                className={`flex items-center justify-between p-3 mx-0 my-1 text-base rounded-lg font-medium transition duration-200 ease-in-out transform ${
                  isActive
                    ? "bg-white text-blue-600 scale-100 shadow-md font-semibold" // Exact active style
                    : "hover:bg-blue-500 hover:text-white hover:scale-105" // Exact hover style
                }`}
              >
                {/* Icon and Text container */}
                <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                    <span>{item.name}</span>
                </div>

                {/* Optional: Badge rendering (Add back if needed) */}
                 {item.badgeName && renderBadge(item.badgeName)}

              </Link>
            );
          })}
        </nav>

        {/* --- Login As Text --- */}
        {/* Apply exact styles from user request */}
        <p className="flex justify-center font-bold tracking-wider text-lg px-4 py-2 text-center"> {/* Added padding/centering */}
            Login as: {accessLevel.toUpperCase()}
        </p>

        {/* --- Logout Button --- */}
        {/* Apply exact styles from user request */}
        <div className="p-4 mt-auto flex-shrink-0"> {/* Ensure logout stays at bottom */}
          <button
            onClick={() => {
              localStorage.clear(); // Clear local storage on logout
              navigate("../login");
            }}
            // Apply exact styles from user request
            className="w-full flex items-center justify-center space-x-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 ease-in-out"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;