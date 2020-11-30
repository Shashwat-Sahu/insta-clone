const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config/keys")
const requiredLogin = require("../middleware/requireLogin")
const nodemailer = require("nodemailer");

router.post("/forgotpassword",(req,res)=>{
    var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'noreplyn86@gmail.com',
//     pass: '$ol-n1234'
//   }
// });
// var x = ""+Math.floor(Math.random()*99)+Math.floor(Math.random()*99)+Math.floor(Math.random()*99);
// var mailOptions = {
//   from: 'noreplyn86@gmail.com',
//   to: req.body.email,
//   subject: 'Sending Email using Node.js',
//   html:"<h1>Xprose DOM</h1><p>Here's your One-time-password "+x
// };

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.status.json(error);
  } else {
    res.json(x);
  }
});
})


router.post("/signup",(req,res)=>{
    const {name,email,password,pic} = req.body
    console.log(req.body)
    if(!email || !password ||!name)
    {
        return res.status(422).json({error : "Please add all the fields"})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser)
        {
            return res.status(422).json({error:"user already exists with that email"})
        }
        
        bcrypt.hash(password,12).then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save().then(user=>{
                
                res.json({message:"Successfully saved"})
            }).catch(err=>
            {
                console.log(err)
            })
        })
        
    }).catch(err=>{
        console.log(err)
    })
})

router.post("/signin",(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser)
        {
            res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password).then(doMatch=>{
            if(doMatch)
            {
                //res.json({message:"Successfully signed in"})
                const token = jwt.sign({id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else
            {
                return res.status(422).json({error:"Invalid Emil or password"})
            }
        })
    }).catch(err=>{
        console.log(err)
    })
})
router.put("/updatepic",requiredLogin,(req,res)=>{
    console.log(req.body.pic)
    User.findByIdAndUpdate(req.user._id,{
        $set:{
            pic:req.body.pic
        }},{
            new:true
        }
    ,(err,result)=>{
        if(err)
        {
            return res.status(422).json({error:err})
        }
        result.password="undefined"
        res.json(result)
    })
})
module.exports = router