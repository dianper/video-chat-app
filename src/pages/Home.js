import React from 'react';
import Api from '../ajaxConfig';

function Home() {
  function createCall() {
    Api.get('calls/v1/create')
      .then(response => {
        if (response.data) {
          window.location.href = `/calls/${response.data.id}`
        }
      }).catch(err => console.log(err));
  }

  function join() {
    Api.get('calls/' + document.getElementById('callId').value)
      .then(response => {
        if (response.data) {
          window.location.href = `/calls/${response.data.id}`
        } else {
          alert('Call not exist!');
        }
      }).catch(err => console.log(err));
  }

  return (
    <div>
      <h2>Home</h2>
      <div>
        <label>Create/Join Chat</label><br />
        <input type="text" id="callId" name="callId" placeholder="Enter Call ID" /><br />
        <input type="text" id="username" name="username" placeholder="Your Username" /><br />
        <button
          onClick={join}>Join</button>&nbsp;
        <button
          onClick={createCall}>Create</button>
      </div>
    </div>
  );
}

export default Home;