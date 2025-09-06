const express = require('express')
const connectionRouter = express.Router()
const { useUserAuth } = require('../middlewares/auth')
const ConnectionRequests = require('../model/connectionRequest')
const User = require('../model/user')
connectionRouter.post('/request/send/:status/:toUserId',useUserAuth,async(req,res)=>{
    try{
    const toUserId = req.params.toUserId
    const connectionStatus = req.params.status
    const fromUserId = req.user._id;
    const acceptedStatuses = ['interested','ignored'];
    if(!acceptedStatuses.includes(connectionStatus)){
        return res.status(400).send('Invalid Connection Type!')
    }
    const isUserExists = await User.findById(toUserId)
    if(!isUserExists){
        return res.status(400).send('User Does not exist ')
    }
    const isAlreadyExists = await ConnectionRequests.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    })
    if(isAlreadyExists){
        return res.status(400).send('Connection Request already exists ')
    }
    const connectionObject = new ConnectionRequests({
        fromUserId,
        toUserId,
        connectionStatus
    })
    const data = await connectionObject.save()
    console.log(data)
    res.status(200).json({message:'connection sent',data:data,})
    }catch(e){
        res.status(400).send('ERROR: ' + e.message)
    }
})
connectionRouter.post('/request/review/:status/:requestId',useUserAuth,async(req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const {status,requestId} = req.params;

        const allowedStatuses = ['accepted','rejected']
        if(!allowedStatuses.includes(status)){
            res.status(400).json({message:"Bad connection type!!"})
        }
        const request = await ConnectionRequests.findOne({
            _id:requestId,
            toUserId:loggedInUserId,
            connectionStatus:'interested'
        })
        if(!request){
            res.status(400).json({message:"Request not found!!"})
        }
        request.connectionStatus=status;
        const data = await request.save();
        res.status(200).json({message:status},data)
    }catch(e){
        res.status(400).json({message:"Error with the service"})
    }
})
module.exports = connectionRouter