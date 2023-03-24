import React, { useState, useEffect, useContext } from 'react'
import Icon from '@mdi/react';
import { mdiMenu, mdiMagnify, mdiYoutube, mdiMicrophone, mdiDotsVertical, mdiAccountCircleOutline, mdiVideoPlusOutline, mdiBellOutline } from '@mdi/js';
import '../CSS/Header.css'
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app, database } from '../firebase';
import { NavigationContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, getDocs, query, where } from 'firebase/firestore';

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export default function Header() {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const { changeLeftOpen, leftOpen, user, setUser, searchFunction } = useContext(NavigationContext);
    const [userClicked, setUserClicked] = useState(false);
    useEffect(() => {
        // const data = JSON.parse(localStorage.getItem("user")) || {};
        // setUser(data);
        onAuthStateChanged(auth, (users) => {
            if (users) {
                const uid = users.uid;
                // //console.log(users);
                setUser(users);
                // //console.log("User logged In");
            }
        });
    }, []);
    function handleSignout() {
        signOut(auth).then(() => {
            setUser({});
        }).catch((err) => {
            // //console.log(err);
        })
    }
    function handleSearch() {
        searchFunction(searchText);
        navigate(`/search`, {replace: true});
    }
    function hanldeSignIn() {
        signInWithPopup(auth, provider).then( async (res) => {
            const q = query(database.users, where("userId", "==", res.user.uid));
            const snapshot = await getDocs(q)
            if(snapshot.docs.length === 0) {
                const payload = {
                    userName: res.user.displayName,
                    userId: res.user.uid,
                    userProfile: res.user.photoURL,
                    userEmail: res.user.email,
                    subscribedChannels: [],   
                }
                const res1 = await addDoc(database.users, payload);
            }
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
                <input type="text" placeholder="Search" className='search' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <button className='search-button' onClick={handleSearch}><Icon path={mdiMagnify} size={1} /></button>
                <Icon path={mdiMicrophone} size={1} style={{ cursor: 'pointer' }} />
            </div>
            {
                user ? <div className='right-actions'>
                    <Link to="upload">
                        <Icon path={mdiVideoPlusOutline} style={{ cursor: 'pointer', color: 'black' }} size={1} />
                    </Link>
                    <Icon path={mdiBellOutline} style={{ cursor: 'pointer' }} size={1} />
                    <img src={user.photoURL} onClick={() => setUserClicked(!userClicked)} className="user-profile" /></div> :   <div className='right-actions'><Icon path={mdiDotsVertical} size={1} style={{ cursor: 'pointer' }} /><button className='signin-btn' onClick={hanldeSignIn}><Icon path={mdiAccountCircleOutline} color="blue" size={1} /> Sign in</button></div>
            }
            <div className='logout-btn' onClick={handleSignout} style={{ display: userClicked ? 'block' : 'none' }}>Logout</div>
        </div>
    )
}
