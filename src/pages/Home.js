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
      <div className="row mb-3 justify-content-center">
        <div className="col-10 col-md-8 col-lg-6">
          <input
            className="form-control"
            type="text"
            id="callId"
            name="callId"
            placeholder="Enter Call ID"
            autoFocus="autofocus" />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-12">
          <button
            className="btn btn-success mr-1"
            onClick={() => join()}>Join</button>
            <button
            className="btn btn-primary"
            onClick={() => createCall()}>Create</button>
        </div>
      </div>
    </div>
  );
}
