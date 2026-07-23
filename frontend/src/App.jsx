import './index.css';
import './styles/AppLayout.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Pages/Login';
import Navbar from './Pages/Navbar';
import Home from './Pages/Home';
import MyAccount from './Pages/MyAccount';
import NotFound from './components/NotFound';
import Items from './Transactions/Items';
import Orders from './Transactions/Orders';

import ManagerLayout from './manager/ManagerLayout';
import ManagerEmployeeList from './manager/ManagerEmployeeList';
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

  // 1. The Manager Bouncer Component
  const ProtectedManagerRoute = () => {
  // Check the browser storage to see if they are a manager
    const isManager = localStorage.getItem('is_staff') === 'true';

    // If they are a manager, let them pass (<Outlet /> renders the layout).
    // If they are NOT a manager, instantly kick them back to their account page.
    if (!isManager) {
      return <Navigate to="/account" replace />;
    }

  return <Outlet />;
};

  // The <Outlet /> tag tells React where to inject the Home, Account, Orders, or Items component.
  const EmployeeLayout = ({onLogout}) => (
    <div className="dashboard-container">
      <Navbar onLogout={handleLogout} />
      <main className="dashboard-content">
        <Outlet /> 
      </main>
    </div>
  );

  return (
    <div>
      {isLoggedIn ? (
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedManagerRoute />}>
    
              <Route path="/manager" element={<ManagerLayout />}>
                <Route path="employees" element={<ManagerEmployeeList />} />
              </Route>

            </Route>
            
            {/* --- ZONE 1: THE MANAGER ROUTES --- */}
            {/* Any URL starting with /manager uses the ManagerLayout (Sidebar) */}
            <Route path="/manager" element={<ManagerLayout />}>
               <Route path="employees" element={<ManagerEmployeeList />} />
               {/* We will add /manager/orders and /manager/items here later */}
            </Route>


            {/* --- ZONE 2: THE EMPLOYEE ROUTES (Your existing code) --- */}
            {/* Because this Route has no path, it acts as the default layout for everything else */}
            <Route element={<EmployeeLayout />}>
              <Route path="/" element={<Navigate to="/account" replace />} />
              <Route path="/home" element={<Home onLogout={handleLogout} />} />
              <Route path="/account" element={<MyAccount onLogout={handleLogout} />} />
              <Route path="/orders" element={<Orders onLogout={handleLogout} />} />
              <Route path="/items" element={<Items onLogout={handleLogout} />} />
              <Route path="*" element={<NotFound />} />
            </Route>

          </Routes>
        </BrowserRouter>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;