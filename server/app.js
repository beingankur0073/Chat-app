import express from 'express'
import { connectDB } from './utils/features.js';
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';

import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { createMessages, createSingleChats } from './seeders/chat.js';



dotenv.config({
    path:"./.env"
})

const mongoURI=process.env.MONGO_URI;
const port=process.env.PORT || 3000;
export const adminSecretKey=process.env.ADMIN_SECRET_KEY||"adsasdsdfsdfsdfd";

const app=express();
//Using Middlwares Here
app.use(express.json());
app.use(cookieParser());


connectDB(mongoURI)

// Seeders
//createSingleChats(10)





app.use("/user",userRoute);
app.use("/chat",chatRoute);
app.use("/admin",adminRoute);

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use(errorMiddleware)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})