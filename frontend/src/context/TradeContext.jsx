import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// import { usePrices } from "./PriceContext"; // Can't circular dep easily if TradeContext is inside PriceProvider or vice versa? 
// Actually PriceProvider wraps App, so it's outside. But TradeProvider is used inside specific pages or globally? 
// Usually TradeProvider should validly use PriceContext if PriceProvider is higher up.

const TradeContext = createContext();

export function TradeProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [loading, setLoading] = useState(false);

  // Note: We won't hold 'currentPrice' state here anymore for *all* stocks. 
  // Individual components should get price from usePrices().
  // However, for buyStock/sellStock functions, we need the price. We should pass it as arg.

  // 🔹 FETCH REAL PORTFOLIO FROM DB
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { user, holdings, orders } = res.data;

      setBalance(user.balance);
      setOrders(orders);

      // Convert array to object map for easier lookup in UI
      const holdingsMap = {};
      holdings.forEach(h => {
        holdingsMap[h.symbol] = { qty: h.quantity, avgPrice: h.avgPrice };
      });
      setHoldings(holdingsMap);

    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  // 🔹 BUY STOCK (Real DB Persistence)
  const buyStock = async (symbol, qty, price) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to trade!");
        return;
      }

      if (!price || price <= 0) {
        alert("Invalid Price! Please wait for live data.");
        return;
      }

      const cost = qty * price;
      if (balance < cost) {
        alert("Insufficient Balance!");
        return;
      }

      setLoading(true);
      await axios.post("http://localhost:5000/api/trade/buy",
        { symbol, quantity: qty, price: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPortfolio(); // Refresh data
      alert(`Successfully bought ${qty} shares of ${symbol}`);

    } catch (error) {
      console.error("Buy Error:", error);
      alert(error.response?.data?.message || "Trade Failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SELL STOCK (Real DB Persistence)
  const sellStock = async (symbol, qty, price) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to trade!");
        return;
      }

      if (!price || price <= 0) {
        alert("Invalid Price! Please wait for live data.");
        return;
      }

      if (!holdings[symbol] || holdings[symbol].qty < qty) {
        alert("Insufficient Holdings!");
        return;
      }

      setLoading(true);
      await axios.post("http://localhost:5000/api/trade/sell",
        { symbol, quantity: qty, price: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPortfolio(); // Refresh data
      alert(`Successfully sold ${qty} shares of ${symbol}`);

    } catch (error) {
      console.error("Sell Error:", error);
      alert(error.response?.data?.message || "Trade Failed");
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <TradeContext.Provider
      value={{
        balance,
        orders,
        holdings,
        buyStock,
        sellStock,
        fetchPortfolio // Create access for login components to trigger refresh
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrade() {
  return useContext(TradeContext);
}
