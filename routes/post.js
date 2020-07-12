const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")

router.get("/allpost",requiredLogin,(req,res)=>{
    Post.find().populate("postedby","_id name pic").populate("comments.postedby","_id name pic").sort('-createdAt').then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
router.get("/getsubpost",requiredLogin,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}}).populate("postedby","_id name").populate("comments.postedby","_id name").sort('-createdAt').then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body,pic} = req.body
    
    if(!title||!body||!pic)
    {
        return res.status(402).json({
            error:"Please add all the fields"
        })
    }
        req.user.password ="undefined"
        const post = new Post({
            title,
            body,
            photo:pic,
            postedby:req.user
        })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/mypost",requiredLogin,(req,res)=>{
    Post.find({postedby:req.user._id}).populate("postedby","_id name pic").then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})
router.put("/like",requiredLogin,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}},{
            new:true
        }
    )
    .populate("postedby","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error})
        }
        else{
            res.json(result)
        }
    })
})
router.put("/unlike",requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}},{
            new:true
        }
    ).populate("postedby","_id name pic").exec((err,result)=>{
        if(err){
            return res.status(422).json({error})
        }
        else{
            console.log(result)
            res.json(result)
        }
    })
})
router.put("/comment",requiredLogin,(req,res)=>{
    const comment = {
        text: req.body.text,
        postedby: req.user
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}},{
            new:true
        }
    )
    .populate("comments.postedby","_id name pic").populate("postedby","_id name pic")
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({
        _id:req.params.postId
    }).populate("postedby","_id").exec((err,post)=>{
        if(err || !post)
        {
            return res.status(422).json({error:err})
        }
        if(post.postedby._id.toString()=== req.user._id.toString())
        {
            post.remove().then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})
router.delete('/deletecomment/:postId',requiredLogin,(req,res)=>{
    
    const comment = {
        _id:req.body.commentId,
        postedby: req.user
    }
    console.log()
    Post.findByIdAndUpdate(req.params.postId,{
        $pull:{comments:comment}},{
            new:true
        }
    ).populate("comments.postedby","_id name pic").populate("postedby","_id name pic")
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
module.exports = router