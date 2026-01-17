import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CandlestickChart from "../components/CandlestickChart";
import Skeleton from "../components/Skeleton";
import TradePanel from "../components/TradePanel";
import StockSelector from "../components/StockSelector";
import { COMPANY_DATA } from "../utils/mockData";
import { usePrices } from "../context/PriceContext";

export default function Company() {
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState("RELIANCE");
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('BUY');
  const [metrics, setMetrics] = useState(null);

  const { getPrice } = usePrices();
  const livePrice = getPrice(symbol);

  // Update symbol from URL
  useEffect(() => {
    const querySymbol = searchParams.get("symbol");
    if (querySymbol) {
      setSymbol(querySymbol.toUpperCase());
    }
  }, [searchParams]);

  // Generic Data Generator for unknown stocks
  const generateGenericData = (sym) => {
    const seed = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = (seed % 1000) + 100;
    const pe = ((seed % 50) + 10).toFixed(1);
    const mcap = ((seed % 100) + 50).toFixed(1);
    const isUS = ["IBM", "TSLA", "AAPL", "NVDA", "GOOGL", "AMZN", "MSFT", "META"].includes(sym);

    return {
      Symbol: sym,
      Name: `${sym} Corporation`,
      Description: `${sym} is a leading entity in its sector, known for robust performance and strong market presence. It operates globally with a diverse portfolio of products and services.`,
      MarketCapitalization: isUS ? `$${mcap}B` : `₹${mcap},000 Cr`,
      PERatio: pe,
      DividendYield: ((seed % 30) / 10).toFixed(2) + "%",
      Sector: (seed % 2 === 0) ? "Technology" : "Finance",
      "52WeekHigh": (basePrice * 1.2).toFixed(2),
      "52WeekLow": (basePrice * 0.8).toFixed(2),
      basePrice: basePrice
    };
  };

  // Fetch Fundamentals (Mock First, then API, then Generic Fallback)
  useEffect(() => {
    const fetchFundamentals = async () => {
      setMetrics(null); // Reset to show skeleton

      // 1. Try Specific Mock Data
      if (COMPANY_DATA[symbol]) {
        setTimeout(() => setMetrics(COMPANY_DATA[symbol]), 500); // Fake delay for realism
        return;
      }

      // 2. Fallback: API (if key exists)
      const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
      if (apiKey && apiKey.length > 5 && !apiKey.startsWith('sk-')) {
        try {
          const cleanSymbol = symbol.replace(".BSE", "");
          const res = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${cleanSymbol}&apikey=${apiKey}`);
          const data = await res.json();
          if (data && data.Symbol) {
            setMetrics(data);
            return;
          }
        } catch (err) {
          console.error("Fundametal fetch error", err);
        }
      }

      // 3. Final Fallback: Generic Data (So user ALWAYS sees something)
      setTimeout(() => {
        setMetrics(generateGenericData(symbol));
      }, 800);
    };

    fetchFundamentals();
  }, [symbol]);

  const toggleTrade = (type) => {
    setTradeType(type);
    setShowTradeModal(true);
  };

  const getCurrency = (sym) => {
    const usStocks = ["IBM", "TSLA", "AAPL", "NVDA", "GOOGL", "AMZN", "MSFT", "META"];
    return usStocks.includes(sym) ? "$" : "₹";
  };
  const currency = getCurrency(symbol);

  // Market Status Logic
  const getMarketStatus = (sym) => {
    const isUS = ["IBM", "TSLA", "AAPL", "NVDA", "GOOGL", "AMZN", "MSFT", "META"].includes(sym);
    // Simple static logic based on timezone for now, or just mock it to align with sidebar
    // If we want to be "smart", we check current UTC time. 
    // Indian Market: 03:45 AM UTC - 09:30 AM UTC (approx 9:15 AM - 3:30 PM IST)
    // US Market: 13:30 UTC - 20:00 UTC (approx 9:30 AM - 4:00 PM EST)

    const now = new Date();
    const utcHigh = now.getUTCHours() * 60 + now.getUTCMinutes();

    if (isUS) {
      // 13:30 (810 mins) to 20:00 (1200 mins)
      const isOpen = utcHigh >= 810 && utcHigh <= 1200;
      return { name: "NASDAQ/NYSE", status: isOpen ? "Market Open" : "Market Closed", color: isOpen ? "var(--success)" : "var(--danger)" };
    } else {
      // 03:45 (225 mins) to 10:00 (600 mins) - approx
      const isOpen = utcHigh >= 225 && utcHigh <= 600;
      return { name: "NSE", status: isOpen ? "Market Open" : "Market Closed", color: isOpen ? "var(--success)" : "var(--danger)" };
    }
  };

  const marketInfo = getMarketStatus(symbol);

  // Use livePrice if available, otherwise fallback to metrics basePrice
  // Note: We use metrics?.basePrice from our generic generator if livePrice is missing
  const displayPrice = livePrice > 0 ? livePrice : (metrics?.basePrice || 0);

  return (
    <div className="company-page animate-fade-in" style={{ paddingBottom: "2rem" }}>
      <style>{`
          /* ... styles ... */
         .company-layout {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 2rem;
         }
         @media (max-width: 1200px) {
            .company-layout { grid-template-columns: 1fr; }
         }
         
         /* ... rest of styles ... */
         /* Ensure Skeleton has space to breathe */
         .skeleton-wrapper {
             margin-bottom: 1rem;
         }

         .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
         }
      `}</style>


      {/* Rest of the component remains same ... */}

      <div className="company-layout">
        {/* LEFT SIDEBAR (Stock List) */}
        <div style={{ height: "calc(100vh - 100px)", position: "sticky", top: "20px" }}>
          <StockSelector />
        </div>

        {/* RIGHT CONTENT */}
        <div className="main-content">
          <div className="header">
            <div>
              <h1 className="stock-title">{symbol}</h1>
              <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                {displayPrice > 0 ? (
                  <>
                    <span className="stock-price">{currency}{displayPrice.toLocaleString()}</span>
                    <span style={{ color: "var(--success)", fontSize: "1.1rem" }}>LIVE</span>
                  </>
                ) : (
                  <span className="stock-price">Loading...</span>
                )}
              </div>
              <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                {marketInfo.name} • <span style={{ color: marketInfo.color }}>{marketInfo.status}</span>
              </p>
            </div>

            <div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  className="action-btn" 
                  onClick={() => toggleTrade('BUY')}
                  style={{
                    background: "var(--success)",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0, 255, 127, 0.3)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span>🚀</span> BUY
                </button>
                <button 
                  className="action-btn" 
                  onClick={() => toggleTrade('SELL')}
                  style={{
                    background: "var(--danger)",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(255, 99, 71, 0.3)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span>📉</span> SELL
                </button>
              </div>
            </div>
          </div>

          <div className="details-grid">
            {/* CHART */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: "550px", position: "relative" }}>
              <div style={{ padding: "1rem", borderBottom: "1px solid var(--glass-border)" }}>
                <h3>Technical Chart</h3>
              </div>
              <div style={{ height: "calc(100% - 60px)", position: "relative" }}>
                <CandlestickChart key={symbol} symbol={symbol} currentPrice={displayPrice} />
              </div>
            </div>

            {/* FUNDAMENTALS */}
            <div className="glass-card">
              <h3 style={{ marginBottom: "1.5rem" }}>Fundamentals</h3>
              {metrics ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  <Row label="Company Name" value={metrics.Name} />
                  <Row label="Sector" value={metrics.Sector} />
                  <Row label="Market Cap" value={metrics.MarketCapitalization} />
                  <Row label="P/E Ratio" value={metrics.PERatio} />
                  <Row label="Dividend Yield" value={metrics.DividendYield} />
                  <Row label="52W High" value={metrics["52WeekHigh"]} />
                  <Row label="52W Low" value={metrics["52WeekLow"]} />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton width="100px" height="20px" /><Skeleton width="150px" height="20px" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton width="80px" height="20px" /><Skeleton width="120px" height="20px" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton width="90px" height="20px" /><Skeleton width="100px" height="20px" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton width="70px" height="20px" /><Skeleton width="80px" height="20px" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton width="110px" height="20px" /><Skeleton width="90px" height="20px" /></div>
                </div>
              )}

              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--glass-border)" }}>
                <h3>About {symbol}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", marginTop: "1rem" }}>
                  {metrics ? metrics.Description : "Loading company details..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        showTradeModal && (
          <div className="modal-overlay" onClick={() => setShowTradeModal(false)}>
            <div className="glass-card animate-fade-in" onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: "400px", position: "relative" }}>
              <button
                onClick={() => setShowTradeModal(false)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "1rem",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  zIndex: 10
                }}
              >
                ✕
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: tradeType === 'BUY' ? 'var(--success)' : 'var(--danger)' }}>
                  {tradeType} {symbol}
                </h3>
              </div>
              <TradePanel symbol={symbol} initialType={tradeType} />
            </div>
          </div>
        )
      }
    </div >
  );
}

const Row = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
    <span style={{ fontWeight: "600", maxWidth: "60%", textAlign: "right" }}>{value}</span>
  </div>
);
