const { createChat } = require("./db");
const server = require("./server");
const io = require("socket.io")(server);

io.on("connection", function(socket) {
    console.log(`${socket.id} connected`);

    function joinRoom(user, room) {
        socket.join(room.uuid);
        console.log(`${user.name} joined ${room.name}`);
    }

    function leaveRoom(user, room) {
        socket.leave(room.uuid);
        console.log(`${user.name} left ${room.name}`);
    }

    socket.on("disconnect", function() {
        console.log(`${socket.id} disconnected`);
    });

    socket.on("message", function({ room, sender, message }) {
        const chat = { room: room.uuid, sender, message };
        console.log(`[${room.name}] ${sender}: ${message}`);
        createChat(chat);
        io.to(room.uuid).emit("message", chat);
    });

    socket.on("switchRoom", function({ user, previousRoom, currentRoom }) {
        if (previousRoom) {
            leaveRoom(user, previousRoom);
        }

        joinRoom(user, currentRoom);
    });

    socket.on("joinRoom", function({ user, room }) {
        joinRoom(user, room);
    });

    socket.on("leaveRoom", function({ user, room }) {
        leaveRoom(user, room);
    });
});
