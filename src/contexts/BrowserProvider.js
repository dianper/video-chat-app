import React, { useState } from 'react';
import { BrowserContext } from './BrowserContext';

function BrowserProvider({ children }) {
  const [roomName, setRoomName] = useState();

  return (
    <BrowserContext.Provider
      value={{
        roomName: roomName,
        onSetRoomName: (name) => setRoomName(name)
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}

export default BrowserProvider;