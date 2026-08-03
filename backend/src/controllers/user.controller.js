import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken';
import { ApiResponse, ApiError, cookieOptions } from '../utils/utils.index.js';
import crypto from "crypto";
import { 
  register, 
  login,
  updateProfile,
  logout, 
  refreshUserSession, 
  verifyEmail, 
  forgetPasswordUser, 
  verifyResetPassword 
} from '../services/auth.service.js';


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

const getUpdateProfile = asyncHandler( async(req, res) => {

  const updatedUser = await updateProfile({ userId: req.user._id, fullname: req.body.fullname });

  res
  .status(200)
  .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
})

const adminDashboard = asyncHandler( async(req, res) => {
  res.status(200).json(new ApiResponse(200, { _id: req.user._id, fullname: req.user.fullname }, `Welcome to adminDashboard !`));
})

const forgotPassword = asyncHandler ( async(req, res, ) => {

  await forgetPasswordUser(req.body);
  
  res.status(200).json(new ApiResponse(200, "If account exists, reset email sent"));
})

const resetPassword = asyncHandler ( async(req, res) => {
  // reset token from URL params
  const { token } = req.params;
  const { newPassword } = req.body;

  await verifyResetPassword({ token, newPassword });

  res.status(200).json(new ApiResponse(200, "PASSWORD RESET SUCCESSFUL"));

});

const forgotPasswordOtp = asyncHandler ( async(req, res, next) => {

  const { email } = req.body;
  
  await forgotPasswordOtpService({ email });
  
  res.status(200).json(new ApiResponse(200, "OTP SENT TO YOUR EMAIL"));
})

const resetPasswordOtp = asyncHandler( async(req, res) => {

  await resetPasswordOtpService(req.body);
  
  res.status(200).json(new ApiResponse(200, "PASSWORD RESET SUCCESSFUL"));
})

export { registerUser, emailVerify, loginUser, getProfile, getUpdateProfile, refreshToken, logoutUser, adminDashboard, forgotPassword, resetPassword, forgotPasswordOtp, resetPasswordOtp };