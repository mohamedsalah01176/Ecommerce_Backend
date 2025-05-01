import { IUser } from "../interface/user";
import signUpSchema from "../middleware/validator";
import User from "../model/user";
import bcrypt from "bcrypt";

import schemas from "../middleware/validator";
import jwt from "jsonwebtoken";

import myHash from "../utils/hash";
import hashpass from "../utils/hash";
import transport from "../middleware/sendemail";

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
  async sendVerificationCode(user: IUser) {
    const { email } = user;
    try {
      const existUser = await User.findOne({ email });
      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }

      if (existUser.verified) {
        return {
          status: "fail",
          message: "You are already verified!",
        };
      }

      const verificationCodevalue = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const info = await transport.sendMail({
        from: process.env.SEND_EMAIL_ADDRESS,
        to: existUser.email,
        subject: "Verification Code",
        html: `<h1>${verificationCodevalue}</h1>`,
      });
      const secret = process.env.VERIFICATION_CODE_SECRET;
      if (info.accepted[0] === existUser.email) {
        const hashedCodevalue = await myHash.hmacProcess(
          verificationCodevalue,
          secret as string
        );

        existUser.verificationCode = hashedCodevalue;
        existUser.verificationCodeValidation = Date.now() + 10 * 60 * 1000;
        await existUser.save();

        return {
          status: "success",
          message: "Verification code sent",
        };
      }

      return {
        status: "fail",
        message: "Verification code not sent",
      };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }
}
