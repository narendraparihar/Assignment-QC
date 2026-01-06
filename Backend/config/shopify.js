const axios = require("axios");

const shopifyConfig = {
  baseURL: `${process.env.SHOPIFY_STORE_URL}/admin/api/2023-07`,
  auth: {
    username: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_PASSWORD,
  },
};

const shopifyApi = axios.create(shopifyConfig);

module.exports = shopifyApi;
