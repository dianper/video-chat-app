const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './build')));

/* NO MATH PATH */

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
});

io.on('connection', socket => {
    console.log(`${socket.id} joined`);
});

/* LISTEN */
server.listen(port, () => console.log(`Listening on port ${port}`));