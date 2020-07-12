import React, { useCallback, useContext } from 'react'
import {Link, useHistory} from "react-router-dom"
import {UserContext} from "../App"
const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const RenderList = () =>{
    if(state){
      return [<li><Link to="/profile">Profile</Link></li>,
      <li><Link to="/create">Create Post</Link></li>,
      <li><Link to="/myfollowingspost">My following Post</Link></li>,
      <li> <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>{
        localStorage.clear();
        dispatch({type:"CLEAR"})
        history.push("/signin")
      }}>Logout</button></li>]
    }
    else {
      return[
        <li><Link to="/signin">Login</Link></li>,
        <li><Link to="/signup">SignUp</Link></li>
      ]
    }
  }
    return(
        <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right logout">
        <RenderList />
      </ul>
    </div>
  </nav>
    )
}
export default NavBar
