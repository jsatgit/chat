const { createChat } = require('./db');
const server = require('./server');
const io = require('socket.io')(server);

io.on('connection', function(socket){ 
    console.log(`${socket.id} connected`);

    socket.on('disconnect', function(){
        console.log(`${socket.id} disconnected`);
    });

    socket.on('message', function({room, sender, message}){
        console.log(`${room} - ${sender}: ${message}`);
        const chat = { room, sender, message };
        createChat(chat)
        io.to(room).emit('message', chat);
    });

    socket.on('joinRoom', function({previousRoom, currentRoom}) {
        console.log('joining room', currentRoom)
        if (previousRoom) {
            socket.leave(previousRoom.id);
        }
        socket.join(currentRoom.id);
    })

});

