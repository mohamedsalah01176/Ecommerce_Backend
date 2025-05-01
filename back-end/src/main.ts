import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import userRouter from "./routes/user";
import helmet from "helmet";
import cors from "cors";
import authUser from "./routes/user";
import feedbackRouter from "./routes/feedback";
import productRouter from "./routes/produtc";


const app = express();


// cofigration
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Meddileware



app.use("/api/auth", authUser);
app.use("/api", feedbackRouter);
app.use("/api", productRouter);

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

mongoose.connect(MONGOURL as string).then(() => {
  console.log("mongodb Connected");
});
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
