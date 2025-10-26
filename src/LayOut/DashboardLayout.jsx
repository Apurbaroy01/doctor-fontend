import { useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  AiFillDashboard,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import {
  FaCalendarCheck,
  FaUserInjured,
  FaUsers,
  FaUserShield,
  FaUserCog,
} from "react-icons/fa";

const DashboardLayout = () => {
  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out" });
  }, []);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
     ${isActive
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md"
      : "hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <div className="drawer lg:drawer-open font-[Poppins]">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-200 w-full lg:hidden flex justify-between">
          <label
            htmlFor="my-drawer-2"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>

          <div className="flex items-center gap-3 pr-4">
            <img
              src="https://i.ibb.co/FwM9x5L/user-avatar.png"
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-blue-400"
            />
          </div>
        </div>

        {/* Main Outlet */}
        <div className="p-4 md:p-6 bg-base-100 min-h-screen">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <div className="menu bg-gradient-to-b from-blue-100 to-blue-50 text-base-content min-h-full w-72 p-5 shadow-xl flex flex-col justify-between">
          {/* Top Section */}
          <div data-aos="fade-down">
            

            {/* Navigation Links */}
            <div className="flex flex-col space-y-2">
              <NavLink to="/Dashboard" className={linkClasses}>
                <AiFillDashboard /> Dashboard
              </NavLink>

              <NavLink to="/Dashboard/appointment" className={linkClasses}>
                <FaCalendarCheck /> Appointment
              </NavLink>

              <NavLink to="/Dashboard/patientlist" className={linkClasses}>
                <FaUserInjured /> Patient
              </NavLink>

              {/* User Management Dropdown */}
              <div className="collapse collapse-arrow ">
                <input type="checkbox" />
                <div className="collapse-title  flex items-center gap-2">
                  <FaUsers className="text-blue-600" /> User Management
                </div>
                <div className="collapse-content flex flex-col gap-2">
                  <NavLink to="/Dashboard/admin" className={linkClasses}>
                    <FaUserShield /> Admin
                  </NavLink>
                  <NavLink to="/Dashboard/assistant" className={linkClasses}>
                    <FaUserCog /> Assistant
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Profile Section */}
          <div
            data-aos="fade-up"
            className="mt-6 border-t border-blue-300 pt-4 text-center text-xs text-gray-500"
          >
            <div className="dropdown dropdown-top">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition justify-center"
              >
                <img
                  src="https://i.ibb.co/FwM9x5L/user-avatar.png"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-400"
                />
                <div className="text-left">
                  <p className="font-semibold text-sm text-blue-800">
                    Dr. Apurba
                  </p>
                  <p className="text-xs text-gray-500">Cardiologist</p>
                </div>
              </div>

              {/* Dropdown Content */}
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 mb-2"
              >
                <li>
                  <Link to="/Dashboard/profileSetting" className="flex items-center gap-2">
                    <AiOutlineSetting /> Profile Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => alert("Logout clicked!")}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <AiOutlineLogout /> Logout
                  </button>
                </li>
              </ul>
            </div>

            <p className="mt-3 text-gray-500 text-xs">
              © 2025 MediCare System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
