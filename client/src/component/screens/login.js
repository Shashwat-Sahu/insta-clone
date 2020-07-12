import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from "../../App"

const Signin = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const history = useHistory()
    const Postdata = () =>{
        
        fetch("/signin",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        }
        ,
        body:JSON.stringify({
            
            password,
            email
        })
    }
        ).then(res=>res.json()).then(data=>{
            console.log(data)
            if(data.error)
            {
                M.toast({html: data.error,classes:"#d32f2f red darken-2"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "Signed In Successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2 className="brand-logo">Instagram</h2>
                   
            <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>Postdata()}>Login</button>
                    <h6>
            <Link to="/signup" >Dont have an account ?</Link>
            </h6>
        </div>
            </div>
    )
}

export default Signin