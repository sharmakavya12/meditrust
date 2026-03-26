import React from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Doctor from './pages/Doctor'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Payment from './pages/Payment'
const App = () => {
 
  return (
   <div className='mx-4 sm:mx-[10%]'>
    <ToastContainer/>
  <Navbar/>
    <Routes>
      <Route path = '/' element={<Home/>}/>
      <Route path = '/doctors' element={<Doctor/>}/>
      <Route path = '/doctors/:speciality' element={<Doctor/>}/>
      <Route path = '/contact' element={<Contact/>}/>
      <Route path = '/about' element={<About/>}/>
      <Route path = '/login' element={<Login/>}/>
      <Route path = '/my-appointments' element={<MyAppointments/>}/>
      <Route path = '/appointment/:docId' element={<Appointment/>}/>   
      <Route path = '/my-profile' element={<MyProfile/>}/>     
      <Route path="/pay/:appointmentId" element={<Payment />} />

   </Routes>
   <Footer/>
   </div>
  )
}

export default App
