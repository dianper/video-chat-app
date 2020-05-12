import io from 'socket.io-client';
import { IceServersConfigs, SocketConfigs } from '../config';
import { GetTimeString } from './';

const peerConnections = {};
const socket = io(SocketConfigs.uri, SocketConfigs.transports);

socket.on('connect', () => {
  socket.on('join', socketId => {
    const date = GetTimeString('pt-Br');
    console.log(`${date} - ${socketId} joined..`);

    const peerConnection = new RTCPeerConnection(IceServersConfigs);
    peerConnections[socketId] = peerConnection;

    window.localStream
      .getTracks().forEach(track => peerConnection.addTrack(track, window.localStream));

    peerConnection.createOffer()
      .then(sdp => peerConnection.setLocalDescription(new RTCSessionDescription(sdp)))
      .then(() => socket.emit('offer', socketId, peerConnection.localDescription))
      .catch(err => console.log(err));

    peerConnection.ontrack = e => {
      const date = GetTimeString('pt-Br');
      console.log(`${date} - ${socketId} ontrack...`);
      addRemoteVideo(e, socketId);
    }

    peerConnection.onicecandidate = e => {
      if (e.candidate) {
        const date = GetTimeString('pt-Br');
        console.log(`${date} - ${socketId} onicecandidate...`);
        socket.emit('candidate', socketId, e.candidate);
      }
    }
  });

  socket.on('offer', (socketId, data) => {
    const date = GetTimeString('pt-Br');
    console.log(`${date} - ${socketId} offer..`);

    const peerConnection = new RTCPeerConnection(IceServersConfigs);
    peerConnections[socketId] = peerConnection;

    window.localStream
      .getTracks().forEach(track => peerConnection.addTrack(track, window.localStream));

    peerConnection.setRemoteDescription(data)
      .then(() => peerConnection.createAnswer())
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => socket.emit('answer', socketId, peerConnection.localDescription))
      .catch(err => console.log(err));

    peerConnection.ontrack = e => {
      const date = GetTimeString('pt-Br');
      console.log(`${date} - ${socketId} ontrack...`);
      addRemoteVideo(e, socketId);
    }

    peerConnection.onicecandidate = e => {
      if (e.candidate) {
        const date = GetTimeString('pt-Br');
        console.log(`${date} - ${socketId} onicecandidate..`);
        socket.emit('candidate', socketId, e.candidate);
      }
    }
  });

  socket.on('answer', (socketId, data) => {
    const date = GetTimeString('pt-Br');
    console.log(`${date} - ${socketId} answer..`);

    peerConnections[socketId]
      .setRemoteDescription(data)
      .catch(err => console.log(err));
  });

  socket.on('candidate', (socketId, data) => {
    const date = GetTimeString('pt-Br');
    console.log(`${date} - ${socketId} candidate..`);

    peerConnections[socketId]
      .addIceCandidate(new RTCIceCandidate(data))
      .catch(err => console.log(err));
  });

  socket.on('leave', socketId => {
    const date = GetTimeString('pt-Br');
    console.log(`${date} - ${socketId} leave..`);

    if (socketId === socket.id) {
      Object.keys(peerConnections).forEach(key => removeRemoteVideo(key));
    } else {
      removeRemoteVideo(socketId);
    }
  });

  socket.on('checkroom', (roomState, id, cb) => {
    if (id === socket.id) cb && cb(roomState);
  });

  socket.on('createroom', (id, cb) => {
    if (id === socket.id) cb && cb();
  });
});

function addRemoteVideo(e, remoteId) {
  if (!document.getElementById(remoteId)) {
    const div = document.createElement('div');
    div.setAttribute('id', `wrp${remoteId}`);
    div.className = "col-4 col-md-3 bg-video align-self-start text-center";

    const remoteVideo = document.createElement('video');
    remoteVideo.setAttribute('id', remoteId);
    remoteVideo.srcObject = e.streams[0];
    remoteVideo.autoplay = true;
    remoteVideo.setAttribute('width', '100%');
    remoteVideo.setAttribute('playsinline', true);
    remoteVideo.play();

    div.appendChild(remoteVideo);
    document.getElementById('videos').appendChild(div);
    reorderVideosByHeight();
  }
}

function removeRemoteVideo(remoteId) {
  peerConnections[remoteId] && peerConnections[remoteId].close();
  delete peerConnections[remoteId];
  if (document.getElementById(remoteId)) {
    document.getElementById(remoteId).parentElement.remove();
    reorderVideosByHeight();
  }
}

function reorderVideosByHeight() {
  const listVideos = [];
  const videoNodes = document.querySelectorAll('div#videos')[0] || [];

  videoNodes
    .forEach(item => listVideos.push({ id: item.id, height: item.offsetHeight }));

  listVideos
    .sort((a, b) => a.height - b.height)
    .map((item, index) => document.getElementById(item.id).style.order = index + 1);
}

function emitEvent(event, data, cb) {
  socket.emit(event, data, cb);
}

export { emitEvent };