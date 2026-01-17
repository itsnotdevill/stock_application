const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  symbol: String,
  type: String,
  quantity: Number,
  price: Number,
  profitLoss: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trade", tradeSchema);
