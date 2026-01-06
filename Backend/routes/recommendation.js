const express = require("express");
const router = express.Router();
const shopifyApi = require("../config/shopify");

// Helper: Fetch similar items
router.get("/similar-items", async (req, res) => {
  const { itemId, category, brand, size } = req.query;

  try {
    // Fetch original product for reference
    const originalProduct = await shopifyApi.get(`/products/${itemId}.json`);
    const originalTags = originalProduct.data.product.tags || [];
    const originalType = originalProduct.data.product.product_type;

    let params = { limit: 50 };
    if (brand) params.vendor = brand;
    else params.product_type = originalType;

    const response = await shopifyApi.get("/products.json", { params });
    let products = response.data.products;

    products = products.filter(
      (p) => p.id !== itemId && p.tags.some((tag) => originalTags.includes(tag))
    );

    if (products.length < 3) {
      const sizeResponse = await shopifyApi.get("/products.json", {
        params: { product_type: originalType, limit: 50 },
      });
      const sizeProducts = sizeResponse.data.products.filter(
        (p) =>
          p.id !== itemId &&
          p.variants.some((v) => v.option1 === size) &&
          !products.some((existing) => existing.id === p.id)
      );
      products = [...products, ...sizeProducts.slice(0, 3 - products.length)];
    }

    const similarItems = products.slice(0, 3).map((p) => ({
      itemId: p.id,
      title: p.title,
      brand: p.vendor,
      sizes: p.variants.map((v) => ({
        variantId: v.id,
        size: v.option1,
        price: v.price,
        inventory: v.inventory_quantity,
      })),
    }));

    res.json(similarItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
