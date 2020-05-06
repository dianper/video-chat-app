import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MySocket from '../../utils';
import { Video } from './components';
import { GetTimeString, GetUserMedia } from '../../utils';
import { useParams } from 'react-router-dom';
import { iceServers } from '../../config';
import { withBrowserContext } from '../../contexts';

function Room({ onSetRoomName }) {
  const { roomName } = useParams();
  if (!roomName) window.location.href = '/';

  const peerConnections = {};
  const addRemoteVideo = (e, remoteId) => {
    if (!document.getElementById(remoteId)) {
      const div = document.createElement('div');
      const remoteVideo = document.createElement('video');
      div.className = "col-6 col-md-3";
      remoteVideo.setAttribute('id', remoteId);
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

  const removeRemoteVideo = remoteId => {
    peerConnections[remoteId] && peerConnections[remoteId].close();
    delete peerConnections[remoteId];
    if (document.getElementById(remoteId)) {
      document.getElementById(remoteId).parentElement.remove();
    }
  }

  useEffect(() => {
    MySocket.on('connect', () => {
      GetUserMedia((stream) => {
        window.localStream = stream;
        document.getElementById('localVideo').srcObject = stream;
      });

      MySocket.on('join', socketId => {
        const date = GetTimeString('pt-Br');
        console.log(`${date} - ${socketId} joined..`);
        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnections[socketId] = peerConnection;

        window.localStream
          .getTracks().forEach(track => peerConnection.addTrack(track, window.localStream));

        peerConnection.createOffer()
          .then(sdp => peerConnection.setLocalDescription(new RTCSessionDescription(sdp)))
          .then(() => MySocket.emit('offer', socketId, peerConnection.localDescription))
          .catch(err => console.log('createOffer.err', err));

        peerConnection.ontrack = e => {
          console.log('ontrack', e, socketId);
          addRemoteVideo(e, socketId);
        }

        peerConnection.onicecandidate = e => {
          if (e.candidate) {
            console.log('onicecandidate', e, socketId);
            MySocket.emit('candidate', socketId, e.candidate);
          }
        }
      });

      MySocket.on('offer', (soketId, data) => {
        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnections[soketId] = peerConnection;

        window.localStream
          .getTracks().forEach(track => peerConnection.addTrack(track, window.localStream));

        peerConnection.setRemoteDescription(data)
          .then(() => peerConnection.createAnswer())
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => MySocket.emit('answer', soketId, peerConnection.localDescription))
          .catch(err => console.log('offer.setRemoteDescription.err', err));

        peerConnection.ontrack = e => {
          console.log('ontrack', e, soketId);
          addRemoteVideo(e, soketId);
        }

        peerConnection.onicecandidate = e => {
          if (e.candidate) {
            console.log('onicecandidate', e, soketId);
            MySocket.emit('candidate', soketId, e.candidate);
          }
        }
      });

      MySocket.on('answer', (soketId, data) => {
        console.log('answer', soketId, data);
        peerConnections[soketId]
          .setRemoteDescription(data)
          .catch(err => console.log('answer.setRemoteDescription.err', err));
      });

      MySocket.on('candidate', (soketId, data) => {
        console.log('candidate', soketId, data);
        peerConnections[soketId]
          .addIceCandidate(new RTCIceCandidate(data))
          .catch(err => console.log('addIceCandidate.err', err));
      });

      MySocket.on('leave', soketId => {
        console.log('leave', soketId);
        if (soketId === MySocket.id) {
          Object.keys(peerConnections).forEach(key => removeRemoteVideo(key));
        } else {
          removeRemoteVideo(soketId);
        }
      });
    });

    onSetRoomName(roomName);
  }, [])

  return (
    <>
      <h2 className="text-center mb-4">Room <span id="roomName">#{roomName}</span></h2>
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

Room.propTypes = {
  onSetRoomName: PropTypes.func,
}

export default withBrowserContext(Room);
