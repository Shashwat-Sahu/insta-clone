import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbars from './component/navbar'
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from "./component/screens/home"
import Profile from "./component/screens/profile"
import Signup from "./component/screens/signup"
import Signin from "./component/screens/login"
import CreatePost from "./component/screens/createpost"
import {reducer,initialState} from './reducers/userReduce'
import UserProfile from "./component/screens/UserProfile"
import Subscribedposts from "./component/screens/getsubcribedposts"
import Forgot_password from "./component/screens/forgot_password"
import ParticlesBg from "particles-bg"
import Chatbox from "./component/screens/chatbox"
 
export const UserContext = createContext()
const Chat=()=>{
  const {state,dispatch} = useContext(UserContext)
  if(state){
    return(<Chatbox/>)
  }
  else{
    return(<></>)
  }
}
const Routing = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
  
    }
    else{
      history.push("/signin")
    }
  },[])
  return (
    <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route path="/signup">
      
      <ParticlesBg type="cobweb"  color="#ffffff" bg={true}/>
      <Signup/>
    </Route>
    <Route path="/signin">
    
    <ParticlesBg type="cobweb"  color="#ffffff" bg={true}/>
    <Signin/>
    </Route>
    <Route exact path="/profile">
      <Profile/>
    </Route>
    <Route exact path="/create">
      <CreatePost/>
    </Route>
    <Route exact path="/profile/:userid">
      <UserProfile/>
    </Route>
    <Route exact path="/myfollowingspost">
      <Subscribedposts/>
    </Route>
    <Route path="/forgot_password"><Forgot_password/>
    <ParticlesBg type="cobweb"  color="#ffffff" bg={true}/>
    </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    
    <Navbars/>
    <Routing/>
    <Chat/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
