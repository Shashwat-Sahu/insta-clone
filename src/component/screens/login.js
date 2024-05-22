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
                    <h2 className="brand-logo">Xprose DOM</h2>
                   
            <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" style={{marginBottom:"2%"}} onClick={()=>Postdata()}>Login</button>
                    <Link to="/forgot_password"><h6 style={{marginBottom:"5%"}}>Forgot Password ?</h6></Link>
                    <div className="or-seperator" style={{borderBottom:"1px solid gray"}}><b style={{backgroundColor:"#aaa", border:"1px solid grey",borderRadius:"50%",padding:"2%"}}>OR</b></div>
                    <a class="btn-floating btn-large waves-effect waves-light" style={{marginTop:"3%",margin:"5%",backgroundColor:"#507cc0"}}><i class="fab fa-facebook"></i></a>
                    <a class="btn-floating btn-large waves-effect waves-light red" style={{marginTop:"3%",margin:"5%"}}><i class="fab fa-google"></i></a>
                    <a class="btn-floating btn-large waves-effect waves-light" style={{marginTop:"3%",margin:"5%",backgroundColor:"#64ccf1"}}><i class="fab fa-twitter"></i></a>
                    <h6>
            <Link to="/signup" >Dont have an account ?</Link>
            </h6>
            
        </div>
        
            </div>
    )
}

export default Signin