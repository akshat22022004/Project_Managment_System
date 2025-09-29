import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail } from "../utils/mail.js";
import { ApiError } from "../utils/api-error.js";
import crypto from "crypto";
import { emailVerficationMailgenContent } from "../utils/mail.js";

// Generate Access & Refresh Tokens
const generateAccessRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  const user = await User.create({ username, email, password, role, isEmailVerified: false });

  const unhashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    mailgenContent: emailVerficationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -emailVerificationToken -emailVerificationTokenExpiry -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: createdUser },
      "User registered successfully. A verification email has been sent to your inbox."
    )
  );
});

export default {
  registerUser,
  generateAccessRefreshTokens,
};
