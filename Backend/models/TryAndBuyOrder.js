const mongoose = require("mongoose");

const tryBuyOrderSchema = new mongoose.Schema({
  shopifyOrderId: { type: String, required: true },
  type: { type: String, default: "TRY_AND_BUY" },
  visibleItems: [
    { itemId: String, variantId: String, size: String, price: Number },
  ],
  allItems: [
    {
      itemId: String,
      variantId: String,
      size: String,
      price: Number,
      kept: { type: Boolean, default: false },
      returned: { type: Boolean, default: false },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "packed", "delivered"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TryBuyOrder", tryBuyOrderSchema);
