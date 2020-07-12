import React, { useCallback, useContext } from 'react'
import {Link, useHistory} from "react-router-dom"
import {UserContext} from "../App"
import {Navbar,NavItem,Icon} from "react-materialize"
const NavBars = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const RenderList = () =>{
    if(state){
      return [<Link to="/profile"><NavItem>
            Profile
        </NavItem></Link>,
        <Link to="/create"><NavItem>Create Post</NavItem></Link>
      ,
      <Link to="/myfollowingspost"><NavItem>My following Post</NavItem></Link>,
      <NavItem> <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>{
        localStorage.clear();
        dispatch({type:"CLEAR"})
        history.push("/signin")
      }}>Logout</button></NavItem>]
    }
    else {
      return[
        <Link to="/signin"><NavItem>Login</NavItem></Link>,
        <Link to="/signup"><NavItem>SignUp</NavItem></Link>
      ]
    }
  }
    return(
        
  <Navbar
  alignLinks="right"
  brand={<Link to={state?"/":"/signin"} className="brand-logo">Instagram</Link>}
  id="mobile-nav"
  menuIcon={<Icon>menu</Icon>}
  options={{
    draggable: true,
    edge: 'left',
    inDuration: 250,
    onCloseEnd: null,
    onCloseStart: null,
    onOpenEnd: null,
    onOpenStart: null,
    outDuration: 200,
    preventScrolling: true
  }}
  className="white"
>
  
  <RenderList/>
</Navbar>
    )
}
export default NavBars
