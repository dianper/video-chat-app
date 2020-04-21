import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Peer from 'peerjs';

export default function Call() {
  /** TODO: Check if id exist */
  const { id } = useParams();
  const [mainPeer, setMainPeer] = useState();
  const [isEnable, setIsEnabled] = useState(false);

  useEffect(() => {
    function init() {
      const peer = new Peer(id);
      peer.on('open', () => {
        console.log('main connected', peer.id);
        setIsEnabled(true);
      });

      peer.on('error', (err) => {
        console.log(err);
      });

      peer.on('connection', (connection) => {
        connection.on('open', () => {
          console.log('peer connected', connection.peer);
          console.log('peer', peer);
        });
      });

      setMainPeer(peer);
    }

    init();
  }, [id]);

  function addConnection() {
    const np = new Peer();
    np.on('open', () => {
      const conn = np.connect(mainPeer.id);
      conn.on('open', () => {
        console.log('new peer', conn.peer);
      });
    });
  }

  return (
    <div>
      <h3>Call ID: {id}</h3>
      <div id="videos"></div>
      <button onClick={() => addConnection()} disabled={!isEnable}>Add connection</button>
    </div>
  );
}
