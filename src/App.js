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

const NavigationContext = createContext();

function App() {
  const [ leftOpen, setLeftOpen] = useState(true);
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState();
  useEffect(() => {
    getDocs(database.videos).then((res) => {
        let dataArr = [...res.docs]
        dataArr  = dataArr.map((ele) => {
            console.log(ele.data())
            return {...ele.data(), videoId: ele.id};
          });
        setVideos(dataArr)
    })
},[]);
  function changeLeftOpen(val) {
    setLeftOpen(val);
  }
  return (
    <div className="App">
      <BrowserRouter>
      <NavigationContext.Provider value={{leftOpen, changeLeftOpen, user, setUser, videos, setVideos}}>
        <Header />
        <div style={{display: 'flex'}}>
        {
          leftOpen && <LeftNav />
        }
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path='/upload' element={<UploadVideo/>} />
          <Route path='/video/:id' element={<VideoDetail/>}></Route>
        </Routes>
        </div>
        </NavigationContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
export {NavigationContext};