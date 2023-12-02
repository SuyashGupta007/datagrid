// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import AdminDashboard from './components/AdminDashboard';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AdminDashboard />
    {/* <App/> */}
  </React.StrictMode>,
  document.getElementById('root')
);
