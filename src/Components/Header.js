import React, { useState, useEffect, useContext } from 'react'
import Icon from '@mdi/react';
import { mdiMenu, mdiMagnify, mdiYoutube, mdiMicrophone, mdiDotsVertical, mdiAccountCircleOutline, mdiVideoPlusOutline, mdiBellOutline } from '@mdi/js';
import '../CSS/Header.css'
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';
import { NavigationContext } from '../App';
import { Link } from 'react-router-dom';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function Header() {
    
    const { changeLeftOpen, leftOpen, user, setUser } = useContext(NavigationContext);
    useEffect(() => {
        // const data = JSON.parse(localStorage.getItem("user")) || {};
        // setUser(data);
        onAuthStateChanged(auth, (users) => {
            if (users) {
                const uid = users.uid;
                console.log(users);
                setUser(users);
                console.log("User logged In");
            }
        });
    }, []);
    function hanldeSignIn() {
        signInWithPopup(auth, provider).then((res) => {
            console.log(res.user);
            // localStorage.setItem("user", JSON.stringify(res.user));
            setUser({ ...res.user })
        }).catch((err) => {
            console.log("Sign in failed");
        })
    }
    return (
        <div className='header'>
            <div className='left-actions'>
                <Icon path={mdiMenu} size={1} style={{ cursor: 'pointer' }} onClick={() => changeLeftOpen(!leftOpen)} />
                <Link to="/" style={{    textDecoration: 'none'}}>
                    <div className='logo'>
                        <Icon path={mdiYoutube} size={1} color="red" /> <span> Youtube<sup className='super-s'>TM</sup></span>
                    </div>
                </Link>
            </div>
            <div className='mid-actions'>
                <input type="text" placeholder="Search" className='search' />
                <button className='search-button'><Icon path={mdiMagnify} size={1} /></button>
                <Icon path={mdiMicrophone} size={1} style={{ cursor: 'pointer' }} />
            </div>
            {
                user ? <div className='right-actions'>
                    <Link to="upload">
                        <Icon path={mdiVideoPlusOutline} style={{ cursor: 'pointer', color: 'black' }} size={1} />
                    </Link>
                    <Icon path={mdiBellOutline} style={{ cursor: 'pointer' }} size={1} />
                    <img src={user.photoURL} className="user-profile" /></div> : <div className='right-actions'><Icon path={mdiDotsVertical} size={1} style={{ cursor: 'pointer' }} /><button className='signin-btn' onClick={hanldeSignIn}><Icon path={mdiAccountCircleOutline} color="blue" size={1} /> Sign in</button></div>
            }
        </div>
    )
}
