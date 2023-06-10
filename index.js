import  express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from 'cors'
import routerRoom from "./routers/routerRoom.js"
import routerTerm from "./routers/routerTerm.js"
import routerRoomType from "./routers/routerRoomType.js"
import routerCustomer from "./routers/routerCustomer.js"
import routerStatusRoom from "./routers/routerStatusRoom.js"
import routeEmployee from "./routers/routerEmployee.js"
dotenv.config()


//kết nối tới mongosedb
const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB")
    }catch(error){
        throw error;
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB disconnected");
})

mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected");
})



const app = express();
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     


// nhúng middleware vào express
app.use(express.json()) 

//sau khi chạy route nếu lỗi thì bắn ra lỗi
app.use("/api/room",routerRoom)

app.use("/api/status-room",routerStatusRoom)

app.use("/api/term",routerTerm)

app.use("/api/room-type",routerRoomType)

app.use("/api/customer",routerCustomer)

app.use("/api/employee",routeEmployee)



app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Somthing went wrong!"
    return res.status(errorMessage).json({
        success: false, 
        status : errorStatus,
        message : errorMessage,
        data: []
    })
})


app.listen(8800,()=>{
    console.log("Connect to backend!")
    connect()
})

