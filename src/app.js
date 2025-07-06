const express = require('express')
const connectDB = require('./config/database')
const User = require('./model/user')
const {validationSignUp,validationLogIn} = require("./utils/validation")
const bcrypt = require('bcrypt')
const app = express();

app.use(express.json())
app.post('/signup', async(req,res)=>{
    const data = req.body
    try{
        validationSignUp(req)
        const {firstName,lastName,emailId,password} = data;
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:hashedPassword
        })
        await user.save()
        res.send("User added succesfully")
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
    
})
app.post('/login', async(req,res)=>{
    try{
        validationLogIn(req)
        const {emailId,password} = req.body
        const data = await User.findOne({emailId:emailId})
        if(!data){
            throw new Error("User not registered! Please sign up")
        }
        const isPasswordValid = await bcrypt.compare(password,data?.password)
        if(isPasswordValid){
            res.send('Login Successfull')
        }else{
            throw new Error("Invalid credentials")
        }
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
})
app.get('/users', async(req,res)=>{
    try{
        const data = await User.find({})
        res.send(data)
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
})
app.get('/user/:id',async(req,res)=>{
    const userId = req.params?.id
    try{
        const data = await User.findById(userId)
        if(data.length===0)
        {
            res.status(400).send("user not found")
        }else{
            res.send(data)
        }
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
})
app.delete('/user/:id',async(req,res)=>{
    const userId = req.params.id
     try{
        await User.findByIdAndDelete(userId)
        res.send('deleted succesfully')
    }catch(err){
        res.status(400).send("something went wrong")
    }
})
app.patch('/user/:id',async(req,res)=>{
    const userId = req.params?.id;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["password","about","age","gender","skills"]
        const isUpdatesAllowed = Object.keys(data).every((item)=> ALLOWED_UPDATES.includes(item))
        if(!isUpdatesAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.skills?.split(',').length>=10){
            throw new Error("Skills should be not more than 10")
        }
        await User.findByIdAndUpdate(userId,data,{
            runValidators: true
        })
        res.send("updated successfully")
    }catch(e){
        res.status(400).send("UPDATE FAILED : "+e.message)
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
