import React, { useState } from "react";
import axios from "axios";

const CustomerOrder = () => {
  const [formData, setFormData] = useState({
    itemId: "",
    variantId: "",
    size: "",
    price: "",
    customerId: "",
    category: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/try-buy",
        formData
      );
      setMessage(`Order created: ${response.data.orderId}`);
    } catch (error) {
      setMessage("Error creating order");
    }
  };

  return (
    <section>
      <h2>Customer Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="itemId"
          placeholder="Item ID"
          onChange={handleChange}
          required
        />
        <input
          name="variantId"
          placeholder="Variant ID"
          onChange={handleChange}
          required
        />
        <input
          name="size"
          placeholder="Size"
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <input
          name="customerId"
          placeholder="Customer ID"
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
        />
        <button type="submit">Order Try & Buy</button>
      </form>
      <p>{message}</p>
    </section>
  );
};

export default CustomerOrder;
