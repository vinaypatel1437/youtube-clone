import Icon from '@mdi/react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { NavigationContext } from '../App';
// import { useLocation } from 'react-router-dom';
import '../CSS/VideoDetail.css'
import { mdiThumbUpOutline, mdiShareOutline } from '@mdi/js';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import MainPage from './MainPage';

export default function VideoDetail() {
    // const location = useLocation();
    const { changeLeftOpen, user, videos, setVideos } = useContext(NavigationContext);
    const videoRef = useRef();
    const [video, setVideo] = useState({});
    const [comment, setComment] = useState('');
    const params = useParams();
    useEffect(() => {
        const tempVideo = videos.find((ele) => ele.id == params.id);
        console.log(tempVideo)
        setVideo(tempVideo);
    });
    useEffect(() => {
        changeLeftOpen(false);
    },[]);
    function dateFormatter(data) {
        const date = new Date(data);
        // console.log(video)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    function handleLike() {
        const tempDoc = doc(firestore, "videos", video.videoId.toString());
        let tempArr = [...video.likes];
        if (video.likes.includes(user.uid)) {
            tempArr = tempArr.filter((ele) => ele !== user.uid);
        } else {
            tempArr = [...tempArr, user.uid];
        }
        updateDoc(tempDoc, {
            likes: tempArr,
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
    function handleShare() {
        console.log(window.location.href);
        navigator.clipboard.writeText(window.location.href);
        console.log("location copied to clipboard")
    }
    function handleComment() {
        console.log("comment");
        const tempDoc = doc(firestore, "videos", video.videoId.toString())
        const payload = {
            userName: user.displayName,
            userProfile: user.photoURL,
            commentTime: new Date(),
            commentText: comment,
        }
        updateDoc(tempDoc, {
            comments: [...video.comments, payload],
        }).then((res) => {
            console.log(res);
            setComment("");
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <div style={{display: 'flex'}}>
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
                            <button className='share-btn' onClick={handleShare}><Icon path={mdiShareOutline} size={1}></Icon> Share</button>
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
                                <input className='new-comment-input' type="text" value={comment} placeholder='Add a Comment ...' onChange={(e) => setComment(e.target.value)} />
                            </div>
                            <div style={{ display: `${comment === '' ? 'none' : 'flex'}`, justifyContent: 'end' }}>
                                <button className='new-comment-action-btn-cancel' onClick={()=>setComment("")}>Cancel</button>
                                <button className='new-comment-action-btn-comment' onClick={handleComment}>Comment</button>
                            </div>
                        </div>
                        <div className='allComments' >
                            {video?.comments?.map((ele, index) => {
                                return(
                                    <div key={index} className='single-comment-cont'>
                                        <img src={ele?.userProfile} alt={ele?.userName} className="comment-channel-image" />
                                        <div>
                                            <div className='comment-user-creds'>{ele?.userName} <span style={{ fontSize: '10px', fontWeight: '400' }}>{dateFormatter(ele?.commentTime?.toDate())}</span></div>
                                            <div style={{marginLeft: '10px'}}>{ele?.commentText}</div>
                                            </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className='video-detail-right'>
                <MainPage origin='videoDetail' />
            </div>
        </div>
    )
}
