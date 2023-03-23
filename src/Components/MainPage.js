import { mdiDotsVertical } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useContext, useEffect, useState } from 'react';
import '../CSS/MainPage.css';
import { NavigationContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function MainPage(props) {
    const navigate = useNavigate()
    const [ tags, setTags ] = useState([
        {
            name: 'All',
            selected: true,
        },
        {
            name: 'Music',
            selected: false,
        },
        {
            name: 'Gaming',
            selected: false,
        },
        {
            name: 'Scene',
            selected: false,
        },
        {
            name: 'Live',
            selected: false,
        },
        {
            name: 'Arijit Singh',
            selected: false,
        },
        {
            name: 'Dramedy',
            selected: false,
        }
    ]);
    const { changeLeftOpen, videos, setVideos } = useContext(NavigationContext);
    useEffect(() => {
        changeLeftOpen(true);
    },[])
    function handleClick(id, element) {
        const tempDoc = doc(firestore, "videos", element.videoId.toString())
        updateDoc(tempDoc, {
            views: element.views + 1 ,
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
        navigate(`/video/${id}`, {replace: true});
    }
  return (
    <div>
        <div className='tags' style={{ width: props.origin ? '350px' : '' }}>
            {
                tags.map((ele, index) => {
                    return (
                        <div key={index} className={`single-tag ${ele.selected ? 'selected-tag' : ''}`}>
                            {ele.name}
                        </div>
                    )
                })
            }
        </div>
        <div className={props.origin === 'videoDetail' ? '' : 'videos'}>
            {
                videos.map((ele) => {
                    return(
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
    </div>
  )
}
