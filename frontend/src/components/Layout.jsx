import React from 'react';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import AiAssistant from './AiAssistant';
import TickerTape from './TickerTape';

const Layout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    if (isAuthPage) {
        return <Outlet />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <TickerTape />

            <div style={{ display: 'flex', flex: 1 }}>
                <Navbar />
                <main style={{
                    flex: 1,
                    marginLeft: '260px', /* Matches var(--sidebar-width) explicitly */
                    padding: '2rem',
                    width: 'calc(100% - 260px)',
                    boxSizing: 'border-box',
                    marginTop: '0' /* Ticker is above this flex container */
                }}>
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>

            <AiAssistant />
        </div>
    );
};

export default Layout;
