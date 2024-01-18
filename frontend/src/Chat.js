import { useState, useEffect, useContext } from 'react'
import './App.css'
import ScrolltoBottom from 'react-scroll-to-bottom'
import { useNavigate } from 'react-router-dom';

function Chat({room,username,socket,setShowChat,showChat}) {
    const [messageList, setMessageList] = useState([])
    const [currentMessage, setcurrentMessage] = useState('')
    const [userList, setUserList] = useState([]);

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
        socket.emit('leave_room', { room, username });
        setShowChat(!showChat)
        navigate('/')
    }

    useEffect(() => {
        socket.on('recieve_msg', (data) => {
            setMessageList((list) => [...list, data])
        });

        socket.on('update_user_list', (userList) => {
            setUserList(userList);
        });

        return ()=>{
            socket.removeListener('recieve_msg')
            socket.removeListener('update_user_list')
        }
    }, [socket]);

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'row', height: '99vh' }}>
            <div style={{ background: 'rgb(241, 235, 235)', minWidth: '20vw', minHeight: '100.15%' }}>
                <div style={{ justifyContent:'center', color: 'black', background: '#f3d9a2', minWidth: '18vw', minHeight: '64%', borderRadius: '5px', marginLeft: '0.5vw', marginRight: '0.5vw', marginTop: '0.5vh', marginBottom: '0.5vh', borderColor: 'black' }}>
                    <h3>Players:</h3>
                    {userList.map((user) => (
                        <ul>
                        <li><h4 key={user} marginLeft='5px'>{user}</h4></li>
                        </ul>
                    ))}
                </div>
                <div style={{ background: 'rgb(241, 235, 235)', minWidth: '16vw', minHeight: '33%', justifyContent: 'center', alignContent: 'center' }}>
                    <button onClick style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Start</button>
                    <button onClick style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Room ID: {room}</button>
                    <button onClick={Changed} style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Leave</button>
                </div>
            </div>
            <div style={{ background: 'rgb(241, 235, 235)', minWidth: '51vw', minHeight: '100.25%', marginBottom:'50px' }}>
                <div style={{ background: 'rgb(199, 240, 236)', minWidth: '49vw', minHeight: '8%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

                </div>
                <div style={{ background: 'white', minWidth: '49vw', minHeight: '58%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

                </div>
                <div style={{ background: 'rgb(199, 240, 236)', minWidth: '49vw', minHeight: '28%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

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