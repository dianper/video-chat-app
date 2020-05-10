import io from 'socket.io-client';
import { iceServerConfiguration, socketURL } from '../config';
import { GetTimeString } from './';

const peerConnections = {};
const socket = io(socketURL, {
  transports: ['websocket']
});

socket.on('connect', () => {
  socket.on('join', socketId => {
    const date = GetTimeString('pt-Br');
    console.log(`${date} - ${socketId} joined..`);

    const peerConnection = new RTCPeerConnection(iceServerConfiguration);
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

    const peerConnection = new RTCPeerConnection(iceServerConfiguration);
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

  socket.on('full', socketId => {
    if (socketId === socket.id) {
      alert('The room is full');
      document.getElementById('btnJoin').classList.remove('d-none');
      document.getElementById('btnLeave').classList.add('d-none');
    }
  });
});

function addRemoteVideo(e, remoteId) {
  if (!document.getElementById(remoteId)) {
    const div = document.createElement('div');
    const remoteVideo = document.createElement('video');
    div.className = "col-4 col-md-2 mb-3";
    remoteVideo.setAttribute('id', remoteId);
    remoteVideo.className = "rounded";
    remoteVideo.srcObject = e.streams[0];
    remoteVideo.autoplay = true;
    remoteVideo.setAttribute('playsinline', true);
    remoteVideo.setAttribute('width', '100%');
    remoteVideo.setAttribute('max-height', '100%');
    remoteVideo.play();
    div.appendChild(remoteVideo);
    document.getElementById('videos').appendChild(div);
  }
}

function removeRemoteVideo(remoteId) {
  peerConnections[remoteId] && peerConnections[remoteId].close();
  delete peerConnections[remoteId];
  if (document.getElementById(remoteId)) {
    document.getElementById(remoteId).parentElement.remove();
  }
}

function emitEvent(event, data) {
  socket.emit(event, data);
}

export { emitEvent };