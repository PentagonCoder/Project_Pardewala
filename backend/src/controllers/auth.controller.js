import {asyncHandler} from '../utils/asyncHandler.js'
import User from '../model/user.model.js';
import crypto from "crypto";
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import { request } from 'http';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const forgotPassword = asyncHandler ( async(req, res, ) => {
  
  await 
  res.status(200).json(new ApiResponse(200, "If account exists, reset email sent"));
})

const resetPassword = asyncHandler ( async(req, res) => {
  // reset token from URL params
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash the token from the URL to compare with the hashed token in the database
  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  // Find the user with the matching reset token and check if it's not expired
  const user = await User.findOne({
   passwordResetToken: hashedToken,
   passwordResetExpires: { $gt: Date.now() }
  });

  // If no user is found, the token is invalid or expired
  if(!user) {
    throw new ApiError(400, "INVALID OR EXPIRED RESET TOKEN");
  }

  // Hash the new password and update the user's password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  // Clear the reset token and expiration time
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save();

  res.status(200).json(new ApiResponse(200, "PASSWORD RESET SUCCESSFUL"));

});

const forgotPasswordOtp = asyncHandler ( async(req, res, next) => {

  const { email } = req.body;
  
  //generate 6 digit otp
  const OTP = crypto.randomInt(100000, 999999).toString();

  const user = await User.findOne({ email })

  if(!user) {
    throw new ApiResponse(200, "If account exists, reset email sent");
  }
  
  const hashedOTP = crypto
  .createHash("sha256")
  .update(OTP)
  .digest("hex");

  user.otp = hashedOTP;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save()

  const message = `Your OTP for password reset is: ${OTP}`;

  await sendEmail({
    to : user.email,
    subject : "Password Reset OTP",
    text : message
  })

  
  res.status(200).json(new ApiResponse(200, "OTP SENT TO YOUR EMAIL"));
})

const resetPasswordOtp = asyncHandler( async(req, res) => {
  const { email, otp, newPassword } = req.body;

  if(!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP and new password are required");
  }

  // Find the user by email
  const user = await User.findOne({email});

  if(!user) {
    throw new ApiError(404, "Invalid request");
  }

  // Check if user exists, OTP is correct and not expired
  if(Date.now() > user.otpExpiry){
    throw new ApiError(400, "OTP Expire");
  }

  // hash the received OTP 
  const hashedOtpRecive = crypto
  .createHash("sha256")
  .update(otp)
  .digest("hex");

  // compare hashed received OTP with stored hashed OTP
  if(hashedOtpRecive !== user.otp){
    throw new ApiError(400, "OTP WRONG");
  }
  
  // Hash the new password and update the user's password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  user.otp = null
  user.otpExpiry = null
  await user.save()

  res.status(200).json(new ApiResponse(200, "PASSWORD RESET SUCCESSFUL"));
})



export { forgotPassword, resetPassword, forgotPasswordOtp, resetPasswordOtp };