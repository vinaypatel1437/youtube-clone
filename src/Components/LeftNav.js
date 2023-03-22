import { mdiAccountCircleOutline,mdiShoppingOutline, mdiHomeOutline, mdiFire, mdiYoutubeSubscription,mdiHistory, mdiPlayBoxMultipleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react'
import '../CSS/LeftNav.css';

export default function LeftNav() {
  return (
    <div className="left-sidebar">
        <div><Icon path={mdiHomeOutline} size={1} />
 Home</div>
        <div>Shorts</div>
        <div><Icon path={mdiYoutubeSubscription} size={1} />
 Subscrptions</div>
        <hr/>
        <div><Icon path={mdiPlayBoxMultipleOutline} size={1} />
 Library</div>
        <div><Icon path={mdiHistory} size={1} />
 History</div>
        <hr></hr>
        <div>Sign in to like videos, comment, and subscribe <button className='signin-btn'><Icon path={mdiAccountCircleOutline} color="blue" size={1} /> Sign in</button></div>
        <hr/>
        <h1>Explore</h1>
        <div><Icon path={mdiFire} size={1} /> Trending</div>
        <div><Icon path={mdiShoppingOutline} size={1} />
 Shopping</div>
        <div>Music</div>
        <div>Movies</div>
        <div>Live</div>
        <div>Gaming</div>
        <div>News</div>
        <div>Sports</div>
        <div>Learning</div>
        <div>Fashion & Beauty</div>
        <hr/>
        <div>Browse channels</div>
      </div>
  )
}
