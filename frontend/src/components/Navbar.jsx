import React, { useState,useContext } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
const Navbar = () => {

    const navigate = useNavigate();
    const {token,setToken,userData} = useContext(AppContext)

    const [showMenu,setShowMenu] =  useState(false)
    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }
    

  return (

    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo1} alt="" />
        <ul className='hidden md:flex items-start font-medium gap-5 '>
            <NavLink to='/' className='flex flex-col items-center gap-1'>
                {({ isActive }) => (
                    <>
                        <li className='py-1'>HOME</li>
                        {isActive && <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto' />}
                    </>
                )}
            </NavLink>
            <NavLink to='/doctors' className='flex flex-col items-center gap-1'>
                {({ isActive }) => (
                    <>
                        <li className='py-1'>ALL SPECIALISTS</li>
                        {isActive && <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto' />}
                    </>
                )}
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1'>
                {({ isActive }) => (
                    <>
                        <li className='py-1'>ABOUT</li>
                        {isActive && <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto' />}
                    </>
                )}
            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                {({ isActive }) => (
                    <>
                        <li className='py-1'>CONTACT</li>
                        {isActive && <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto' />}
                    </>
                )}
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            { 
                token && userData
                ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                    <div className='relative w-10 h-10'>
                        <img 
                            className='w-full h-full rounded-full object-cover object-center border-2 border-gray-200' 
                            src={userData.image} 
                            alt="Profile"
                            onError={(e) => {
                                e.target.src = assets.profile_pic; // Fallback to default image
                            }}
                        />
                    </div>
                    <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-white border border-slate-100 rounded-2xl flex flex-col gap-1 p-2.5 shadow-xl transition-all duration-300'>
                            <p onClick={()=>navigate('/my-profile')} className='hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-colors duration-150'>My Profile</p>
                            <p onClick={()=>navigate('/my-appointment')} className='hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition-colors duration-150'>My Appointment</p>
                            <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                            <p onClick={logout} className='hover:bg-rose-50 text-rose-600 hover:text-rose-700 px-3.5 py-2.5 rounded-xl cursor-pointer text-sm font-semibold transition-colors duration-150'>Logout</p>
                        </div>
                    </div>
                </div> 
                : <button 
                        onClick={()=>navigate('/login')}
                        className=' bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
                        Create account
                    </button>
            }
            <img onClick={() =>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            {/*----------Mobile Menu ------------- */}
            <div className={`${showMenu ? 'fixed w-full': 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    < img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={() =>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink  onClick={() =>setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                    <NavLink onClick={() =>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL SPECIALISTS</p></NavLink>
                    <NavLink  onClick={() =>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                    <NavLink onClick={() =>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                </ul>
            </div>
            
        </div>
    </div>

  )
}

export default Navbar
