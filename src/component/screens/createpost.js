import React,{useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const CreatePost = () =>{
  const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setURL] = useState("")
    const [disp,setDisp] = useState("")
    const postDetails =()=>{
      setDisp(1)
      const data = new FormData()
      data.append("file",image)
      data.append("upload_preset","insta-clone")
      data.append("cloud_name","xprose")
      data.append("quality","auto:low")
      fetch("	https://api.cloudinary.com/v1_1/xprose/image/upload",{
        method:"post",
        body:data
      }).then(res=>res.json()).then(data=>{
        setURL(data.url)
        fetch("/createpost",{
        method:"post",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
        ,
        body:JSON.stringify({
            pic:data.url,
            title,
            body
        })
    }
        ).then(res=>res.json()).then(data=>{
          console.log(data)
            if(data.error)
            {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }
            else{
                M.toast({html: "Created post successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
      }).catch(err=>{
        console.log(err)
      })

      
    }
    return(
        <div className="card input-field"
        style={{margin:"10px auto",
        maxWidth:"500px",
        padding:"20px",
        textAlign:"center",
        marginTop:"6%"
}}
        >
              <h2 className="brand-logo">Create Post</h2>
            <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
          <div className="btn">
            <span>UPLOAD IMAGE</span>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text"/>
          </div>
        </div>
        <button className="waves-effect waves-light btn #1565c0 blue darken-1 white-text" onClick={()=>postDetails()}>Submit Post</button>
        <div className="progress" id="progress-bar" style={{display: disp?"block":"none"}}>
          <div className="indeterminate"></div>
      </div>
            </div>
    )
}

export default CreatePost