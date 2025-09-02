import jwt from "jsonwebtoken";
import UserModel from "../model/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const accesstoken = req.header("accesstoken");

    if (!accesstoken) {
      const error = new Error("Authorization Error!");
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.verify(accesstoken, process.env.JWT_SECRET);
    const user = await UserModel.findById({ _id: decoded.userId });

    if (!user) {
      const error = new Error("User Authorization Error!");
      error.statusCode = 400;
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Please Verify Your Email");
      error.statusCode = 400;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    const err = new Error("Something Went Wrong!");
    err.statusCode = 400;
    throw err;
  }
};
