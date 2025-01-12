

const errorMiddleware=(err,req,res,next)=>{
    err.message||="Internal Server Error";
    err.statusCode||=500;
    return res.status(err.statusCode).json({
        succcess:false,
        message:err.message
    })
}


const TryCatch=(passedFunc)=>async(req,res,next)=>{
    try {
        await passedFunc(req,res,next);
    } catch (error) {
        next(error)
    }
};

export {errorMiddleware,TryCatch}