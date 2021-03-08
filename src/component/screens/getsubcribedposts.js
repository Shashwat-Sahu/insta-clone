import React ,{useState, useEffect, useContext} from 'react'
import {UserContext} from "../../App"
import M from 'materialize-css'
import { Collapsible, CollapsibleItem ,Icon} from 'react-materialize';
import {Link} from 'react-router-dom'
import {BASE_URL} from "../../Config/config.json"
const Home = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch(BASE_URL+"/getsubpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            
           setData(result.posts)
        })
    },[])
    
    const likePost= (id)=>{
        fetch(BASE_URL+"/like",{
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
    const unlikePost= (id)=>{
        fetch(BASE_URL+"/unlike",{
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
        fetch(BASE_URL+"/comment",{
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
        fetch(`${BASE_URL}/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
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
    const deleteComment = (postId,commentId)=>{
        fetch(`${BASE_URL}/deletecomment/${postId}`,{
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
        
        <div className="home">
            {
                
                data.map(item=>{
                    
                    return (
                        
                        <div className="card home-card" key={item._id}>
                <h5 style={{display:"inline-block"}}><Link to={item.postedby._id!=state._id?"/profile/"+item.postedby._id:"/profile"}>{item.postedby.name}</Link></h5>
               { item.postedby._id == state._id?<i class="material-icons" style={{float:"right",cursor:"pointer"}} onClick={()=>deletePost(item._id)}>delete</i>:<i></i>}
                <div className="card-image">
                    <img src={item.photo}/>
                </div>
                <div className="card-content">
                    {
                        
                
                            item.likes.includes(state._id)?<i className="material-icons" style={{color:"red",cursor:"pointer"}} onClick={()=>unlikePost(item._id)}>favorite</i>
                             :<i className="material-icons" style={{color:"red",cursor:"pointer"}} onClick={()=>likePost(item._id)}>favorite_border</i>
                    
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
  >
    {   
                    
                    item.comments.map(record=>{
                        
                        return (
                            
                            <h6><span style={{fontWeight:500}}>{record.postedby.name}</span> {record.text}
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
    )
}

export default Home