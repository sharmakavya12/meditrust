import React, { useContext } from 'react'
import { assets } from "../../assets/assets";
import { useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const AddDoctor = () => {
  const[docImg,setDocImg] = useState(null)
  const[name,setName] = useState('')
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[experience,setExperience] = useState('1 Year')
  const[fees,setFees] = useState('')
  const[education,setEducation] = useState('')
  const[address1,setAddress1] = useState('')
  const[address2,setAddress2] = useState('')
  const[about,setAbout] = useState('')
  const[speciality,setSpeciality] = useState('General Physician')
  const[degree,setDegree] = useState('')

  const{ backendUrl, aToken} = useContext(AdminContext)
  const onSubmitHandler = async (event) =>{
    event.preventDefault()
     
    try {
      if(!docImg){
         return toast.error('image not selected')
      }
      
      const formData = new FormData()
      formData.append('docImg',docImg);
      formData.append('name',name);
      formData.append('email',email);
      formData.append('password',password);
      formData.append('degree', education);
      formData.append('address', JSON.stringify({address1,address2})); 
      formData.append('fees',fees);
      formData.append('experience',experience);
      formData.append('about',about);
      formData.append('speciality',speciality);
      //console log formdata
      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`)
      })

      const{data} =await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{ atoken : aToken}}) 

      if(data.success){
        toast.success(data.message)
        setDocImg(null)
        setName('')
        setEmail('')
        setPassword('')
        setFees('')
        setAddress1('')
        setAddress2('')
        setAbout('')
        setDegree('')
      
    } else{
        toast.error(data.message)
        console.log(data)
      }}
    catch (error) {
      toast.error(error.message)
    }
  }

  return (
  <form className='m-5 w-full'onSubmit={onSubmitHandler} >
    <p className='mb-3 text-lg font-medium'>Add Doctor</p>

    <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
      <div className='flex items-center gap-4 mb-8 text-gray-500'>
        <label htmlFor="doc-img">
          <img className='w-16 bg-gray-50 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg):assets.upload_area} alt="" />
        </label>
        <input onChange={(e)=> setDocImg(e.target.files[0])} type="file" id="doc-img" hidden  />
        <p>Upload doctor <br />picture</p>
      </div>
      <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
        <div className='w-full lg:flex-1 flex flex-col gap-4'>

          <div className='flex-1 flex flex-col gap-1'>
            <p>Doctor name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Name' className='bg-gray-50 border rounded px-3 py-2' />
          </div>

          <div className='flex-1 flex flex-col gap-1' >
            <p>Doctor Email</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email'  className='bg-gray-50 border rounded px-3 py-2'  />
          </div>

          <div className='flex-1 flex flex-col gap-1' >
            <p>Doctor Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='bg-gray-50 border rounded px-3 py-2'  />
          </div>
          
          <div className='flex-1 flex flex-col gap-1' >
            <p>
              Experience
            </p>
            <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' id='experience' >
              <option value="1 Year">1 Year</option>
              <option value="2 Year">2 Year</option>
              <option value="3 Year">3 Year</option>
              <option value="4 Year">4 Year</option>
              <option value="5 Year">5 Year</option>
              <option value="6 Year">6 Year</option>
              <option value="7 Year">7 Year</option>
              <option value="8 Year">8 Year</option>
              <option value="9 Year">9 Year</option>
              <option value="9+ Year">9+ Year</option>
            </select>
          </div>
          <div className='flex-1 flex flex-col gap-1' >
            <p>Fees</p>
            <input onChange={(e)=>setFees(e.target.value)} value={fees} type="number" placeholder="Fees"  className='bg-gray-50 border rounded px-3 py-2'  />
          </div>
          </div>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=> setSpeciality(e.target.value)} value={speciality} className='bg-gray-50 border rounded px-3 py-2' id='speciality' >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
             <div className='flex-1 flex flex-col gap-1' >
               <p>Education</p>
               <input onChange={(e)=>setEducation(e.target.value)} value={education} type="text" placeholder="Education"  className='bg-gray-50 border rounded px-3 py-2' />
            </div>

            <div className='flex-1 flex flex-col gap-1' >
               <p>Address</p>
               <input onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" placeholder="address 1" className='bg-gray-50 mb-1 border rounded px-3 py-2' /> <br />
               <input onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" placeholder="address 2"  className='bg-gray-50 border rounded px-3 py-2'  />
            </div>
          </div>
         </div>
        <div>
               <p className='mt-4 mb-2'>About Doctor</p>
               <textarea onChange={(e)=> setAbout(e.target.value)} value={about} placeholder="write about doctor" rows={5}  className='bg-gray-50 border rounded px-4 pt-2 w-full ' />
            </div>
            <button type='submit' className='bg-indigo-400 px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>
    </div>
  </form>
  )
}

export default AddDoctor
