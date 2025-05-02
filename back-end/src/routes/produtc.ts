import Router from 'express';
import ProductService from '../service/product';
import ProductControl from '../control/product';
// const {checkRole}=require("../middleware/auth")

let router =Router();

let productService=new ProductService();
let productControl=new ProductControl(productService);


router.get('/products',(req,res)=>productControl.getAllProduct(req,res))
router.get('/product/:id',(req,res)=>productControl.getSpecificProduct(req,res))
router.post('/product',(req,res)=>productControl.addProduct(req,res))
router.patch('/product/:id',(req,res)=>productControl.updateProduct(req,res))
router.delete('/product/:id',(req,res)=>productControl.deleteProduct(req,res))
// router.delete('/product/:id',checkRole,(req,res)=>productControl.deleteProduct(req,res))
















export default router;