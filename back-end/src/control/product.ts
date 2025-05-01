import { Request, Response } from "express";
import ProductService from "../service/product";

export default class ProductControl{
    constructor(private productService:ProductService){}

    async getAllProduct(req:Request,res:Response){
        let resSer=await this.productService.handleGetAllProducts()
        if(resSer.status === 'fail'){
            res.status(500).json(resSer)
        }else{
            res.status(200).json(resSer)
        }
    }
    async getSpecificProduct(req:Request,res:Response){
        let id=req.params.id;
        let resSer=await this.productService.handleGetSpecificProduct(id);
        if(resSer.status === 'fail'){
            res.status(404).json(resSer)
        }else if(resSer.status== 'error'){
            res.status(500).json(resSer)
        }else{
            res.status(200).json(resSer)
        }
    }
    async addProduct(req:Request,res:Response){
        let body=req.body;
        let token= req.headers['authorization'] as string;
        let resSer=await this.productService.handleAddProduct(body,token);
        if(resSer.status == "error"){
            res.status(500).send(resSer)
        }else{
            res.status(200).send(resSer)
        }
    }
    async deleteProduct(req:Request,res:Response){
        let id=req.params.id;
        let resSer=await this.productService.handleDeleteProduct(id);
        if(resSer.status == "error"){
            res.status(500).send(resSer)
        }else{
            res.status(200).send(resSer)
        }
    }
}