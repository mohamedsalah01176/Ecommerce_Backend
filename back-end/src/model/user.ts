import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, pattern: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: false },
    verificationCodeValidation: { type: Number, default: false },
    forgetPasswordCode: { type: String, default: false },
    forgetPasswordCodeValidation: { type: Number, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("users", UserSchema);

export default UserModel;
