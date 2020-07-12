import React, { useCallback, useContext, useState } from 'react'
import {Link, useHistory} from "react-router-dom"
import {UserContext} from "../App"
import {Navbar,NavItem,Icon,Modal,Button} from "react-materialize"
const NavBars = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [search,setSearch] = useState('')
  const RenderList = () =>{
    if(state){
      return [
      
        <NavItem><Modal
        actions={[
          <Button flat modal="close" node="button" waves="green">Close</Button>
        ]}
        bottomSheet={false}
        fixedFooter={false}
        header="Search User"
        id="Modal-0"
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
        
        trigger={<i class="material-icons" node="i">search</i>}
      >
        <input type="text" value={search} placeholder="Search" onChange={(e)=>setSearch(e.target.value)}  />
        <ul className="collection">
          <li className="collection-item">Alvin</li>
          <li className="collection-item">Alvin</li>
          <li className="collection-item">Alvin</li>
          <li className="collection-item">Alvin</li>
        </ul>
        </Modal></NavItem>,
      <Link to="/profile"><NavItem>
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
