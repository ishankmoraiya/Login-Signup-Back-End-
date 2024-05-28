const User = require("../model/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/config.env" });

const sendData = async (res, statusCode, user, message) => {
  const token = await user.getToken();
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    user,
    token,
    message,
  });
};

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, dob } = req.body;

  if (password.length < 8) {
    return next(new ErrorHandler("Password must be atleast 8 characters", 400));
  }

  const user_exist = await User.findOne({ email: email.toLowerCase() });

  if (user_exist) {
    return next(new ErrorHandler(`Email already exists`, 400));
  }

  let user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    dob,
  });

  sendData(res, 201, user, "User Registered Successfully");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password!", 401));

  sendData(res, 200, user, "User Logged In Successfully");
});
