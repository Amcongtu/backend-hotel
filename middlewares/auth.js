import jwt from "jsonwebtoken"

const verifyToken = (req,res,next)=>{
    const token_bearer = req.header('Authorization');
    const token = token_bearer.split(' ')[1];
    const JWT_process = process.env.JWT_SECRET
    if(token){
        jwt.verify(token,JWT_process,(err,user)=>{
            if(err){
                return res.status(403).json({message:"Token không hợp lệ."});
            }
            req.user = user;
            next()
        })
    }
    else{
        return res.status(401).json({message:"You are not authenticated!"});
    }

}
export const verifyUser = (req,res,next)=>{
    verifyToken(req,res ,()=>{
        if(req.user){
            if(req.user == "admin"){
                next()
            }
            return res.status(403).json({message: "Bạn không phải là admin."})
        }else{
            return res.status(403).json({message:"You are not authorized!"});
        }
    })
}


export const verifyTokenClient = (req,res,next)=>{
    const token = req.body.access_token_client;
    const JWT_process = process.env.JWT
    if(token){
        jwt.verify(token,JWT_process,(err,user)=>{
            // console.log(user)
            // console.log("chay")
    
            if(err){
                return res.status(403).json({message:"Token is not valid!"});
            }
            req.user = user;
    
            next()
        })
    }
    else{

        return res.status(401).json({message:"You are not authenticated!"});

    }

}
export const verifyClient = (req,res,next)=>{
    verifyTokenClient(req,res ,()=>{

        if(req.user){
            next();
        }else{
            
            return res.status(403).json({message:"You are not authorized!"});
        }
    })
}