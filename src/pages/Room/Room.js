import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Video } from './components';
import { GetUserMedia } from '../../utils';
import { emitEvent } from '../../utils/Socket';
import { BsCameraVideoFill, BsMicFill } from 'react-icons/bs';
import { RoomState } from '../../constants/RoomState';
import './Room.css';

export default function Room() {
  const { roomName } = useParams();
  if (!roomName) window.location.href = '/';

  const [roomState, setRoomState] = useState();

  useEffect(() => {
    emitEvent('checkroom', roomName, (state) => {
      setRoomState(state);

      if (state === RoomState.Available) {
        GetUserMedia()
          .then(stream => {
            window.localStream = stream;
            document.getElementById('localVideo').srcObject = stream;
            document.getElementById('btnJoin').classList.remove('d-none');
          })
          .catch(err => console.log(err));
      }
    });
  }, [roomName]);

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

  function renderAlert() {
    if (roomState) {
      const message = roomState === RoomState.Full ? 'The room is full.' : 'The room is unavailable.';
      return (<div className="alert alert-danger m-3" role="alert">{message}</div>);
    }
  }

  function renderRoom() {
    return (<>
      <div className="row m-1">
        <div className="col-8 text-truncate">
          <h2 onClick={() => copyToClipBoard()} className="d-none d-sm-block copy"><span id="roomName">#{roomName}</span></h2>
          <h4 onClick={() => copyToClipBoard()} className="d-sm-none copy"><span id="roomName">#{roomName}</span></h4>
        </div>
        <div className="col-4 text-right align-self-center">
          <button className="btn btn-sm btn-danger mr-1"><BsCameraVideoFill className="align-baseline" /></button>
          <button className="btn btn-sm btn-danger"><BsMicFill className="align-baseline" /></button>
        </div>
      </div>
      <div className="row m-1" id="videos">
        <div id="wrpLocal" className="col-4 col-md-3 bg-video align-self-start text-center">
          <Video id="localVideo" muted={true} />
        </div>        
      </div>
    </>);
  }

  return (
    <>
      {roomState === RoomState.Available ? renderRoom() : renderAlert()}
    </>
  );
}
