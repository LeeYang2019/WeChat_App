const path = require('path');
const express = require('express');
const socket = require('./utils/socket');

const app = socket.getExpress();
const server = socket.getServer();

//set static
app.use(express.static(path.join(__dirname, 'public')));

//listen to port
const port = process.env.port || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
