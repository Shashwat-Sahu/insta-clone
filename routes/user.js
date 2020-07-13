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
module.exports = router