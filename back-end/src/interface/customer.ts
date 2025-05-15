import { IProduct } from "./product";

export interface ICustomer{
    products:IProduct[];
    adminsId:string[],
    userId:string,
    order_details:{
        address: string;
        phone: string;
    }
}