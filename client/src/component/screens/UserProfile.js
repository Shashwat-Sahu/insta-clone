import React,{useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import {Modal,Button} from "react-materialize"

const UserProfile = ()=>{
    const [userProfile,setuserProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    const [post,setpost] = useState({})
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
        {userProfile?<div style={{maxWidth:"700px",margin:"0px auto",color:"white"}}>
            <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px auto",
                    borderBottom:"1px solid gray"
                }}>
                <div>
                    <img  href="#modal1" className="modal-trigger"node="img" onClick={()=>setpost({photo:userProfile.user.pic})} style={{width:"180px",height:"180px",borderRadius:"50%"}} src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <p style={{fontSize:"1.2em"}}>{userProfile.user.email}</p>
                    <p style={{display:"flex",justifyContent:"space-around",width:"108%"}}>
                        <p style={{fontSize:"0.8em"}}>{userProfile.posts.length} posts</p>
                        <p style={{fontSize:"0.8em"}}>{userProfile.user.followers.length} followers</p>
                        <p style={{fontSize:"0.8em"}}>{userProfile.user.following.length} following</p>
                    </p>
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
                        return (<>
                            <img href="#modal1" node="img" key ={item._id} className="item modal-trigger" onClick={()=>setpost(item)} src={item.photo} alt={item.title}/>
                            
                            </>
                            )
                    })
                }
                <Modal
                                actions={[
                                <Button flat modal="close" node="button" waves="green">Close</Button>
                                ]}
                                bottomSheet={false}
                                fixedFooter={false}
                                header={post.title}
                                id="modal1"
                                open={false}
                                options={{
                                dismissible: true,
                                endingTop: '10%',
                                inDuration: 250,
                                onCloseEnd: null,
                                onCloseStart: null,
                                onOpenEnd: null,
                                onOpenStart: null,
                                opacity: 0.5,
                                outDuration: 250,
                                preventScrolling: true,
                                startingTop: '4%'
                                }}

                            >
                                
                                <img src={post.photo} className="post"/>
                                
                            </Modal>
             </div>   
            
        </div>:<h2 className="brand-logo">Loading...</h2>}
        
    </>)

}

export default UserProfile