const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = 3001

app.use(express.static('public'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'), err => {
        if (err) {
            res.status(500).send(err)
        }
    })
})

io.sockets.on('connection', socket => {

    console.log(`${socket.id} connected!`);

    socket.on('join', data => {

        const numClients =
            data.room && data.room in io.sockets.adapter.rooms
                ? io.sockets.adapter.rooms[data.room].length
                : 0;

        if (numClients === 0) {
            socket.join(data.room);
            socket.emit('join', { isJoin: true, polite: true });
            console.log(`${socket.id} joined ${data.room}.`);
        } else if (numClients === 1) {
            socket.join(data.room);
            socket.emit('join', { isJoin: true, polite: false });
            console.log(`${socket.id} joined ${data.room}.`);
        } else {
            socket.emit('join', { isJoin: false });
            console.log(`${socket.id} rejected from ${data.room}.`);
        }
    });


    socket.on('description', data => {
        if (data.room && data.room in io.sockets.adapter.rooms
            && socket.id in io.sockets.adapter.rooms[data.room].sockets) {

            socket.broadcast.in(data.room).emit('description', data); // Send to peer
        }
    });

    socket.on('candidate', data => {
        if (data.room && data.room in io.sockets.adapter.rooms
            && socket.id in io.sockets.adapter.rooms[data.room].sockets) {

            socket.broadcast.in(data.room).emit('candidate', data);
        }
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected!`);
    });
});

server.listen(PORT, () => console.log(`Start server on port ${PORT}...`));