import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function StockSelector() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentSymbol = searchParams.get("symbol") || "RELIANCE";
    const [activeExchange, setActiveExchange] = useState("IND");

    const stocks = [
        // IND
        { symbol: "RELIANCE", name: "Reliance Industries", exchange: "IND" },
        { symbol: "TCS", name: "Tata Consultancy Svc", exchange: "IND" },
        { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "IND" },
        { symbol: "INFY", name: "Infosys", exchange: "IND" },
        { symbol: "ICICIBANK", name: "ICICI Bank", exchange: "IND" },
        { symbol: "SBIN", name: "State Bank of India", exchange: "IND" },
        { symbol: "BHARTIARTL", name: "Bharti Airtel", exchange: "IND" },
        { symbol: "ITC", name: "ITC Limited", exchange: "IND" },
        // USA
        { symbol: "IBM", name: "IBM Corp (US)", exchange: "USA" },
        { symbol: "TSLA", name: "Tesla Inc (US)", exchange: "USA" },
        { symbol: "AAPL", name: "Apple Inc (US)", exchange: "USA" },
        { symbol: "NVDA", name: "NVIDIA Corp (US)", exchange: "USA" },
    ];

    const handleSelect = (symbol) => {
        const path = window.location.pathname;
        navigate(`${path}?symbol=${symbol}`);
    };

    const filteredStocks = stocks.filter(s => s.exchange === activeExchange);

    return (
        <div className="stock-selector glass-card" style={{ height: "100%", overflowY: "auto", padding: "1rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1rem", color: "var(--text-secondary)" }}>Market Leaders</h3>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button
                    onClick={() => setActiveExchange("IND")}
                    style={{
                        flex: 1,
                        padding: "8px",
                        background: activeExchange === "IND" ? "var(--accent-color)" : "rgba(255,255,255,0.05)",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem"
                    }}
                >
                    IND 🇮🇳
                </button>
                <button
                    onClick={() => setActiveExchange("USA")}
                    style={{
                        flex: 1,
                        padding: "8px",
                        background: activeExchange === "USA" ? "var(--accent-color)" : "rgba(255,255,255,0.05)",
                        border: "none",
                        borderRadius: "6px",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem"
                    }}
                >
                    USA 🇺🇸
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {filteredStocks.map((stock) => (
                    <button
                        key={stock.symbol}
                        onClick={() => handleSelect(stock.symbol)}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            background: currentSymbol === stock.symbol ? "var(--accent-color)" : "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "8px",
                            color: "white",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <div style={{ textAlign: "left" }}>
                            <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{stock.symbol}</div>
                            <div style={{ fontSize: "0.75rem", color: currentSymbol === stock.symbol ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>
                                {stock.name}
                            </div>
                        </div>
                        <span style={{ fontSize: "1.2rem" }}>›</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
