const express = require('express')
const authRouter = express.Router()
const {validationSignUp,validationLogIn} = require("../utils/validation")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const User = require('../model/user')

authRouter.post('/signup', async(req,res)=>{
    const data = req.body
    try{
        validationSignUp(req)
        const {firstName,lastName,emailId,password,profilePicture,age,gender,about} = data;
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:hashedPassword,
            profilePicture,
            age,
            gender,
            about
        })
        await user.save()
        const token = await user.getJWT()
        res.cookie("token",token)   
        res.status(200).json({message:'User Added Successfully!',user})
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
    
})
authRouter.post('/login', async(req,res)=>{
    try{
        validationLogIn(req)
        const {emailId,password} = req.body
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Invakid Credentials!")
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            const token = await user.getJWT()
            res.cookie("token",token)   
            res.status(200).json({message:'Login Successful!',user})
        }else{
            throw new Error("Invalid credentials")
        } 
    }catch(e){
        res.status(400).send(e.message)
    }
})
authRouter.post('/logout', async(req,res)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now())
    }).send("Logout successful!!")
})
module.exports = authRouter
