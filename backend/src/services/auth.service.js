import { ApiError } from "../utils/utils.index.js";
import jwt from 'jsonwebtoken';
import User from "../model/user.model.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const generateEmailVerificationToken = () => {

  // Hash the Token
  const plainToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return {
    plainToken,
    hashedToken,
    expiresAt
  };
}

export const generateAccessTokenandRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError( 500, "somthing went wrong while generating access token and refresh token");
  }
}

export const register = async({ fullname, email, password, role }) => {

  // Check if user already exists
  const userExists = await User.findOne({email});
  if(userExists) {
    throw new ApiError(409, "Email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10 );

  // Generate verification token
  const { plainToken, hashedToken, expiresAt } = generateEmailVerificationToken();

  // Create a new user object
  const newUser = await User.create({
    fullname,
    email,
    password: hashedPassword,
    role: role || 'user',
    verificationToken: hashedToken,
    verificationTokenExpires: expiresAt
  })

  const verificationLink = `${process.env.VERIFYLINK}/${plainToken}`;
  const message = `Please verify your email by clicking the following link: ${verificationLink}`;
  
  await sendEmail({
    to: newUser.email,
    subject: "Verify your email",
    text: message,
    verificationLink
  });

  return newUser;
}

export const verifyEmail = async (token) => {

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

}

export const login = async({ email, password }) => {

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
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if(!isPasswordCorrect) throw new ApiError(401, "WRONG PASSWORD");

  //jwt generation
  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user);
  
  return { 
    user: 
    { 
      _id: user._id,
      email: user.email, 
      fullname: user.fullname, 
      role: user.role 
    }, 
    accessToken, refreshToken 
  };
}

export const updateProfile = async({ userId, fullname }) => {

  const update = {};

  if(fullname) update.fullname = fullname;
    // if (avatar) update.avatar = avatar;
    // if (phone) update.phone = phone;
    // if (bio) update.bio = bio;
  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  
  if(!user){
    throw new ApiError(400, "Not exist");
  }

  return { 
    user: 
    { 
      _id: user._id,
      email: user.email, 
      fullname: user.fullname, 
      role: user.role 
    }
  };
}

export const logout = async (userId) => {

  // Clear the refresh token from the user's record in the database
  await User.findByIdAndUpdate(userId, {
    refreshToken: null
  });
  
}

export const refreshUserSession = async (token) => {

  if (!token) {
    throw new ApiError(401, "NO REFRESH TOKEN PROVIDED");
  }

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

  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user);

  return { accessToken, refreshToken };
}

export const forgetPasswordUser = async ({ email }) => {

  // Generate verification token
  const { plainToken, hashedToken, expiresAt } = generateEmailVerificationToken();

  const user = await User.findOne({ email });

  if(!user) {
    throw new ApiError(404, "If account exists, reset email sent");
  }

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiresAt;

  await user.save();

  const resetUrl = `http://localhost:3000/api/users/reset-password/${plainToken}`;
  const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

  await sendEmail({
    to : user.email,
    subject : "Password Reset Request",
    text : message
  })
}

export const verifyResetPassword = async ({ token, newPassword }) => {

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
}

export const forgotPasswordOtpService = async ({ email }) => {

  //generate 6 digit otp
  const OTP = crypto.randomInt(100000, 999999).toString();

  const user = await User.findOne({ email })

  if(!user) {
    throw new ApiError(200, "If account exists, reset email sent");
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

}

export const resetPasswordOtpService = async ({ email, otp, newPassword }) => {

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
}
