import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Video } from './components';
import { GetUserMedia } from '../../utils';
import { emitEvent } from '../../utils/Socket';

export default function Room() {
  const { roomName } = useParams();
  if (!roomName) window.location.href = '/';

  useEffect(() => {
    GetUserMedia()
      .then(stream => {
        window.localStream = stream;
        document.getElementById('localVideo').srcObject = stream;
        document.getElementById('btnJoin').classList.remove('d-none');
      })
      .catch(err => console.log(err));

    if (document.getElementById("btnJoin")) {
      document.getElementById("btnJoin").addEventListener("click", () => {
        document.getElementById('btnJoin').classList.add('d-none');
        document.getElementById('btnLeave').classList.remove('d-none');
        emitEvent('ready', roomName);
      });
    }

    if (document.getElementById("btnLeave")) {
      document.getElementById("btnLeave").addEventListener("click", () => {
        document.getElementById('btnJoin').classList.remove('d-none');
        document.getElementById('btnLeave').classList.add('d-none');
        emitEvent('leave');
      });
    }
  }, [roomName]);

  return (
    <>
      <h2 className="text-center mb-4">Room <span id="roomName">#{roomName}</span></h2>
      <div className="row mt-5">
        <div className="col-12 text-center">
          <div className="row" id="videos">
            <div className="col-6 col-md-3">
              <Video
                id="localVideo"
                autoplay={true}
                playsinline={true}
                muted={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
