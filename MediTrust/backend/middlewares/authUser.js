
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    const token = authHeader.split(" ")[1]; // get the token after 'Bearer'
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("AuthUser Error:", error.message);
    res.status(401).json({ success: false, message: "Not authorized, login again" });
  }
};

export default authUser;

