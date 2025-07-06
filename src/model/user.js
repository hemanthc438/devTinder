const mongoose = require('mongoose')
const validator = require('validator')
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
module.exports = mongoose.model('User',userSchema)