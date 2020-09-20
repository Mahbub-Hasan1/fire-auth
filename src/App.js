import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  
  const handleLoginClick = () => {
      firebase.auth().signInWithPopup(provider)
      .then(res => {
        const {displayName, email, photoURL} = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signedInUser);
      })
      .catch(err => err(console.log("404")))
  }

  const handleLogOutClick = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: '',
      }
      setUser(signedOutUser);
    })
    .catch(err => err(console.log("404")))
  }


 const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name === 'password') {
        const isPasswordValid = e.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(e.target.value)
        isFieldValid = (isPasswordValid && passwordHasNumber);
    }
    if (isFieldValid) {
        const newUserInfo = {...user};
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
    }
 }
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then( res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)
        updateUserName(user.name);
      })
      .catch( error => {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo)
        // // ...
      });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res=> {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)
        console.log('sign in user info')
      })
      .catch(function(error) {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo)
      });
    }
    e.preventDefault();
  }
  
  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      // Update successful.
      console.log('user name update successful')
    }).catch(function(error) {
      // An error happened.
      console.log(error)
    });
  }
  return (
    <div style={{margin: '0 auto', textAlign: 'center'}}>
     {
        user.isSignedIn  ?  <button onClick={handleLogOutClick}>sine out</button>
        : <button onClick={handleLoginClick}>sine in</button>
     }
      {
        user.isSignedIn && <div><h5>Welcome,{user.name}</h5>
        <h6>your email : {user.email}</h6>
        <img src={user.photo} alt=""/>
        </div>

      }


      <h1>Our own Autghentic </h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
       {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="you email " required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'sign up' : 'sign in'}/>
      </form>
    <p style={{color: 'red'}}>{user.error}</p>
    { user.success && <p style={{color: 'green'}}>user { newUser ? 'created' : 'Logged In'} successfully</p>}


    </div>
  );
}

export default App;
