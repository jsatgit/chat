const { getRooms, createRoom, getChat } = require("./db");
const app = require("./app");
const { verify } = require("./google");
const bodyParser = require("body-parser");
const express = require("express");
const favicon = require('serve-favicon')
const path = require('path')

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.send("Welcome to chat!");
});

app.post("/api/login", async function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const token = req.body.token;
    if (!token) {
        return res.sendStatus(400);
    }

    try {
        const ticket = await verify(token);
        const payload = ticket.getPayload();
        const name = payload.name;
        const user = { name };
        
        console.log(`${name} logged in`);

        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(user));
    } catch (err) {
        console.error(err)
        return res.sendStatus(401);
    }
});

app.get("/api/rooms", async function(req, res) {
    const rooms = await getRooms();
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(rooms));
});

app.post("/api/room", async function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const name = req.body.name;
    if (!name) {
        return res.sendStatus(400);
    }

    const room = await createRoom(name);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(room));
});

app.get("/api/chat/:room", async function(req, res) {
    const room = req.params.room;
    if (!room) {
        return res.sendStatus(400);
    }

    const chat = await getChat(room);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(chat));
});
