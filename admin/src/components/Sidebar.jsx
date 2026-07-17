import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);

    const navLinkClass = (isActive) =>
        `flex items-center justify-center md:justify-start gap-0 md:gap-3 px-3 py-3 md:px-4 mx-1 md:mx-2 my-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${isActive
            ? "bg-primary/10 text-primary border-primary/10 shadow-sm"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
        }`;

    return (
        <div className="min-h-[calc(100vh-80px)] w-[64px] md:w-72 bg-white border-r border-slate-100 py-6 px-1.5 md:px-3 flex-shrink-0 transition-all duration-300">
            {aToken && (
                <ul className="space-y-1">
                    <NavLink to="/admin-dashboard" className={({ isActive }) => navLinkClass(isActive)}>
                        <img className="w-5 h-5 opacity-80" src={assets.home_icon} alt="Dashboard" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink to="/all-appointments" className={({ isActive }) => navLinkClass(isActive)}>
                        <img className="w-5 h-5 opacity-80" src={assets.appointment_icon} alt="Appointments" />
                        <p className="hidden md:block">Appointments</p>
                    </NavLink>

                    <NavLink to="/add-doctor" className={({ isActive }) => navLinkClass(isActive)}>
                        <img className="w-5 h-5 opacity-80" src={assets.add_icon} alt="Add Doctor" />
                        <p className="hidden md:block">Add Doctor</p>
                    </NavLink>

                    <NavLink to="/doctors-list" className={({ isActive }) => navLinkClass(isActive)}>
                        <img className="w-5 h-5 opacity-80" src={assets.people_icon} alt="Doctors List" />
                        <p className="hidden md:block">Doctors List</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
};

export default Sidebar;