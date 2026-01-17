import { useState, useEffect } from "react";
import LearnTrading from "../components/LearnTrading";

export default function Reports() {
    const [activeTab, setActiveTab] = useState("journal");
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/portfolio", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPortfolioData(data);
            }
        } catch (error) {
            console.error("Failed to fetch report data:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div style={{ color: "var(--text-secondary)" }}>Loading reports...</div>;

        switch (activeTab) {
            case "journal":
                return <TradingJournal trades={portfolioData?.orders || []} />;
            case "performance":
                return <PerformanceStats trades={portfolioData?.orders || []} />;
            case "skills":
                return <SkillThreshold trades={portfolioData?.orders || []} />;
            case "learn":
                return <LearnTrading />;
            default:
                return <TradingJournal trades={portfolioData?.orders || []} />;
        }
    };

    return (
        <div className="reports-container">
            <h1 style={{ marginBottom: "1.5rem" }}>📑 Trading Reports</h1>

            <div className="tabs" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--glass-border)" }}>
                {['Journal', 'Performance', 'Skills', 'Learn'].map(tab => {
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
                                transition: "all 0.2s"
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="tab-content animate-fade-in">
                {renderContent()}
            </div>
        </div>
    );
}

function TradingJournal({ trades }) {
    if (!trades || trades.length === 0) {
        return <div className="glass-card" style={{ color: "var(--text-secondary)" }}>No trades recorded yet. Start trading to see your journal!</div>;
    }

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: "1rem" }}>History Log</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left", color: "var(--text-secondary)", borderBottom: "1px solid var(--glass-border)" }}>
                        <th style={{ padding: "12px" }}>Date</th>
                        <th style={{ padding: "12px" }}>Symbol</th>
                        <th style={{ padding: "12px" }}>Type</th>
                        <th style={{ padding: "12px" }}>Qty</th>
                        <th style={{ padding: "12px" }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((t, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                            <td style={{ padding: "12px" }}>{new Date(t.date).toLocaleDateString()}</td>
                            <td style={{ padding: "12px", fontWeight: "bold" }}>{t.symbol}</td>
                            <td style={{ padding: "12px" }}>
                                <span style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    background: t.type === 'BUY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: t.type === 'BUY' ? 'var(--success)' : 'var(--danger)',
                                    fontSize: "0.8rem"
                                }}>{t.type}</span>
                            </td>
                            <td style={{ padding: "12px" }}>{t.quantity}</td>
                            <td style={{ padding: "12px" }}>₹{t.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PerformanceStats({ trades }) {
    // Basic calculation logic
    const totalTrades = trades.length;
    const buystrades = trades.filter(t => t.type === 'BUY').length;
    const sellTrades = trades.filter(t => t.type === 'SELL').length;

    // Simulate Win Rate (Since we don't track closed P&L per trade in DB perfectly yet, we mock logic based on activity)
    // In a real app, we'd match buy/sell pairs. For now, let's derive activity score.
    const activityLevel = totalTrades > 10 ? "High" : "Low";

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="glass-card">
                <h3 style={{ marginBottom: "1rem" }}>Total Activity</h3>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--success)" }}>{totalTrades}</div>
                <p style={{ color: "var(--text-secondary)" }}>Trades Executed</p>
            </div>
            <div className="glass-card">
                <h3 style={{ marginBottom: "1rem" }}>Buy / Sell Ratio</h3>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--accent-color)" }}>{buystrades}:{sellTrades}</div>
                <p style={{ color: "var(--text-secondary)" }}>Market Bias</p>
            </div>
            <div className="glass-card">
                <h3 style={{ marginBottom: "1rem" }}>Activity Level</h3>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#60a5fa" }}>{activityLevel}</div>
                <p style={{ color: "var(--text-secondary)" }}>Based on trade frequency</p>
            </div>
        </div>
    );
}

function SkillThreshold({ trades }) {
    const tradeCount = trades.length;
    let level = "Beginner";
    let progress = 10;
    let nextGoal = 5;

    if (tradeCount >= 5 && tradeCount < 20) {
        level = "Intermediate";
        progress = 45;
        nextGoal = 20 - tradeCount;
    } else if (tradeCount >= 20) {
        level = "Pro Trader";
        progress = 85;
        nextGoal = 0;
    } else {
        nextGoal = 5 - tradeCount;
    }

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: "1rem" }}>Trader Level: <span style={{ color: 'var(--accent-color)' }}>{level}</span></h3>
            <div style={{ background: "rgba(255,255,255,0.1)", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ width: `${progress}%`, background: "var(--accent-color)", height: "100%", transition: "width 0.5s" }}></div>
            </div>
            {level !== "Pro Trader" ? (
                <p style={{ color: "var(--text-secondary)" }}>
                    Execute <strong>{nextGoal} more trades</strong> to reach the next level and unlock advanced insights.
                </p>
            ) : (
                <p style={{ color: "var(--success)" }}>
                    You have reached the Pro level! You now have access to all features.
                </p>
            )}

            <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <h4>Current Skills Rating</h4>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Based on your activity of {tradeCount} trades, your experience score is growing.
                        Keep trading consistently to improve your rating.
                    </p>
                </div>
            </div>
        </div>
    );
}
