import { Request, Response } from "express";
import OrderService from "../service/order";

export default class OrderControler{
    constructor(private orderService:OrderService){}

    async createOrder(req:Request,res:Response){
        const body=req.body;
        const resSer=await this.orderService.handleCreateOrder(body);
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }
    }
    async getOrdersForUser(req:Request,res:Response){
        const userId:string=req.params.userId;
        const resSer=await this.orderService.handlegetOrdersForUser(userId);
        console.log(resSer)
        if(resSer.status == "success"){
            res.status(200).send(resSer)
        }else{
            res.status(500).send(resSer)
        }

    }
}