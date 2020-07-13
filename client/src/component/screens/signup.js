import React, { useState, useEffect } from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup = ()=>{
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setURL] = useState(undefined)
    const [disp,setDisp] = useState("")
    const history = useHistory()
    useEffect(()=>{
        if(url)
        {
            uploadFields()
        }
    },[url])
    const uploadpic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","xprose")
        fetch("	https://api.cloudinary.com/v1_1/xprose/image/upload",{
          method:"post",
          body:data
        }).then(res=>res.json()).then(data=>{
          setURL(data.url)}).catch(err=>{
              console.log(err)
          })
    }
    const uploadFields = () =>{
        setDisp(1)
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: 'Invalid Email!',classes:"#d32f2f red darken-2"})
            return 
        }
        fetch("/signup",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        }
        ,
        body:JSON.stringify({
            name,
            password,
            email,
            pic:url
        })
    }
        ).then(res=>res.json()).then(data=>{
            if(data.error)
            {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
                setDisp(0)
            }
            else{
                M.toast({html: data.message,classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const Postdata = () =>{
        if(image){
            uploadpic()
        }
        else{
            uploadFields()
        }
        
        
    }
    return(
        <div className="mycard">
        <div className="card auth-card input-field">
            <h2 className="brand-logo">Instagram Clone</h2>
            <input type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="email (Please type a false email since it is beta ver.)" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="password (Please type a false password since it is beta ver.)" value={password} onChange={(e)=>setPassword(e.target.value)} />

            <div className="file-field input-field">
            <div className="btn">
            <span>UPLOAD IMAGE</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
    </div>

            <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>Postdata()}>Sign Up</button>
            <h6>
            <Link to="/signin" >Already have an account ?</Link>
            </h6>
            <div className="progress" id="progress-bar" style={{display: disp==1?"block":"none"}}>
          <div className="indeterminate"></div>
      </div>
</div>
    </div>
    )
}

export default Signup