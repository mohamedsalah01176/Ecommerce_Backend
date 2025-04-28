import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user';


const app=express();


// cofigration
dotenv.config();


// Meddileware
app.use('/',userRouter)











const PORT=process.env.PORT;
const MONGOURL=process.env.MONGOURL;

mongoose.connect(MONGOURL as string).then(()=>{
    console.log('mongodb Connected')
})


app.listen(PORT,()=>{
console.log(`http://localhost:${PORT}`)
})