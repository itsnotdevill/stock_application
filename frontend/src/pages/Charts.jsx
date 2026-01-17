import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CandlestickChart from "../components/CandlestickChart";
import TradePanel from "../components/TradePanel";
import StockSelector from "../components/StockSelector";
import { usePrices } from "../context/PriceContext";

export default function Charts() {
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState("RELIANCE");
  const { getPrice } = usePrices();
  const currentPrice = getPrice(symbol);

  useEffect(() => {
    const querySymbol = searchParams.get("symbol");
    if (querySymbol) {
      setSymbol(querySymbol.toUpperCase());
    }
  }, [searchParams]);

  return (
    <div className="charts-container" style={{ height: "calc(100vh - 100px)" }}>
      <style>{`
          .trading-layout {
             display: grid;
             grid-template-columns: 240px 1fr 300px;
             gap: 1rem;
             height: 100%;
          }
          @media (max-width: 1200px) {
            .trading-layout { grid-template-columns: 200px 1fr; }
          }
       `}</style>

      <div className="trading-layout">
        {/* LEFT: SELECTOR */}
        <div style={{ height: "100%" }}>
          <StockSelector />
        </div>

        {/* MIDDLE: CHART */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          <h2 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}>{symbol} Analysis</h2>
          <div style={{ flex: 1, position: 'relative' }}>
            <CandlestickChart key={symbol} symbol={symbol} currentPrice={currentPrice} />
          </div>
        </div>

        {/* RIGHT: TRADE (Hidden on smaller screens or moved) */}
        <div className="glass-card">
          <TradePanel symbol={symbol} />
        </div>
      </div>
    </div>
  );
}
