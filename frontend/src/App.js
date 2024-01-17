import './App.css';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Chat from './Chat';
import io from 'socket.io-client'
import {BrowserRouter as Router,Routes,Route, useNavigate} from 'react-router-dom'

// window.showChat = false
const socket = io.connect('http://localhost:3001')


function App({navigation}) {

  const [userName,setUserName] = useState('')
  const [room,setRoom] = useState('')
  const [showChat,setShowChat] = useState(false)

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const joinRoom = () => {
    if(userName !== '' && room !== '') {
      console.log(room)
      socket.emit('join_room',room)
      setShowChat(true)
      // navigation.navigate(`/room/${room}`,{
      //   username: userName,
      //   socket: socket
      // })
    }
  }

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
  };

  // const createRoom = () => {
  //   if(userName !== '') {
  //     setRoom(Math.floor(Math.random() * 100));
  //     // await delay(1000)
  //     // setTimeout(()=>{},1000)
  //     console.log(room)
  //     socket.emit('join_room',room)
  //     // joinRoom()
  //     setShowChat(true)
  //   }
  // }

  const createRoom = () => {
    if (userName !== '') {
      const newRoom = Math.floor(Math.random() * 100);
      setRoom(newRoom);
      
      // Emit 'join_room' event after setting the room
      socket.emit('join_room', newRoom);

      // Show the chat or perform other actions related to the room
      setShowChat(true);
    }
  };

  // const navigate = useNavigate()

  return (
    <div className='App'>
      {!showChat? (
      <>
        {/* <div style={{height: '0.5vh', marginTop:'0px', marginBottom:'5vh'}} >
          <div class="containerk">
            <h2 class="title">
              <span class="title-word title-word-1">DRAW</span>
              <span class="title-word title-word-2">YOUR</span>
              <span class="title-word title-word-3">WAY</span>
              <span class="title-word title-word-4">OUT</span>
            </h2>
          </div>
        </div> */}
      {/* <div className="App">   */}
        <h1>DRAW YOUR WAY OUT</h1>
      <div className='joinChatContainer'>
        <Card style={{justifyContent: "center",
        alignItems: "center", paddingBottom: '10px'}}>
          <h4>Create a room</h4>
          <input type='text' placeholder='Name..'
          onChange={(event) => {setUserName(event.target.value)}}/>
          <button onClick={createRoom}> Create room</button>
        </Card>
      </div>
      <div className='joinChatContainer'>
        <Card style={{justifyContent: "center",
        alignItems: "center", paddingBottom: '10px'}}>
          <h4>Join a room</h4>
          <input type='text' placeholder='Name..' 
          onChange={(event) => {setUserName(event.target.value)}}/>
          <input type='text' placeholder='Room id..' 
          onChange={(event) => {setRoom(event.target.value)}}/>
          <button onClick={joinRoom}> Join room</button>
        </Card>
      </div>
      </>):
      (<Chat room={room} username={userName} socket={socket} setShowChat={setShowChat} showChat={showChat} />)}
      {/* (<></>)} */}
    </div>
  );
}

export default App;

// import './App.css';
// import { useEffect, useState } from 'react';
// import { Card } from '@mui/material';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
// import Chat from './Chat';
// import { RoomContext } from './Context';

// const socket = io.connect('http://localhost:3001');

// function App() {
//   const [userName, setUserName] = useState('');
//   const [room, setRoom] = useState('');
//   const navigate = useNavigate();

//   const joinRoom = () => {
//     if (userName !== '' && room !== '') {
//       socket.emit('join_room', room);
//       navigate('/room');
//     }
//   };

//   return (
//     <RoomContext.Provider value={room}>
//       <div className="App">
//         <h1>DRAW YOUR WAY OUT</h1>
//         <div className='joinChatContainer'>
//           <Card style={{ justifyContent: "center", alignItems: "center", paddingBottom: '10px' }}>
//             <h4>Create a room</h4>
//             <input type='text' placeholder='Name..' onChange={(event) => { setUserName(event.target.value) }} />
//             <button onClick={joinRoom}> Create room</button>
//           </Card>
//         </div>
//         <div className='joinChatContainer'>
//           <Card style={{ justifyContent: "center", alignItems: "center", paddingBottom: '10px' }}>
//             <h4>Join a room</h4>
//             <input type='text' placeholder='Name..' onChange={(event) => { setUserName(event.target.value) }} />
//             <input type='text' placeholder='Room id..' onChange={(event) => { setRoom(event.target.value) }} />
//             <button onClick={joinRoom}> Join room</button>
//           </Card>
//         </div>
//       </div>
//       {/* <Chat /> */}
//     </RoomContext.Provider>
//   );
// }

// export default App;
