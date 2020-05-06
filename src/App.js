import React from 'react';
import { Footer, Header, Main } from './components';
import { BrowserProvider } from './contexts';
import './App.css';

export default function App() {
  return (
    <BrowserProvider>
      <Header />
      <Main />
      <Footer />
    </BrowserProvider>
  );
}
