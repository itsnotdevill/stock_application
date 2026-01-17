import React, { useState, useEffect } from 'react';

const NewsWidget = () => {
    const [news, setNews] = useState([]);

    // Sample headlines generator
    useEffect(() => {
        const generateNews = () => {
            const tickers = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT", "RELIANCE", "TCS"];
            const actions = ["surges", "dips", "rallies", "falls", "steady", "volatility increases"];
            const reasons = ["on strong earnings", "amid market uncertainty", "after CEO comments", "following new product launch", "due to global trends"];
            
            const newArticles = Array.from({ length: 5 }).map((_, i) => {
                const ticker = tickers[Math.floor(Math.random() * tickers.length)];
                const action = actions[Math.floor(Math.random() * actions.length)];
                const reason = reasons[Math.floor(Math.random() * reasons.length)];
                
                return {
                    id: i,
                    source: ["Bloomberg", "Reuters", "CNBC", "Financial Times"][Math.floor(Math.random() * 4)],
                    headline: `${ticker} ${action} ${reason}`,
                    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
                    sentiment: action.includes("surges") || action.includes("rallies") ? "positive" : "negative"
                };
            });
            setNews(newArticles);
        };

        generateNews();
        // Refresh every 5 minutes
        const interval = setInterval(generateNews, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-card" style={{ height: '100%', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <h2>Market News 📰</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>LIVE FEED</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {news.map((item) => (
                    <div key={item.id} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        borderLeft: `3px solid ${item.sentiment === 'positive' ? 'var(--success)' : 'var(--danger)'}`,
                        paddingLeft: '10px'
                    }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>
                            {item.headline}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.source}</span>
                            <span>{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsWidget;
