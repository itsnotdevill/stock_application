import User from "../models/User.js";
// import Portfolio from "../models/Portfolio.js";
// import Transaction from "../models/Transaction.js";

// BUY STOCK
export const buyStock = async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalCost = quantity * price;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct Balance
    user.balance -= totalCost;

    // Update Embedded Portfolio
    const portfolioItem = user.portfolio.find(p => p.symbol === symbol);

    if (portfolioItem) {
      // Calculate new average price
      const totalValue = (portfolioItem.quantity * portfolioItem.avgPrice) + totalCost;
      const newQuantity = portfolioItem.quantity + quantity;
      portfolioItem.avgPrice = totalValue / newQuantity;
      portfolioItem.quantity = newQuantity;
    } else {
      // Create new holding
      user.portfolio.push({
        symbol,
        quantity,
        avgPrice: price
      });
    }

    // Record Embedded Transaction
    user.transactions.push({
      symbol,
      type: "BUY",
      quantity,
      price
    });

    await user.save();

    // Find the updated item to return
    const updatedItem = user.portfolio.find(p => p.symbol === symbol);

    res.json({ message: `Successfully bought ${quantity} shares of ${symbol}`, balance: user.balance, portfolioItem: updatedItem });

  } catch (error) {
    console.error("Buy Error:", error);
    res.status(500).json({ message: "Server error processing trade" });
  }
};

// SELL STOCK
export const sellStock = async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const portfolioItem = user.portfolio.find(p => p.symbol === symbol);

    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient holdings to sell" });
    }

    // Add Balance
    const totalValue = quantity * price;
    user.balance += totalValue;

    // Update Embedded Portfolio
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity === 0) {
      // Remove item if quantity is 0
      user.portfolio = user.portfolio.filter(p => p.symbol !== symbol);
    }

    // Record Embedded Transaction
    user.transactions.push({
      symbol,
      type: "SELL",
      quantity,
      price
    });

    await user.save();

    res.json({ message: `Successfully sold ${quantity} shares of ${symbol}`, balance: user.balance });

  } catch (error) {
    console.error("Sell Error:", error);
    res.status(500).json({ message: "Server error processing trade" });
  }
};
