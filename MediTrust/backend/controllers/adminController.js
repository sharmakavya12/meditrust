import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as  cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
// api for adding doctor

const addDoctor = async (req,res) =>{
    try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file); 

    const { name , email, password ,speciality ,degree,experience,about,fees,address} = req.body//when ever we call this data we want it in terms of form data hence multer is needed
    const imageFile = req.file;

    console.log("database connected")

    //checking for all data to add doctor
    if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
        return res.json({success:false , message:"Missing Details"})
    }
     // validating email format
    if(!validator.isEmail(email)){
            return res.json({success:false, message:'please enter a valid email'})
    }
    // validating password
     if(password.length < 8 ){
            return res.json({success:false , message:'please enter a strong password'})
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10) // it ranges from 5-15 and more the number more the time for encryption
    const hashedPassword = await bcrypt.hash(password,salt)
   
// upload image to cloudinary 
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url
//for saving data
    const doctorData={
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({success:true,message:"Doctor added"})
}
    catch (error){
  console.log(error)
  res.json({success:false,message:error.message})
    }}

    // api for admin login

const loginAdmin = async (req,res) => {
        try {

            const {email,password} = req.body
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
               const token = jwt.sign(email+password,process.env.JWT_SECRET)
                res.json({success:true,token})

            }
            else {
                res.json({success:false,message:"invalid credentials"})
            }
        }
        catch(error) {
            console.log(error)
            res.json({success:false,message:error.message})
        }
    }


const allDoctors = async (req,res) => {
    try {
        const doctors = await doctorModel.find().sort({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
         console.log(error)
            res.json({success:false,message:error.message})
    }}


//api to get all appointments 
const appointmentAdmin = async(req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {

          console.log(error)
            res.json({success:false,message:error.message})

    }
}

// api for cancellation of appointment 
const appointmentCancel = async(req,res)=>{
    try {
       
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

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
//api to get dashboard
const adminDashboard = async(req,res)=>{

    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData ={
            doctors: doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }
        
        res.json({success:true,dashData})

    } catch (error) {
          console.log(error)
       res.json({success:false,message:error.message})
    }

}

export {addDoctor,loginAdmin,allDoctors,appointmentAdmin,appointmentCancel,adminDashboard}