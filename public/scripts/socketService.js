'use strict';
function SocketService(){
  var service = {}

  var ws = new WebSocket("ws://" + window.location.hostname + (location.port ? ':' + location.port : ''));

  ws.onopen = function(){
    console.log('socket connected');
  };

  ws.onmessage = function(msg){
    console.log("get message");
    console.log(JSON.parse(msg.data));
  };

  function sendRequest(req, cb){
    console.log('Sending request', req);
    ws.send(JSON.stringify(request));
  }

  service.sendRequest = sendRequest;
  return service;
}
