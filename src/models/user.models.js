import mongoose , {Schema} from "mongoose";
import { type } from "os";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema = new Schema(
    {
        avatar: {
            type: {
                url: String,
                localPath: String,

            },
            default: {
                url: `https://placeholder.com/150`,
                localPath: ""
            }
        },
        username: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        fullName: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: [true , "Password is required"], // customized error  if pass is not provided   
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String,

        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpiry:{
            type: Date
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpiry: {
            type: Date
        }
    },{
        timestamps: true
    },
);

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()
   this.password =  await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password) // return true or false
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,   
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,   
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}   

userSchema.methods.generateTemporaryToken = function() {
 const unHashedToken =  crypto.randomBytes(20).toString("hex");



  const hashedToken = crypto
  .creaqteHash("sha256") // algorithm used
  .update(unHashedToken)
  .digest("hex")


  const tokenExpiry = Date.now() + (20 * 60 * 1000) // 20 minutes

  return {unHashedToken , hashedToken , tokenExpiry}
};
export const User = mongoose.model("User" , userSchema)

