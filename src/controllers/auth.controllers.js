import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail } from "../utils/mail.js";
import { ApiError } from "../utils/api-error.js";
import crypto from "crypto"; // for token hashing
import { emailVerficationMailgenContent } from "../utils/mailgen-templates.js"; // <-- make sure you have this

// Generate Access & Refresh Tokens
const generateAccessRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }; // must return
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  // create new user
  const user = await User.create({
    username,
    email,
    password,
    role,
    isEmailVerified: false,
  });

  // generate email verification token
  const unhashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });
  
  // send email
  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    mailgenContent: emailVerficationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
    ),
  });

  // return response that the user is created without leaking any important information 
  const createdUser = await User.findById(user._id).select(
    "-password -emailVerificationToken -emailVerificationTokenExpiry -refreshToken"
  );
   
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: createdUser },
      "User registered successfully. A verification email has been sent to your inbox."
    )
  );
});

export { registerUser };
