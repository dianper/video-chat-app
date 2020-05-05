import React from 'react';
import PropTypes from 'prop-types'
import './Video.css';

function Video({ id, autoplay, playsinline, muted }) {
  return <video
    id={id}
    className="video"
    autoPlay={autoplay}
    playsInline={playsinline}
    width="100%"
    muted={muted}></video>
}

Video.propTypes = {
  id: PropTypes.string.isRequired,
  autoplay: PropTypes.bool.isRequired,
  playsinline: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired
}

export default Video;