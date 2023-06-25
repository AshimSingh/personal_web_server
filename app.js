const dotenv=require('dotenv')

const express = require('express');

const { default: mongoose } = require('mongoose');

const app =express();
dotenv.config({path:'./config.env'})

const DB= process.env.DATABASE
const PORT = process.env.PORT || 5000
app.use(express.json())
require('./db/conn')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(require('./router/auth'))


// const middleware =(req,res,next)=>{
//     console.log("hello i am middleware")
//     next();
// }
app.get('/',(req,res)=>{
    res.send("Hello ashim world")
})

// app.get('/about',middleware,(req,res)=>{
//     res.send("Hello about ashim world")
// })

// app.get('/api/contact',(req,res)=>{
//     res.cookie("ashi","ashim")
//     res.send("Hello contact ashim world")
// })

app.get('/signin',(req,res)=>{
    res.send("Hello signin")
})

app.get('/signup',(req,res)=>{
    res.send("Hello signup")
})

// 3 step deploy on heruko

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/personal_web/dist'))
}

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})

