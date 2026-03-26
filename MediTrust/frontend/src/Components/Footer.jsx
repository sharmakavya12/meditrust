import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (

<div className=" bg-gray-50 text-gray-700 px-6 md:px-12 py-7 mt-7">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-sm">

    {/* ----- Left side (Logo + description) ------ */}
    <div>
      <img src={assets.logo} alt="MediTrust Logo" className=" mb-4 h-24 w-24 object-cover rounded-full"/>
      <p className="text-gray-600 leading-relaxed">
        MediTrust - Your trusted platform for booking doctor appointments, managing health records, and connecting with verified healthcare providers.
      </p>
    </div>

    {/* ----- Middle side (Company Links) ------ */}
    <div>
      <p className="text-lg font-semibold mb-3">Company</p>
      <ul className="space-y-2">
        <Link to="/" className="hover:text-green-600 cursor-pointer block">Home</Link>
        <li className="hover:text-green-600 cursor-pointer">About Us</li>
        <li className="hover:text-green-600 cursor-pointer">Contact Us</li>
        <li className="hover:text-green-600 cursor-pointer">Privacy Policy</li>
      </ul>
    </div>

    {/* ----- Right side (Get in Touch) ------ */}
    <div>
      <p className="text-lg font-semibold mb-3">Get in Touch</p>
      <ul className="space-y-2">
        <li className="hover:text-green-600 cursor-pointer">📞 +1-212-455-8878</li>
        <li className="hover:text-green-600 cursor-pointer">✉️ MediTrust@gmail.com</li>
      </ul>
    </div>
  </div>

  {/* ------- Copyright ----------- */}
  <div className="border-t pt-5 text-center text-gray-500 text-sm">
    <p>© 2025 MediTrust — All Rights Reserved</p>
  </div>
</div>

  )
}
export default Footer
// <span className="h-12 w-12 rounded-full object-cover border-2 border-emerald-600"><span className="tex  t-xl font-bold"><span className="text-emerald-700">Medi</span><span className='text-yellow-400'>Trust</span></span></span></img>