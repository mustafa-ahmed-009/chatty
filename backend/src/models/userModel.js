import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String, 
            required: true
        },
        password: {
            type: String, 
            required: true, 
            minlength :6 ,
        },
        profilePic: {
            type: String, 
            default :""
        } , 
        newUserVerified: Boolean,
        newUserVerificaitonCodeExpires : Date , 
        newRegistrationCode: String,
    }, {
        timestamps:true ,
    }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
export const User = mongoose.model("User", userSchema)
 