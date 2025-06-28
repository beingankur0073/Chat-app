import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken'
import { TryCatch } from "./error.js";
import { CHATTU_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";
import { CHATTU_TOKEN, corsOptions } from "../constants/config.js"

const isAuthticated=TryCatch(async (req,res,next)=>{
    const token=req.cookies[CHATTU_TOKEN];
    if(!token) return next(new ErrorHandler("Please login to access this route",401));
    

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decodedData._id;

    next();
})


const adminOnly=(req,res,next)=>{
    const token=req.cookies["chattu-admin-token"];
    if(!token) return next(new ErrorHandler("Only Admin can access this route",401));

    

    
    const secretKey=jwt.verify(token,process.env.JWT_SECRET);
    const isMatched=secretKey===adminSecretKey
    if(!isMatched) return next(new ErrorHandler("Only Admin can access this route",401))

    

    next();
}

const socketAuthenicator = async (err, socket, next) => {
    try {
        if (err) {
            console.error("Socket.IO Auth Error from CookieParser:", err); // Log the initial cookie parsing error
            // Ensure CORS headers are set on the response before sending an error
            if (socket.request.res && !socket.request.res.headersSent) {
                socket.request.res.header('Access-Control-Allow-Origin', corsOptions.origin[0]);
                socket.request.res.header('Access-Control-Allow-Credentials', 'true');
                socket.request.res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
            }
            return next(new ErrorHandler("Authentication failed due to cookie error", 401));
        }

        const authToken = socket.request.cookies[CHATTU_TOKEN];
        if (!authToken) {
            // Manually set CORS headers for this early exit error response
            if (socket.request.res && !socket.request.res.headersSent) {
                socket.request.res.header('Access-Control-Allow-Origin', corsOptions.origin[0]);
                socket.request.res.header('Access-Control-Allow-Credentials', 'true');
                socket.request.res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
            }
            return next(new ErrorHandler("Please login to access this route", 401));
        }

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
        const user = await User.findById(decodedData._id);

        if (!user) {
            // Manually set CORS headers for this early exit error response
            if (socket.request.res && !socket.request.res.headersSent) {
                socket.request.res.header('Access-Control-Allow-Origin', corsOptions.origin[0]);
                socket.request.res.header('Access-Control-Allow-Credentials', 'true');
                socket.request.res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
            }
            return next(new ErrorHandler("Please login to access this route", 401));
        }

        socket.user = user;
        return next();
    } catch (error) {
        console.error("Socket.IO Auth Catch Block Error:", error); // Log unexpected errors
        // Manually set CORS headers for the catch-all error response
        if (socket.request.res && !socket.request.res.headersSent) {
            socket.request.res.header('Access-Control-Allow-Origin', corsOptions.origin[0]);
            socket.request.res.header('Access-Control-Allow-Credentials', 'true');
            socket.request.res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
        }
        return next(new ErrorHandler("Authentication failed, please try again", 401));
    }
};



export {isAuthticated,adminOnly,socketAuthenicator};