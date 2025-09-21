const express = require('express')
const connectDB = require('./config/database')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const appRouter = require('./routes/auth')
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');
const connectionRouter = require('./routes/request')
const userRouter = require('./routes/user')
require('dotenv').config()
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials:true
}))
app.use(cookieParser())
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRouter)
app.use('/',userRouter)
connectDB().then(()=>{
    console.log('connection successful')
    app.listen(process.env.PORT,()=>{
        console.log('server started at http://localhost:3000/')
    })
}).catch((err)=>{
        console.log('Connection unsuccesful! please check your connection.')
    })
