export interface IUser {
  username: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "admin";
  verified: boolean;
  verificationCode: string | undefined;
  verificationCodeValidation: number | undefined;
  forgetPasswordCode: string;
  forgetPasswordCodeValidation: number;
}
