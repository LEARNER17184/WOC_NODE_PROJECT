import { useState, useEffect, useContext } from 'react'
import './App.css'
import {App} from './App'
import ScrolltoBottom from 'react-scroll-to-bottom'
import { RoomContext } from './Context';
import { useNavigate } from 'react-router-dom';

function Chat({room,username,socket,setShowChat,showChat}) {
    const [messageList, setMessageList] = useState([])
    const [currentMessage, setcurrentMessage] = useState('')

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                message: currentMessage,
                author: username,
                room: room,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_msg', messageData)
            setMessageList((list) => [...list, messageData])
            console.log(messageData)
            setcurrentMessage('')
        }
    }

    const navigate = useNavigate()

    const Changed = () => {
        setShowChat(!showChat)
        navigate('/')
    }

    useEffect(() => {
        
        socket.on('recieve_msg', (data) => {
            setMessageList((list) => [...list, data])
        });
        return ()=>socket.removeListener('recieve_msg')
    }, [socket]);


    // console.log(username)

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'row', height: '99vh' }}>
            <div style={{ background: 'blue', minWidth: '20vw', minHeight: '100.15%' }}>
                <div style={{ color: 'black', background: 'yellow', minWidth: '18vw', minHeight: '64%', borderRadius: '5px', marginLeft: '0.5vw', marginRight: '0.5vw', marginTop: '0.5vh', marginBottom: '0.5vh', borderColor: 'black' }}>
                    <h3>{username}</h3>
                </div>
                <div style={{ background: 'orange', minWidth: '16vw', minHeight: '33%', justifyContent: 'center', alignContent: 'center' }}>
                    <button onClick style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Start</button>
                    <button onClick style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Room ID: {room}</button>
                    <button onClick={Changed} style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Leave</button>
                </div>
            </div>
            <div style={{ background: 'green', minWidth: '51vw', minHeight: '100.25%', marginBottom:'50px' }}>
                <div style={{ background: 'purple', minWidth: '49vw', minHeight: '8%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

                </div>
                <div style={{ background: 'black', minWidth: '49vw', minHeight: '58%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

                </div>
                <div style={{ background: 'blue', minWidth: '49vw', minHeight: '28%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

                </div>
            </div>
            <div className='chat-window' style={{height:'100%', minWidth: '29vw', minHeight: '100%' }}>
                <div className='chat-body' style={{minHeight:'95%'}}>
                    <ScrolltoBottom className='message-container'>
                        {
                            messageList.map((messages) => {
                                return (
                                    <div className='message' id='other' >
                                        <div className='message-content'>
                                            <p>{messages.message}</p>
                                        </div>
                                        <div className='message-meta'>
                                            <p id='time'>{messages.time}</p>
                                            <p id='author'>{messages.author}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ScrolltoBottom>
                </div>
                <div className='chat-footer' style={{height:'5%', }} >
                    <input type='text' value={currentMessage} placeholder='Type your message'
                        onChange={(event) => setcurrentMessage(event.target.value)} />
                    <button onClick={sendMessage}>&#9658;</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Chat







// //style={{background:'blue',borderRadius: '5px',marginLeft:'1vw',marginRight:'1vw',marginTop:'1vh',marginBottom:'1vh',minWidth:'27vw',minHeight:'98vh',borderColor: 'black'}}

// import { useState, useContext } from 'react';
// import ScrollToBottom from 'react-scroll-to-bottom';
// import { RoomContext } from './Context';
// import { useNavigate } from 'react-router-dom';

// function Chat({room,username,socket}) {
// //   const room = useContext(RoomContext);
// //   console.log(`Print room ${room}`);

//   const [messageList, setMessageList] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState('');

//   const navigate = useNavigate();

//   const changed = () => {
//     navigate('/');
//   };

//   return (
//     <>
//       <div style={{ display: 'flex', flexDirection: 'row', height: '99vh' }}>
//         {/* ... rest of your code */}
//         <button onClick={() => console.log(`button ${room}`)}>Hello </button>
//       </div>
//     </>
//   );
// }

// export default Chat;
