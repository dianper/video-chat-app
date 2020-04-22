import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import Peer from 'peerjs';

export default function Call() {
  const { id, isnew } = useParams();
  const isNew = !!(isnew && parseInt(isnew) === 1);
  const uuid = require('uuid');
  const peerId = isNew ? id : uuid.v1();
  const peer = new Peer(peerId);

  const [myPeerId, setMyPeerId] = useState();
  const [connections, setConnections] = useState([]);
  const [message, setMessage] = useState();
  const [isReadyToJoin, setReadyToJoin] = useState(false);
  const [inCall, setInCall] = useState(false);

  const chatInput = useRef(null);

  useEffect(() => {
    //sendNotification(message);
  }, [connections, message]);

  useEffect(() => {
    peer.on('open', () => {
      setMyPeerId(peer.id);
      setReadyToJoin(true);
    });

    peer.on('connection', (connection) => {
      connection.on('open', () => {
        setConnections(connections => [...connections, { id: connection.peer, conn: connection }]);
        //setMessage({ id: connection.peer, message: 'joined' });
        printMessage({ id: connection.peer, message: 'joined' });
      });

      connection.on('data', (data) => {
        printMessage({ id: data.id, message: data.message });
      })

      connection.on('close', () => {
        console.log(connections);
        printMessage({ id: connection.peer, message: 'left' });
      });
    });

    peer.on('disconnected', () => {
      console.log('disconnected');
    });

    peer.on('error', (err) => {
      console.log(err);
    });
  }, []);

  function sendNotification(data) {
    if (connections.length && data) {
      connections.forEach(item => {
        item.conn.send(data);
      });
    }
  }

  function join() {
    const peerConnected = peer.connect(id);
    peerConnected.on('open', () => {});
    peerConnected.on('data', (data) => {
      if (data.id === peer.id) {
        setInCall(true);
      }

      printMessage({ id: data.id, message: data.message });
    })

    peerConnected.on('close', () => {
      printMessage({ id: peerConnected.peer, message: 'left' });
    });
  }

  function printMessage(data) {
    chatInput.current.innerText += `${data.id} - ${data.message}\n`;
  }

  return (
    <div>
      <h3>{myPeerId ? `Call ID: ${myPeerId}` : "# getting id.. #"}</h3>
      <div id="videos"></div>
      {!isNew && isReadyToJoin && !inCall && <button onClick={() => join()}>Join</button>}
      <br />
      <a href={`/calls/${id}`} target="_blank" rel="noopener noreferrer">Share</a>
      <br /><br />
      <code ref={chatInput}></code>
    </div>
  );
}
