import Icon from '@mdi/react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { NavigationContext } from '../App';
import '../CSS/VideoDetail.css'
import { mdiThumbUpOutline, mdiShareOutline } from '@mdi/js';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function VideoDetail() {
    const { changeLeftOpen, user, videos, setVideos } = useContext(NavigationContext);
    const videoRef = useRef();
    const [video, setVideo] = useState({});
    const [comment, setComment] = useState('');
    const params = useParams();
    useEffect(() => {
        const tempVideo = videos.find((ele) => ele.id == params.id);
        console.log(tempVideo)
        setVideo(tempVideo);
        // videoRef.current.play();
    });
    useEffect(() => {
        changeLeftOpen(false);
    },[])
    function dateFormatter(data) {
        const date = new Date(data);
        // console.log(video)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    function handleLike() {
        const tempDoc = doc(firestore, "videos", video.videoId.toString())
        updateDoc(tempDoc, {
            likes: [...video.likes, user.id],
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
        // console.log(data);
    }
    return (
        <div>
            <div className='video-detail-left'>
                <video src={video?.videoURL} ref={videoRef} className="video-player" autoPlay={true} controls ></video>
                <div className='video-details-cont'>
                    <h3>{video?.displayName}</h3>
                    <div className='channel-details'>
                        <div className='channel-details-left'>
                            <img src={video?.channelPhoto} alt={video?.channelName} className="channel-image" />
                            <div>{video?.channelName}</div>
                            <button className='subscribe'>Subscribe</button>
                        </div>
                        <div className='channel-details-right'>
                            <button onClick={handleLike} className='like-btn'><Icon path={mdiThumbUpOutline} size={1}></Icon>{video?.likes?.length}</button>
                            <button className='share-btn'><Icon path={mdiShareOutline} size={1}></Icon> Share</button>
                        </div>
                    </div>
                    <div className='description'>
                        <div>{video?.views} views     {dateFormatter(video?.createdAt?.toDate())}</div>
                        <div>{video?.description}</div>
                    </div>
                    <div className='comments'>
                        <div>{video?.comments?.length} Comments</div>
                        <div className='new-comment'>
                            <div className='new-comment-input-cont'>
                                <img src={user?.photoURL} alt={user?.displayName} className="channel-image" />
                                <input className='new-comment-input' type="text" placeholder='Add a Comment ...' onChange={(e) => setComment(e.target.value)} />
                            </div>
                            <div style={{ display: `${comment === '' ? 'none' : 'flex'}`, justifyContent: 'end' }}>
                                <button className='new-comment-action-btn-cancel'>Cancel</button>
                                <button className='new-comment-action-btn-comment'>Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='video-detail-right'></div>
        </div>
    )
}
