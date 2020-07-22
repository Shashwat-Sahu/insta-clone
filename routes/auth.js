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

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'photographyxprose@gmail.com',
    pass: '$TRON-ger1'
  }
});

var mailOptions = {
  from: 'no-reply@gmail.com',
  to: 'shashwatsahu25@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'ok!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
})


router.post("/signup",(req,res)=>{
    const {name,email,password,pic} = req.body
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