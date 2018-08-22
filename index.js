var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
const {OAuth2Client} = require('google-auth-library');

const messages = [];

function loadHistory(socket) {
    db.any('SELECT message, sender FROM messages')
      .then(function (messages) {
        socket.emit('load', {
            messages
        });
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      })
}

function storeHistory(line) {
    db.none('INSERT INTO messages(message, sender) VALUES($1, $2)', [line.message, line.sender])
    .then(() => {
        // success;
    })
    .catch(error => {
        console.log("error inserting", error)
    });
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
    loadHistory(socket);

    socket.on('disconnect', function(){
        console.log(`${socket.id} disconnected`);
    });

    socket.on('message', function({sender, message}){
        console.log(`${sender}: ${message}`);
        const line = {
            sender,
            message,
        };
        storeHistory(line);
        io.emit('message', line);
    });

    socket.on('join', async function(token){
        try {
            const ticket = await verify(token);
            const payload = ticket.getPayload();
            const name = payload.name;
            console.log(`${name} joined`);
            socket.emit('login', {name, token});
            io.emit('join', name);
        } catch {
            console.log(`unable to verify token ${token}`)
        }
    });
});

app.use(express.static('dist'))

app.get("/", function(req, res) {
   res.send("Hello world!");
});

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:mysecretpassword@localhost:5432/mytestdb')


server.listen(3000);
