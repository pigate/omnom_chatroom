var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
});

var clients = [];

io.on('connection', function(socket){
  clients.push(socket);
  socket.broadcast.emit('hi');

  console.log('connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
    var i = clients.indexOf(socket);
    clients.splice(i, 1);
    broadcast_others('exit', 'someone exited');
  });
  socket.on('chat message', function(msg){
    console.log('a message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('typing', function(){
    //socket.broadcast.emit('typing', 'is typing...');
    broadcast_others('typing', 'is typing...');
  });
  var broadcast_others = function(type_event, data){
    for(var i = 0; i < clients.length; i++){
      if (clients[i] == socket) continue;
      clients[i].emit(type_event, data);
    }
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
