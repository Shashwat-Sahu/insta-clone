import React,{useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'

const Profile = ()=>{
    const [mypics,setMypics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("") 
    const [url,setURL] = useState(undefined)
    const [set,setSetting] = useState(0)
    useEffect(()=>{
        fetch("/mypost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            
            setMypics(result.mypost)
            console.log(mypics)
        }).catch(err=>{
            console.log(err)
        })

    },[])
    useEffect(()=>{
        if(image)
        {
            const data = new FormData()
            setSetting(1)
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","xprose")
        fetch("	https://api.cloudinary.com/v1_1/xprose/image/upload",{
          method:"post",
          body:data
        }).then(res=>res.json()).then(data=>{
            fetch("/updatepic",{
                method:"put",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json()).then(result=>{
                console.log(result)
                setSetting(0)
            localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            dispatch({type:"UPDATEPIC",payload:data.url})
          setURL(data.url)
            }).catch(err=>{
                setSetting(0)
                console.log(err)
            })

}).catch(err=>{
              console.log(err)
          })
        }
    },[image])
    const updatepic = (file)=>{
        setImage(file)
        
    }
    return(
        <div style={{maxWidth:"700px",margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px auto",
                    borderBottom:"1px solid gray"
                }}>
                <div>
                    <img style={{width:"180px",height:"180px",borderRadius:"50%",display:"block"}} src={state?state.pic:"loading"}/>
                    <div className="file-field input-field" style={{width:"70%",display:"inline-block",marginRight:"4%"}}>
            <div className="btn">
            <span>UPDATE PROFILE PIC</span>
        <input type="file"  onChange={(e)=>updatepic(e.target.files[0])}/>
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
      </div>
      
    </div>


  <div class="preloader-wrapper small active" style={{display:set?"inline-block":"none"}}>
    <div class="spinner-layer spinner-green-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>



                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                        <div style={{display:"flex",justifyContent:"space-around",width:"108%"}}>
                        <h5 style={{fontSize:"1em"}}>{mypics.length} posts</h5>
                        <h5 style={{fontSize:"1em"}}>{state?state.followers.length:""} followers</h5>
                        <h5 style={{fontSize:"1em"}}>{state?state.following.length:""} following</h5>
                    </div>
                </div>
            </div>
            
            <div className="gallery">
                {
                    mypics.slice(0).reverse().map(item=>{
                        return (
                            <img key ={item._id} className="item" src={item.photo} alt={item.title} />
                            )
                    })
                }
             </div>   
            
        </div>
    )
}

export default Profile