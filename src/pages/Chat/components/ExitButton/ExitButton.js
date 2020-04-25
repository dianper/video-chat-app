import React from 'react';
import PropTypes from 'prop-types';

function ExitButton({ onHandleClick }) {
  //const onHandleClick = () => {
  /* peer.disconnect();
  peer.destroy();
  window.location.href = '/'; */
  //};

  return (<button
    className="btn btn-sm btn-danger mr-1"
    type="button"
    onClick={() => onHandleClick()}>
    Exit
  </button>)
};

ExitButton.propTypes = {
  onHandleClick: PropTypes.func.isRequired,
};

export default ExitButton;
