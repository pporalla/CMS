import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ onLogout }) {
  // THE DATA FLOW: location.pathname tells us exactly what the browser URL is right now
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">CMS</div>
      <div className="nav-links">

        {/* We use React Router's <Link> instead of <button> to change the URL without refreshing the page */}
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
        
        {/* Logout remains a button because it triggers a function, it doesn't change the URL */}
        <button className="nav-item nav-logout" onClick={onLogout}>
          Logout
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;