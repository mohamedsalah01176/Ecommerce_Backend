import mongoose from 'mongoose'

let schma=new mongoose.Schema({

});


let UserModel=mongoose.model('user',schma);

export default UserModel;