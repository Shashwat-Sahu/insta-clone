const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    , followers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ]
    , following: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    pic: {
        type: String,
        default: "https://res.cloudinary.com/xprose/image/upload/v1594498879/noprofile_uqscoq.jpg"
    },
    chats: [{
        chat_person: {
            type: ObjectId,
            ref: "User"
        },
        chat_person_name:String
        ,
        messages: [
            {
                sender: {
                    type: ObjectId,
                    ref: "User"
                },
                sender_name:String
                ,
                message:String
            }
        ]
    }]
})

mongoose.model("User", userSchema)