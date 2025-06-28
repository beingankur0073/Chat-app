import express from 'express'
import { connectDB } from './utils/features.js';
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io'
import {createServer} from 'http'
import {v4 as uuid} from 'uuid'

import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { createMessages, createSingleChats } from './seeders/chat.js';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS } from './constants/events.js';
import { getSockets } from './lib/helper.js';
import { Message } from './models/message.js';
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import { corsOptions } from './constants/config.js';
import { socketAuthenicator } from './middlewares/auth.js';
import { CHAT_JOINED, CHAT_LEAVED, START_TYPING, STOP_TYPING } from '../client/src/constants/events.js';



dotenv.config({
    path:"./.env"
})

const mongoURI=process.env.MONGO_URI;
const port=process.env.PORT || 3000;
const envMode=process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey=process.env.ADMIN_SECRET_KEY||"adsasdsdfsdfsdfd";




const userSocketIDs=new Map();
const onlineUsers=new Set()

connectDB(mongoURI)

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors:corsOptions
});

app.set("io",io)

//Using Middlwares Here
app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions))



// Seeders
//createSingleChats(10)





app.use("/api/v1/user",userRoute);
app.use("/api/v1/chat",chatRoute);
app.use("/api/v1/admin",adminRoute);

app.get("/",(req,res)=>{
    res.send("Hello World");
})



io.use((socket,next)=>{
    cookieParser()(socket.request,
        socket.request.res,
        async (err)=>await socketAuthenicator(err,socket,next)
)
    
})

io.on("connection",(socket)=>{

    const user=socket.user
    userSocketIDs.set(user._id.toString(),socket.id);
    
    

    const userIdString = user._id.toString();
    if (!onlineUsers.has(userIdString)) { // Avoid re-adding if somehow already there
        onlineUsers.add(userIdString);

        // 3. Broadcast the updated online users list to ALL connected clients
        //    (or at least to users who are friends with this user, etc., depending on your app's privacy)
        //    For simplicity, let's broadcast to all sockets connected to the server.
        //    If you have a large number of users, consider optimizing this by only sending
        //    to users who need this list (e.g., users on the "friends list" page).
        io.emit(ONLINE_USERS, Array.from(onlineUsers)); // Emit to everyone
        console.log(`User ${user.name} added to onlineUsers. Current online: ${onlineUsers.size}`);
    }



    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
        const messageForRealtime={
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name,
            },
            chat:chatId,
            createdAt:new Date().toISOString(),
        }


        const messageForDB={
            content:message,
            sender:user._id,
            chat:chatId,
        }

        // console.log("Emitting",messageForRealtime)
        const membersSocket=getSockets(members)
        
        io.to(membersSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealtime,
        });

        io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})
        try {
            await Message.create(messageForDB);
        } catch (error) {
            console.log(error)
        }
    })

    socket.on(START_TYPING,({members,chatId})=>{
        console.log("typing",chatId)

        const membersSocket=getSockets(members)

        socket.to(membersSocket).emit(START_TYPING,{chatId})

    })

    socket.on(STOP_TYPING,({members,chatId})=>{
        console.log("stop-typing",chatId)

        const membersSocket=getSockets(members)

        socket.to(membersSocket).emit(STOP_TYPING,{chatId})

    })


    socket.on(CHAT_JOINED,({userId,members})=>{
        onlineUsers.add(userId.toString())
        
       if(members) {
        const membersSocket=getSockets(members)
        io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers))
       }
    })

    socket.on(CHAT_LEAVED,({userId,members})=>{
        onlineUsers.delete(userId.toString())

        if(members) {
            const membersSocket=getSockets(members)
            io.to(membersSocket).emit(ONLINE_USERS,Array.from(onlineUsers))
           }
    })

    



    socket.on("disconnect",()=>{
        console.log("user disconnected");
        userSocketIDs.delete(user._id.toString())
        onlineUsers.delete(user._id.toString())
        socket.broadcast.emit(ONLINE_USERS,Array.from(onlineUsers))
    })
})

app.use(errorMiddleware)

server.listen(port,()=>{
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV}Mode`);
})



export {
    envMode,
    adminSecretKey,
    userSocketIDs,
}