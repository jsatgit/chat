const { createChat } = require("./db");
const server = require("./server");
const io = require("socket.io")(server);

io.on("connection", function(socket) {
    socket.on("message", function({ room, sender, message }) {
        const chat = { room, sender, message };
        console.log(`[${room}] ${sender}: ${message}`)
        createChat(chat);
        io.to(room).emit("message", chat);
    });

    socket.on("joinRoom", function({ previousRoom, currentRoom }) {
        if (previousRoom) {
            socket.leave(previousRoom.id);
        }
        socket.join(currentRoom.id);
    });
});
