var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

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
});

app.use(express.static('dist'))

app.get("/", function(req, res) {
   res.send("Hello world!");
});

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:mysecretpassword@localhost:5432/mytestdb')


server.listen(3000);
