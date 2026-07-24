import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const ManagerSidebar = ({ onLogout }) => {
    const location = useLocation();
    return(

        <nav className="navbar">
            <div className="nav-brand">Manager Portal</div>
            <div className="nav-links">

                {/* We use React Router's <Link> instead of <button> to change the URL without refreshing the page */}
                <Link to="/manager/employees" className={`nav-item ${location.pathname === '/manager/employees' ? 'active' : ''}`}>
                Employees
                </Link>
                
                <Link to="/manager/orders" className={`nav-item ${location.pathname === '/manager/orders' ? 'active' : ''}`}>
                Global Orders
                </Link>
                
                <Link to="/manager/items" className={`nav-item ${location.pathname === '/manager/items' ? 'active' : ''}`}>
                Global Inventory
                </Link>

                <Link to="/manager/stores" className={`nav-item ${location.pathname === '/manager/stores' ? 'active' : ''}`}>
                Stores & Markets
                </Link>
                
                {/* Logout remains a button because it triggers a function, it doesn't change the URL */}
                <button className="nav-item nav-logout" onClick={onLogout}>
                Logout
                </button>
            
            </div>
        </nav>


    );
}

export default ManagerSidebar;