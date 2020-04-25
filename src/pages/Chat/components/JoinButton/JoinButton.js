import React from 'react';
import PropTypes from 'prop-types';

function JoinButton({ onHandleClick }) {
  //const onHandleClick = () => {
    /* if (!nickNameInput.current.value) {
      alert('Nickname is required!');
      nickNameInput.current.focus();
      return;
    }

    let peerConnected = peer.connect(id);
    peerConnected.on('open', () => {
      console.log('[peerConnected - open]', peerConnected.peer);
      setInCall(true);
    });

    peerConnected.on('data', (data) => {
      console.log('[peerConnected - data]', data);
      if (data && data.type === 'count') {
        setCount(data.count);
      }

      if (data && data.type === 'message') {
        addTextToChat(data);
      }
    });

    peerConnected.on('close', () => {
      console.log('[peerConnected - close]');
    });

    peerConnected.on('error', (err) => {
      console.log('[peerConnected - error]', err);
    });

    setPeerConnected(peerConnected); */
  //};

  return (<button
    className="btn btn-sm btn-primary mr-1"
    type="button"
    onClick={() => onHandleClick()}>
    Join
  </button>)
};

JoinButton.propTypes = {
  onHandleClick: PropTypes.func.isRequired,
};

export default JoinButton;
