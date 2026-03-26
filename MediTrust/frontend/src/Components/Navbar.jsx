import React from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
    const navigate = useNavigate();

    const {token,setToken,userData} = useContext(AppContext)
    const[showMenu,setShowMenu] = useState(false)

    const logout = () =>{
      setToken(false)
      localStorage.removeItem('token')
    }

  return (
    <>
    <div className='flex items-center justify-between text-sm py-4 mb border-b border-b-gray-400 mb-7'>
         <div className ="flex items-center space-x-3">
        <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo"   className="h-12 w-12 rounded-full object-cover border-2 border-emerald-600" />
         <span className="text-xl font-bold"><span className="text-emerald-700">Medi</span><span className='text-yellow-400'>Trust</span></span>
      </div>
    
      <ul className='hidden md:flex items-start gap-5 font-medium '>
        <NavLink to={'/'}>
            <li className='py-1   hover:text-green-700 hover:translate-y-[-2px] duration-500'>Home</li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto  hidden '/>
        </NavLink>
          <NavLink to={'/doctors'}>
            <li className='py-1  hover:text-green-700 hover:translate-y-[-2px] duration-500'>All Doctors</li>
            <hr className='border-none  outline-none h-0.5 bg-primary  w-3/5 m-auto hidden'/>
        </NavLink>
          <NavLink to={'/about'}>
            <li className='py-1  hover:text-green-700 hover:translate-y-[-2px] duration-500'>About</li>
            <hr className='border-none  outline-none h-0.5 bg-primary   w-3/5 m-auto hidden'/>
        </NavLink>
          <NavLink to={'/contact'}>
            <li className='py-1  hover:text-green-700 hover:translate-y-[-2px] duration-500'>Contact</li>
            <hr className='border-none  outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
      </ul>
    {
      token && userData
      ?  <div className='flex item-center gap-2 cursor-pointer group relative'>
        <img className='w-8 rounded-full' src={userData.image} alt="profile" />
        <img className='w-2.5' src= {assets.dropdown_icon} alt="profile" />
        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              {/* p padding flexing column gap  */}
            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={()=>navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointment</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Log Out</p>
            </div>
        </div>
      </div>
      :  <button onClick={()=>navigate('/login')}className="bg-green-700 text-white px-6 py-2 font-semibold rounded-full hover:bg-yellow-400 transition flex items-center gap-2">Create Account</button>
    }


    </div></>
  ) 
}
export default Navbar