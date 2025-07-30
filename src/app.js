const express = require('express')
const connectDB = require('./config/database')
const app = express();
const cookieParser = require('cookie-parser')
const appRouter = require('./routes/auth')
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');
app.use(express.json())
app.use(cookieParser())
app.use('/',authRouter)
app.use('/',profileRouter)

connectDB.then(()=>{
    console.log('connection successful')
    app.listen(3000,()=>{
        console.log('server started at http://localhost:3000/')
    })
}).catch((err)=>{
        console.log('Connection unsuccesful! please check your connection.')
    })
