//importing Schema from models 
const User =require("../models/User");
const jwt=require('jsonwebtoken');

exports.isAuthenticated=async(req,res,next)=>{

    try {
        const { token } = req.cookies;

        //if token is not found means user have not logged in
        if (!token) {
          return res.status(401).json({
            message: "Please login first",
          });
        }
    
        //if user have logged in
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        //saving all data of that user
        req.user = await User.findById(decoded._id);
        //do nothing bypass
        next();
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
}