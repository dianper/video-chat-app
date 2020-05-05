import React, { useRef } from 'react';

export default function Home() {
  const roomNameRef = useRef();

  function createRoom() {
    if (!roomNameRef.current.value) {
      alert('Room name is required!');
      roomNameRef.current.focus();
      return;
    }

    const roomName = roomNameRef.current.value.replace(/[^\w\s]/gi, '').split(' ').join('-');
    window.location.href = `/room/${roomName}`;
  }

  return (
    <>
      <h2 className="text-center mb-4">Create Room</h2>
      <div className="row justify-content-center mb-2 mb-md-3">
        <div className="col-12 col-md-6">
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
        <div className="col-12 col-md-2">
          <button
            className="btn btn-primary btn-block"
            onClick={() => createRoom()}>Create Room</button>
        </div>
      </div>
    </>
  );
}
