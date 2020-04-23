import React from 'react';
// import Api from '../ajaxConfig';

console.log(process.env.NODE_ENV);

export default function Home() {
  const uuid = require('uuid');

  function createCall() {
    /* const input_username = document.getElementById('username');
    if (!input_username.value) {
      input_username.focus();
      alert('Username is required!');
      return;
    } */

    /* Api.get('calls/v1/create')
      .then(response => {
        if (response.data) {
          window.location.href = `/calls/${response.data.id}`;
        }
      }).catch(err => console.log(err)); */

      window.location.href = `/calls/${uuid.v1()}/1`;
  }

  function join() {
    const input_callid = document.getElementById('callId');
    // const input_username = document.getElementById('username');

    if (!input_callid.value) {
      input_callid.focus();
      alert('Call ID is required!');
      return;
    }

    // if (!input_username.value) {
    //   input_username.focus();
    //   alert('Username is required!');
    //   return;
    // }

    /* Api.get('calls/' + input_callid.value)
      .then(response => {
        if (response.data) {
          window.location.href = `/calls/${response.data.id}/${input_username.value}`;
        } else {
          alert('Call not exist!');
        }
      }).catch(err => console.log(err)); */

      window.location.href = `/calls/${input_callid.value}`;
  }

  return (
    <div>
      <h2>Home</h2>
      <div>
        <label>Create/Join Chat</label><br />
        <input type="text" id="callId" name="callId" placeholder="Enter Call ID" autoFocus="autofocus" /><br />
        <input type="text" id="username" name="username" placeholder="Your Username" /><br />
        <button
          onClick={join}>Join</button>&nbsp;
        <button
          onClick={createCall}>Create</button>
      </div>
    </div>
  );
}
