import Router from 'express';
import ProductService from '../service/product';
import ProductControl from '../control/product';

let router =Router();

let productService=new ProductService();
let productControl=new ProductControl(productService);


router.get('/products',(req,res)=>productControl.getAllProduct(req,res))
router.get('/product/:id',(req,res)=>productControl.getSpecificProduct(req,res))
router.post('/product',(req,res)=>productControl.addProduct(req,res))
router.delete('/product/:id',(req,res)=>productControl.deleteProduct(req,res))
















export default router;