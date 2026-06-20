import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isPrivateHubHost, PrivateHubGate } from './src/components/PrivateHubGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {isPrivateHubHost() ? <PrivateHubGate /> : <App />}
  </React.StrictMode>
);
