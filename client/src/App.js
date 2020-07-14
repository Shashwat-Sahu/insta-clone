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
      <Home/>
    </Route>
    <Route path="/signup">
      <Signup/>
    </Route>
    <Route path="/signin">
    <Signin/>
    </Route>
    <Route exact path="/profile">
      <Profile/>
    </Route>
    <Route path="/create">
      <CreatePost/>
    </Route>
    <Route path="/profile/:userid">
      <UserProfile/>
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
      <Navbars/>
    <BrowserRouter>
    <Routing/>
    
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
