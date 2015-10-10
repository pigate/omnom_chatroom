var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
});

var rooms = { 'default': [], 'chat1': []};

io.on('connection', function(socket){
  console.log(client_name, 'just joined');
  var address = socket.handshake.address;
  console.log(socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress)
  console.log('connected', socket.request.connection.remoteAddress);

  var client_name = 'anon' + Math.floor(Math.random()*10000000);
  var current_room = 'default';

  socket.join(current_room);
  rooms[current_room].push(socket);

  var broadcast_others_room = function(groupName, type_event, data){
    for(var i = 0; i < rooms[groupName].length; i++){
      var client = rooms[groupName][i];
      if (client == socket) continue;
      client.emit(type_event, data);
    }
  }

  broadcast_others_room(current_room, 'join', client_name + 'just joined');

  socket.on('roster-request', function(){
    socket.emit('roster-request-reply', JSON.stringify(Object.keys(rooms)));
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var i = rooms[current_room].indexOf(socket);
    rooms[current_room].splice(i, 1);
    broadcast_others_room(current_room, 'exit', client_name);
  });

  socket.on('chat message', function(msg){
    console.log('a message: ' + msg);
    broadcast_others_room(current_room, 'chat message', client_name + ": " + msg);
    socket.emit('chat message', 'you: ' + msg);
  });

  socket.on('typing', function(){
    broadcast_others_room(current_room, 'typing', client_name);
  });

  socket.on('request-join', function(groupName){
    console.log(client_name, 'requested join', groupName);
    var chat_reply = { "group": groupName, "success": true };
    if (groupName in rooms){
      var i = rooms[current_room].indexOf(socket);
      rooms[current_room].splice(i, 1);
      socket.join(groupName);
      current_room = groupName;
      rooms[current_room].push(socket);
    } else {
      chat_reply["success"] = false;
    }
    socket.emit('request-join-reply', JSON.stringify(chat_reply));
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
