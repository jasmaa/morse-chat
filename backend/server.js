const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = 3000

app.get('/', (req, res) => {
    res.send('hello world');
});

io.sockets.on('connection', socket => {

    socket.on('join', data => {

        console.log(socket);

        const numClients =
            data.room && data.room in io.sockets.adapter.rooms
                ? io.sockets.adapter.rooms[data.room].length
                : 0;

        if (numClients === 0) {
            socket.join(data.room);
            socket.emit('join', { isJoin: true, polite: true });
        } else if (numClients === 1) {
            socket.join(data.room);
            socket.emit('join', { isJoin: true, polite: false });
        } else {
            socket.emit('join', { isJoin: false });
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
        console.log('Disconnected');
    });
});

server.listen(PORT, () => console.log(`Start server on port ${PORT}...`));