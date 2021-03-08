import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from "../../App"
import {BASE_URL} from "../../Config/config.json"
// import { JsonWebTokenError } from 'jsonwebtoken'
const Forgot_password= () =>{
  const [value,setValue] = useState("");
    const Postforgot=()=>{
      
      fetch(BASE_URL+"/forgotpassword",{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email:value})
      }).then(res=>res.json()).then(data=>{
        
      }).catch(err=>{
        console.log(err)
      })
    }
     return(
            
        <div className="mycard">
        <div className="card auth-card input-field">
            <h3>Forgot Pssword</h3>
            <input type="email" placeholder="Email" value={value} style={{display:"inline",width:"80%"}} onChange={(e)=>{setValue(e.target.value)}}/>
             <button class="waves-effect waves-light
              btn #1565c0 blue darken-3 white-text" style={{marginBottom:"2%",display:"inline-block"}} onClick={()=>Postforgot()}><i class="material-icons">send</i></button>
            </div>
            </div>
     )
}
export default Forgot_password