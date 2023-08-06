import { useEffect } from "react";

import db, { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  logout,
  selectUser,
  setSubscription,
} from "./features/userSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import ProfileScreen from "./components/ProfileScreen";
const App = () => {
  //fetching the user stored in the redux using useSelector
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // its a listener, it listens to any authentication state changed,
    const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // it means that the user is logged in

        // so here we will dispatch the login action to set state of user
        //login(payload)
        let subsStatus = user ? user.currSubscription : null;
        if (subsStatus === null) {
          console.log("Inside if for subsStatus having value ", subsStatus);
          const colRef = collection(
            db,
            `customers/${userAuth.uid}/subscriptions`
          );
          getDocs(colRef).then((querySnapshot) => {
            querySnapshot.forEach(async (subs) => {
              subsStatus = subs.data().role;
            });
            dispatch(
              setSubscription({
                currSubscription: subsStatus,
              })
            );
          });
        }

        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
            currSubscription: null,
          })
        );
      } else {
        //it means that user is not logged in

        // here we will dispatch the logout action to set state of user to null
        dispatch(logout());
      }
    });

    /*
      whenever , we are using useEffect, we should have a cleanup function specially when we use eventlisteners to avoid memory leak

      so the good thing about onAuthState Changed is that it actually allows us to have a powerful functionality 'unsubscribe' i.e it returns unsubscribe
      remember what we are doing by setting onAuthStateChanged listener is that we are setting up a listener , which takes up a little memory in our browser, a little computing power
      so what we want to say is when the component was to unmount, we dont want to duplicate another listener , we just want to detach the old one and attach the new one

      so we return unsubscribe which helps to perform the cleanup for listener onAuthStateChanged


      so in UseEffect we have to perform cleanup for all listneners that we use in it
    */
    return unsubscribeAuth;
  }, [dispatch]);

  return (
    <div className="app">

    <Router>
      
      
      
         

        
          <Routes>
            <Route exact path="/" element={<Login/>} />
            <Route exact path="/home" element={<ProfileScreen />} />
            <Route exact path="/register" element={<Register />} />

          </Routes>

  



        
      
    </Router>
  </div>
);
}

export default App;
