import { Router, Request, Response } from "express";
import verifyToken from "../middleware/verifyToken";
import { getAdminProducts } from "../control/dashboard";

const router = Router();

router.route("/dashboard").get(verifyToken, getAdminProducts);

export default router;
