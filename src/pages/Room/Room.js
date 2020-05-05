import React, { useEffect } from 'react';
import MySocket from '../../utils';
import { Video } from './components';
import { GetUserMedia } from '../../utils';
import { useParams } from 'react-router-dom';
import { iceServers } from '../../config';

export default function Room() {
  const { id } = useParams();
  if (!id) window.location.href = '/';
  window.roomId = id;

  const peerConnections = {};
  const addRemoteVideo = (e, id) => {
    if (!document.getElementById(id)) {
      const div = document.createElement('div');
      const remoteVideo = document.createElement('video');
      div.className = "col-6 col-md-3";
      remoteVideo.setAttribute('id', id);
      remoteVideo.className = "video";
      remoteVideo.srcObject = e.streams[0];
      remoteVideo.playsinline = "true";
      remoteVideo.autoplay = "true";
      remoteVideo.setAttribute('width', '100%');
      remoteVideo.play();
      div.appendChild(remoteVideo);
      document.getElementById('videos').appendChild(div);
    }
  }

  const removeRemoteVideo = (id) => {
    peerConnections[id] && peerConnections[id].close();
    delete peerConnections[id];
    if (document.getElementById(id)) {
      document.getElementById(id).parentElement.remove();
    }
  }

  useEffect(() => {
    MySocket.on('connect', () => {
      GetUserMedia((stream) => {
        window.localStream = stream;
        document.getElementById('btnJoin').classList.remove('d-none');
        document.getElementById('localVideo').srcObject = stream;
      });

      MySocket.on('join', id => {
        const date = new Date(Date.now()).toLocaleTimeString('pt-Br');
        console.log(`${date} - ${id} joined..`);
        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnections[id] = peerConnection;

        window.localStream
          .getTracks().forEach(track => peerConnection.addTrack(track, window.localStream));

        peerConnection.createOffer()
          .then(sdp => peerConnection.setLocalDescription(new RTCSessionDescription(sdp)))
          .then(() => MySocket.emit('offer', id, peerConnection.localDescription))
          .catch(err => console.log('createOffer.err', err));

        peerConnection.ontrack = e => {
          console.log('ontrack', e, id);
          addRemoteVideo(e, id);
        }

        peerConnection.onicecandidate = e => {
          if (e.candidate) {
            console.log('onicecandidate', e, id);
            MySocket.emit('candidate', id, e.candidate);
          }
        }
      });

      MySocket.on('offer', (id, data) => {
        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnections[id] = peerConnection;

        window.localStream
          .getTracks().forEach(track => peerConnection.addTrack(track, window.localStream));

        peerConnection.setRemoteDescription(data)
          .then(() => peerConnection.createAnswer())
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => MySocket.emit('answer', id, peerConnection.localDescription))
          .catch(err => console.log('offer.setRemoteDescription.err', err));

        peerConnection.ontrack = e => {
          console.log('ontrack', e, id);
          addRemoteVideo(e, id);
        }

        peerConnection.onicecandidate = e => {
          if (e.candidate) {
            console.log('onicecandidate', e, id);
            MySocket.emit('candidate', id, e.candidate);
          }
        }
      });

      MySocket.on('answer', (id, data) => {
        console.log('answer', id, data);
        peerConnections[id]
          .setRemoteDescription(data)
          .catch(err => console.log('answer.setRemoteDescription.err', err));
      });

      MySocket.on('candidate', (id, data) => {
        console.log('candidate', id, data);
        peerConnections[id]
          .addIceCandidate(new RTCIceCandidate(data))
          .catch(err => console.log('addIceCandidate.err', err));
      });

      MySocket.on('leave', id => {
        console.log('leave', id);
        removeRemoteVideo(id);
      });
    });
  }, [])

  return (
    <>
      <h2 className="text-center mb-4">Room <span id="roomName">#{id}</span></h2>
      <div className="row mt-5">
        <div className="col-12 text-center">
          <div className="row" id="videos">
            <div className="col-6 col-md-3">
              <Video
                id="localVideo"
                autoplay={true}
                playsinline={true}
                muted={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
