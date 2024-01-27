import { useState, useEffect, useContext, useRef } from 'react'
import './App.css'
import ScrolltoBottom from 'react-scroll-to-bottom'
import { useNavigate } from 'react-router-dom';

function Chat({room,username,socket,setShowChat,showChat}) {
    const [messageList, setMessageList] = useState([])
    const [currentMessage, setcurrentMessage] = useState('')
    const [userList, setUserList] = useState([]);
    const [brushSize, setBrushSize] = useState(2);
    const [brushColor, setBrushColor] = useState('black');

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    // const navigate = useNavigate()

    const handleClearCanvas = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        socket.emit('clear_canvas', { room });
        const clearedCanvasState = {
            cleared: true,
        };
        localStorage.setItem('drawingState', JSON.stringify(clearedCanvasState));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        contextRef.current = context;

        socket.on('draw', ({ x, y, type }) => {
            if (type === 'mousedown') {
                contextRef.current.beginPath();
                contextRef.current.moveTo(x, y);
            } else if (type === 'mousemove') {
                contextRef.current.lineTo(x, y);
                contextRef.current.stroke();
            }
        });

        socket.on('clear_canvas', () => {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        });

        return () => {
            socket.off('draw');
            socket.off('clear_canvas');
        };
    }, [socket]);

    const handleCanvasMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        socket.emit('draw', { x: offsetX, y: offsetY, type: 'mousedown',room , brushSize, brushColor });
    };

    const handleCopyRoomId = () => {
        const roomIdButton = document.getElementById('roomIdButton');
        const roomId = roomIdButton.innerText.replace('Room ID: ', '');
        const range = document.createRange();
        const tempElement = document.createElement('span');
        tempElement.textContent = roomId;
        document.body.appendChild(tempElement);
        range.selectNode(tempElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        document.body.removeChild(tempElement);
        window.getSelection().removeAllRanges();
    };

    const handleCanvasMouseMove = (e) => {
        if (e.buttons !== 1) return;
        const { offsetX, offsetY } = e.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        socket.emit('draw', { x: offsetX, y: offsetY, type: 'mousemove', room, brushSize, brushColor });
    
        // Save drawing state to local storage
        const drawingState = {
            x: offsetX,
            y: offsetY,
            type: 'mousemove',
            brushSize,
            brushColor,
        };
    
        // Retrieve existing drawing states from local storage
        const existingDrawingStates = JSON.parse(localStorage.getItem('drawingStates')) || [];
    
        // Add the current drawing state to the existing states
        const updatedDrawingStates = [...existingDrawingStates, drawingState];
    
        // Save the updated drawing states back to local storage
        localStorage.setItem('drawingStates', JSON.stringify(updatedDrawingStates));
    };

    const handleBrushSizeChange = (size) => {
        setBrushSize(size);
        contextRef.current.lineWidth = size;
        socket.emit('brush_size_change', { room, size });
    };

    // Function to handle changes in brush color
    const handleBrushColorChange = (color) => {
        setBrushColor(color);
        contextRef.current.strokeStyle = color;
        socket.emit('brush_color_change', { room, color });
        localStorage.setItem('brushColor', color);
    };

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                message: currentMessage,
                author: username,
                room: room,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
            }
            await socket.emit('send_msg', messageData);
            setMessageList((list) => [...list, messageData]);
            setcurrentMessage('');
    
            // Save messages to local storage
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            messages.push(messageData);
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    }

    const navigate = useNavigate()

    const Changed = () => {
        socket.emit('leave_room', { room, username });
        setShowChat(!showChat)
        navigate('/')

        Object.keys(localStorage).forEach((key) => {
            localStorage.removeItem(key);
        });
    }

    useEffect(() => {
        const storedColor = localStorage.getItem('brushColor');
        if (storedColor) {
            setBrushColor(storedColor);
            contextRef.current.strokeStyle = storedColor;
        }
        const storedDrawingState = localStorage.getItem('drawingState');
        if (storedDrawingState) {
            const parsedState = JSON.parse(storedDrawingState);
            // Apply the drawing state (either redraw or keep cleared)
            if (parsedState.cleared) {
                contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            } else {
                contextRef.current.beginPath();
                contextRef.current.moveTo(parsedState.x, parsedState.y);
                contextRef.current.lineTo(parsedState.x, parsedState.y);
                contextRef.current.stroke();
            }
        }

    },[])

    useEffect(() => {
        socket.on('initial_drawing_state', (drawingState) => {
            if (drawingState && drawingState.x && drawingState.y && drawingState.type) {
                const { x, y, type, brushSize, brushColor } = drawingState;
                if (type === 'mousedown') {
                    contextRef.current.beginPath();
                    contextRef.current.moveTo(x, y);
                } else if (type === 'mousemove') {
                    contextRef.current.lineTo(x, y);
                    contextRef.current.stroke();
                }
            }
        });

        const savedDrawingStates = JSON.parse(localStorage.getItem('drawingStates')) || [];
        savedDrawingStates.forEach((drawingState) => {
            const { x, y, type, brushSize, brushColor } = drawingState;
            if (type === 'mousedown') {
                contextRef.current.beginPath();
                contextRef.current.moveTo(x, y);
            } else if (type === 'mousemove') {
                contextRef.current.lineTo(x, y);
                contextRef.current.stroke();
            }
        });

        const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        setMessageList(savedMessages);

        socket.on('recieve_msg', (data) => {
            setMessageList((list) => [...list, data])
        });


        socket.on('update_user_list', (userList) => {
            setUserList(userList);
        });

        socket.on('brush_size_change', ({ size }) => {
            setBrushSize(size);
            contextRef.current.lineWidth = size;
        });

        socket.on('brush_color_change', ({ color }) => {
            setBrushColor(color);
            contextRef.current.strokeStyle = color;
        });

        return ()=>{
            socket.removeListener('recieve_msg')
            socket.removeListener('update_user_list')
            socket.removeListener('brush_size_change');
            socket.removeListener('brush_color_change');
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
                    <button id="roomIdButton" onClick={handleCopyRoomId} style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Room ID: {room}</button>
                    <button onClick={Changed} style={{ marginLeft: '2vw', marginRight: '2vw', marginTop: '2vh', marginBottom: '2vh' }}> Leave</button>
                </div>
            </div>
            <div style={{ background: 'rgb(241, 235, 235)', minWidth: '51vw', minHeight: '100.25%', marginBottom:'50px' }}>
                <div style={{ background: 'rgb(199, 240, 236)', minWidth: '49vw', minHeight: '8%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black' }}>

                </div>
                <div style={{ background: 'white', minWidth: '49vw', minHeight: '58%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black', position: 'relative'  }}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    style={{ cursor: 'crosshair', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                />
                </div>
                <div style={{ background: 'rgb(199, 240, 236)', minWidth: '49vw', minHeight: '28%', borderRadius: '5px', marginLeft: '1vw', marginRight: '1vw', marginTop: '1vh', marginBottom: '1vh', borderColor: 'black', display: 'flex', flexDirection: 'row'}}>
                <div style={{ display: 'flex', alignItems: 'center', paddingRight: '10vw', paddingLeft: '5vw' }}>
                        <label style={{ paddingRight: '5px' }}>Brush Size:</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={brushSize}
                            onChange={(e) => handleBrushSizeChange(parseInt(e.target.value, 10))}
                            
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ marginRight: '5px' }}>Brush Color:</label>
                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => handleBrushColorChange(e.target.value)}
                        />
                    </div>
                    <div>
                    <button onClick={handleClearCanvas}>Clear Canvas</button>
                    </div>
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