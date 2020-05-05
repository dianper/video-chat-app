import React from 'react';
import MySocket from '../../utils';
import './Header.css';

export default function Header() {
  function join() {
    document.getElementById('btnJoin').classList.add('d-none');
    document.getElementById('btnLeave').classList.remove('d-none');
    MySocket.emit('ready', window.roomId);
  }

  function leave() {
    document.getElementById('btnJoin').classList.remove('d-none');
    document.getElementById('btnLeave').classList.add('d-none');
    MySocket.emit('leave');
  }

  return (
    <header>
      <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
        <a className="navbar-brand" href="/">M.S.K Web Meeting</a>
        <div className="w-100 text-right">
          <button id="btnJoin" onClick={() => join()} className="btn btn-success d-none" type="button">Join</button>
          <button id="btnLeave" onClick={() => leave()} className="btn btn-danger d-none" type="button">Leave</button>
        </div>
      </nav>
    </header>
  )
}
