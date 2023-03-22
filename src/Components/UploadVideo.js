import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import { NavigationContext } from '../App';
import '../CSS/UploadVidoe.css';
import { addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { storage, database } from '../firebase';

export default function UploadVideo() {
    const { changeLeftOpen, user } = useContext(NavigationContext);
    const [ videoDetails, setVideoDetails ] = useState({
        id: uuidv4(),
        displayName: null,
        description: null,
        videoURL: '',
        createdAt: null,
        views: 0,
        tumbnailPhoto: '',
        likes: [],
        comments: [],
        channelName: null,
        channelPhoto: null,
    });
    const [videoUploaded, setVideoUploaded] = useState(true);
    const navigate = useNavigate()
    const [thumbnailUploaded, setThumbnailUploaded] = useState(true);
    useEffect(() => {
        changeLeftOpen(false);
    }, []);
    async function submitVideo() {
        let tempPayload = {...videoDetails};
        tempPayload.channelName = user.displayName;
        tempPayload.channelPhoto = user.photoURL;
        tempPayload.createdAt = new Date();
        console.log(tempPayload);
        const res = await addDoc(database.videos, tempPayload);
        navigate('/', {replace: true});
        console.log(res);
    }
    function hanldeFileChange(e, type) {
        const file = e.target.files[0];
        const videoRef = type === 'video' ? ref(storage, `videos/${file.name}`) : ref(storage, `thumbnail/${file.name}`);
        const uploadTask = uploadBytesResumable(videoRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    type === 'video' ? videoDetails.videoURL = downloadURL : videoDetails.tumbnailPhoto = downloadURL;
                    setVideoDetails(videoDetails);
                    setVideoUploaded(false);
                    setThumbnailUploaded(false);
                });
            }
        );
    }
    return (
        <div className='video-upload-cont'>
            <h1 className='video-upload-title'>Upload Your Video</h1>
            <div className='video-upload'>
                <h4 className="action-label">Select Video</h4>
                <input type="file" accept="video/*" onChange={(e) => hanldeFileChange(e, 'video')} />
                <h4 className="action-label">Select Thumbnail Image</h4>
                <input type="file" accept="image/*" onChange={(e) => hanldeFileChange(e, 'thumbnail')}/>
                <h4 className="action-label">Enter video title</h4>
                <input type="text" placeholder='Enter video title' onBlur={(e) =>setVideoDetails({...videoDetails, displayName: e.target.value})} />
                <h4 className="action-label">Enter video Description</h4>
                <textarea placeholder='Enter video description ...' onBlur={(e) =>setVideoDetails({...videoDetails, description: e.target.value})}></textarea>
                <button className='upload-action' disabled={videoUploaded && thumbnailUploaded} onClick={submitVideo} >Upload Video</button>
            </div>
        </div>
    )
}
