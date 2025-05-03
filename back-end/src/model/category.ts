import mongoose  from 'mongoose';
import { ICategory } from '../interface/category';

let schema=new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
})

let CategoryModel=mongoose.model<ICategory>('category',schema);

export default CategoryModel;