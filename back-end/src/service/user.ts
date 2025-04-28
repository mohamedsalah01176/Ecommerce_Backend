import  UserModel  from "../model/user";

export default class UserService{
    constructor(){}

    async handleGetData(){
        try{
            let users=await UserModel.find({})
            return {
                status:"success",
                data:users
            }
        }
        catch(err){
            return {
                status:"fail",
                data:err
            }
        }
    }
}