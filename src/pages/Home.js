import React from 'react';

export default function Home() {
  const uuid = require('uuid');

  function createCall() {
    window.location.href = `/calls/${uuid.v1()}/1`;
  }

  function join() {
    const input_callid = document.getElementById('callId');

    if (!input_callid.value) {
      input_callid.focus();
      alert('Call ID is required!');
      return;
    }

    window.location.href = `/calls/${input_callid.value}`;
  }

  return (
    <div>
      <h2 className="mt-4 mb-4">Join / Create Chat</h2>
      <div className="row justify-content-center">
        <div className="col-6">
          <input
            className="form-control"
            type="text"
            id="callId"
            name="callId"
            placeholder="Enter Call ID"
            autoFocus="autofocus" /><br />
          <button
            className="btn btn-success"
            onClick={join}>Join</button>&nbsp;
            <button
            className="btn btn-primary"
            onClick={createCall}>Create</button>
        </div>
      </div>
    </div>
  );
}
