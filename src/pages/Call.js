import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import Peer from 'peerjs';

export default function Call() {
  /** TODO: Check if id exist */
  const { id } = useParams();

  useEffect(() => {
    const peer = new Peer(id);
    peer.on('open', () => {
      console.log('connected.', peer.id);
    });
  }, []);

  return (
    <div>
      <h3>Call ID: {id}</h3>
      <div id="videos"></div>
    </div>
  );
}
