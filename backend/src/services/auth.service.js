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
