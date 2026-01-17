import { useState } from "react";
import { useTrade } from "../context/TradeContext";
import { usePrices } from "../context/PriceContext";

export default function TradePanel({ symbol = "RELIANCE" }) {
  const [qty, setQty] = useState(1);
  const { buyStock, sellStock } = useTrade();
  const { getPrice } = usePrices();
  const [loading, setLoading] = useState(false);

  const currency = ["IBM", "TSLA", "AAPL", "NVDA"].includes(symbol) ? "$" : "₹";
  const rawPrice = getPrice(symbol);
  // Ensure price is a valid number
  const currentPrice = (rawPrice && !isNaN(rawPrice)) ? Number(rawPrice) : 0;

  const handleOrder = async (type) => {
    if (currentPrice <= 0) {
      alert("Waiting for valid price data...");
      return;
    }
    setLoading(true);
    if (type === 'BUY') {
      await buyStock(symbol, qty, currentPrice);
    } else {
      await sellStock(symbol, qty, currentPrice);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0.5rem" }}>
      <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Place Order</h3>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          {symbol} <span style={{ color: "var(--accent-color)" }}>
            {currentPrice > 0 ? `${currency}${currentPrice.toFixed(2)}` : "Loading..."}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", color: "var(--text-secondary)", marginBottom: "8px", fontSize: "0.9rem" }}>
          Quantity
        </label>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "12px",
            background: "rgba(0,0,0,0.2)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)",
            color: "white",
            fontSize: "1rem",
            boxSizing: "border-box"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          <span>Margin Req:</span>
          <span>{currentPrice > 0 ? `${currency}${(qty * currentPrice).toFixed(2)}` : "--"}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <button
          className="btn-primary"
          style={{ background: "var(--success)", opacity: (loading || currentPrice <= 0) ? 0.7 : 1 }}
          onClick={() => handleOrder('BUY')}
          disabled={loading || currentPrice <= 0}
        >
          BUY
        </button>

        <button
          className="btn-primary"
          style={{ background: "var(--danger)", opacity: loading ? 0.7 : 1 }}
          onClick={() => handleOrder('SELL')}
          disabled={loading}
        >
          SELL
        </button>
      </div>

      <div style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center" }}>
        {loading ? "Processing Order..." : "Market Limit Order • Day"}
      </div>
    </div>
  );
}
