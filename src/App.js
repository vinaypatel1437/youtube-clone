import { createContext, useEffect, useState } from 'react';
import './App.css';
import Header from './Components/Header';
import LeftNav from './Components/LeftNav';
import MainPage from './Components/MainPage';
import './firebase';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadVideo from './Components/UploadVideo';
import VideoDetail from './Components/VideoDetail';
import { getDocs } from 'firebase/firestore';
import { database } from './firebase';
import SearchPage from './Components/SearchPage';

const NavigationContext = createContext();

function App() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [serachedVideos, setSearchVideos] = useState([]);
  const [serachChannels, setSearchChannels] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    setInterval(() => {
      getDocs(database.videos).then((res) => {
        let dataArr = [...res.docs]
        dataArr = dataArr.map((ele) => {
          // //console.log(ele.data())
          return { ...ele.data(), videoId: ele.id };
        });
        setVideos(dataArr);
      })
      getDocs(database.users).then((res) => {
        let dataarr = [...res.docs]
        dataarr = dataarr.map((ele) => {
          // //console.log(ele.data())
          return { ...ele.data() };
        });
        setUsers(dataarr);
      });
    }, 1000);
  }, []);
  function searchFunction(text) {
    const filterVideos = videos.filter((ele) => ele.displayName.toLowerCase().includes(text.toLowerCase()));
    setSearchVideos(filterVideos);
    console.log(users);
    const filterUsers = users.filter((ele) => ele.userName.toLowerCase().includes(text.toLowerCase()));
    setSearchChannels(filterUsers);
  }
  function changeLeftOpen(val) {
    setLeftOpen(val);
  }
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationContext.Provider value={{ leftOpen, changeLeftOpen,serachChannels, user, setUser, videos, setVideos, searchFunction, serachedVideos }}>
          <Header />
          <div style={{ display: 'flex' }}>
            {
              leftOpen && <LeftNav />
            }
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path='/upload' element={<UploadVideo />} />
              <Route path='/video/:id' element={<VideoDetail />}></Route>
              <Route path='/search' element={<SearchPage />}></Route>
            </Routes>
          </div>
        </NavigationContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
export { NavigationContext };