var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var request = require('request');
var routes = require('./routes/index');

var port = process.env.PORT || 8080;

app.use(express.static(process.cwd() + '/views'));

app.use('/', routes);

io.on('connection', function(socket){
  socket.on('add name', function(name){
    io.emit('create stock', name);
  });/*
  socket.on('not found', function(){
    io.emit('not found');
  });
  socket.on('already have', function() {
     io.emit('already have'); 
  });*/
});

server.listen(port);
