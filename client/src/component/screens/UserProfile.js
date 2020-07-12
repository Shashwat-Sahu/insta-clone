import React,{useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = ()=>{
    const [userProfile,setuserProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()).then(result=>{
            
            console.log(result)
            setuserProfile(result)
            
        }).catch(err=>{
            console.log(err)
        })

    },[])
    const followUser = ()=>{
        fetch("/follower",{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                followid:userid
            })
            }).then(res=>res.json()).then(data=>{
                dispatch({type:"UPDATE",payload:{following:data.following,
                followers:data.followers
                }})
                localStorage.setItem("user",JSON.stringify(data))
                setuserProfile((prevState)=>{
                    return{...prevState,user:{...prevState.user,
                        followers:[
                        ...prevState.user.followers,data._id]}}
                })
                setShowFollow(false)
                console.log(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unfollowUser = ()=>{
        fetch("/unfollower",{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                unfollowid:userid
            })
            }).then(res=>res.json()).then(data=>{
                dispatch({type:"UPDATE",payload:{following:data.following,
                    followers:data.followers
                    }})
                    localStorage.setItem("user",JSON.stringify(data))
                    
                    setuserProfile((prevState)=>{
                        
                        const newFollower = prevState.user.followers.filter(item=>item!=data._id)
                        return{...prevState,
                            user:{...prevState.user,
                            followers:newFollower}}
                    })
                    setShowFollow(true)
                console.log(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <>
        {userProfile?<div style={{maxWidth:"700px",margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px auto",
                    borderBottom:"1px solid gray"
                }}>
                <div>
                    <img style={{width:"180px",height:"180px",borderRadius:"50%"}} src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-around",width:"108%"}}>
                        <h5 style={{fontSize:"1.2em"}}>{userProfile.posts.length} posts</h5>
                        <h5 style={{fontSize:"1.2em"}}>{userProfile.user.followers.length} followers</h5>
                        <h5 style={{fontSize:"1.2em"}}>{userProfile.user.following.length} following</h5>
                    </div>
                    {
                        showFollow?<button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>{
        
                            followUser()
                          }}>Follow</button>:<button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>{
        
                            unfollowUser()
                           }}>Unfollow</button>
                    }
                    
      
                </div>
            </div>
            
            <div className="gallery">
                {
                    userProfile.posts.slice(0).reverse().map(item=>{
                        return (
                            <img key ={item._id} className="item" src={item.photo} alt={item.title} />
                            )
                    })
                }
             </div>   
            
        </div>:<h2 className="brand-logo">Loading...</h2>}
        
    </>)

}

export default UserProfile