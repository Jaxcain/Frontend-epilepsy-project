// src/App.js


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './dashboard'
import Register from './Register';
import { io } from 'socket.io-client';
const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    const newSocket = io(`${apiUrl}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>

          <Route path="/" exact Component={Login} />
          <Route path="/dashboard" /* Component={Dashboard} */ element={<Dashboard socket={socket} />}/>
          <Route path="/register" element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
