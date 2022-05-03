const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');

const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'))
app.use(cors());



app.get('/', (req, res) => {
    res.sendFile("index.html");
});

app.get('/room', (req, res) => {
    console.log(req.query)

    io.on('connection', (socket) => {
        socket.broadcast.emit('connection', req.query.username);
    
        socket.on('chat message', (chat) => {
            socket.broadcast.emit('chat message', chat);
        });
    
        socket.on('typing', (nickname)=> {
            socket.broadcast.emit('typing', nickname);
        })
    
        socket.on('disconnect', () => {
            socket.broadcast.emit("offline");
        })
    })
    
    res.sendFile(__dirname + "/public/room.html")
})




server.listen(3000, () => {
    console.log("listening on port 3000....");
})
