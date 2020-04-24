const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5080;
const { ExpressPeerServer } = require('peer');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './build')));

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const peerServer = ExpressPeerServer(server, { debug: true });

app.use('/peerjs', peerServer);

/* NO MATH PATH */

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
});