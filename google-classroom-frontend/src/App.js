// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AssignmentPage from './components/AssignmentPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');  // Remove JWT token from localStorage
    setToken(null);  // Clear the token from state
  };

  return (
    <Router>
      <div>
        <header>
          {token && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </header>
        <Switch>
          <Route path="/login">
            <LoginPage setToken={setToken} />
          </Route>
          <Route path="/assignments">
            {token ? <AssignmentPage /> : <LoginPage setToken={setToken} />}
          </Route>
          <Route path="/">
            {token ? <AssignmentPage /> : <LoginPage setToken={setToken} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
