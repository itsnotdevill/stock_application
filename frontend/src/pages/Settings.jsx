import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const { dark, toggleTheme, currency, setCurrency } = useContext(ThemeContext);

  // Local state for trading settings (simulated persistence)
  const [tradingSettings, setTradingSettings] = useState({
    defaultQuantity: 1,
    riskLimit: "5%",
    leverage: "1x",
    defaultOrderType: "MARKET",
    oneClickTrading: false,
    chartTimeframe: "1D",
    notifications: {
      orderFill: true,
      priceAlerts: true,
      news: false
    }
  });

  const handleTradingChange = (field, value) => {
    setTradingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setTradingSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>⚙️ Settings</h1>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--glass-border)" }}>
        {["General", "Account", "Trading"].map((tab) => {
          const key = tab.toLowerCase();
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === key ? "2px solid var(--accent-color)" : "2px solid transparent",
                color: activeTab === key ? "var(--text-primary)" : "var(--text-secondary)",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: activeTab === key ? 600 : 400
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="glass-card animate-fade-in" style={{ maxWidth: "600px" }}>
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>Theme</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Current: {dark ? "Dark 🌙" : "Light ☀️"}</p>
              </div>
              <button
                className="btn-primary"
                onClick={toggleTheme}
              >
                Toggle Theme
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>Currency</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Display currency for portfolio</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  color: "white",
                  border: "1px solid var(--glass-border)"
                }}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Profile Header */}
            <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "2rem" }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-color), #2a2a2a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
              }}>
                👤
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.8rem" }}>{JSON.parse(localStorage.getItem("user"))?.name || "Trader"}</h2>
                <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
                  <span className="badge" style={{ background: "var(--success)", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>Active</span>
                  <span className="badge" style={{ background: "var(--accent-color)", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>Pro Plan</span>
                </div>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="glass-card">
              <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>Account Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <DetailItem label="Account ID" value={`#TRD-${Math.floor(Math.random() * 100000) + 10000}`} />
                <DetailItem label="Email" value={JSON.parse(localStorage.getItem("user"))?.email || "user@tradeverse.com"} />
                <DetailItem label="Account Type" value="Paper Trading / Demo" />
                <DetailItem label="Member Since" value={new Date().toLocaleDateString()} />
                <DetailItem label="Base Currency" value={currency} />
                <DetailItem label="Region" value={currency === "INR" ? "India (NSE)" : "USA (NYSE/NASDAQ)"} />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card" style={{ border: "1px solid var(--danger)" }}>
              <h3 style={{ color: "var(--danger)", marginBottom: "1rem" }}>Danger Zone</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                Resetting your account will wipe all transaction history and portfolio data. This action cannot be undone.
              </p>
              <button
                className="btn-danger"
                style={{ width: "fit-content" }}
                onClick={() => {
                  if (confirm("Are you sure you want to reset all paper trading data? This action is irreversible.")) {
                    localStorage.removeItem('portfolio'); // Example toggle
                    alert("Account reset successfully. (Simulated)");
                  }
                }}
              >
                Reset Account Data
              </button>
            </div>

          </div>
        )}

        {activeTab === "trading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Order Settings */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <h3>Default Quantity</h3>
                <input
                  type="number"
                  value={tradingSettings.defaultQuantity}
                  onChange={(e) => handleTradingChange("defaultQuantity", e.target.value)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "10px",
                    width: "100%",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--glass-border)",
                    color: "white",
                    borderRadius: "6px"
                  }}
                />
              </div>
              <div>
                <h3>Default Leverage</h3>
                <select
                  value={tradingSettings.leverage}
                  onChange={(e) => handleTradingChange("leverage", e.target.value)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "10px",
                    width: "100%",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--glass-border)",
                    color: "white",
                    borderRadius: "6px"
                  }}
                >
                  <option value="1x">1x (Cash)</option>
                  <option value="2x">2x (Margin)</option>
                  <option value="5x">5x (Intraday)</option>
                  <option value="10x">10x (Pro)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <h3>Risk Limit (Stop Loss)</h3>
                <input
                  type="text"
                  value={tradingSettings.riskLimit}
                  onChange={(e) => handleTradingChange("riskLimit", e.target.value)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "10px",
                    width: "100%",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--glass-border)",
                    color: "white",
                    borderRadius: "6px"
                  }}
                />
              </div>
              <div>
                <h3>Default Order Type</h3>
                <select
                  value={tradingSettings.defaultOrderType}
                  onChange={(e) => handleTradingChange("defaultOrderType", e.target.value)}
                  style={{
                    marginTop: "0.5rem",
                    padding: "10px",
                    width: "100%",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--glass-border)",
                    color: "white",
                    borderRadius: "6px"
                  }}
                >
                  <option value="MARKET">Market</option>
                  <option value="LIMIT">Limit</option>
                  <option value="STOP">Stop Loss</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3>One-Click Trading</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Execute orders immediately without confirmation</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={tradingSettings.oneClickTrading}
                    onChange={(e) => handleTradingChange("oneClickTrading", e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Notifications</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {[
                  { id: 'orderFill', label: 'Order Fills & Executions' },
                  { id: 'priceAlerts', label: 'Price Alerts' },
                  { id: 'news', label: 'Major Market News' }
                ].map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={tradingSettings.notifications[item.id]}
                      onChange={() => handleNotificationChange(item.id)}
                      style={{ accentColor: "var(--accent-color)", width: "16px", height: "16px" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-color);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }
      `}</style>
    </div >
  );
}

const DetailItem = ({ label, value }) => (
  <div>
    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>{label}</p>
    <p style={{ fontWeight: "600", fontSize: "1.05rem" }}>{value}</p>
  </div>
);
