import { useEffect, useState } from "react";

export default function TickerTape() {
  // Mock data for indices - in a real app this would come from an API
  // Intentionally mixed positive and negative for realism
  const indices = [
    { symbol: "S&P 500", price: "4,783.45", change: "+0.54%" },
    { symbol: "NASDAQ", price: "15,123.88", change: "+0.82%" },
    { symbol: "DOW JONES", price: "37,543.12", change: "-0.12%" },
    { symbol: "BTC/USD", price: "45,120.00", change: "+2.34%" },
    { symbol: "ETH/USD", price: "2,430.50", change: "+1.15%" },
    { symbol: "GOLD", price: "2,045.30", change: "+0.25%" },
    { symbol: "OIL (WTI)", price: "72.40", change: "-1.50%" },
    { symbol: "EUR/USD", price: "1.0950", change: "-0.05%" },
    { symbol: "TSLA", price: "235.40", change: "+1.20%" },
    { symbol: "AAPL", price: "185.90", change: "-0.40%" },
    { symbol: "NVDA", price: "540.20", change: "+3.50%" },
  ];

  return (
    <div className="ticker-container">
      <style>{`
        .ticker-container {
          width: 100%;
          height: 36px;
          background: rgba(11, 15, 25, 0.6);
          backdrop-filter: blur(5px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 50;
        }

        .ticker-track {
          display: flex;
          animation: tickerScroll 30s linear infinite;
          white-space: nowrap;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          margin-right: 48px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .ticker-symbol {
          margin-right: 8px;
          color: var(--text-primary);
          font-weight: 700;
          opacity: 0.9;
        }

        .ticker-change.positive {
          color: var(--success);
          text-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }

        .ticker-change.negative {
          color: var(--danger);
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
        }

        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Pause on hover for readability */
        .ticker-container:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Duplicated content to ensure seamless loop */}
      <div className="ticker-track">
        {[...indices, ...indices, ...indices].map((item, index) => (
          <div key={index} className="ticker-item">
            <span className="ticker-symbol">{item.symbol}</span>
            <span style={{ marginRight: "8px" }}>{item.price}</span>
            <span className={`ticker-change ${item.change.startsWith("+") ? "positive" : "negative"}`}>
              {item.change.startsWith("+") ? "▲" : "▼"} {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
