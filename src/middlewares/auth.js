const jwt = require("jsonwebtoken")
const User = require("../model/user")
const useUserAuth = async(req, res, next)=>{
    try{
        const {token} = req.cookies
        if(!token){
            res.status(401).send("Invalid Token")
        }
        const tokenData = await jwt.verify(token,"Hem@nth99488")
        const {_id} = tokenData
        if(!_id){
            res.status(401).send("Invalid Token")
        }
        const user = await User.findById(_id)
        if(!user){
            throw new Error("User not found")
        } 
        req.user = user;
        next() 
    }catch(e){
        res.status(400).send(e.message)
    }
}

module.exports = { useUserAuth }