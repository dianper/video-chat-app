import React, { useRef } from 'react';
import { emitEvent } from '../../utils/Socket';

export default function Home() {
  const roomNameRef = useRef();

  function createRoom() {
    if (!roomNameRef.current.value) {
      alert('Room name is required!');
      roomNameRef.current.focus();
      return;
    }

    const roomName = roomNameRef.current.value.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').join('-');
    emitEvent('createroom', roomName, () => {
      window.location.href = `/room/${roomName}`;
    });
  }

  return (
    <div className="container">
      <h2 className="text-center mb-4">Create Room</h2>
      <div className="row justify-content-center mb-2 mb-md-3">
        <div className="col-12 col-sm-8">
          <input
            ref={roomNameRef}
            className="form-control"
            type="text"
            id="roomName"
            name="roomName"
            placeholder="Room name e.g: Brothers"
            autoFocus="autofocus" />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-12 col-sm-4 col-md-3">
          <button
            className="btn btn-primary btn-block"
            onClick={() => createRoom()}>Create Room</button>
        </div>
      </div>
    </div>
  );
}
