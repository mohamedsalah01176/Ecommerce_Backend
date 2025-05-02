import { required } from "joi";
import mongoose from "mongoose";

let schema=new mongoose.Schema({
  title: {
    type: String,
    minlength: [2, "Title must be at least 2 characters."],
    required:true
  },
  slug: {
    type: String
  },
  description: {
    type: String,
    required:true,
  },
  quantity: {
    type: Number,
    min: [0, "Quantity cannot be negative."],
    required:true
  },
  price: {
    type: Number,
    min: [0, "Price must be a positive number."],
    required:true
  },
  imageCover: {
    type: String
  },
  images: {
    type: [String]
  },
  category: {
    type: Object
  },
  brand: {
    type: Object
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, "Rating must be at least 0."],
    max: [5, "Rating cannot exceed 5."]
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  adminId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  isWachList:{
    type:Boolean,
    required:true,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});




let ProductModel=mongoose.model('product',schema);

export default ProductModel;