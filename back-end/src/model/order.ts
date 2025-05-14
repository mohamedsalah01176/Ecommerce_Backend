import { IOrder } from '../interface/order';
import { IProduct } from './../interface/product';
import mongoose from "mongoose";

const schema=new mongoose.Schema({
    order_details:{
        type:Object,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        required:true
    },
    adminsId:{
        type:Array,
        required:true
    },
    total:{
        type:Number,
        required:true
    }
})

const OrderModel=mongoose.model<IOrder>("order",schema);


export default OrderModel;