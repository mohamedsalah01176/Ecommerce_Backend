import { IUser } from "../interface/user";
import signUpSchema from "../middleware/validator";
import User from "../model/user";
import bcrypt from "bcrypt";

import schemas from "../middleware/validator";
import jwt from "jsonwebtoken";

import myHash from "../utils/hash";
import hashpass from "../utils/hash";
export default class UserService {
  constructor() {}

  async signUp(user: IUser) {
    const { username, email, password, phone, role } = user;

    try {
      const { error, value } = schemas.signUpSchema.validate({
        username,
        email,
        password,
        phone,
        role,
      });

      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }
      const existUser = await User.findOne({ email });

      if (existUser) {
        return {
          status: "fail",
          message: "user is already exist",
        };
      }

      const hashedPAssword = await hashpass.hashPassword(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPAssword,
        phone,
        role,
      });
      const result = await newUser.save();
      const { password: _, ...userWithoutPassword } = result.toObject();

      return {
        status: "your account has been created",
        data: userWithoutPassword,
      };
    } catch (err) {}

    return {
      status: "success",
      message: "User data received",
    };
  }
  async signIn(user: IUser) {
    const { email, password } = user;
    try {
      const { error, value } = schemas.signInSchema.validate({
        email,
        password,
      });
      console.log(value);
      const existUser = await User.findOne({ email }).select("password");
      if (!existUser) {
        return {
          status: "fail",
          message: "user is not Exist",
        };
      }
      console.log(existUser);
      const result = await hashpass.hashValidation(
        password,
        existUser.password
      );
      console.log();
      if (!result) {
        return {
          status: "fail",
          message: "ivalid credential",
        };
      }
      console.log(result);
      const token = jwt.sign(
        {
          userID: existUser._id,
          email: existUser.email,
          verified: existUser.verified,
        },
        process.env.TOKEN_SECRET as string
      );

      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }
      return {
        status: "success",
        message: "Login successful",
        token,
      };
    } catch (err) {
      return {
        status: "error",
        message: "internal server error",
      };
    }
  }
  async signout(user: IUser): Promise<string> {
    return "Successfully signed out";
  }
}
