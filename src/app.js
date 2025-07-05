const express = require('express')

const app = express();
console.log('started')

app.use('/home',(req,res)=>{
    res.send("express response home")
})
app.use('/',(req,res)=>{
    res.send("express response dashboard")
})

app.listen(3000,()=>{
    console.log('server started at http://localhost:3000/')
})
