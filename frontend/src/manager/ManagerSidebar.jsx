import React from 'react';
import { Link } from 'react-router-dom';

const ManagerSidebar = () => {
    return (
        // <aside> is the correct semantic HTML tag for a sidebar
        <aside className="manager-sidebar">
            <h2>Manager Portal</h2>
            
            // nav indicates this section contains navigation links
            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    <li className="menu-item">
                        <Link to="/manager/employees">👥 Employees</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/manager/orders">📦 Global Orders</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/manager/items">🏷️ Global Inventory</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/manager/stores">🏪 Stores & Markets</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default ManagerSidebar;