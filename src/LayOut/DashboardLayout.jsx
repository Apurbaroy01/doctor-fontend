import { NavLink, Outlet } from "react-router-dom";
import { AiFillDashboard } from "react-icons/ai";
import { FaCalendarCheck, FaUserInjured, FaUsers, FaUserShield, FaUserCog } from "react-icons/fa";

const DashboardLayout = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
     ${isActive ? "bg-blue-100 font-semibold text-blue-700" : "hover:bg-gray-200"}`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for small screen */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
        </div>

        {/* Main Page Content */}
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-64 p-4">
          <h1 className="text-xl font-bold text-blue-600 text-center mb-4">
            🏥 Doctor Dashboard
          </h1>

          <div className="flex flex-col mt-6 space-y-2">
            <NavLink to="/Dashboard" className={linkClasses}>
              <AiFillDashboard /> Dashboard
            </NavLink>

            <NavLink to="/Dashboard/appointment" className={linkClasses}>
              <FaCalendarCheck /> Appointment
            </NavLink>

            <NavLink to="/Dashboard/patientlist" className={linkClasses}>
              <FaUserInjured /> Patient
            </NavLink>

            {/* 🧩 User Management Dropdown */}
            <div className="collapse collapse-arrow ">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium flex items-center gap-2">
                <FaUsers className="text-blue-600" /> User Management
              </div>
              <div className="collapse-content flex flex-col gap-2">
                <NavLink
                  to="/Dashboard/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-200"
                    }`
                  }
                >
                  <FaUserShield /> Admin
                </NavLink>
                <NavLink
                  to="/Dashboard/assistant"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-200"
                    }`
                  }
                >
                  <FaUserCog /> Assistant
                </NavLink>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
