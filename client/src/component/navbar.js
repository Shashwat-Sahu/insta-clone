import React, { useCallback, useContext } from 'react'
import {Link, useHistory} from "react-router-dom"
import {UserContext} from "../App"
import {Navbar,NavItem,Icon} from "react-materialize"
const NavBars = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const RenderList = () =>{
    if(state){
      return [<NavItem>
            <Link to="/profile">Profile</Link>
        </NavItem>,
        <NavItem><Link to="/create">Create Post</Link></NavItem>
      ,
      <NavItem><Link to="/myfollowingspost">My following Post</Link></NavItem>,
      <NavItem> <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>{
        localStorage.clear();
        dispatch({type:"CLEAR"})
        history.push("/signin")
      }}>Logout</button></NavItem>]
    }
    else {
      return[
        <NavItem><Link to="/signin">Login</Link></NavItem>,
        <NavItem><Link to="/signup">SignUp</Link></NavItem>
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
