import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const DoctorProfile = () => {
  const {dToken, profileData, setProfileData, getProfileData, backendUrl} = useContext(DoctorContext)
  const {currency} = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(true)

  const updateProfile = async() => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }
      const {data} = await axios.post(backendUrl+'/api/doctor/update-profile', updateData, {
        headers: { Authorization: `Bearer ${dToken}` }
      })

      if(data.success){
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Update failed")
    }
  }

  useEffect(() => {
    console.log(" DoctorProfile Component Mounted");
    console.log(" dToken:", dToken ? "Present" : "Missing");
    console.log(" profileData:", profileData);
    
    if (dToken) {
      console.log("Calling getProfileData");
      getProfileData().finally(() => setLoading(false));
    } else {
      console.error(" No dToken found!");
      setLoading(false);
    }
  }, [dToken])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading profile...</p>
      </div>
    )
  }

  // No token
  if (!dToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">Not authenticated!</p>
          <p className="text-sm text-gray-600">Please login again.</p>
        </div>
      </div>
    )
  }

  // No profile data
  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600">Profile not found!</p>
          <p className="text-sm text-gray-600">Unable to load profile data.</p>
          <button 
            onClick={getProfileData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  return  (
    <div className='m-5'>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-shrink-0'>
          <img className='w-64 h-64 object-cover bg-indigo-400/80 rounded-lg' src={profileData.image} alt="" />
        </div>
        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          {/* DOC- information */}
           <p className='flex items-center gap-2 text-lg font-medium text-gray-700'>{profileData.name}</p>
           <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p className='py-0.5 px-2 border text-xs rounded-full'>{profileData.degree} - {profileData.speciality}</p>
            <span>{profileData.experience}</span>
           </div>
           {/* doc-about */}
           <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{profileData.about}</p>
           </div>

           <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currency} {isEdit? <input type="number" onChange={(e)=>setProfileData(prev=>({...prev,fees:e.target.value}))} value={profileData.fees}/>:profileData.fees}</span>
           </p>

           <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit? <input type="text" className='border rounded bg-gray-100 my-1 px-0.5' onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={profileData.address.line1} />:profileData.address.line1}
              <br/>
              {isEdit? <input type="text" className='border rounded bg-gray-100 my-1 px-0.5'  onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))} value={profileData.address.line2} />:profileData.address.line2}

            </p>
           </div>

           <div className='flex gap-1 pt-2'>
            <input onChange={()=>isEdit&&setProfileData(prev => ({...prev,available:!prev.available}))} checked={profileData.available} type="checkbox" id="available" disabled={!isEdit} />
            <label htmlFor="available">Available</label>
           </div>
        {
  isEdit
  ?  <button 
        onClick={updateProfile} // <-- call updateProfile here
        className='px-4 py-1 border border-indigo-500 text-sm rounded-full mt-5 hover:bg-indigo-400 hover:text-white transition-all'>
        Save
     </button>
  :  <button 
        onClick={()=>setIsEdit(true)} 
        className='px-4 py-1 border border-indigo-500 text-sm rounded-full mt-5 hover:bg-indigo-400 hover:text-white transition-all'>
        Edit
     </button>
}

          
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile

