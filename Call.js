const uuid = require('uuid');

var calls = [];

function Call() {
    this.id = uuid.v1();
    this.peers = [];
}

exports.createCall = function () {
    if (calls.length < 10) {
        const call = new Call();
        calls.push(call);
        return call;
    }

    return null;
};

exports.getCallById = function (id) {
    return calls.find(call => call.id === id);
};

exports.getAllCalls = function () {
    return calls;
}

exports.addPeer = function (call, peerId) {
    if (call.peers.indexOf(peerId) > -1) return call;

    call.peers.push(peerId);
    return call;
}

exports.removePeer = function (call, peerId) {
    const index = call.peers.indexOf(peerId);
    if (index > -1) {
        call.peers.splice(index, 1);
    }
}

exports.clear = function () {
    while (calls.length) calls.pop();
    return calls;
}
