import { IOrder } from "../interface/order";
import OrderModel from "../model/order";
import ProductModel from "../model/product";


export default class OrderService{
    constructor(){}

    async handleCreateOrder(body:IOrder[]){
        let adminsId:string[]=[];
        let total:number=0;
        let products:{}[]=[]
        let userId:string="";
        let order_details!:{};
        try{
            for(let j=0;j<body.length;j++){
                for(let i=0;i<body[j].products.length;i++){
                    await ProductModel.updateOne({_id:body[j].products[i]._id},{$inc:{sold:1}});
                    const adminId = body[j].products[i].adminId;
                    if (typeof adminId === 'string' && !adminsId.includes(adminId)) {
                        adminsId.push(adminId);
                    }
                    total+=body[j].products[i].price * Number(body[j].products[i].quantity)
                    products.push(body[j].products[i])
                }
                userId=body[j].userId;
                order_details=body[j].order_details
            }
            let body2={order_details,userId,products};
            console.log(body2)
            const newOrder=new OrderModel({...body2,adminsId,total});
            await newOrder.save()
            console.log(adminsId)


            return{
                status:"success",
                message:"Order Created"
            }
        }catch(errors){
            console.log(errors)
            return {
                status:"error",
                errors
            }
        }
    }
    async handlegetOrdersForUser(userId:string){
        try{
            console.log(userId)
            let orders=await OrderModel.find({userId:userId})
            return{
                status:"success",
                orders
            }
        }
        catch(errors){
            return{
                status:"error",
                errors
            }
        }
    }
    async handleDeleteOrder(orderId:string){
        try{
            console.log(orderId)
            let orders=await OrderModel.deleteOne({_id:orderId})
            return{
                status:"success",
                message:"order deleted"
            }
        }
        catch(errors){
            return{
                status:"error",
                errors
            }
        }
    }

}