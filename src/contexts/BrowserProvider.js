import React, { useState } from 'react';
import { BrowserContext } from './BrowserContext';

function BrowserProvider({ children }) {
  const [roomName, setRoomName] = useState();
  const [socket, setSocket] = useState();

  return (
    <BrowserContext.Provider
      value={{
        roomName: roomName,
        onSetRoomName: (name) => setRoomName(name),
        onSetSocket: (socket) => setSocket(socket)
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}

export default BrowserProvider;