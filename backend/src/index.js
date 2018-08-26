var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
const {OAuth2Client} = require('google-auth-library');

const messages = [];

function loadHistory(socket, room) {
    db.any('SELECT message, sender FROM chat WHERE room = ${room}', { room })
      .then(function (messages) {
        socket.emit('load', {
            messages
        });
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })
}

function storeHistory({room, message, sender}) {
    db.none('INSERT INTO chat(room, message, sender) VALUES(${room}, ${message}, ${sender})', {
        room, message, sender
    })
    .then(() => {
        // success;
    })
    .catch(error => {
        console.log("error inserting", error)
    });
}

function addRoom(name) {
    db.none('INSERT INTO room(name) VALUES($1)', [name])
    .then(() => {
        loadRooms(null, all=true);
    })
    .catch(error => {
        console.log("error inserting", error)
    });
}

function loadRooms(socket, all=false) {
    db.any('SELECT name FROM room')
      .then(function (rooms) {
          if (all) {
              io.emit('loadRooms', rooms);
          } else {
              socket.emit('loadRooms', rooms);
          }
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })
}

const CLIENT_ID = "320665311927-28nv44ac7jfmbf3g4sejkt616c6gtqms.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

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
        const line = {
            room,
            sender,
            message,
        };
        storeHistory(line);
        io.to(room).emit('message', line);
    });

    socket.on('joinRoom', function(prevRoom, roomName) {
        socket.leave(prevRoom);
        socket.join(roomName);
        loadHistory(socket, roomName);
    })

    socket.on('join', async function(token){
        try {
            const ticket = await verify(token);
            const payload = ticket.getPayload();
            const name = payload.name;
            console.log(`${name} joined`);
            socket.emit('login', {name, token});
            io.emit('join', name);
            loadRooms(socket);
        } catch(err) {
            console.log(`unable to verify token ${token}, ${err}`)
        }
    });

    socket.on('addRoom', function(name){
        console.log(`creating room ${name}`);
        addRoom(name);
    });

});

app.use(express.static('public'))

app.get("/", function(req, res) {
   res.send("Hello world!");
});

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:pass@localhost:5432/chatdb')


server.listen(3000);
