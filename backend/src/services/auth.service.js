import { ApiError } from "../utils/utils.index.js";
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
};

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