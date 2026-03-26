import validator from 'validator'
import bcrypt from 'bcryptjs'  
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

//API to register user 
const registerUser = async (req,res) => {
    try{
        const{name,email,password,dob} =req.body
        if(!name || !password ||!email){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"password too short"})
        }
       
        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        
        const userData ={
            name,
            email,
            password : hashedPassword,
            dob: dob && dob.toString().trim() !== "Not Selected" ? new Date(dob) : null
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const loginUser = async(req,res)=>{
    try {
        const{email,password} = req.body
        const user= await userModel.findOne({email})
        if(!user){
           return res.json({success:false,message:'user doesnot exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
             res.json({success:false,message:'invalid credentials'})
        }
        else{
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
    } catch (error) {
           console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Api to get user data 
const getProfile = async(req,res) =>{
    try {
        const userData = await userModel.findById(req.userId).select('-password')
        res.json({success:true,userData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api update user profile 
const updateProfile = async(req,res) =>{
    try {
       const userId = req.userId
       const {name,phone,address,dob,gender} = req.body
       const imageFile =req.file

       if(!name||!phone||!dob ||!gender){
        return res.json({success:false,message:"missing details"})
       }
       const result= await userModel.findByIdAndUpdate(userId,{
        name,
        phone,
        address:JSON.parse(address),
        dob,
        gender
    },
{new:true})
     
    if(imageFile){
        // upload image to cloudinary
         const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
         const imageURL = imageUpload.secure_url

         await userModel.findByIdAndUpdate(userId,{image: imageURL})
        }
        res.json({success:true,message:"profile updated"})
}catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
}
}

// API to book appointment
const bookAppointment = async(req,res) =>{
    try{
        const userId = req.userId
        const {doctorId,slotDate,slotTime} = req.body;

        const docData = await doctorModel.findById(doctorId).select('-password')

        if(!docData || !docData.available){
            return res.json({success:false,message:"Doctor not available"})
        }

        let slots_booked = docData.slots_booked || {};
        //checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Doctor not available"})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData ={
            userId,
            doctorId,
            userData,
            docData,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data to docData
        await doctorModel.findByIdAndUpdate(doctorId,{slots_booked})

        res.json({success:true,message:"Appointment Booked"})
    }
    catch(error){
       console.log(error)
       res.json({success:false,message:error.message})
    }
}

//api to get user appointment 
const listAppointment = async(req,res)=>{
    try {
        const userId  = req.userId
        let appointments = await appointmentModel.find({userId})
        appointments = appointments.filter(app => !app.cancelled);
        res.json({success:true,appointments})
    } catch (error) {
         console.log(error)
       res.json({success:false,message:error.message})
    }
}

//api to cancel appointment
const cancelAppointment = async(req,res)=>{
    try {
        const userId = req.userId;
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        //verify appointment user 
        if(appointmentData.userId.toString() !== userId){
          return  res.json({success:false,message:'unauthorized action'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled :true})

        //releasing doctor slot
        const {doctorId,slotDate,slotTime} = appointmentData
        const doctorData = await doctorModel.findById(doctorId)
  
        if(!doctorData){
            return res.json({success:false,message:"Doctor not found"})
        }

        let slots_booked = doctorData.slots_booked || {}
        slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e !== slotTime)

        await doctorModel.findByIdAndUpdate(doctorId,{slots_booked})

        res.json({success:true,message:'Appointment cancelled'})
    } catch (error) {
        console.log(error)
       res.json({success:false,message:error.message})
    }
}

// api to make mock payment
const mockPay = async (req, res) => {
  try {
    const userId = req.userId; // set by authUser middleware
    const { appointmentId, method } = req.body; // method: 'mock-card'|'mock-upi'|'cod' etc.

    if (!appointmentId) {
      return res.json({ success: false, message: "Missing appointmentId" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // verify ownership
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // mark paid and save chosen method
    appointmentData.paid = true;
    appointmentData.paymentMethod = method || "mock";

    await appointmentData.save();

    return res.json({ success: true, message: "Payment recorded (mock)", appointment: appointmentData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

// --- OTP only ---
const sendOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId, phone } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    appointment.otp = otp;
    appointment.phone = phone;
    await appointment.save();

    // For testing: return OTP
    res.json({ success: true, message: `OTP generated (mock): ${otp}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { appointmentId, otp } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    if (appointment.otp !== otp) return res.status(400).json({ success: false, message: "Incorrect OTP" });

    appointment.paymentStatus = 'confirmed';
    appointment.paid = true;
    appointment.otp = undefined;
    await appointment.save();

    res.json({ success: true, message: "Payment confirmed!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser,loginUser,getProfile,updateProfile, bookAppointment,listAppointment,cancelAppointment,mockPay,sendOtp,verifyOtp}
