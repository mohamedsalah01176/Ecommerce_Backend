export interface IUser {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "admin";
  verified: boolean;
  verificationCode: string;
  verificationCodeValidation: number;
  forgetPasswordCode: string;
  forgetPasswordCodeValidation: number;
}
