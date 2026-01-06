const express = require("express");
const router = express.Router();
const TryBuyOrder = require("../models/TryAndBuyOrder");
const shopifyApi = require("../config/shopify");

// Get items for delivery
router.get("/try-buy-orders/:id/items", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await TryBuyOrder.findById(id);
    res.json(order.allItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark items kept/returned
router.put("/try-buy-orders/:id/items", async (req, res) => {
  const { id } = req.params;
  const { items } = req.body; // [{variantId, action: 'kept' or 'returned'}]

  try {
    const order = await TryBuyOrder.findById(id);
    for (const item of items) {
      const itemIndex = order.allItems.findIndex(
        (i) => i.variantId === item.variantId
      );
      if (item.action === "kept") {
        order.allItems[itemIndex].kept = true;
        await shopifyApi.post(
          `/orders/${order.shopifyOrderId}/fulfillments.json`,
          {
            fulfillment: { line_items: [{ id: item.variantId }] },
          }
        );
      } else if (item.action === "returned") {
        order.allItems[itemIndex].returned = true;
        await shopifyApi.post(`/inventory_levels/adjust.json`, {
          inventory_item_id: item.variantId,
          available_adjustment: 1,
        });
      }
    }
    order.status = "delivered";
    await order.save();

    // Update order value (mock: recalculate total)
    const keptItems = order.allItems.filter((i) => i.kept);
    const newTotal = keptItems.reduce((sum, i) => sum + i.price, 0);
    // Update Shopify order total (mock)
    await shopifyApi.put(`/orders/${order.shopifyOrderId}.json`, {
      order: { total_price: newTotal },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
