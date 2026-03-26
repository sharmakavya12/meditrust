
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'

// Add Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file
    const addressArr = address ? JSON.parse(address) : []

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
      return res.status(400).json({ success: false, message: 'Missing Details' })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' })
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password too short' })
    }

    const existingDoctor = await doctorModel.findOne({ email })
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let imageUrl = ''
    if (imageFile) {
      const uploadRes = await cloudinary.uploader.upload(imageFile.path, { folder: 'doctors' })
      imageUrl = uploadRes.secure_url
    }

    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: addressArr,
      image: imageUrl || undefined
    })

    await newDoctor.save()
    res.status(201).json({ success: true, message: 'Doctor added', doctor: newDoctor })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Change availability
const changeAvailability = async (req, res) => {
  try {
    const docId = req.params.id
    const docData = await doctorModel.findById(docId)

    if (!docData) return res.json({ success: false, message: 'Doctor not found' })

    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({ success: true, message: 'Availability Changed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find()
    res.json({ success: true, doctors })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id)
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
    res.json({ success: true, doctor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await doctorModel.findByIdAndDelete(req.params.id)
    if (!deletedDoctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
    res.json({ success: true, message: 'Doctor deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Doctor list
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password -email')
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Doctor appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ doctorId: req.docId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Complete appointment
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId
    const {  appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.doctorId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Appointment Completed' })
    } else {
      return res.json({ success: false, message: 'Mark failed' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId
    const {  appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.doctorId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Appointment Cancelled' })
    } else {
      return res.json({ success: false, message: 'Cancellation failed' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Doctor dashboard
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId
    const appointments = await appointmentModel.find({ doctorId: docId })

    let earnings = 0
    let patients = []

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Doctor profile
const doctorProfile = async (req, res) => {
  try {
    const profileData = await doctorModel.findById(req.docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, address, available } = req.body

    // Basic validation
    if (fees !== undefined && (isNaN(fees) || fees < 0)) {
      return res.json({ success: false, message: 'Invalid fees value' })
    }

    if (address && typeof address !== 'object') {
      return res.json({ success: false, message: 'Invalid address format' })
    }

    await doctorModel.findByIdAndUpdate(req.docId, { fees, address, available })
    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}



export { addDoctor, loginDoctor, doctorDashboard, doctorProfile, updateDoctorProfile, appointmentsDoctor, appointmentComplete, appointmentCancel, changeAvailability, getAllDoctors, getDoctorById, deleteDoctor, doctorList };
 