import jwt  from 'jsonwebtoken';
import { IProduct } from "../interface/product";
import ProductModel from "../model/product";

export default class ProductService{
    
    constructor(){}
    async handleGetAllProducts(){
        try{
            let products = await ProductModel.find({});
            return{
                status:"succes",
                products
            }
        }
        catch(errors){
            return{
                status:"fail",
                errors
            }
            
        }
    }
    async handleGetSpecificProduct(id:string){
        try{
            let product = await ProductModel.find({_id:id});
            if(product.length>0){
                return{
                    status:"succes",
                    product
                }
            }else{
                return{
                    status:"fail",
                    message:"product not found"
                }
            }
        }
        catch(errors){
            return{
                status:"error",
                errors
            }
            
        }
    }
    async handleAddProduct(body:IProduct,token:string){
        try{
            let user:any=  jwt.verify(token,process.env.TOKEN_SECRET as string)
            console.log(user)
            let newProduct=new ProductModel({...body,adminId:user.userID  })
            await newProduct.save();
            return{
                status:"success",
                message:"product Addes"
            }
        }
        catch(err){
            return {
                status:"error",
                message:err
            }
        }
    }
    async handleDeleteProduct(id:string){
        try{
            await ProductModel.deleteOne({_id:id});
            return {
                status:"succes",
                message:'prodect Deleted'
            }
        }
        catch(errors){
            return {
                status:"error",
                message:errors
            }
        }
    }
}