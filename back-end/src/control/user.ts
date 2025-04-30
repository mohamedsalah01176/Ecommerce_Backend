import UserService from "../service/user";
import { Response, Request, NextFunction } from "express";
export default class UserControl {
  constructor(private userService: UserService) {}

  async signUpController(req: Request, res: Response) {
    try {
      const result = await this.userService.signUp(req.body);
      const statusCode = result.status === "fail" ? 400 : 200;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  async loginController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.userService.signIn(req.body);

      if (result.status === "success" && result.token) {
        res.cookie("auth_token", result.token, {
          sameSite: "strict",
          maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
          status: "success",
          message: result.message,
        });
      } else {
        res.status(401).json({
          status: result.status,
          message: result.message,
        });
      }
    } catch (err) {
      console.error("Error during login:", err);
      next(err);
    }
  }
  async logOutController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.userService.signout(req.body);
      res.clearCookie("auth_token", {
        sameSite: "strict",
        maxAge: 3600000,
      });
      res.status(200).json({
        status: "success",
        message: result,
      });
    } catch (err) {
      console.error("Error during logout:", err);
      next(err);
    }
  }
}
