import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'

const DoctorList = () => {
  const {doctors,aToken,getAllDoctors,changeAvailability} = useContext(AdminContext)

  useEffect(()=>{
if (aToken) {
  getAllDoctors()
}
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
   <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
  {doctors.length === 0 && <p>No doctors found.</p>}
  {doctors.map((item,index)=>(
    <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index} >
      <img className='bg-indigo-50 group-hover:bg-indigo-400 transition-all duration-500' src={item.image} alt={item.name} />
      <div className='p-4'>
        <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
        <p className='text-zinc-600 text-sm'>{item.email}</p>
        <p className='mt-2 flex items-center gap-1 text-sm'>{item.specialization}</p>
        <label className='flex items-center gap-2 mt-2'>
          <input type="checkbox" checked={item.available} onChange={()=>changeAvailability(item._id)} />
          <span>Available</span>
        </label>
      </div>
    </div>
  ))}
</div>

    </div>
  )
}

export default DoctorList
