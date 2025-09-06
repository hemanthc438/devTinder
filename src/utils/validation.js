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
const validateProfileEdit = (req) =>{
    const body = req.body
    const editableFields = ["firstName","lastName","profilePicture","emailId","about","age","gender","skills"]
    const isEditValid = Object.keys(body).every((item)=>editableFields.includes(item))
    return isEditValid;
}
const validatePasswordReset = (req) =>{
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    const body = req.body;
    const isNewPasswordValid = strongPasswordRegex.test(body.password)
    return isNewPasswordValid;
}
module.exports = { validationSignUp,validationLogIn,validateProfileEdit,validatePasswordReset}