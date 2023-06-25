const express =require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("../db/conn")
const User =require('../model/userSchema')
const authenticate = require('../middleware/authenticate')
router.get('/',(req,res)=>{
    res.send("This is home from router")
})
router.post('/api/register',async(req,res)=>{
    const {name,email,phone,work,password,cpass}=req.body
    console.log(name,email,phone,work,password,cpass)
    if(!name || !email || !phone || !work || !password || !cpass)
    {
        return res.status(422).json({error:"fill properly"})
    }
    else if (password != cpass){
        return res.status(422).json({error:"Password didnt match"})
    }
    else{

        try{
            const userExists = await User.findOne({email:email})
            if(userExists){
                return res.status(422).json({error:"Email already exists"})
            }
            else{
                const user =new User({name,email,phone,work,password,cpass})
                const userReg = await user.save()
                if(userReg){
                    return res.status(500).json({message:"User register sucessfully"})
                }
            }
           }catch(error){
            console.log(error)
           }

    }

    // promises
    // User.findOne({email:email})
    // .then((userExists)=>{
    //     if(userExists){
    //         return res.status(422).json({error:"Email already exists"})
    //     }
    //     const user = new User({name,email,phone,work,password,cpass})
    //     user.save().then(()=>{
    //         return res.status(201).json({message:"User register sucessfully"})
    //     }).catch((err)=>{
    //         res.status(500).json({message:"User register failed"})
    //     })
    // }).catch((err)=>{console.log(err)})

   


})

router.post('/api/login',async (req,res)=>{
    try{
    const {email,password}=req.body
    console.log(email)
    if( !email  || !password )
    {
        return res.status(422).json({error:"Fill properly"})
    }

    
        const userExists = await User.findOne({email:email})
        if(userExists){
            const ismatch = await bcrypt.compare(password,userExists.password)
           

            if(!ismatch)
            {
                return res.status(500).json({message:"Invalid credentials"})
            }
            else{
                 const token =await userExists.generateAuthToken()
                 res.cookie("jwtoken",token,{
                    expires:new Date(Date.now() + 2589200000),
                    httpOnly:true
                 })
                return res.status(500).json({message:"logged in successfully"})
            }
        }
        else{
            return res.status(422).json({error:"Inva credential"})
        }

    }catch(err){
        return res.status(422).json({err})
    }


})

router.get('/api/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.post('/api/alldata',async(req,res)=>{
    const {_id,name,email}=req.body
    // const data =await User.find(name)
    console.log(name)
    // console.log("ashim daka")
    // console.log(data[0])
    res.send("message reciverd")
    
})
router.get('/api/getdata',authenticate,async(req,res)=>{
    
   
    res.send(req.rootUser)
    
})

router.post('/api/contact',authenticate,async(req,res)=>{
    const {name,phone,email,message} =await req.body
    const user = await User.findOne({_id:req.UserID})
    if(user){
        const saveUser = await user.addmessage(name,phone,email,message)
        // user.save()
        console.log("ashim daka")
        return res.status(202).json({message:"user created successfully"})
    }
    res.status(202).json({message:"recived data but couldn't post"})
})

router.get('/api/logout',(req,res)=>{
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).json({message:"Logout successfull"})
})

module.exports = router