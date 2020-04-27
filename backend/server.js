const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = 3000

app.get('/', (req, res) => {
    res.send('hello world');
});

io.sockets.on('connection', socket => {

    socket.on('description', () => {
        console.log('Description');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => console.log(`Start server on port ${PORT}...`));