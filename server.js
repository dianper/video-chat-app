const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { RoomState } = require('./src/constants/RoomState');
const port = process.env.PORT || 5080;
const delay = 1500;
const limitPerRoom = 9;
var rooms;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './build')));

/* NO MATH PATH */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

io.on('error', (err) => console.log(err));
io.on('connection', socket => {
  if (!rooms) rooms = new Object();

  socket.on('createroom', (roomId, cb) => {
    initRoom(roomId, () => socket.emit('createroom', socket.id, cb));
  });

  socket.on('checkroom', (roomId, cb) => {
    if (!rooms[roomId]) {
      socket.emit('checkroom', RoomState.Unavailable, socket.id, cb);
      return;
    }

    if (rooms[roomId].users.length === limitPerRoom) {
      socket.emit('checkroom', RoomState.Full, socket.id, cb);
      return;
    }

    socket.emit('checkroom', RoomState.Available, socket.id, cb);
  });

  socket.on('ready', (roomId) => {
    initRoom(roomId, () => rooms[roomId].users.push(socket.id));
    socket.roomId = roomId;
    socket.join(roomId);

    const sockets = getSocketsByRoomId(socket.roomId);
    Object.keys(sockets).forEach((socketId, index) => {
      if (socket.id !== socketId) {
        setTimeout(() => {
          socket.to(socketId).emit('join', socket.id);
        }, index * delay);
      }
    });
  });

  socket.on('leave', () => {
    updateRooms(socket.roomId, socket.id);
    io.emit('leave', socket.id);
    socket.leave(socket.roomId);
  });

  socket.on('offer', (id, data) => {
    socket.to(id).emit('offer', socket.id, data);
  });

  socket.on('answer', (id, data) => {
    socket.to(id).emit('answer', socket.id, data);
  });

  socket.on('candidate', (id, data) => {
    socket.to(id).emit('candidate', socket.id, data);
  });

  socket.on('disconnect', () => {
    if (socket.roomId) {
      updateRooms(socket.roomId, socket.id);
      io.emit('leave', socket.id);
      socket.leave(socket.roomId);
    }
  });

  function updateRooms(roomId, socketId) {
    if (rooms[roomId]) {
      const userPosition = rooms[roomId].users.findIndex(user => user === socketId);
      if (userPosition > -1) {
        rooms[roomId].users.splice(userPosition, 1);
      }
    }
  }

  function getSocketsByRoomId(roomId) {
    const room = io.sockets.adapter.rooms[roomId] || {};
    return room.sockets || {};
  }

  function initRoom(roomId, cb) {
    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }

    cb && cb();
  }
});

/* LISTEN */
server.listen(port, () => console.log(`Listening on port ${port}`));
