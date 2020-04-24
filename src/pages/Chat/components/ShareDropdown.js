import React from 'react';
import PropTypes from 'prop-types';

function ShareDropdown({ onHandleWhatsApp, onHandleCopyLink }) {
  return (
    <div className="dropdown">
      <button className="btn btn-success btn-sm btn-block dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Share this room
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <button className="dropdown-item" onClick={onHandleWhatsApp}>WhatsApp</button>
        <button className="dropdown-item" onClick={onHandleCopyLink}>Copy Link</button>
      </div>
    </div>
  );
}

ShareDropdown.propTypes = {
  onHandleWhatsApp: PropTypes.func.isRequired,
  onHandleCopyLink: PropTypes.func.isRequired
};

export default ShareDropdown;