const pgp = require("pg-promise")();

const db = pgp({
    host: "localhost",
    port: 5432,
    database: "chatdb",
    user: "postgres",
    password: "pass"
});

function getRooms(name) {
    if (name) {
        return db.any("SELECT id, name FROM room WHERE name = ${name}", {
            name
        });
    }

    return db.any("SELECT id, name FROM room");
}

function createRoom(name) {
    return db.one("INSERT INTO room(name) VALUES(${name}) RETURNING id, name", {
        name
    });
}

function getChat(room) {
    return db.any("SELECT message, sender FROM chat WHERE room = ${room}", {
        room
    });
}

function createChat({ room, message, sender }) {
    db.none(
        "INSERT INTO chat(room, message, sender) VALUES(${room}, ${message}, ${sender})",
        {
            room,
            message,
            sender
        }
    );
}

module.exports = { getRooms, createRoom, getChat, createChat };
