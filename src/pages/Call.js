import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import Peer from 'peerjs';
import {
  ExitButton,
  JoinButton,
  ShareDropdown
} from './Chat/components';

export default function Call() {
  const { id, isnew } = useParams();
  const isNew = !!(isnew && parseInt(isnew) === 1);
  const uuid = require('uuid');
  const peerId = isNew ? id : uuid.v1();
  const config = require('../peerConfig');

  const peer = new Peer(peerId, config);
  const [myPeerId, setMyPeerId] = useState();
  const [actCnns, setCnns] = useState([]);
  const [isReadyToJoin, setReadyToJoin] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [count, setCount] = useState(0);
  const [peerConnected, setPeerConnected] = useState();
  const [message, setMessage] = useState();

  const chatInput = useRef(null);
  const textInput = useRef(null);
  const nickNameInput = useRef(null);

  useEffect(() => {
    peer.on('open', () => {
      setMyPeerId(peer.id);
      setReadyToJoin(true);
      console.log('[peer - open]', peer.id);
    });

    peer.on('connection', (connection) => {
      console.log('[peer - connection]', connection.peer);
      console.log('[peer - connection - metadata]', connection.metadata);
      const newJoinerMessage = `${connection.metadata.nickName} joined..`;

      connection.on('open', () => {
        console.log('[peer - connection - open]', connection.peer);
        setCnns(actCnns => [...actCnns, { id: connection.peer, cn: connection }]);
        setCount(count => count + 1);

        setMessage({ from: 'system', message: newJoinerMessage });
        addTextToChat({ id: 'system', message: newJoinerMessage });
      });

      connection.on('data', (data) => {
        console.log('[peer - data]', data);
        if (data && data.type === 'message') {
          setMessage({ from: data.id, message: data.message });
          addTextToChat(data);
        }
      });

      connection.on('close', () => {
        console.log('[peer - close]', connection.peer);
        setCnns(actCnns => actCnns.filter(item => item.id !== connection.peer));
        setCount(count => count - 1);

        setMessage({ from: 'system', message: `${connection.metadata.nickName} left..` });
        addTextToChat({ id: 'system', message: `${connection.metadata.nickName} left..` });
      });
    });

    peer.on('disconnected', () => {
      console.log('[peer - disconnected]');
    });

    peer.on('error', (err) => {
      console.log('[peer - error]', err);
    });
  }, []);

  // Send count
  useEffect(() => {
    actCnns.forEach(item => {
      item.cn.send({ type: 'count', count });
    });
  }, [count]);

  // Update messages
  useEffect(() => {
    if (message) {
      actCnns.forEach(item => {
        item.cn.send({ type: 'message', id: message.from, message: message.message });
      });
    }
  }, [message]);

  function join() {
    if (!nickNameInput.current.value) {
      alert('Nickname is required!');
      nickNameInput.current.focus();
      return;
    }

    let peerConnected = peer.connect(id, { metadata: { nickName: nickNameInput.current.value } });
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

    setPeerConnected(peerConnected);
  }

  function exit() {
    peer.disconnect();
    peer.destroy();
    window.location.href = '/';
  }

  // Send messages
  function send() {
    const message = textInput.current.value;
    const nickName = nickNameInput.current.value;

    if (!nickName) {
      alert('Nickname is required!');
      nickNameInput.current.focus();
      return;
    }

    if (!message) {
      alert('Message is required!');
      textInput.current.focus();
      return;
    }

    const data = { type: 'message', id: nickName, message: message };
    // Send to owner chat
    if (peerConnected) {
      peerConnected.send(data);
    } else {
      addTextToChat(data);
    }

    // Send to all peers
    setMessage({ from: nickName, message: message });

    // Clear
    textInput.current.value = '';
  }

  function addTextToChat(data) {
    if (chatInput.current.innerHTML.indexOf('**') > -1) {
      chatInput.current.innerHTML = '';
    }

    const date = new Date(Date.now()).toLocaleTimeString('pt-Br');
    chatInput.current.innerHTML += `<small><em><b>${data.id}</b> - ${date}:</em><br />${data.message}<br /></small>`;
    scrollToBottom();
  }

  function scrollToBottom() {
    const element = document.getElementById('wrapperChat');
    element.scrollTop = element.scrollHeight;
  }

  function renderJoinOrExitButton() {
    if (inCall) {
      return (<ExitButton onHandleClick={exit} />);
    }

    return (
      !isNew &&
      isReadyToJoin &&
      !inCall && <JoinButton onHandleClick={join} />
    );
  }

  return (
    <div>
      <div className="row mt-4 mb-2">
        <div className="col-12 col-md-9 text-center text-md-left mb-3 mb-md-0">
          <h2>Chat Room <span className="badge badge-primary">{count}</span></h2>
        </div>
        <div className="col-12 col-md-3 text-right">
          <div className="input-group input-group-sm">
            <input
              ref={nickNameInput}
              className="form-control"
              placeholder="Nickname" />
            <div className="input-group-append">
              {renderJoinOrExitButton()}
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-1">
        <div className="col-12">
          <div className="wrapper rounded" id="wrapperChat">
            <div className="chat" ref={chatInput}></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="input-group mb-1">
            <input
              ref={textInput}
              className="form-control"
              type="text"
              placeholder="Your message here"
              autoFocus="autofocus" />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon1"
                onClick={() => send()}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 col-md-3 text-center text-md-left mb-2 mb-md-0">
          <ShareDropdown id={id} />
        </div>
        <div className="col-12 col-md-9 text-center text-md-right">
          <div className="text-wrap font-italic">
            <small>{myPeerId ? `My ID: ${myPeerId}` : "# getting id.. #"}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
