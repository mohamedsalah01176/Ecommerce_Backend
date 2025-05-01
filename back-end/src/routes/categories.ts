import { Router } from "express";
import CategoriesService from "../service/category";
import CategoriesControl from "../control/category";


let router=Router();
let categoriesService=new CategoriesService();
let categoriesControl=new CategoriesControl(categoriesService);
router.get('/categories',(req,res)=>categoriesControl.getAllService(req,res))
router.get('/categories/:id',(req,res)=>categoriesControl.getSpecificCategory(req,res))







export default router

