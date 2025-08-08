const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
 
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;

        next();
      }
    } catch (error) {
      console.log(error)
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
     console.log('There is no token attached to header')
    throw new Error(" There is no token attached to header");
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  
  const { email } = req.user;
  
  const adminUser = await User.findOne({ email });
  
  if (!adminUser) {
    return res.status(404).json({ message: "User not found" });
  }
  if (adminUser.role !== "admin") {
    return res.status(403).json({ message: "You are not an admin" });
  }
  next();
});
module.exports = { authMiddleware, isAdmin };
