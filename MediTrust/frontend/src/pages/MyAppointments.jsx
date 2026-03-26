import React, { useContext, useState ,useEffect} from 'react'
import { AppContext } from '../context/AppContext'
import { doctors } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PaymentModal from './Payment'
const MyAppointments = () => {
  const {backendUrl, token , getDoctorsData} = useContext(AppContext)

  const [appointments,setAppointments] = useState([])
  const [modalVisible,setModalVisible] = useState(false)
  const[selectedAppointmentId,setSelectedAppointmentId] = useState(null)

  const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate)=>{
    const dateArray = slotDate.split('_')
    return dateArray[0] +" "+months[Number(dateArray[1])]+" " +dateArray[2]


  }
  const navigate = useNavigate()

  const getUserAppointments = async() =>{
    try {

      const {data} = await axios.get(backendUrl + '/api/user/appointments' , { headers: { Authorization: `Bearer ${token}` }})

      if(data.success){
        setAppointments([...data.appointments].reverse())
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }
  }
  const cancelAppointment = async (appointmentId)=>{
     try {
      const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId}, { headers: { Authorization: `Bearer ${token}` }})

      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()

      }else{
        toast.error(data.message)
      }
      console.log(appointmentId)
     } catch (error) {
      console.log(error);
      toast.error(error.message);
     }
  }
 const openPayModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId)
    setModalVisible(true)
  }

  // on successful payment refresh list
  const onPaymentSuccess = () => {
    getUserAppointments()
    getDoctorsData && getDoctorsData()
  }
  useEffect(()=>{

   if(token){
    getUserAppointments()
   }
  },[token])
   const selectedAppointment = appointments.find(
    (app) => app._id === selectedAppointmentId
  );

  return (
    <>
    <div className="max-w-6xl mx-auto p-4">
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b text-xl'>My Appointments</p>
      <div className="space-y-4 mt-6">
        {appointments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No appointments found.</p>
        ) : (
          appointments.map((item)=>(
            <div className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4' key={item._id} >
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className="flex-shrink-0">
                  <img className='w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-lg object-cover' src={item.docData.image} alt={item.docData.name} />
                </div>
                <div className='flex-1 text-sm text-zinc-600'>
                  <p className='text-neutral-800 font-semibold text-lg mb-1'>{item.docData.name}</p>
                  <p className='text-indigo-600 font-medium mb-2'>{item.docData.speciality}</p>
                  <div className='mb-2'>
                    <p className='text-zinc-700 font-medium'>Address:</p>
                    <p className='text-xs text-gray-600'>{item.docData.address.line1}</p>
                    <p className='text-xs text-gray-600'>{item.docData.address.line2}</p>
                  </div>
                  <p className='text-sm mt-2'><span className='text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                </div>

                <div className='flex flex-col gap-2 justify-center sm:justify-start'>
                  {!item.cancelled && !item.paid && !item.isCompleted &&(
                    <button
                      onClick={() => openPayModal(item._id)}
                      className='text-sm px-6 py-2 border border-indigo-500 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300'
                    >
                      Pay Online
                    </button>
                  )}
                  {item.paid &&<span className="text-green-600 font-medium text-sm">Paid</span>}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='text-sm px-6 py-2 border border-red-500 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300'
                    >
                      Cancel Appointment
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className='text-sm px-6 py-2 border border-red-500 rounded-full text-red-500 bg-red-50'>
                      Appointment Cancelled
                    </button>
                  )}
                  {item.isCompleted && <button className='text-sm px-6 py-2 border border-green-500 rounded-full text-green-500 bg-green-50'>Completed</button> }
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

     <PaymentModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  appointmentId={selectedAppointmentId}
  backendUrl={backendUrl}
  token={token}
  userPhone={selectedAppointment?.userData?.phone || ''}
  onSuccess={onPaymentSuccess}
/>

</>
  )
}


export default MyAppointments
