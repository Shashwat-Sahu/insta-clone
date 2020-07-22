import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from "../../App"
const forgot_password= () =>{
    const Postforgot=()=>{

    }
     return(
            
        <div className="mycard">
        <div className="card auth-card input-field">
            <h3>Forgot Pssword</h3>
            <input type="email" placeholder="Email"  style={{display:"inline",width:"80%"}}/>
             <button class="waves-effect waves-light
              btn #1565c0 blue darken-3 white-text" style={{marginBottom:"2%",display:"inline-block"}} onClick={()=>Postforgot()}><i class="material-icons">send</i></button>
            </div>
            </div>
     )
}
export default forgot_password