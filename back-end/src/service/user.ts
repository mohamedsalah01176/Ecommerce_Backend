import { IUser } from "../interface/user";
import signUpSchema from "../middleware/validator";
import User from "../model/user";
import bcrypt from "bcrypt";
import hashPassword from "../utils/hash";
import schemas from "../middleware/validator";
import jwt from "jsonwebtoken";

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
      console.log(existUser?.username);
      if (existUser) {
        return {
          status: "fail",
          message: "user is already exist",
        };
      }

      const hashedPAssword = await hashPassword(password, 10);

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
  async signIn(
    user: IUser
  ): Promise<{ status: string; message: string; token?: string }> {
    const { email, password } = user;
    try {
      const { error, value } = schemas.signInSchema.validate({
        email,
        password,
      });
      const existUser = await User.findOne({ email }).select("password");
      if (!existUser) {
        return {
          status: "sucess",
          message: "user is not Exist",
        };
      }
      const result = await hashPassword(password, existUser.password);

      if (!result) {
        return {
          status: "fail",
          message: "ivalid credential",
        };
      }

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
        token, // return token to the controller
      };
    } catch (err) {
      return {
        status: "error",
        message: "internal server error",
      };
    }
  }
}
