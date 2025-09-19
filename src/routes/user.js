const express = require('express');
const { useUserAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequests = require('../model/connectionRequest');
const User = require('../model/user');
const SAFE_DATA = "firstName lastName profilePicture emailId age about gender skills"
userRouter.get('/user/requests/received',useUserAuth,async (req,res)=>{
    try{
        const loggedInUserId = req.user._id
        const connectionRequests = await ConnectionRequests.find({
            toUserId:loggedInUserId,
            connectionStatus:'interested'
        }).populate("fromUserId",SAFE_DATA) 
        
        res.status(200).json({connectionRequests})
    }catch(e){
        res.status(400).send("Error in receiving requests!")
    }
})
userRouter.get('/user/connections',useUserAuth,async (req,res)=>{
    try{
        const loggedInUserId = req.user._id
        const connectionRequests = await ConnectionRequests.find({
            $or:[
                {fromUserId:loggedInUserId,connectionStatus:'accepted'},
                {toUserId:loggedInUserId,connectionStatus:'accepted'}
            ]
        }).populate("fromUserId",SAFE_DATA).populate("toUserId",SAFE_DATA)
        if(!connectionRequests){
            res.status(400).send("Connections not found")
        }
        const connections = connectionRequests.map((item)=>{
            if(item.fromUserId._id.toString() === loggedInUserId.toString()){
                return item.toUserId;
            }
            return item.fromUserId;
        }) 
        res.status(200).json({connections})
    }catch(e){
        res.status(400).send("Error in receiving requests!")
    }
})
userRouter.get('/user/feed',useUserAuth,async(req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        const skip = (page-1)*limit;
        const connectionRequests = await ConnectionRequests.find({
            $or:[
                {fromUserId:loggedInUserId},
                {toUserId:loggedInUserId}
            ]
        })
        console.log(loggedInUserId)
        const ignoreSet = new Set()
        connectionRequests.forEach((item)=>{
            ignoreSet.add(item.fromUserId.toString())
            ignoreSet.add(item.toUserId.toString())
        })
        console.log(ignoreSet)
        const feed = await User.find({
            $and:[
                {_id:{$nin:Array.from(ignoreSet)}},
                {_id:{$ne:loggedInUserId}}
            ]
        }).select(SAFE_DATA).skip(skip).limit(limit)
        res.status(200).json({message:"feed fetched successfullt",feed})
    }catch(e){
        res.status(400).send('ERROR')
    }
})
module.exports = userRouter;