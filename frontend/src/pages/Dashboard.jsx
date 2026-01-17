import React, { useState, useEffect, useMemo } from 'react';
import { usePrices } from '../context/PriceContext';
import { authFetch } from '../services/api';
import NewsWidget from '../components/NewsWidget';

const StatCard = ({ title, value, subtext, trend, loading }) => (
  <div className="glass-card">
    <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
      {title}
    </h3>
    <div style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "0.25rem" }}>
      {loading ? "..." : value}
    </div>
    <div style={{ fontSize: "0.85rem", color: trend === 'up' ? "var(--success)" : trend === 'down' ? "var(--danger)" : "var(--text-secondary)" }}>
      {subtext}
    </div>
  </div>
);

const MarketMovers = () => {
  const { prices } = usePrices();
  const [marketValues, setMarket] = useState("IND"); // IND or USA

  const indStocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN", "BHARTIARTL", "ITC"];
  const usaStocks = ["IBM", "TSLA", "AAPL", "NVDA"];

  const currentList = marketValues === "IND" ? indStocks : usaStocks;

  // Filter, Sort and Map
  const movers = currentList
    .map(symbol => {
      const data = prices[symbol];
      return {
        symbol,
        price: data?.price || 0,
        change: data?.change || 0,
        changePercent: data?.changePercent || 0
      };
    })
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5); // Top 5

  return (
    <div className="glass-card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Market Movers {marketValues === 'IND' ? '🇮🇳' : '🇺🇸'}</h2>
        <div style={{ background: 'var(--glass-bg)', borderRadius: '8px', padding: '4px', border: 'var(--glass-border)' }}>
          <button
            onClick={() => setMarket("IND")}
            style={{
              background: marketValues === "IND" ? "var(--accent-gradient)" : "transparent",
              border: "none",
              color: "white",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >IND</button>
          <button
            onClick={() => setMarket("USA")}
            style={{
              background: marketValues === "USA" ? "var(--accent-gradient)" : "transparent",
              border: "none",
              color: "white",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
          >USA</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {movers.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>Loading market data...</div>
        ) : (
          movers.map((stock) => (
            <div key={stock.symbol} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid var(--glass-border)'
            }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{stock.symbol}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {marketValues === 'IND' ? '₹' : '$'}{stock.price.toFixed(2)}
                </div>
              </div>
              <div style={{
                textAlign: 'right',
                color: stock.changePercent >= 0 ? 'var(--success)' : 'var(--danger)',
                fontWeight: '600',
                textShadow: stock.changePercent >= 0 ? '0 0 10px var(--success-glow)' : '0 0 10px var(--danger-glow)'
              }}>
                <div>{stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { prices } = usePrices();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('/portfolio');
        if (res.user) {
          setData(res);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real-time calculations
  const { netWorth, todaysPnL, availableBalance, activePositions } = useMemo(() => {
    if (!data) return { netWorth: 0, todaysPnL: 0, availableBalance: 0, activePositions: 0 };

    const balance = data.user.balance;
    let holdingsValue = 0;
    let dayPnL = 0;

    // Calculate holdings value based on LIVE prices
    if (data.holdings) {
      data.holdings.forEach(h => {
        const currentPrice = prices[h.symbol]?.price || h.avgPrice; // Fallback to avg if no live price
        const change = prices[h.symbol]?.change || 0;

        holdingsValue += h.quantity * currentPrice;
        dayPnL += h.quantity * change;
      });
    }

    return {
      netWorth: balance + holdingsValue,
      todaysPnL: dayPnL,
      availableBalance: balance,
      activePositions: data.holdings?.length || 0
    };
  }, [data, prices]);

  const pnlPercent = netWorth > 0 ? (todaysPnL / netWorth) * 100 : 0;

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Overview</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Welcome back, {data?.user?.name || 'Trader'}! Here's what's happening in your portfolio.
        </p>
      </div>

      <div className="dashboard-grid">
        <style>{`
          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          .content-grid {
             display: grid;
             grid-template-columns: 2fr 1fr;
             gap: 1.5rem;
             align-items: start;
          }
          .col-left {
             display: flex;
             flex-direction: column;
             gap: 1.5rem;
          }
          @media (max-width: 1024px) {
            .content-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <StatCard
          title="Net Worth"
          value={`₹${netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={`${todaysPnL >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}% today`}
          trend={todaysPnL >= 0 ? "up" : "down"}
          loading={loading}
        />
        <StatCard
          title="Available Balance"
          value={`₹${availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Ready to deploy"
          trend="neutral"
          loading={loading}
        />
        <StatCard
          title="Today's P&L"
          value={`₹${Math.abs(todaysPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={todaysPnL >= 0 ? "Profit" : "Loss"}
          trend={todaysPnL >= 0 ? "up" : "down"}
          loading={loading}
        />
        <StatCard
          title="Open Positions"
          value={activePositions}
          subtext="Active Investments"
          trend="neutral"
          loading={loading}
        />
      </div>

      <div className="content-grid">
        <div className="col-left">
          <MarketMovers />

          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2>Recent Activity</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last 5 Transactions</span>
            </div>

            {!data?.orders || data.orders.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No recent transactions</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {data.orders.slice(0, 5).map(txn => (
                  <li key={txn._id} style={{
                    padding: "12px 0",
                    borderBottom: "1px solid var(--glass-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <span style={{
                        fontWeight: '600',
                        color: txn.type === 'BUY' ? 'var(--success)' : 'var(--danger)',
                        marginRight: '8px'
                      }}>
                        {txn.type}
                      </span>
                      <span>{txn.symbol}</span>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {new Date(txn.date).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '500' }}>{txn.quantity} qty</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        @ ₹{txn.price}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-right">
          <NewsWidget />
        </div>
      </div>
    </div>
  );
}
