const express = require('express')
const connectDB = require('./config/database')
const app = express();
const User = require('./model/user')
app.post('/signup', async(req,res)=>{
    const user = new User({
        firstName:"hemanth",
        lastName:'bolla',
        emailId:'hemanthbolla5@gmail.com',
        password:'qwerty@123'
    })
    try{
        await user.save()
        res.send("User added succesfully")
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
    
})
connectDB.then(()=>{
    console.log('connection successful')
    app.listen(3000,()=>{
        console.log('server started at http://localhost:3000/')
    })
}).catch((err)=>{
        console.log('Connection unsuccesful! please check your connection.')
    })
