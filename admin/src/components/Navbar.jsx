import React,{useContext} from "react";
import {assets} from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { aToken, logout } = useContext(AdminContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        logout();
    }

    return (
        <div className="sticky top-0 z-50 flex justify-between items-center px-6 sm:px-10 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-3">
                <img 
                    onClick={() => navigate('/')} 
                    className="w-36 sm:w-40 cursor-pointer hover:opacity-90 transition-opacity" 
                    src={assets.admin_logo} 
                    alt="Prescripto Admin Logo" 
                />
                <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {aToken ? "Admin" : "Doctor"}
                </span>
            </div>
            <button 
                onClick={handleLogout} 
                className="bg-slate-900 text-white hover:bg-slate-800 text-sm px-6 py-2 rounded-xl transition-all duration-300 active:scale-95 shadow-sm font-medium"
            >
                Logout
            </button>
        </div> 
    )
}
export default Navbar;
