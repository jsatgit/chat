var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){ 
    console.log("user connected");

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('message', function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

app.use(express.static('dist'))

app.get("/", function(req, res) {
   res.send("Hello world!");
});

server.listen(3000);
