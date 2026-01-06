const express = require("express");
const router = express.Router();
const TryBuyOrder = require("../models/TryAndBuyOrder");
const shopifyApi = require("../config/shopify");

router.get("/try-buy-orders", async (req, res) => {
  try {
    const orders = await TryBuyOrder.find({ type: "TRY_AND_BUY" }).populate(
      "allItems"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/try-buy-orders/:id/items", async (req, res) => {
  const { id } = req.params;
  const { action, item } = req.body;
  try {
    const order = await TryBuyOrder.findById(id);
    if (action === "add") {
      order.allItems.push(item);
      await shopifyApi.post(`/orders/${order.shopifyOrderId}/line_items.json`, {
        line_item: {
          variant_id: item.variantId,
          quantity: 1,
          price: item.price,
        },
      });
      await shopifyApi.post(`/inventory_levels/adjust.json`, {
        inventory_item_id: item.variantId,
        available_adjustment: -1,
      });
    } else if (action === "remove") {
      order.allItems = order.allItems.filter(
        (i) => i.variantId !== item.variantId
      );
    }
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/try-buy-orders/:id/pack", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await TryBuyOrder.findByIdAndUpdate(
      id,
      { status: "packed" },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
