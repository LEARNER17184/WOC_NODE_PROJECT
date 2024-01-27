const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    }
})

const roomUsernames = {};


io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data.room);
        console.log(`User ${socket.id} joined room ${data.room}`);

        if (!roomUsernames[data.room]) {
            roomUsernames[data.room] = [];
        }

        if (!roomUsernames[data.room].includes(data.username)) {
            roomUsernames[data.room].push(data.username);
        }
        // roomUsernames[data.room].push(data.username);
        io.to(data.room).emit('update_user_list', roomUsernames[data.room]);
    });

    socket.on('send_msg', (data) => {
        socket.to(data.room).emit('recieve_msg', data);
    });

    socket.on('draw', (data) => {
        socket.to(data.room).emit('draw', data);

        const drawingState = data/* Get the initial drawing state for the room */;
        socket.emit('initial_drawing_state', drawingState);
    });

    socket.on('brush_size_change', ({ room, size }) => {
        socket.to(room).emit('brush_size_change', { size });
    });

    socket.on('brush_color_change', ({ room, color }) => {
        socket.to(room).emit('brush_color_change', { color });
    });

    socket.on('leave_room', (data) => {
        console.log(`User ${socket.id} leaving room ${data.room}`);
        const index = roomUsernames[data.room]?.indexOf(data.username);
        if (index !== -1) {
            roomUsernames[data.room].splice(index, 1);

            io.to(data.room).emit('update_user_list', roomUsernames[data.room]);
        }
    });

    socket.on('clear_canvas', ({ room }) => {
        io.to(room).emit('clear_canvas');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

server.listen(3001,() => {
    console.log('Server running')
})