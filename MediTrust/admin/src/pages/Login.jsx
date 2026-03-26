import { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Admin')
  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Admin login successful')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Doctor login successful')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border-rounded-x1 text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl m-auto'>
          <span className='text-green-700'>{state}</span>
          <span className='text-yellow-400'> Login</span>
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-gray-600 rounded w-full p-2 mt-1' type='email' required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-gray-600 rounded w-full p-2 mt-1' type='password' required />
        </div>
        <button className='bg-white text-gray-600 w-full py-2 rounded-md text-base border border-indigo-700 hover:bg-indigo-700 hover:text-white duration-300'>
          Login
        </button>
        {state === 'Admin'
          ? <p>Doctor Login? <span className='text-indigo-500 underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
          : <p>Admin Login? <span className='text-indigo-500 underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
