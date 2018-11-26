const { createChat } = require("./db");
const server = require("./server");
const io = require("socket.io")(server);

io.on("connection", function(socket) {
    console.log(`${socket.id} connected`)

    socket.on('disconnect', function () {
        console.log(`${socket.id} disconnected`)
    });

    socket.on("message", function({ room, sender, message }) {
        const chat = { room: room.uuid, sender, message };
        console.log(`[${room.name}] ${sender}: ${message}`)
        createChat(chat);
        io.to(room.uuid).emit("message", chat);
    });

    socket.on("switchRoom", function({ user, previousRoom, currentRoom }) {
        if (previousRoom) {
            socket.leave(previousRoom.uuid);
        }

        socket.join(currentRoom.uuid);
        console.log(`${user.name} joined ${currentRoom.name}`)
    });
});
