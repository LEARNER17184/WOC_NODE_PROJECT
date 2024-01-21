import './App.css';
import Card from '@mui/material/Card';
import Chat from './Chat';
import io from 'socket.io-client'
import { useState } from 'react';

const socket = io.connect('http://localhost:3001')


function App({navigation}) {

  const [userName,setUserName] = useState('')
  const [room,setRoom] = useState('')
  const [showChat,setShowChat] = useState(false)

  const joinRoom = () => {
    if(userName !== '' && room !== '') {
      console.log(room)
      const data={
        room: room,
        username: userName
      }
      socket.emit('join_room',data)
      setShowChat(true)
    }
  }

  const createRoom = () => {
    if (userName !== '') {
      const newRoom = Math.floor(Math.random() * 100).toString();
      setRoom(newRoom);
      const data={
        room: newRoom,
        username: userName
      }
      socket.emit('join_room', data);

      setShowChat(true);
    }
  };

  return (
    <div className='App'>
      {!showChat? (
      <>
        <div style={{height: '0.5vh', marginTop:'0px', marginBottom:'10vh'}} >
          <div class="containerk">
            <h2 class="title">
              <span class="title-word title-word-1">DRAW </span>
              <span class="title-word title-word-2">YOUR </span>
              <span class="title-word title-word-3">WAY </span>
              <span class="title-word title-word-4">OUT</span>
            </h2>
          </div>
        </div> 
      <div className='joinChatContainer'>
        <Card style={{justifyContent: "center",
        alignItems: "center", paddingBottom: '10px'}}>
          <b><p style={{color: 'green', fontSize: 20}}>Create a room</p></b>
          <b>Username:</b><br/>
          <input type='text' placeholder='Name..'
          onChange={(event) => {setUserName(event.target.value)}}/>
          <button onClick={createRoom}> Create room</button>
        </Card>
      </div>
      <div className='joinChatContainer'>
        <Card style={{justifyContent: "center",
        alignItems: "center", paddingBottom: '10px'}}>
          <b><p style={{color: 'green', fontSize: 20, textDecorationThickness: 80}}>Join a room</p></b>
          <b>Username:</b><br/>
          <input type='text' placeholder='Name..' 
          onChange={(event) => {setUserName(event.target.value)}}/>
          <br/>
          <b>Room:</b><br/>
          <input type='text' placeholder='Room id..' 
          onChange={(event) => {setRoom(event.target.value)}}/>
          <button onClick={joinRoom}> Join room</button>
        </Card>
      </div>
      </>):
      (<Chat room={room} username={userName} socket={socket} setShowChat={setShowChat} showChat={showChat} />)}
    </div>
  );
}

export default App;