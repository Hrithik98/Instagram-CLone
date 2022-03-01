import React,{ useState,useEffect } from 'react';
import './App.css';
import Post from './Post'
import Promo from './Promo'
import Upload from './Upload'
import {auth, db, storage} from "./firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Avatar, Button, Input } from '@material-ui/core';
import { render } from '@testing-library/react';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(null);
  const [picture,setPicture] = useState(null);
  const [openPicChange,setOpenPicChange] = useState(false);
  const [Searchemail, setSearchEmail] = useState("");
  const [follows, setFollows] = useState([]);
  var post_elements = []

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[] )

  useEffect(() => {
    /*onAuthStateChanged listens for any authentication changes(login/logout/signup)
      nd fires the code inside*/
    const unsubscribe = auth.onAuthStateChanged((authUser) => { 
      if(authUser){
        //user has logged in
        db.collection("follows").doc("default")
        .onSnapshot(snapshot => setFollows(snapshot.data()[authUser.uid]));
        setUser(authUser);
      }else{
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  },[user, username]);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      if(picture){
        const uploadTask = storage.ref(`profilePictures/${picture.name}`).put(picture);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
            alert(error.message);
          },
          () => {
            storage
            .ref('profilePictures')
            .child(picture.name)
            .getDownloadURL()
            .then(url => {
              
              auth_user = authUser.user.updateProfile({
                displayName: username,
                photoURL: url,
              })
              db.collection("follows").doc("default").update({
                [authUser.user.uid]: [],
              }).then(window.location.reload())  
              setFollows([]);           
            })
          }
        )    
        console.log(follows);  
        return auth_user;
    }else{
      var auth_user = authUser.user.updateProfile({
        displayName: username,
      })     
      console.log(authUser);
      db.collection("follows").doc("default").update({
        [authUser.user.uid]: [],
      }).then(window.location.reload())
      setFollows([])
      return auth_user;
    }
    })
    .catch((error) => alert(error.message));


    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  const setProfilePicture = (e) => {
    if(e.target.files[0]){
        setPicture(e.target.files[0]);
    }
  }
  const changeProfilePicture =(e) => {
    if(user.photoURL){
      storage.refFromURL(user.photoURL).delete();
    }
    const uploadTask = storage.ref(`profilePictures/${picture.name}`).put(picture);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
            alert(error.message);
          },
          () => {
            storage
            .ref('profilePictures')
            .child(picture.name)
            .getDownloadURL()
            .then(url => {
              auth.currentUser.updateProfile({
                photoURL: url,
              })
              document.location.reload();
            })
          }
        )

    setOpenPicChange(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>  
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)} 
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Input
              placeholder="Profile Picture"
              type="file"
              onChange={setProfilePicture} 
            />
            <Button type="submit" onClick={signUp}>Sign Up!</Button>
            
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>  
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)} 
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In!</Button>
            
          </form>
        </div>
      </Modal>
      <Modal
        open={openPicChange}
        onClose={() => setOpenPicChange(false)}>
        <div style={modalStyle} className={classes.paper}>
        <Input
              placeholder="Profile Picture"
              type="file"
              onChange={setProfilePicture} 
            />
            <Button type="submit" onClick={changeProfilePicture}>Set</Button>
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage"
        src= "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
        alt=""></img>

      {
        user ? (
          <div>
          <div className="app__loginContainer">
            <Button onClick={() => auth.signOut()}>Log Out</Button>
            {user.photoURL ? <Button onClick={() => setOpenPicChange(true)}>Change Profile Picture</Button> : <Button onClick={() => setOpenPicChange(true)}>Set Profile Picture</Button>}
          </div>
          </div>): (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
        )
      }
      </div>

      <div className="app__posts">
      {
        posts.map(({id, post}) => {
          post_elements.push(<Post 
            key={id}
            postId={id}
            user={user}
            caption={post.caption}
            url={post.url}
            username={post.username} 
            type={post.type}
            photo={post.photo}
          />)
          })}
          
      </div>
      {
        user ? (
        <div>
          <Promo displayname={user.displayName} photoURL={user.photoURL} />
          <Upload username={user.displayName} photo={user.photoURL} email={user.email} />
        </div>
        ) : (
          <h3>You need to Login to Upload</h3>
        )
      }
      <div id="display_posts">
        {post_elements}
        <h3>All Caught Up!!</h3>
      </div>
    </div>
  );
}
export default App