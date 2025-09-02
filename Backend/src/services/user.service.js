import UserModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPtoEmail } from "../utils/mailer.js";
import { genereateTokens, verifyOTP } from "../utils/helper.js";



export const userRegisterService = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Email and Password are required!");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exist!");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = new UserModel({
    email,
    password: hashedPassword,
    otp,
    otpExpires,
  });

  await newUser.save();

  await sendOTPtoEmail(email, otp);

  return { message: "Registration Successful" };
};

export const userLoginService = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("User Not Found!");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid Credential!");
    error.statusCode = 400;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error("Please verify your email!");
    error.statusCode = 400;
    throw error;
  }

  const { accesstoken, refreshtoken, refreshtokenExpires } = genereateTokens(
    user?._id
  );

  user.refreshtokens.push({
    token: refreshtoken,
    expiresAt: refreshtokenExpires,
  });

  await user.save();

  return {
    accesstoken,
    refreshtoken,
    message: "user logged in successfully!",
  };
};

export const userVerifyService = async (email, otp) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("User Not Found!");
    error.statusCode = 400;
    throw error;
  }

  if (!verifyOTP(otp, user)) {
    const error = new Error("Invalid or OTP Expired");
    error.statusCode = 400;
    throw error;
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;

  const { accesstoken, refreshtoken, refreshtokenExpires } = genereateTokens(
    user?._id
  );

  user.refreshtokens.push({
    token: refreshtoken,
    expiresAt: refreshtokenExpires,
  });

  await user.save();

  return {
    accesstoken,
    refreshtoken,
    message: "user verified successfully!",
  };
};

export const userLogoutService = async (user, refreshtoken) => {
  user.refreshtokens = user.refreshtokens.filter(
    (t) => t.token !== refreshtoken
  );

  await user.save();

  return { message: "Logged Out Successfully!" };
};

export const refreshAccessTokenService = async (refreshtoken) => {
  if (!refreshtoken) {
    const error = new Error("Refresh Error");
    error.statusCode = 400;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshtoken, process.env.JWT_SECRET);
  } catch (error) {
    const err = new Error("Invalid Token");
    err.statusCode = 400;
    throw err;
  }

  const user = await UserModel.findOne({
    _id: decoded.userId,
    "refreshtokens.token": refreshtoken,
    "refreshtokens.expiresAt": { $gt: new Date() },
  });

  if (!user) {
    const error = new Error("Refresh Expired");
    error.statusCode = 400;
    throw error;
  }

  const { accesstoken } = genereateTokens(user?._id);

  return { accesstoken };
};
