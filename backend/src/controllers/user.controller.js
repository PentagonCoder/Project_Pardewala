import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken';
import { ApiResponse, ApiError, cookieOptions } from '../utils/utils.index.js';
import { register, login, logout, refreshUserSession, verifyEmail } from '../services/auth.service.js';


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

  await verifyEmail(req.params.token);

  res.status(201).json(new ApiResponse(201, "Email verified successfully"));
  
})

const loginUser = asyncHandler(async (req, res ) =>{

  const { user, accessToken, refreshToken } = await login(req.body);

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

  return res
  .status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(new ApiResponse(200, "AccessToken generated successfully"));
})

const getProfile = asyncHandler( async(req, res) => {
  res
  .status(200)
  .json(new ApiResponse(200, { _id: req.user._id, email: req.user.email, fullname: req.user.fullname, role: req.user.role }, "Welcome to your profile"));
})

const adminDashboard = asyncHandler( async(req, res) => {
  res.status(200).json(new ApiResponse(200, { _id: req.user._id, fullname: req.user.fullname }, `Welcome to adminDashboard !`));
})

export { registerUser, emailVerify, loginUser, getProfile, refreshToken, logoutUser, adminDashboard };