import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import Peer from 'peerjs';

export default function Call() {
  const { id, isnew } = useParams();
  const isNew = !!(isnew && parseInt(isnew) === 1);
  const uuid = require('uuid');
  const peerId = isNew ? id : uuid.v1();
  const peer = new Peer(peerId, {
    host: 'moska-chat.herokuapp.com',
    port: 443,
    path: '/peerjs'
  });

  const [myPeerId, setMyPeerId] = useState();
  const [actCnns, setCnns] = useState([]);
  const [isReadyToJoin, setReadyToJoin] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [count, setCount] = useState(0);
  let peerConnected;

  const chatInput = useRef(null);
  const textInput = useRef(null);

  useEffect(() => {
    peer.on('open', () => {
      setMyPeerId(peer.id);
      setReadyToJoin(true);
      console.log('[peer - open]', peer.id);
    });

    peer.on('connection', (connection) => {
      console.log('[peer - connection]', connection.peer);

      connection.on('open', () => {
        console.log('[peer - connection - open]', connection.peer);
        setCnns(actCnns => [...actCnns, { id: connection.peer, cn: connection }]);
        setCount(count => count + 1);
      });

      connection.on('data', (data) => {
        console.log('[peer - data]', data);
      })

      connection.on('close', () => {
        console.log('[peer - close]', connection.peer);
        setCnns(actCnns => actCnns.filter(item => item.id !== connection.peer));
        setCount(count => count - 1);
      });
    });

    peer.on('disconnected', () => {
      console.log('[peer - disconnected]');
    });

    peer.on('error', (err) => {
      console.log('[peer - error]', err);
    });
  }, []);

  useEffect(() => {
    actCnns.forEach(item => {
      item.cn.send({ type: 'count', count });
    });
  }, [actCnns, count]);

  function join() {
    peerConnected = peer.connect(id);
    peerConnected.on('open', () => {
      console.log('[peerConnected - open]', peerConnected.peer);
      setInCall(true);
    });

    peerConnected.on('data', (data) => {
      console.log('[peerConnected - data]', data);
      if (data && data.type === 'count') {
        setCount(data.count);
      }
    })

    peerConnected.on('close', () => {
      console.log('[peerConnected - close]');
    });

    peerConnected.on('error', (err) => {
      console.log('[peerConnected - error]', err);
    });
  }

  function send() {
    const message = textInput.current.value || "dummy message";

    if (peerConnected) {
      peerConnected.send(message);
    }

    actCnns.forEach(item => {
      item.cn.send(message);
    });
  }

  return (
    <div>
      <h3>{myPeerId ? `Call ID: ${myPeerId}` : "# getting id.. #"}</h3>
      <div id="videos"></div>
      {!isNew && isReadyToJoin && !inCall && <button onClick={() => join()}>Join</button>}
      <br />
      {count > 0 ? `${count} online - ` : 'nobody online :( - '}
      <a href={`/calls/${id}`} target="_blank" rel="noopener noreferrer">Share</a>
      <br /><br />
      <code ref={chatInput}></code>
      <br /><br />
      <input type="text" ref={textInput}></input>
      <br /><br />
      <button onClick={send}>Send</button>
    </div>
  );
}
