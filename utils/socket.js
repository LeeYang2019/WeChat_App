const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'WeChat Bot';

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('message', formatMessage(botName, 'Welcome to WeChat'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${username} has joined the chat.`)
      );
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

module.exports.getExpress = () => {
  return app;
};

module.exports.getServer = () => {
  return server;
};
