import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [marketStatus, setMarketStatus] = useState({
    india: false,
    usa: false
  });

  useEffect(() => {
    const checkMarkets = () => {
      const isMarketOpen = (timeZone, startHour, startMinute, endHour, endMinute) => {
        const now = new Date();
        const options = { timeZone, hour12: false, weekday: 'short', hour: 'numeric', minute: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(now);

        const partValue = (type) => parts.find(p => p.type === type)?.value;
        const weekday = partValue('weekday');
        const hour = parseInt(partValue('hour'), 10);
        const minute = parseInt(partValue('minute'), 10);

        // Closed on weekends
        if (weekday === 'Sat' || weekday === 'Sun') return false;

        const currentMinutes = hour * 60 + minute;
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      };

      setMarketStatus({
        india: isMarketOpen('Asia/Kolkata', 9, 15, 15, 30), // NSE: 9:15 - 3:30 PM IST
        usa: isMarketOpen('America/New_York', 9, 30, 16, 0)   // NYSE: 9:30 - 4:00 PM ET
      });
    };

    checkMarkets();
    const interval = setInterval(checkMarkets, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Hide navbar on login/signup page
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/company?symbol=${search.trim().toUpperCase()}`);
      setSearch("");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Portfolio", path: "/portfolio", icon: "💼" },
    { name: "Watchlist", path: "/watchlist", icon: "⭐" },
    { name: "Charts", path: "/charts", icon: "📈" },
    { name: "Reports", path: "/reports", icon: "📑" },
    { name: "Company", path: "/company", icon: "🏢" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <nav className="navbar">
      <style>{`
        .navbar {
          width: var(--sidebar-width); /* 260px from index.css */
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          z-index: 9999; /* Ensure it is on top */
          box-sizing: border-box;
          overflow-y: auto; /* Allow scroll on small screens */
        }

        .logo-container {
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: -0.5px;
          flex-shrink: 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .search-container {
          position: relative;
          margin-bottom: 2rem;
          flex-shrink: 0;
        }

        .search-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1; /* Takes available space */
          overflow-y: auto; /* Scroll if list is too long */
          min-height: 0; /* Important for flex nested scrolling */
          margin-bottom: 1rem;
        }

        /* Customize scrollbar for nav-links (Hidden for cleaner look) */
        .nav-links::-webkit-scrollbar { width: 0px; background: transparent; }
        .navbar::-webkit-scrollbar { width: 0px; background: transparent; }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s ease;
          font-weight: 500;
          flex-shrink: 0;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: var(--glass-bg);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: var(--accent-color);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .user-section {
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex-shrink: 0; /* Ensures it stays visible at bottom */
          background-color: var(--bg-secondary); /* Cover potential content behind */
        }

        .market-status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: var(--text-secondary);
            background: rgba(0,0,0,0.2);
            padding: 6px 10px;
            border-radius: 8px;
        }
        
        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
        }
        
        .status-open {
            background: var(--success);
            box-shadow: 0 0 5px var(--success);
            animation: pulse 2s infinite;
        }
        
        .status-closed {
            background: var(--danger);
        }

        .logout-btn {
          width: 100%;
          padding: 0.8rem;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
      `}</style>

      <div className="logo-container">
        <span style={{ fontSize: "2rem", marginRight: "0.5rem" }}>📈</span>
        TradeVerse
      </div>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search stocks..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>

      <div className="user-section">
        <div className="market-status-row">
          <span>🇮🇳 India (NSE)</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={`status-dot ${marketStatus.india ? 'status-open' : 'status-closed'}`}></span>
            {marketStatus.india ? 'Open' : 'Closed'}
          </div>
        </div>
        <div className="market-status-row">
          <span>🇺🇸 USA (NYSE)</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className={`status-dot ${marketStatus.usa ? 'status-open' : 'status-closed'}`}></span>
            {marketStatus.usa ? 'Open' : 'Closed'}
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
