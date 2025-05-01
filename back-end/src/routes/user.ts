// router/user.ts or similar

import { Router } from "express";
import UserService from "../service/user";
import UserControl from "../control/user";

const router = Router();

const userService = new UserService();
const userControl = new UserControl(userService);

router.post("/signup", (req, res) => userControl.signUpController(req, res));
router.post("/signin", userControl.loginController.bind(userControl));
router.post("/signout", userControl.logOutController.bind(userControl));
router.patch(
  "/verification-code",
  userControl.sendVerificationCodeController.bind(userControl)
);

export default router;
