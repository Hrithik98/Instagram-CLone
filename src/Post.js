import React,{useEffect, useState} from 'react';
import './Post.css';
import {Avatar, Input, Button, Modal} from '@material-ui/core';
import {db, storage} from './firebase'
import firebase from 'firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { makeStyles } from '@material-ui/core/styles';

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
      textAlign: 'center',
    },
  }));


export default function Post({username, caption, url, postId, user, type, photo}) {
    const classes = useStyles();
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment= (event) => {
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add(
            {
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }
        )
        setComment('');
    }

    const deletePost=()=>{
        storage.refFromURL(url).delete();
        db.collection('posts').doc(postId).delete();
        setOpen(false);
    }

    return (
        <div className="post">
            <Modal
                open={open}
                onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <h3>Are You sure?</h3>
                    <Button onClick={() => deletePost()} >Yes</Button>
                </div>
            </Modal>
            <div className="post__header">
            
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src={photo ? photo : "/static/1.jpeg"}
                />
                <h3>{username}</h3>
            
            {user?.displayName===username && <Button style={{position:'absolute' ,right:'10px'}} onClick={() => setOpen(true)}><FontAwesomeIcon icon={faTrash}/></Button>}
            </div>
            {
                type==='image' ? (<img src={url} alt="" className="post__image"></img>) : <video src={url} alt="" className="post__video" controls></video> 
            }
            
            <h4 className="post__text"><strong>{username}</strong> : {caption}</h4>
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <b>{comment.username}</b> : {comment.text}
                        </p>
                    ))
                }
            </div>
            {user && (
            <form className="post__commentBox">
                <Input
                    className="post__input"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}>
                        Post
                </Button>
            </form>
            )
            }
        </div>
    );
}
