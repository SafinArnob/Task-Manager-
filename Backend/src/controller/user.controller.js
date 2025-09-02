import {
  refreshAccessTokenService,
  userLoginService,
  userLogoutService,
  userRegisterService,
  userVerifyService,
} from "../services/user.service.js";



export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userRegisterService(email, password);
    return res.status(201).json(result);
  } 
  catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something Went Wrong!" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userLoginService(email, password);

    res.cookie("refreshtoken", result.refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accesstoken", result.accesstoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something Went Wrong!" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await userVerifyService(email, otp);

    res.cookie("refreshtoken", result.refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accesstoken", result.accesstoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(result);
  } 
  catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something Went Wrong!" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshtoken } = req.body;
    const result = await refreshAccessTokenService(refreshtoken);
    return res.status(200).json(result);
  } 
  catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something Went Wrong!" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshtoken } = req.body;
    console.log(refreshtoken, req.user);

    const result = await userLogoutService(req.user, refreshtoken);
    console.log(result, "RESULT");
    
    return res.status(200).json(result);
  } 
  catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something Went Wrong!" });
  }
};
