var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){ 
    console.log(`${socket.id} connected`);

    socket.on('disconnect', function(){
        console.log(`${socket.id} disconnected`);
    });

    socket.on('message', function(message){
        console.log(`${socket.id}: ${message}`);
        io.emit('message', {
            sender: socket.id,
            message,
        });
    });
});

app.use(express.static('dist'))

app.get("/", function(req, res) {
   res.send("Hello world!");
});

server.listen(3000);
