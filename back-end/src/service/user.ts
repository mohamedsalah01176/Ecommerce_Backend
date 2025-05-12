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

      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }

      const existUser = await User.findOne({ email }).select(
        "password email verified"
      );

      const existUser = await User.findOne({ email });
      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }

      const result = await hashpass.hashValidation(
        password,
        existUser.password
      );
      if (!result) {
        return {
          status: "fail",
          message: "Invalid credentials",
        };
      }

      const token = jwt.sign(
        {
          userID: existUser._id,
          userName: existUser.username,
          email: existUser.email,
          role: existUser.role,
          verified: existUser.verified,
        },
        process.env.TOKEN_SECRET as string,
        { expiresIn: "1h" }
      );
      console.log(process.env.TOKEN_SECRET);
      return {
        status: "success",
        message: "Login successful",
        token: token,
        userID: existUser._id,
      };
    } catch (err) {
      console.error("SignIn Error:", err);
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }

  async signout(): Promise<{ message: string }> {
    return { message: "Successfully signed out" };
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
  async verfiycode(email: string, providedCode: string) {
    try {
      const { error, value } = schemas.acceptCodeSchema.validate({
        email,
        providedCode,
      });
      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }
      const codeValue = providedCode.toString();
      const existUser = await User.findOne({ email }).select(
        "+verificationCodeValidation +verificationCode"
      );
      if (!existUser) {
        return {
          status: "fail",
          message: "user does not exist!",
        };
      }
      if (existUser.verified) {
        return {
          status: "fail",
          message: "You are already verified!",
        };
      }
      if (
        !existUser.verificationCode ||
        !existUser.verificationCodeValidation
      ) {
        return {
          status: "fail",
          message: "something is wrong with code!",
        };
      }
      if (Date.now() - existUser.verificationCodeValidation > 5 * 60 * 1000) {
        return {
          status: "fail",
          message: "Code has expired!",
        };
      }
      const hashedCodevalue = await myHash.hmacProcess(
        codeValue,
        process.env.VERIFICATION_CODE_SECRET as string
      );
      if (hashedCodevalue !== existUser.verificationCode) {
        return {
          status: "fail",
          message: "Invalid verification code",
        };
      }
      if (hashedCodevalue === existUser.verificationCode) {
        existUser.verified = true;
        existUser.verificationCode = undefined;
        existUser.verificationCodeValidation = undefined;
        await existUser.save();
        return {
          status: "success",
          message: "Verification successful",
        };
      }
      return {
        status: "fail",
        message: "Invalid verification code",
      };
    } catch (error) {
      console.log("verification error: ", error);
    }
  }
  async changePassword(user: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const { email, oldPassword, newPassword } = user;

    try {
      const { error } = schemas.changePasswordSchema.validate({
        email,
        oldPassword,
        newPassword,
      });

      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }

      const existUser = await User.findOne({ email }).select("password");
      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }

      const isValidPassword = await hashpass.hashValidation(
        oldPassword,
        existUser.password
      );
      if (!isValidPassword) {
        return {
          status: "fail",
          message: "Current password is incorrect",
        };
      }

      const hashedNewPassword = await hashpass.hashPassword(newPassword, 10);
      existUser.password = hashedNewPassword;
      await existUser.save();

      return {
        status: "success",
        message: "Password changed successfully",
      };
    } catch (err) {
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }
  async forgetPassword(user: IUser) {
    console.log(user);

    try {
      const existUser = await User.findOne({ email: user });
      console.log("Found user:", existUser);

      if (!existUser) {
        return {
          status: "fail",
          message: "User does not exist",
        };
      }
      const verificationCodevalue = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const info = await transport.sendMail({
        from: process.env.SEND_EMAIL_ADDRESS,
        to: existUser.email,
        subject: "forget password Code ",
        html: `<h1>${verificationCodevalue}</h1>`,
      });
      const secret = process.env.VERIFICATION_CODE_SECRET;
      if (info.accepted[0] === existUser.email) {
        const hashedCodevalue = await myHash.hmacProcess(
          verificationCodevalue,
          secret as string
        );

        existUser.forgetPasswordCode = hashedCodevalue;
        existUser.forgetPasswordCodeValidation = Date.now() + 10 * 60 * 1000;
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

  /**
   * Verifies the provided code for password reset and updates the password if valid.
   *
   * @param providedCode - The verification code provided by the user for password reset
   * @param newPassword - The new password to be set after successful verification
   *
   * @returns A response object with status and message
   * - Success: {status: "success", message: "Verification successful"}
   * - Validation Failure: {status: "fail", message: [validation error message]}
   * - Code Mismatch: {status: "fail", message: "Invalid verification code"}
   * - User Not Found: {status: "fail", message: "user does not exist!"}
   * - Code Issues: {status: "fail", message: "something is wrong with code!"}
   * - Expired Code: {status: "fail", message: "Code has expired!"}
   * - Server Error: {status: "error", message: "Internal server error"}
   *
   * @throws May throw errors during database operations or hashing
   *
   * Process:
   * 1. Validates input using acceptForgetPasswordCodeSchema
   * 2. Hashes the provided code using HMAC
   * 3. Finds user with matching hashed code
   * 4. Verifies code validity and expiration (5 minutes)
   * 5. Updates password and clears verification data if successful
   */
  async verifyForgetPassword(providedCode: string, newPassword: string) {
    try {
      const { error } = schemas.acceptForgetPasswordCodeSchema.validate({
        providedCode,
        newPassword,
      });
      if (error) {
        return {
          status: "fail",
          message: error.details[0].message,
        };
      }
      const codeValue = providedCode.toString();
      const hashedCodevalue = await myHash.hmacProcess(
        codeValue,
        process.env.VERIFICATION_CODE_SECRET as string
      );
      const existUser = await User.findOne({
        forgetPasswordCode: hashedCodevalue,
      }).select("+forgetPasswordCodeValidation +forgetPasswordCode");
      if (!existUser) {
        return {
          status: "fail",
          message: "user does not exist!",
        };
      }
      if (
        !existUser.forgetPasswordCode ||
        !existUser.forgetPasswordCodeValidation
      ) {
        return {
          status: "fail",
          message: "something is wrong with code!",
        };
      }
      if (Date.now() - existUser.forgetPasswordCodeValidation > 5 * 60 * 1000) {
        return {
          status: "fail",
          message: "Code has expired!",
        };
      }

      if (hashedCodevalue !== existUser.forgetPasswordCode) {
        return {
          status: "fail",
          message: "Invalid verification code",
        };
      }
      if (hashedCodevalue === existUser.forgetPasswordCode) {
        existUser.verified = true;
        existUser.password = await hashpass.hashPassword(newPassword, 10);

        existUser.forgetPasswordCode = undefined;
        existUser.forgetPasswordCodeValidation = undefined;
        await existUser.save();
        return {
          status: "success",
          message: "Verification successful",
        };
      }
      return {
        status: "fail",
        message: "Invalid verification code",
      };
    } catch (error) {
      console.log("verification error: ", error);
      return {
        status: "error",
        message: "Internal server error",
      };
    }
  }
}
