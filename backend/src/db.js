const pgp = require("pg-promise")();
const config = require('config');
const uuidv4 = require('uuid/v4');

const db = pgp({
    host: config.get("db.host"),
    port: config.get("db.port"),
    database: config.get("db.database"),
    user: config.get("db.user"),
    password: config.get("db.password")
});

function getRooms(name) {
    return db.any("SELECT id, uuid, name FROM room WHERE name = ${name}", {
        name
    });
}

function getAllRooms() {
    return db.any("SELECT id, uuid, name FROM room");
}

function createRoom(name) {
    const uuid = uuidv4();
    return db.one("INSERT INTO room(uuid, name) VALUES(${uuid}, ${name}) RETURNING id, uuid, name", {
        uuid, name
    });
}

function getChat(room) {
    return db.any("SELECT message, sender FROM chat WHERE room = ${room} LIMIT 100", {
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

module.exports = { getRooms, getAllRooms, createRoom, getChat, createChat };
