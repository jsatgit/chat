var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const messages = [];

function loadHistory(socket) {
    socket.emit('load', {
        messages
    });
}

function storeHistory(line) {
    messages.push(line);
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

server.listen(3000);
