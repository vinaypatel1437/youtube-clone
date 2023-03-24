import { mdiDotsVertical } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useContext, useEffect } from 'react';
import '../CSS/MainPage.css';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function SearchPage(props) {
    const navigate = useNavigate()
    const { changeLeftOpen, serachChannels, serachedVideos } = useContext(NavigationContext);
    useEffect(() => {
        changeLeftOpen(true);
    }, [])
    function handleClick(id, element) {
        const tempDoc = doc(firestore, "videos", element.videoId.toString())
        updateDoc(tempDoc, {
            views: element.views + 1,
        }).then((res) => {
            //console.log(res);
        }).catch((err) => {
            //console.log(err);
        })
        navigate(`/video/${id}`, { replace: true });
    }
    return (
        <div>
            <h1>Videos</h1>
            <div className={props.origin === 'videoDetail' ? '' : 'videos'}>
                {
                    serachedVideos.map((ele) => {
                        return (
                            <div key={ele.id} className="single-video" onClick={() => handleClick(ele.id, ele)}>
                                <img className="thumbnail-image" src={ele.tumbnailPhoto} alt={ele.displayName} />
                                <div className='video-details'>
                                    <img src={ele.channelPhoto} alt={ele.channelName} className="channel-image" />
                                    <p className='video-name'>{ele.displayName}</p>
                                    <Icon path={mdiDotsVertical} size={1} style={{ cursor: 'pointer' }} />
                                </div>
                                <h6 className='channel-name'>{ele.channelName}</h6>
                                <div className='channel-name'>{ele.views} views . {ele.time}</div>
                            </div>
                        )
                    })
                }
            </div>
            <h1>Channels</h1>
            <div className={props.origin === 'videoDetail' ? '' : 'videos'}>
                {
                    serachChannels.map((ele) => {
                        return (
                            <div key={ele.userid} className="single-video">
                                <div className='video-details'>
                                    <img src={ele.userProfile} alt={ele.userName} className="channel-image" />
                                    <h6 className='channel-name'>{ele.userName}</h6>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
