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
import ProtectedRoute from './components/ProtectedRoute';
// import ManagerDashboard from './Manager/CreateOrders';
import CreateStore from './Manager/CreateStore';


function App() {
  const tokenExists = localStorage.getItem('access_token') !== null;
  const savedRole = localStorage.getItem('user_role') || null;

  const [isLoggedIn, setIsLoggedIn] = useState(tokenExists);
  const [userRole, setUserRole] = useState(savedRole);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('user_role'); 
    setIsLoggedIn(false); 
    setUserRole(null); 
  };

  return (
    <BrowserRouter>
      <div className="dashboard-container">
        
        {isLoggedIn && <Navbar onLogout={handleLogout} userRole={userRole} />}
        
        <main className="dashboard-content">
          <Routes>
            <Route 
              path="/login" 
              element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to={userRole === 'manager' ? '/manager-dashboard' : '/account'} replace />} 
            />
            
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* MANAGER ROUTES */}
            <Route element={<ProtectedRoute isAllowed={isLoggedIn && userRole === 'manager'} />}>
              {/* <Route path="/manager-dashboard" element={<ManagerDashboard onLogout={handleLogout} />} /> */}
              <Route path="/manager-stores" element={<CreateStore onLogout={handleLogout} />} />
            </Route>

            {/* EMPLOYEE ROUTES */}
            <Route element={<ProtectedRoute isAllowed={isLoggedIn && userRole === 'employee'} />}>
              <Route path="/home" element={<Home onLogout={handleLogout} />} />
              <Route path="/account" element={<MyAccount onLogout={handleLogout} />} />
              <Route path="/orders" element={<Orders onLogout={handleLogout} />} />
              <Route path="/items" element={<Items onLogout={handleLogout} />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;