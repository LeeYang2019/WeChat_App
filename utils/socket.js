const http = require('http');
const socketio = require('socket.io');

//get express app
const server = http.createServer();

const io = socketio(server);

function getApp(app) {
  return app;
}
