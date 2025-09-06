const mongoose = require('mongoose')
const {Schema} = mongoose

const connectionSchema = new Schema({
    fromUserId : {
        type : mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    toUserId : {
        type : mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    connectionStatus : {
        type:String,
        enum : {
            values:["interested","ignored","accepted","rejected"],
            message:`{value} is an invalid status`
        }
    }

},{timestamps:true})

connectionSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Sender shouldn't be the Reciever!")
    }
    next();
})

module.exports = mongoose.model("ConnectionRequests",connectionSchema) 