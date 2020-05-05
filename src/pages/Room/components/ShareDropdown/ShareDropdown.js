import React from 'react';
import PropTypes from 'prop-types';

function ShareDropdown({ id }) {
  const shareToWhatsApp = () => {
    const url = encodeURIComponent(`https://moska-chat.herokuapp.com/calls/${id}`);
    window.open(`https://wa.me/?text=${url}`);
  }

  const copyToClipBoard = () => {
    const el = document.createElement('textarea');
    el.value = `https://moska-chat.herokuapp.com/calls/${id}`;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  return (
    <div className="dropdown">
      <button
        className="btn btn-success btn-sm btn-block dropdown-toggle"
        type="button" id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        Share this room
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button className="dropdown-item" onClick={() => shareToWhatsApp()}>WhatsApp</button>
        <button className="dropdown-item" onClick={() => copyToClipBoard()}>Copy Link</button>
      </div>
    </div>
  );
}

ShareDropdown.propTypes = {
  id: PropTypes.string
}

export default ShareDropdown;
