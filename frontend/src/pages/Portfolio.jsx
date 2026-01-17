import { useState } from "react";
import { useTrade } from "../context/TradeContext";
import { usePrices } from "../context/PriceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis } from 'recharts';
import TradePanel from "../components/TradePanel";

export default function Portfolio() {
  const { balance, orders, holdings } = useTrade();
  const { prices } = usePrices();
  const [selectedStock, setSelectedStock] = useState(null);

  // Prepare data for chart 
  const data = Object.keys(holdings).length > 0
    ? Object.entries(holdings).map(([symbol, data]) => ({ name: symbol, value: data.qty * data.avgPrice }))
    : [{ name: 'Cash', value: balance }];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExportCSV = () => {
    if (Object.keys(holdings).length === 0) {
      alert("No holdings to export!");
      return;
    }

    const headers = ["Symbol", "Quantity", "Avg Price", "Current Price", "Current Value", "P&L"];
    const rows = Object.entries(holdings).map(([symbol, data]) => {
      const currentPrice = prices[symbol]?.price || data.avgPrice;
      const currentValue = currentPrice * data.qty;
      const pnl = currentValue - (data.avgPrice * data.qty);

      return [
        symbol,
        data.qty,
        data.avgPrice.toFixed(2),
        currentPrice.toFixed(2),
        currentValue.toFixed(2),
        pnl.toFixed(2)
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>💼 Portfolio</h1>
        <button
          onClick={handleExportCSV}
          className="action-btn"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid var(--glass-border)",
            color: "white",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>📥</span> Export CSV
        </button>
      </div>

      <div className="portfolio-grid">
        <style>{`
          .portfolio-grid {
             display: grid;
             grid-template-columns: 2fr 1fr;
             gap: 1.5rem;
          }
          @media (max-width: 1024px) {
            .portfolio-grid { grid-template-columns: 1fr; }
          }
          .action-btn {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: opacity 0.2s;
          }
          .action-btn:hover { opacity: 0.8; }
        `}</style>

        {/* Left Col: Holdings & Orders */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Holdings Section */}
          <div className="glass-card">
            <h2 style={{ marginBottom: "1rem" }}>Current Holdings</h2>
            {Object.keys(holdings).length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                No active holdings found. Start trading to see your portfolio grow!
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "8px" }}>Asset</th>
                    <th style={{ padding: "8px" }}>Qty</th>
                    <th style={{ padding: "8px" }}>Avg. Price</th>
                    <th style={{ padding: "8px" }}>Cur. Price</th>
                    <th style={{ padding: "8px" }}>P&L</th>
                    <th style={{ padding: "8px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(holdings).map(([symbol, data]) => {
                    const currentPrice = prices[symbol]?.price || data.avgPrice;
                    const pnl = (currentPrice - data.avgPrice) * data.qty;
                    return (
                      <tr key={symbol} style={{ borderTop: "1px solid var(--glass-border)" }}>
                        <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{symbol}</td>
                        <td style={{ padding: "12px 8px" }}>{data.qty}</td>
                        <td style={{ padding: "12px 8px" }}>₹{data.avgPrice.toFixed(2)}</td>
                        <td style={{ padding: "12px 8px" }}>₹{currentPrice.toFixed(2)}</td>
                        <td style={{ padding: "12px 8px", color: pnl >= 0 ? "var(--success)" : "var(--danger)" }}>
                          {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "right" }}>
                          <button
                            className="action-btn"
                            style={{ background: "var(--success)", color: "white", marginRight: "8px" }}
                            onClick={() => setSelectedStock(symbol)}
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Orders Section */}
          <div className="glass-card">
            <h3 style={{ marginBottom: "1rem" }}>Order History</h3>
            {orders.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>No recent orders.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {orders.map((o, i) => (
                  <li key={i} style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--glass-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <span style={{ fontWeight: "bold", marginRight: "8px" }}>{o.symbol}</span>
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: o.type === 'BUY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: o.type === 'BUY' ? 'var(--success)' : 'var(--danger)'
                      }}>{o.type}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>{o.qty} @ ₹{o.price}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{new Date().toLocaleTimeString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Col: Stats & Charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card">
            <h3 style={{ color: "var(--text-secondary)" }}>Total Balance</h3>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>₹{balance.toLocaleString()}</div>
            <div style={{ color: "var(--success)", fontSize: "0.9rem", marginTop: "4px" }}>+₹1,240.50 (Today)</div>
          </div>

          <div className="glass-card" style={{ flex: 1, minHeight: "300px", display: "flex", flexDirection: "column" }}>
            <h3>Portfolio Growth</h3>
            <div style={{ flex: 1, marginTop: "1rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', value: 4000 },
                  { name: 'Tue', value: 3000 },
                  { name: 'Wed', value: 5000 },
                  { name: 'Thu', value: 2780 },
                  { name: 'Fri', value: 1890 },
                  { name: 'Sat', value: 2390 },
                  { name: 'Sun', value: 3490 },
                ]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ height: "300px", display: "flex", flexDirection: "column" }}>
            <h3>Asset Allocation</h3>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Trade Modal Overlay */}
      {selectedStock && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
          backdropFilter: "blur(4px)"
        }} onClick={() => setSelectedStock(null)}>
          <div
            className="glass-card animate-fade-in"
            style={{ width: "90%", maxWidth: "400px", position: "relative" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStock(null)}
              style={{
                position: "absolute", right: "1rem", top: "1rem",
                background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.5rem", cursor: "pointer"
              }}
            >
              &times;
            </button>
            <TradePanel symbol={selectedStock} />
          </div>
        </div>
      )}

    </div>
  );
}
