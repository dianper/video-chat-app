import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import Peer from 'peerjs';
import { ShareDropdown } from './Chat/components';

export default function Call() {
  const { id, isnew } = useParams();
  const isNew = !!(isnew && parseInt(isnew) === 1);
  const uuid = require('uuid');
  const peerId = isNew ? id : uuid.v1();
  const config = process.env.NODE_ENV === 'development' ? {
    host: 'localhost',
    port: 5080,
    path: '/peerjs'
  } : {
      host: 'moska-chat.herokuapp.com',
      port: 443,
      path: '/peerjs'
    };

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

      connection.on('open', () => {
        console.log('[peer - connection - open]', connection.peer);
        setCnns(actCnns => [...actCnns, { id: connection.peer, cn: connection }]);
        setCount(count => count + 1);
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

  function shareToWhatsApp() {
    const url = encodeURIComponent(`https://moska-chat.herokuapp.com/calls/${id}`);
    window.open(`https://wa.me/?text=${url}`);
  }

  function copyToClipBoard() {
    const el = document.createElement('textarea');
    el.value = `https://moska-chat.herokuapp.com/calls/${id}`;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  function scrollToBottom() {
    const element = document.getElementById('wrapperChat');
    element.scrollTop = element.scrollHeight;
  }

  function renderJoinOrExitButton() {
    if (inCall) {
      return (<button className="btn btn-sm btn-danger mr-1" type="button" onClick={() => exit()}>Exit</button>);
    }

    return (
      !isNew &&
      isReadyToJoin &&
      !inCall && <button className="btn btn-sm btn-primary mr-1" type="button" onClick={() => join()}>Join</button>
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
          <ShareDropdown
            onHandleWhatsApp={shareToWhatsApp}
            onHandleCopyLink={copyToClipBoard} />
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
