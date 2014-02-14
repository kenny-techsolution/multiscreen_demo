// web.js

var logfmt = require("logfmt");
var express = require("express");
var app = express();
var port = Number(process.env.PORT || 5000);

app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});