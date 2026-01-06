const express = require("express");
const router = express.Router();
const TryBuyOrder = require("../models/TryAndBuyOrder");
const shopifyApi = require("../config/shopify");

async function getSimilarItems(itemId, category) {
  const response = await shopifyApi.get("/products.json", {
    params: { collection_id: category },
  });
  const products = response.data.products.slice(0, 3);
  return products.map((p) => ({
    itemId: p.id,
    variantId: p.variants[0].id,
    size: p.variants[0].option1,
    price: p.variants[0].price,
  }));
}

function getSizeVariants(variantId, size) {
  const sizes = ["S", "M", "L", "XL"];
  const index = sizes.indexOf(size);
  const up = index < sizes.length - 1 ? sizes[index + 1] : size;
  const down = index > 0 ? sizes[index - 1] : size;
  return [
    { itemId: "same", variantId: "up_variant", size: up, price: 100 },
    { itemId: "same", variantId: "down_variant", size: down, price: 100 },
  ];
}

router.post("/try-buy", async (req, res) => {
  const { itemId, variantId, size, price, customerId, category } = req.body;

  try {
    const sizeVariants = getSizeVariants(variantId, size);
    const similarItems = await getSimilarItems(itemId, category);
    const allItems = [
      { itemId, variantId, size, price, kept: false, returned: false },
      ...sizeVariants,
      ...similarItems,
    ];

    const orderData = {
      order: {
        line_items: allItems.map((item) => ({
          variant_id: item.variantId,
          quantity: 1,
          price: item.price,
        })),
        customer: { id: customerId },
        metafields: [{ key: "type", value: "TRY_AND_BUY", type: "string" }],
      },
    };
    const shopifyOrder = await shopifyApi.post("/orders.json", orderData);
    const shopifyOrderId = shopifyOrder.data.order.id;

    for (const item of allItems) {
      await shopifyApi.post(`/inventory_levels/adjust.json`, {
        inventory_item_id: item.variantId,
        available_adjustment: -1,
      });
    }

    const tryBuyOrder = new TryBuyOrder({
      shopifyOrderId,
      visibleItems: [{ itemId, variantId, size, price }],
      allItems,
    });
    await tryBuyOrder.save();

    res.status(201).json({ message: "Order created", orderId: shopifyOrderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
