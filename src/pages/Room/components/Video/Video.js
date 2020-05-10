import React from 'react';
import PropTypes from 'prop-types'
import './Video.css';

function Video({ id, autoplay, playsinline, muted }) {
  return (<video
    id={id}
    className="rounded"
    autoPlay={autoplay}
    playsInline={playsinline}
    width="100%"
    max-height="100%"
    muted={muted}></video>);
}

Video.defaultProps = {
  autoplay: true,
  playsinline: true,
  muted: false
};

Video.propTypes = {
  id: PropTypes.string.isRequired,
  autoplay: PropTypes.bool,
  playsinline: PropTypes.bool,
  muted: PropTypes.bool
};

export default Video;