const { getRooms, getAllRooms, createRoom, getChat } = require("./db");
const app = require("./app");
const { verify } = require("./google");
const bodyParser = require("body-parser");
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const jwt = require("express-jwt");
const config = require("config");

app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.send("Welcome to chat!");
});

function sendJson(res, obj) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(obj));
    return res;
}

app.post("/api/login", async function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const { token, platform } = req.body;
    if (!token) {
        return res.sendStatus(400);
    }

    try {
        const ticket = await verify(token, platform);
        const payload = ticket.getPayload();
        const { name, email, picture, locale } = payload;
        const user = { name };

        console.log({ name, email, picture, locale }, "logged in");

        sendJson(res, user);
    } catch (err) {
        console.error(err);
        return res.sendStatus(401);
    }
});

app.get(
    "/api/allrooms",
    jwt({ secret: config.get("jwtSecret") }),
    async function(req, res) {
        const rooms = await getAllRooms();
        sendJson(res, rooms);
    }
);

app.get("/api/rooms", async function(req, res) {
    const name = req.query.name;
    const rooms = await getRooms(name);
    sendJson(res, rooms);
});

app.post("/api/room", async function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const name = req.body.name;
    if (!name) {
        return res.sendStatus(400);
    }

    try {
        const room = await createRoom(name);
        sendJson(res, room);
    } catch (err) {
        console.error(err);
        res.sendStatus(409);
    }
});

app.get("/api/chat/:room", async function(req, res) {
    const room = req.params.room;
    if (!room) {
        return res.sendStatus(400);
    }

    const chat = await getChat(room);
    sendJson(res, chat);
});
