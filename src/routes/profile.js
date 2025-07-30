const express = require('express')
const profileRouter = express.Router()
const { useUserAuth } = require('../middlewares/auth')

profileRouter.get('/profile', useUserAuth, async(req,res)=>{
    try{
        const data = req.user
        res.send(data)
    }catch(e){
        res.status(400).send("Something went wrong - "+e.message)
    }
})


module.exports = profileRouter