const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const {MONGOURI} = require("./config/keys")
const cors = require('cors')

require("./models/user")
require("./models/post")
app.use(express.json())

app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

if(process.env.NODE_ENV==="production")
{
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        resSendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
mongoose.connection.on("connected",()=>{
    console.log("Connected to mongoDB")
})
mongoose.connection.on("error",(err)=>{
    console.log("error connecting",err)
})

app.listen(PORT,()=>{
    console.log("Server is running on port : ",5000);
})