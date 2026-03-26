import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (<>
    <div className='text-center text-2xl pt-10 text-gray-500'>
      <p>CONTACT <span className='text-gray-800 font-semibold'>US</span></p>
     </div>
    <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
    <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
    <div className='flex flex-col justify-center items-start gap-6'>
     <p className='font-semibold text-lg text-gray-600'>Our Office</p>
     <p className='text-gray-500'>MediTrust Pvt. Ltd.<br/>
     2nd Floor, Shivalik Business Plaza,<br/>
     Circular Road, Shimla, Himachal Pradesh - 171001, India</p><br/>
     <p className='text-gray-500'> Tel : +1-212-455-8878<br/> Email : MediTrust@gmail.com</p>
     <p  className='text-gray-700 font-semibold'>CAREERS AT MEDITRUST</p> 
     <p  className='text-gray-500'>Learn more about our teams and openings.</p>
     <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
   
    </div>
    </div>
    </>
  )
}

export default Contact
