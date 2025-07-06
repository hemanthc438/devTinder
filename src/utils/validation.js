const validator = require('validator')
const validationSignUp = (req) =>{
    const body = req.body;
    if(!validator.isEmail(body.emailId)){
        throw new Error("Please enter a valid Email Id")
    }
}
const validationLogIn = (req) =>{
    const body = req.body;
    if(body.emailId === '' || body.password === ''){
        throw new Error("please enter creddentials!")
    }
}
module.exports = { validationSignUp,validationLogIn }