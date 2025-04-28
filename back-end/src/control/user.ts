import UserService from "../service/user";
import {Response,Request} from 'express'

export default class UserControl{
    constructor(private userService:UserService){}

    async getData(req:Request,res:Response){
        let resServer=await this.userService.handleGetData();
        if(resServer.status === 'fail'){
            res.status(400).send(resServer)
        }else{
            res.status(200).send(resServer)
        }
    }
}