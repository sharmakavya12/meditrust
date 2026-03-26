// import jwt from "jsonwebtoken"

// //user  authentication middleware
// const authDoctor = async(req,res,next) =>{
//     try {
//         const dtoken = req.headers.token;
//         if (!dtoken) {
//             return res.json({success:false,message:'Not authorized login again'})
//         }
//         const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET)

//         req.docId = token_decode.id;

//         next()


//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// export default authDoctor

import jwt from "jsonwebtoken";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.docId = decoded.id; // Save doctorId in request
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
 