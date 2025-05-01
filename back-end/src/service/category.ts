import CategoryModel from "../model/category";

export default class CategoriesService{
    async handleGetAllCategory(){
        try{
            let categories=await CategoryModel.find();
            return{
                status:'success',
                data:categories
            }
        }
        catch(err){
            return{
                status:'fail',
                message:err
            }
        }
    }
    async handleSpecificCategory(id:string){
        try{
            let category=await CategoryModel.find({_id:id});
            return{
                status:'success',
                category
            }
        }
        catch(err){
            return{
                status:'fail',
                message:err
            }
        }
    }
}