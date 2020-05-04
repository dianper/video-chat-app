import React, { useEffect } from 'react';

export default function Home() {
  const uuid = require('uuid');

  function createCall() {
    window.location.href = `/calls/${uuid.v1()}/1`;
  }

  useEffect(() => {
    document.getElementById('btnJoin').classList.remove('d-none');
  }, [])

  return (
    <div>
      <h2 className="text-center mb-4">Create Room</h2>
      <div className="row mb-2">
        <div className="col-12">
          <input
            className="form-control"
            type="text"
            id="roomId"
            name="roomId"
            placeholder="Room name e.g: Brothers"
            autoFocus="autofocus" />
        </div>
      </div>
      <div className="row justify-content-md-end">
        <div className="col-12 col-md-3">
          <button
            className="btn btn-primary btn-block"
            onClick={() => createCall()}>Create</button>
        </div>
      </div>
    </div>
  );
}
