import {asyncHandler} from '../utils/asyncHandler.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import crypto from "crypto";
import { sendEmail } from '../utils/sendEmail.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { register } from '../services/auth.service.js';

const generateAccessTokenandRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError( 500, "somthing went wrong while generating access token and refresh token");
  }
};



const registerUser = asyncHandler( async (req, res, ) => {
  
  //service layer
  const newUser = await register(req.body);

  res
  .status(200)
  .json(
    new ApiResponse(200, { email: newUser.email }, "Please verify your email")
  );
  }
)

const emailVerify = asyncHandler(async (req, res)=>{
  const {token} =req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ verificationToken : hashedToken})

  if(!user) {
    throw new ApiError (400, "INVALID OR EXPIRED RESET TOKEN")
  }
  
  if(user.isVerified){
    throw new ApiError(403, "User already verified");
  }

  if(Date.now() > user.verificationTokenExpires){
    throw new ApiError(400, "Verification token expired");
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save()

  res.status(200).json(new ApiResponse(200, "Email verified successfully"));
  
})

const loginUser = asyncHandler(async (req, res ) =>{
  const {email, password} = req.body;

  if(!email || !password){
    throw new ApiError(400, "EMAIL AND PASSWORD ARE REQUIRED"); 
  };

  // Find the user by email
  const user = await User.findOne({ email });

  // If user not found, return an error
  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  // Check if the user's email is verified
  if(user.isVerified === false){
    throw new ApiError(403, "PLEASE VERIFY YOUR EMAIL TO LOGIN");
  }
  
  // Compare the provided password with the stored hashed password
  let pass = false;
  try{
    pass = await bcrypt.compare(password, user.password);
  }
  catch(err){
    console.error('Error comparing passwords:', err);
  }

  // If the password is incorrect, return an error
  if(!pass) throw new ApiError(401, "WRONG PASSWORD");

  //jwt generation
  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };

  res
  .status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(new ApiResponse(200, "Login successful"));
})

const logoutUser = asyncHandler(async (req, res) => {

  // Get the user from auth middleware
  const user = req.user;

  const foundUser = await User.findById(user._id);
  
  if (!foundUser) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  foundUser.refreshToken = null;
  await foundUser.save();

  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Logout successful"));
})

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "NO REFRESH TOKEN PROVIDED");
  }

  try {

    //decode the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "INVALID REFRESH TOKEN");
    }

    // Check if the refresh token matches the one stored in the database
    if (user.refreshToken !== token) {
      throw new ApiError(401, "REFRESH TOKEN MISMATCH");
    }

    const accessToken = await generateAccessToken(user);
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(new ApiResponse(200, "AccessToken generated successfully"));
  } catch (error) {
    throw new ApiError(403, "INVALID OR EXPIRED REFRESH TOKEN");
  }
});


const getProfile = asyncHandler( async(req, res) => {
  res
  .status(200)
  .json(new ApiResponse(200, { email: req.user.email, fullname: req.user.fullname, role: req.user.role }, "Welcome to your profile"));
})

const adminDashboard = asyncHandler( async(req, res) => {
  res.status(200).json(new ApiResponse(200, { fullname: req.user.fullname }, `Welcome to adminDashboard !`));
})

export { registerUser, emailVerify, loginUser, getProfile, refreshToken, logoutUser, adminDashboard };