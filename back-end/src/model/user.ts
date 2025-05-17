import { IUser } from "../interface/user";
import mongoose, { Schema, Types } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: false },
    verificationCodeValidation: { type: Number, default: false },
    forgetPasswordCode: { type: String, default: false },
    forgetPasswordCodeValidation: { type: Number, default: false },
    avatar: { type: String, default: "profile.png" },
    wishlist: [
      {
        type: Types.ObjectId,
        ref: "product",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("users", UserSchema);

export default UserModel;
