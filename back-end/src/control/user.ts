import UserService from "../service/user";
import { Response, Request } from "express";
export default class UserControl {
  constructor(private userService: UserService) {}

  async signUp(req: Request, res: Response) {
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
  //   async postData(req: Request, res: Response) {
  //     try {
  //       const result = await this.userService.handleGetAllUser();
  //       const statusCode = result.status === "fail" ? 400 : 201;
  //       res.status(statusCode).json(result);
  //     } catch (error) {
  //       console.error("Unexpected error:", error);
  //       res
  //         .status(500)
  //         .json({ status: "error", message: "Internal server error" });
  //     }
  //   }
}
