import { Button, Input } from '@material-ui/core'
import React, {useState} from 'react'
import {db, storage} from './firebase'
import firebase from "firebase"
import "./Upload.css"


function Upload({username, photo, email}) {
    const [caption,setCaption] = useState('');
    const [file,setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleUpload = (e) => {
        console.log(file)
        if(file.type.includes("image")){
            const uploadTask = storage.ref(`images/${file.name}`).put(file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                    .ref("images")
                    .child(file.name)
                    .getDownloadURL()
                    .then(url =>{
                        console.log(username);
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            url: url,
                            username: username,
                            type: 'image',
                            photo: photo,
                            email: email
                        })
                        setProgress(0);
                        setCaption('');
                        setFile(null);
                    })
                }
            )
        }else{
            console.log(caption, username);
            const uploadTask = storage.ref(`videos/${file.name}`).put(file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                    .ref("videos")
                    .child(file.name)
                    .getDownloadURL()
                    .then(url =>{
                        console.log(url);
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            url: url,
                            username: username,
                            type: 'video',
                            photo: photo
                        })
                        setProgress(0);
                        setCaption('');
                        setFile(null);
                    })
                }
            )
        }
    }
    
    const handleChange = (e) => {
        if(e.target.files[0]){
            setFile(e.target.files[0]);
        }
    }

    return (
        <div className="upload">
            <progress className="upload__progress" value={progress} max="100"></progress>
            <Input 
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)} 
                placeholder="Enter a Caption"/>
            <Input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button> 
        </div>
    )
}

export default Upload
