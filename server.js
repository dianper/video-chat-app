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

/* START API */

const {
    createCall,
    getCallById,
    getAllCalls,
    addPeer,
    removePeer,
    clear
} = require('./Call');

app.get('/api/calls', (req, res) => {
    res.json(getAllCalls());
});

app.get('/api/calls/v1/create', (req, res) => {
    res.json(createCall());
});

app.get('/api/calls/:callid', (req, res) => {
    res.json(getCallById(req.params.callid));
});

app.get('/api/calls/:callid/peers', (req, res) => {
    const call = getCallById(req.params.callid);

    if (!call) res.status(404).json({ message: 'Call not found' });

    res.json(call.peers);
});

app.get('/api/calls/:callid/peers/v1/addpeer/:peerid', (req, res) => {
    const call = getCallById(req.params.callid);

    if (!call) res.status(404).json({ message: 'Call not found' });

    res.json(addPeer(call, req.params.peerid));
});

app.get('/api/calls/:callid/peers/v1/removepeer/:peerid', (req, res) => {
    const call = getCallById(req.params.callid);

    if (!call) res.status(404).json({ message: 'Call not found' });

    res.json(removePeer(call, req.params.peerid));
});

app.get('/api/clearCalls', (req, res) => {
    res.json(clear());
});

/* END API */

/* NO MATH PATH */

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
});