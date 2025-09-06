const express = require('express')
const profileRouter = express.Router()
const bcrypt = require('bcrypt')
const { useUserAuth } = require('../middlewares/auth')
const {validateProfileEdit,validatePasswordReset} = require('../utils/validation')
profileRouter.get('/profile/view', useUserAuth, async(req,res)=>{
    try{
        const data = req.user
        res.send(data)
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
})
profileRouter.patch('/profile/edit', useUserAuth, async(req,res)=>{
    try{
        const currentUser = req.user;
        if(validateProfileEdit(req)){
            console.log("befire",currentUser)
            Object.keys(req.body).forEach((item)=>currentUser[item]=req.body[item])
            await currentUser.save()
            res.send({
                message:`${currentUser.firstName}, Profile edit successful!`,
                data: currentUser
            })
        }else{
            throw new Error("Edit is invalid!")
        }
    }catch(err){
        res.status(400).send(err.message)
    }
})
profileRouter.patch('/profile/reset-password', useUserAuth, async(req,res)=>{
    try{
        const currentUser = req.user
        console.log(currentUser)
        if(!Object.keys(req.body).includes('password')){
            throw new Error('wrong inputs')
        }else{
            const verifyPassword = await currentUser.validatePassword(req.body.password)
            if(verifyPassword){
                throw new Error("The new password cannot be the same as the old password! please try giving a new one.")
            }
            const isNewPasswordValid = validatePasswordReset(req);
            if(!isNewPasswordValid){
                throw new Error('Please provide a stringer password')
            }
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            currentUser.password = hashedPassword
            await currentUser.save()
            res.send("Password reset successful!")
        }
        
    }catch(err){
        res.status(400).send(err.message)
    }
})

module.exports = profileRouter