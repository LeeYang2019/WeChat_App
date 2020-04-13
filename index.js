const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

//run when a client connects
io.on('connection', (socket) => {
  //
  socket.on('joinRoom', ({ username, room }) => {
    //create a user with id, username, and room
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //send to client
    //send welcome message to a connecting user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //send msg to client
    //broadcast to the room user has joined
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `User ${username} has joined the chat.`)
      );

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for msg from client
  socket.on('chatMessage', (msg) => {
    //get user
    const user = getCurrentUser(socket.id);

    //relay client msg to user room displaying user
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //runs when client disconnects
  socket.on('disconnect', () => {
    //get user from array
    const user = userLeave(socket.id);

    //if user exists
    if (user) {
      //relay msg to user room that users left
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      //send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//listen to port
const port = process.env.port || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
