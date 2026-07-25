import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { register, login, logout, refresh } from '../services/auth.service.js';

// const generateAccessTokenandRefreshToken = async (user) => {
//   try {
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
    
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });
//     return { accessToken, refreshToken };

//   } catch (error) {
//     throw new ApiError( 500, "somthing went wrong while generating access token and refresh token");
//   }
// };



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

  const { user, accessToken, refreshToken } = await login(req.body);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };

  res
  .status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(new ApiResponse(200, user, "Login successful"));
})

const logoutUser = asyncHandler(async (req, res) => {

  await logout(req.user._id);

  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Logout successful"));
})

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

  const { accessToken, refreshToken } = await refreshUserSession(token);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(new ApiResponse(200, "AccessToken generated successfully"));
});


const getProfile = asyncHandler( async(req, res) => {
  res
  .status(200)
  .json(new ApiResponse(200, { _id: req.user._id, email: req.user.email, fullname: req.user.fullname, role: req.user.role }, "Welcome to your profile"));
})

const adminDashboard = asyncHandler( async(req, res) => {
  res.status(200).json(new ApiResponse(200, { _id: req.user._id, fullname: req.user.fullname }, `Welcome to adminDashboard !`));
})

export { registerUser, emailVerify, loginUser, getProfile, refreshToken, logoutUser, adminDashboard };