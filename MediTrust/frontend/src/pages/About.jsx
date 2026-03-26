import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div>
        <p className='text-center text-2xl pt-10 text-gray-500'>
          ABOUT <span className='text-gray-700'>US</span>
        </p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="About MediTrust - Healthcare professionals" />
       <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
       <p>At MediTrust, we are dedicated to making healthcare more accessible, reliable, and transparent for everyone. Our mission is to bridge the gap between patients and trusted medical services through innovative digital solutions.</p>
       <p>We believe that quality healthcare should be simple and stress-free. That’s why MediTrust provides users with secure access to medical resources, trusted professionals, and easy-to-use tools that help them make better health decisions.</p>
       <b className='text-gray-800'>Our Vision</b>
       <p>With a focus on trust, efficiency, and care, MediTrust is committed to building a healthier future. We continue to grow as a platform that not only connects people with healthcare but also inspires confidence in every step of their medical journey.</p>
       </div>
      </div>
      
       
    </div>
  )
}

export default About
