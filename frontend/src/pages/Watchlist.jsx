import { useState } from "react";
import { usePrices } from "../context/PriceContext";
import TradePanel from "../components/TradePanel";

export default function Watchlist() {
  const [query, setQuery] = useState("");
  const { prices } = usePrices();
  const [selectedStock, setSelectedStock] = useState(null);

  // Default watchlist symbols (could be moved to user preferences later)
  const defaultStocks = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "BAJFINANCE", "BHARTIARTL", "TSLA", "AAPL", "GOOGL", "AMZN"];

  const filteredStocks = defaultStocks.filter((symbol) =>
    symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>⭐ Watchlist</h1>
        <input
          type="text"
          placeholder="Search symbols..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px 16px",
            width: "300px",
            borderRadius: "var(--radius-md)",
            border: "var(--glass-border)",
            background: "rgba(15, 23, 42, 0.6)",
            color: "white",
            outline: "none"
          }}
        />
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)", textAlign: "left" }}>
              <th style={{ padding: "16px", fontWeight: "600", color: "var(--text-secondary)" }}>Symbol</th>
              <th style={{ padding: "16px", fontWeight: "600", color: "var(--text-secondary)" }}>Price</th>
              <th style={{ padding: "16px", fontWeight: "600", color: "var(--text-secondary)" }}>Change</th>
              <th style={{ padding: "16px", fontWeight: "600", color: "var(--text-secondary)", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((symbol) => {
              const stockData = prices[symbol];
              const price = stockData?.price || 0;
              const change = stockData?.changePercent || 0;
              const currency = ["TSLA", "AAPL", "GOOGL", "AMZN"].includes(symbol) ? "$" : "₹";

              return (
                <tr key={symbol} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                  <td style={{ padding: "16px", fontWeight: "bold" }}>{symbol}</td>
                  <td style={{ padding: "16px" }}>
                    {price > 0 ? `${currency}${price.toFixed(2)}` : "Loading..."}
                  </td>
                  <td style={{ padding: "16px", color: change >= 0 ? "var(--success)" : "var(--danger)" }}>
                    {change > 0 ? "+" : ""}{change.toFixed(2)}%
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button
                      className="btn-primary"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
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
