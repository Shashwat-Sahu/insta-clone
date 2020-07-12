import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './component/navbar'
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

export const UserContext = createContext()
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
      <Home></Home>
    </Route>
    <Route path="/signup">
      <Signup></Signup>
    </Route>
    <Route path="/signin">
    <Signin></Signin>
    </Route>
    <Route exact path="/profile">
      <Profile></Profile>
    </Route>
    <Route path="/create">
      <CreatePost></CreatePost>
    </Route>
    <Route path="/profile/:userid">
      <UserProfile></UserProfile>
    </Route>
    <Route path="/myfollowingspost">
      <Subscribedposts/>
    </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
