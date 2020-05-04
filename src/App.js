import React, { useEffect } from 'react';
import { Footer, Header, Main } from './components';
import io from 'socket.io-client';
import { socketURL } from './ajaxConfig';
import './App.css';

export default function App() {
  useEffect(() => {
    io(socketURL);
  }, []);

  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
