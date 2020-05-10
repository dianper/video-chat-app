import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Video } from './components';
import { GetUserMedia } from '../../utils';
import { emitEvent } from '../../utils/Socket';
import { BsCameraVideoFill, BsMicFill } from 'react-icons/bs';
import './Room.css';

export default function Room() {
  const { roomName } = useParams();
  if (!roomName) window.location.href = '/';

  useEffect(() => {
    GetUserMedia()
      .then(stream => {
        window.localStream = stream;
        document.getElementById('localVideo').srcObject = stream;
        document.getElementById('btnJoin').classList.remove('d-none');
      })
      .catch(err => console.log(err));

    if (document.getElementById("btnJoin")) {
      document.getElementById("btnJoin").addEventListener("click", () => {
        document.getElementById('btnJoin').classList.add('d-none');
        document.getElementById('btnLeave').classList.remove('d-none');
        emitEvent('ready', roomName);
      });
    }

    if (document.getElementById("btnLeave")) {
      document.getElementById("btnLeave").addEventListener("click", () => {
        document.getElementById('btnJoin').classList.remove('d-none');
        document.getElementById('btnLeave').classList.add('d-none');
        emitEvent('leave');
      });
    }
  }, [roomName]);

  function copyToClipBoard() {
    const textArea = document.createElement('textarea');
    textArea.value = `https://moska-chat.herokuapp.com/room/${roomName}`;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Link room copied!');
  }

  return (
    <>
      <div className="row m-1">
        <div className="col-8 text-truncate">
          <h2 onClick={() => copyToClipBoard()} className="d-none d-sm-block copy"><span id="roomName">#{roomName}</span></h2>
          <h4 onClick={() => copyToClipBoard()} className="d-md-none copy"><span id="roomName">#{roomName}</span></h4>
        </div>
        <div className="col-4 text-right align-self-center">
          <button className="btn btn-sm btn-danger mr-1"><BsCameraVideoFill className="align-baseline" /></button>
          <button className="btn btn-sm btn-danger"><BsMicFill className="align-baseline" /></button>
        </div>
      </div>
      <div className="row m-1">
        <div className="col-12 text-center">
          <div className="row" id="videos">
            <div className="col-4 col-md-2 mb-3">
              <Video id="localVideo" muted={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
