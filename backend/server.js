const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = 3000

app.get('/', (req, res) => {
    res.send('hello world');
});

io.sockets.on('connection', socket => {

    //socket.emit('assign', { polite: true }); // Assign politeness

    socket.on('description', data => {
        socket.broadcast.to(data.socketID).emit('description', data); // Send to specific user
    });

    socket.on('candidate', data => {
        socket.broadcast.to(data.socketID).emit('candidate', data);
    });

    socket.on('peerList', () => {
        io.emit('peerList', Object.keys(io.sockets.clients().sockets));
    });

    socket.on('disconnect', () => {
        io.emit('peerList', Object.keys(io.sockets.clients().sockets));
    });
});

server.listen(PORT, () => console.log(`Start server on port ${PORT}...`));