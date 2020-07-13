import React, { useCallback, useContext, useState } from 'react'
import {Link, useHistory} from "react-router-dom"
import {UserContext} from "../App"
import {Navbar,NavItem,Icon,Modal,Button} from "react-materialize"
const NavBars = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [searchdetails,setSearchdetails] = useState([])
  const [isModalopen,setModalopen] = useState(false)
  const searchusers = (users)=>{
    fetch("/search-user",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name:users
      })
    }).then(res=>res.json()).then(result=>{
      console.log(result)
      setSearchdetails(result)
    })
  }
  const RenderList = () =>{
    if(state){
      return (
      
        <Navbar
  alignLinks="right"
  brand={<Link to={state?"/":"/signin"} className="brand-logo">Instagram Clone</Link>}
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
  <NavItem>

<i
    className="modal-trigger material-icons"
    href="#modal2"
    node="i"
    onClick={()=>setModalopen(true)}
  >
     search
  </i>
  


        
        </NavItem>
      <Link to="/profile"><NavItem>
            Profile
        </NavItem></Link>
        <Link to="/create"><NavItem>Create Post</NavItem></Link>
      
      <Link to="/myfollowingspost"><NavItem>My following Post</NavItem></Link>
      <NavItem> <button class="waves-effect waves-light btn #1565c0 blue darken-3 white-text" onClick={()=>{
        localStorage.clear();
        dispatch({type:"CLEAR"})
        history.push("/signin")
      }}>Logout</button></NavItem></Navbar>)
    }
    else {
      return( <Navbar
        alignLinks="right"
        brand={<Link to={state?"/":"/signin"} className="brand-logo">Instagram Clone</Link>}
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
       
        <Link to="/signin"><NavItem>Login</NavItem></Link>
        <Link to="/signup"><NavItem>SignUp</NavItem></Link></Navbar>
      )
    }
  }
    return(
        <>
  
  <RenderList/>
  

<Modal
    actions={[
      <Button modal="close" flat node="button" waves="green">Close</Button>
    ]}
    bottomSheet={false}
    fixedFooter={false}
    header="Search"
    id="modal2"
    open={isModalopen}
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
    <input type="text" placeholder="Search"  onChange={(e)=>{searchusers(e.target.value)}} />
        <ul className="collection">
          {searchdetails.map(item=>{
            return(
              <Link to={item._id!=state._id?"/profile/"+item._id:"/profile"}  onClick={()=>setModalopen(false)} >
                <li className="collection-item">
                  <img src={item.pic} style={{width:"5%",border:"1px solid",borderColor:"#d966ff",borderRadius:"50%"}}/>
                  {item.name}
                  </li>
                  </Link>
              )
          })}
          
        </ul>
  </Modal>
</>
    )
}
export default NavBars
