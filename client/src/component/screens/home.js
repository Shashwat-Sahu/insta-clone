import React ,{useState, useEffect, useContext} from 'react'
import {UserContext} from "../../App"
import M from 'materialize-css'
import { Collapsible, CollapsibleItem ,Icon} from 'react-materialize';
import {Link} from 'react-router-dom'
import Confettibackground from "./confettis"

const Home = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [confitt,setconfettis] = useState("0")
    useEffect(()=>{
        fetch("/allpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            console.log(result)
           setData(result.posts)
        })
    },[])

    
    const likePost= (id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json()).then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(result._id==item._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            setTimeout(() => {
                setconfettis("0")
            }, 5000);
        })
    }
    const unlikePost= (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json()).then(result=>{
            const newData = data.map(item=>{
                if(result._id==item._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })
    }
    const makeComment=(text,postId)=>{
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text,
                postId
            })
        }).then(res=>res.json()).then(result=>{
            const newData = data.map(item=>{
                if(result._id==item._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const deletePost = (postId)=>{
        console.log(postId)
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !==result._id
            })
            
            setData(newData)
        })
    }
    const deleteComment = (postId,commentId)=>{
        fetch(`/deletecomment/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:
                    JSON.stringify({
                        commentId
                    })
            
        }).then(res=>res.json()).then(result=>{
            
            const newData = data.map(item=>{
                if(result._id==item._id)
                {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    
            
    return(
        <>
        <div className="home">
            <h3 className="brand-logo" style={{textAlign:"center"}}>{data.length==0?<div><div class="preloader-wrapper small active" style={{marginTop:"13%"}}>
    <div class="spinner-layer spinner-green-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div><br/>
  </div><h4 style={{color:"white"}}>Loading</h4></div>:""}</h3>
            {
                
                data.map(item=>{
                
                    return (
                        
                        <div className="card home-card" key={item._id}>
                            { item.postedby._id === state._id?<i className="material-icons" style={{cursor:"pointer",float:"right"}} onClick={()=>{console.log("hell");deletePost(item._id)}}>delete</i>:<i></i>}
                <h5 style={{display:"inline-block"}}><Link to={item.postedby._id!=state._id?"/profile/"+item.postedby._id:"/profile"} >
                    <img src={item.postedby.pic} style={{width:"8%",marginRight:"2%",borderRadius:"50%"}}/>{item.postedby.name}
                    </Link></h5>
               
                <div className="card-image">
                    <img src={item.photo}/>
                </div>
                <div className="card-content">
                    {
                        
                
                            item.likes.includes(state._id)?
                            <i className="material-icons" style={{color:"red",cursor:"pointer"}} onClick={()=>unlikePost(item._id)}>favorite</i>
                             :<i className="material-icons" style={{color:"red",cursor:"pointer"}} onClick={()=>{setconfettis("1");likePost(item._id) ;
                            }}>favorite_border</i>
                    
                    }
                     
                    
                        
                    
                
                <h6>Liked by {item.likes.length}</h6>
                <h4>{item.title}</h4>
                    <p>{item.body}</p>
         
<Collapsible accordion>
  <CollapsibleItem
    expanded={false}
    header="Comments"
    node="div"
    icon={<Icon>comment</Icon>}
    className="commentCard"
  >
    {   
                    
                    item.comments.map(record=>{
                        
                        return (
                            
                            <h6><Link to={item.postedby._id!=state._id?"/profile/"+item.postedby._id:"/profile"} ><img src={record.postedby.pic} style={{width:"8%",marginRight:"2%"}}/><span style={{fontWeight:500}}>{record.postedby.name}</span></Link> {record.text}
                            { record.postedby._id == state._id?<i class="material-icons" style={{float:"right",cursor:"pointer"}} onClick={()=>deleteComment(item._id,record._id)}>delete</i>:<i></i>}
                            </h6>
                            
                        )
                    })
                }
  </CollapsibleItem>
</Collapsible>

                    
                    
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        makeComment(e.target[0].value,item._id)
                        e.target[0].value=""
                    }
                    }>
                    <input type="text" placeholder="add a comment" />
                    </form>
                </div>
            </div>
                    )
                })
            }
            
        </div>
        
            {confitt=="1"?<Confettibackground/>:<></>}
        </>
    )
}

export default Home