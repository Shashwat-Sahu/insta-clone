const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get("/user/:id",requiredLogin,(req,res)=>{
    User.findOne({_id:req.params.id}).select("-password").then(user=>{
        Post.find({postedby:req.params.id}).populate("postedby","_id name").exec((err,posts)=>{
            if(err)
            {
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(422).json({err:"User not found"})
    })
})

router.put("/follower",requiredLogin,(req,res)=>
{
    User.findByIdAndUpdate(req.body.followid,{
        $push:{followers:req.user._id}},{new:true}
    ,
    (err)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followid}},{new:true}

        ).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            
        return res.status(422).json({error:err})
        })
        }
    )
})

router.put("/unfollower",requiredLogin,(req,res)=>
{
    User.findByIdAndUpdate(req.body.unfollowid,{
        $pull:{followers:req.user._id}},{new:true}
    ,
    (err)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowid}},{new:true}

        ).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            
        return res.status(422).json({error:err})
        })
        }
    )
})
router.post("/search-user",(req,res)=>{
    let searchregex = new RegExp("^"+req.body.name)
    User.find({name:{$regex:searchregex}}).select("_id name email pic").then(user=>{
        res.json(user)
    }).catch(err=>{
        return res.status(422).json({error:err})
    }) 
})

router.get("/getchats",requiredLogin,(req,res)=>{
    User.findById({_id:req.user._id}).then(data=>{
        res.json(data.chats)
    })
})

router.put("/addchats",requiredLogin,(req,res)=>{
    User.findOne({_id:req.user._id,"chats.chat_person":req.body.chat_person}
    ).then(result=>{
        console.log(result)
        if(!result)
        {
            console.log("a");
            User.findOneAndUpdate({_id:req.user._id},{
                $push:{chats:{chat_person:req.body.chat_person,chat_person_name:req.body.chat_person_name,messages:req.body.messages}}
            },{new:true}).then(sender=>{
                User.findOneAndUpdate({_id:req.body.chat_person},{$push:{chats:{chat_person:req.user._id,chat_person_name:req.user.name,messages:req.body.messages}}
                },{new:true}).then(receiver=>{return res.json({message:"sent"})}).catch(err=>console.log(err))
                
            }).catch(err=>console.log(err))
        }
        else{
            User.findOneAndUpdate({_id:req.user._id,"chats.chat_person":req.body.chat_person},{
                "$push":{'chats.$.messages':{"sender":req.body.messages.sender,"sender_name":req.body.messages.sender_name,"message":req.body.messages.message}}
            },{new:true}).then(sender=>{
                User.findOneAndUpdate({_id:req.body.chat_person,"chats.chat_person":req.user._id},{
                    "$push":{'chats.$.messages':{"sender":req.body.messages.sender,"sender_name":req.body.messages.sender_name,"message":req.body.messages.message}}
                },{new:true}).then(receiver=>{console.log("b")
                return res.json({message:"sent"})}).catch(err=>console.log(err))
                
            }).catch(err=>console.log(err))
        }
    })
})
module.exports = router