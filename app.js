const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

require("./models/user")
require("./models/post")
require("dotenv").config();
app.use(express.json())

app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

if(process.env.ENV==="production")
{
    app.use(express.static(path.join(__dirname, 'build')))
    console.log("Production running")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'build','index.html'))
    })
}

mongoose.connect(process.env.MONGOURI,{
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
