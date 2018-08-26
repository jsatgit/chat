var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json())

var server = require('http').createServer(app);
var io = require('socket.io')(server);
const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = "320665311927-28nv44ac7jfmbf3g4sejkt616c6gtqms.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);


function getRooms() {
    return db.any('SELECT id, name FROM room');
}

function createRoom(name) {
    return db.one('INSERT INTO room(name) VALUES(${name}) RETURNING id, name', {name})
}

function getChat(room) {
    return db.any('SELECT message, sender FROM chat WHERE room = ${room}', { room });
}

function createChat({room, message, sender}) {
    db.none('INSERT INTO chat(room, message, sender) VALUES(${room}, ${message}, ${sender})', {
        room, message, sender
    });
}

function verify(token) {
    return client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
}

io.on('connection', function(socket){ 
    console.log(`${socket.id} connected`);

    socket.on('disconnect', function(){
        console.log(`${socket.id} disconnected`);
    });

    socket.on('message', function({room, sender, message}){
        console.log(`${room} - ${sender}: ${message}`);
        const chat = {
            room,
            sender,
            message,
        };
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

app.use(express.static('public'))

app.get("/", function(req, res) {
   res.send("Hello world!");
});

app.post("/api/login", async function(req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }

    const token = req.body.token;
    if (!token) {
        return res.sendStatus(400)
    }

    try {
        const ticket = await verify(token);
        const payload = ticket.getPayload();
        const name = payload.name;
        console.log(`${name} logged in`);
        const user = { name }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(user));
    } catch(err) {
        console.error(err);
        return res.sendStatus(401)
    }
})

app.get("/api/rooms", async function(req, res) {
    const rooms = await getRooms();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(rooms));
})

app.post("/api/room", async function(req, res) {
    if (!req.body) {
        return res.sendStatus(400)
    }

    const name = req.body.name;
    if (!name) {
        return res.sendStatus(400)
    }

    const room = await createRoom(name);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(room));
})


app.get("/api/chat/:room", async function(req, res) {
    const room = req.params.room;
    if (!room) {
        return res.sendStatus(400);
    }

    const chat = await getChat(room);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(chat));
})

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:pass@localhost:5432/chatdb')


server.listen(3000);
