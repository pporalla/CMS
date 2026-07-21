import './index.css';
import './styles/AppLayout.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Navbar from './Pages/Navbar';
import Home from './Pages/Home';
import MyAccount from './Pages/MyAccount';
import NotFound from './components/NotFound';
import Items from './Transactions/Items';
import Orders from './Transactions/Orders';


function App() {
  // 1. THE DATA FLOW: When the page loads, React checks the browser's digital wallet.
  // If 'access_token' exists, it sets isLoggedIn to true. If not, it sets it to false.
  const tokenExists = localStorage.getItem('access_token') !== null;
  const [isLoggedIn, setIsLoggedIn] = useState(tokenExists);

  // 2. This is the function we pass down to Login.jsx.
  // When Login.jsx calls this, it changes our memory box to true, which updates the screen.
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 3. A simple function to delete the keycard and log out
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Throw away the keycard
    setIsLoggedIn(false); // Change the screen back to the login form
  };

  return (
    <div>
      {isLoggedIn ? (
        
        // THE UI ROUTER: BrowserRouter allows the URL to dictate which component renders
        <BrowserRouter>
          <div className="dashboard-container">
            
            {/* Navbar is outside <Routes> so it stays on the screen at all times */}
            <Navbar onLogout={handleLogout} />
            
            <main className="dashboard-content">
              <Routes>
                {/* If they just hit the root URL, bounce them to /account */}
                <Route path="/" element={<Navigate to="/account" replace />} />
                
                {/* The specific page routes */}
                <Route path="/home" element={<Home onLogout={handleLogout} />} />
                <Route path="/account" element={<MyAccount onLogout={handleLogout} />} />
                <Route path="/orders" element={<Orders onLogout={handleLogout} />} />
                <Route path="/items" element={<Items onLogout={handleLogout} />} />
                <Route path="*" element = { <NotFound /> } />
              </Routes>
            </main>

          </div>
        </BrowserRouter>

      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;