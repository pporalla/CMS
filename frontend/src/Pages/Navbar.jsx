import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ onLogout, userRole }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Brand logo changes slightly to indicate the role */}
      <div className="nav-brand">CMS {userRole === 'manager' && <span style={{fontSize: '14px', color: '#ccc'}}>| Manager</span>}</div>
      
      <div className="nav-links">
        
        {/* MANAGER LINKS */}
        {userRole === 'manager' ? (
          <>
            <Link to="/manager" className={`nav-item ${location.pathname === '/manager' ? 'active' : ''}`}>
              Dashboard
            </Link>
            {/* <Link to="/manager-dashboard" className={`nav-item ${location.pathname === '/manager-dashboard' ? 'active' : ''}`}>
              Order Creation
            </Link> */}
            <Link to="/manager-stores" className={`nav-item ${location.pathname === '/manager-stores' ? 'active' : ''}`}>
              Stores
            </Link>
            
          </>
        ) : (
          <>
            <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/account" className={`nav-item ${location.pathname === '/account' ? 'active' : ''}`}>
              My account
            </Link>
            <Link to="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
              Orders
            </Link>
            <Link to="/items" className={`nav-item ${location.pathname === '/items' ? 'active' : ''}`}>
              Items
            </Link>
          </>
        )}
        
        <button className="nav-item nav-logout" onClick={onLogout}>
          Logout
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;