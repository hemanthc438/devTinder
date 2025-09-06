const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    emailId:{
        type: String,
        required: true,
        unique: [true,"Email Id already registered!"],
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a strong password")
            }
        }
    },
    profilePicture:{
        type: String,
    },
    about:{
        type: String,
        maxlength: [250,`Too large! length should be under 250`]
    },
    age:{
        type: Number,
        min:[18,"Minimum age shuld be 18"]
    },
    gender:{
        type: String
    },
    skills:{
        type: String,
        validate(value){
            if(value.split(',').length>10){
                throw new Error("Skills cannot be greater than 10")
            }
        }
    },
},{
    timestamps: true
})
userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id},"Hem@nth99488",{expiresIn: '1h'});
    return token;
}
userSchema.methods.validatePassword = async function(userEnteredPassword){
    const user = this;
    const storedPassword = user.password
    const isPasswordValid = await bcrypt.compare(userEnteredPassword,storedPassword)
    return isPasswordValid
}
module.exports = mongoose.model('User',userSchema)