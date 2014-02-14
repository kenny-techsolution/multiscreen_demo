// web.js

var logfmt = require("logfmt");
var express = require("express");
var app = express();
var port = Number(process.env.PORT || 5000);

app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  socket.on('room', function(room) {
        socket.join(room);
  });

  socket.on('fromPaloAlto', function (data) {
    socket.broadcast.to('screens').emit('bush', data);
    console.log(data);
  });

  socket.on('fromBush', function (data) {
	  socket.broadcast.to('screens').emit('paloAlto', data);
  });

});