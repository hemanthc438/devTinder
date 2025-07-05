const useUserAuth = (req, res, next)=>{
    const token = 'asd'
    const authorized = token === 'asd'
    if(!authorized){
        res.status(401).send("Unauthorized")
    }else{
        next()
    }
}

module.exports = { useUserAuth }