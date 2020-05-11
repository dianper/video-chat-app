import React from 'react';
import PropTypes from 'prop-types'
import './Video.css';

function Video({ id, autoplay, playsinline, muted }) {
  return (<video
    id={id}
    className="card-img-top"
    autoPlay={autoplay}
    playsInline={playsinline}
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