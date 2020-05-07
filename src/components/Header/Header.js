import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
        <a className="navbar-brand" href="/">M.S.K Web Meeting</a>
        <div className="w-100 text-right">
          <button id="btnJoin" className="btn btn-success d-none" type="button">Join</button>
          <button id="btnLeave" className="btn btn-danger d-none" type="button">Leave</button>
        </div>
      </nav>
    </header>
  )
}
