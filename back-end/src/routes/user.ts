import Router from 'express';
import UserService from '../service/user';
import UserControl from '../control/user';


let router=Router();

let userService=new UserService();
let userControl= new UserControl(userService);


router.get('/',(req,res)=>userControl.getData(req,res))


export default router