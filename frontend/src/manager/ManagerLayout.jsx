import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';

const ManagerLayout = () => {
    return (
        // A generic container wrapper for the whole page
        <div className="manager-layout-container">
            
            {/* 1. The semantic sidebar component */}
            <ManagerSidebar />
            
            {/* 2. <main> is the correct semantic HTML tag for the primary page content */}
            <main className="manager-main-content">
                {/* The <Outlet /> renders whichever component matches the current route */}
                <Outlet />
            </main>
        </div>
    );
};

export default ManagerLayout;