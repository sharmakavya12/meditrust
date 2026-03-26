import React from 'react'
import { assets } from '../assets/assets'
const Header = () => {
  return (
    <div className='flex flex-col md:flex-row md:relative flex-wrap  bg-gradient-to-r from-emerald-700 to-emerald-100 px-9 rounded-2xl  shadow-lg  w-full min-h-[450px]'>
        {/* -----------left side------------- */}
     <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[-10vw] md:mb-[-30px]'>

      <p className='text-3xl py-8 md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
        Book Appointment <br/>
        With Trusted Doctors
      </p> 
      <div className='flex flex-col md:flex-row md:relative bottom-6 items-center gap-3 text-white text-sm font-light'>
        <img className='w-28'  src={assets.group_profiles} alt="" />
        <p>Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block'/>
        schedule your appointment anytime from anywhere</p>
      </div>
      <a href="#speciality" className=' py-3 bottom-6 md:relative flex items-center gap-2 bg-white px-8 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300' >
        Book appointment <img className="w-3" src= {assets.arrow_icon} alt="" />
      </a>
      </div>

      {/* ------------right side------------ */}
      <div className='md:w-1/2 relative'>
      <img className='w-50%  md:relative bottom-0  h-30 rounded-lg' src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
//  md:absolute