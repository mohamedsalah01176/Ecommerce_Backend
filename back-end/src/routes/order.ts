import { Router } from "express";
import OrderService from "../service/order";
import OrderControler from "../control/order";

const router = Router();

const orderService = new OrderService();
const orderControler = new OrderControler(orderService);

router.post("/order",(req,res)=>orderControler.createOrder(req,res))
router.get("/order/:userId",(req,res)=>orderControler.getOrdersForUser(req,res))
router.delete("/orders/delete/:userId",(req,res)=>orderControler.deleteAllOrders(req,res))
router.delete("/order/delete/:orderId",(req,res)=>orderControler.deleteSpecificOrder(req,res))










export default router;
