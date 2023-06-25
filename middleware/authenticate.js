const jwt = require('jsonwebtoken')
const User = require('../model/userSchema')
const Authenticate =async(req,res,next)=>{
    console.log("authenticate")
    try{
        const token = req.cookies.jwtoken
        // console.log("token",token)
        const verify_token =jwt.verify(token,process.env.SECRET_KEY)
        // console.log("vtoken",verify_token)
        const rootUser =await User.findOne({_id:verify_token._id,"tokens.token":token})
        // console.log("rootUser",rootUser)
        if(!rootUser) {throw new Error('User not Found')}
        req.token =token
        req.rootUser = rootUser
        req.UserID =rootUser._id
        next()

    }
    catch(err){
        res.status(401).send("Unauthorized")
       
        console.log(err)
    }


}
module.exports =Authenticate