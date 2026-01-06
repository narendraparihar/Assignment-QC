import React, { useState, useEffect } from "react";
import axios from "axios";

const Rider = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actions, setActions] = useState({}); // {variantId: 'kept' or 'returned'}

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/store-ops/try-buy-orders"
      );
      setOrders(response.data.filter((o) => o.status === "packed"));
    } catch (error) {
      console.error("Error fetching orders");
    }
  };

  const handleAction = (variantId, action) => {
    setActions({ ...actions, [variantId]: action });
  };

  const handleSubmit = async () => {
    if (!selectedOrder) return;
    const items = Object.keys(actions).map((variantId) => ({
      variantId,
      action: actions[variantId],
    }));
    try {
      await axios.put(
        `http://localhost:5000/api/rider/try-buy-orders/${selectedOrder._id}/items`,
        { items }
      );
      fetchOrders();
      setSelectedOrder(null);
      setActions({});
    } catch (error) {
      console.error("Error updating items");
    }
  };

  return (
    <section>
      <h2>Rider Delivery & Return</h2>
      <h3>Packed Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order.shopifyOrderId}
            <button onClick={() => setSelectedOrder(order)}>Deliver</button>
          </li>
        ))}
      </ul>
      {selectedOrder && (
        <div>
          <h4>Items</h4>
          <ul>
            {selectedOrder.allItems.map((item) => (
              <li key={item.variantId}>
                Size: {item.size}, Price: {item.price}
                <button onClick={() => handleAction(item.variantId, "kept")}>
                  Kept
                </button>
                <button
                  onClick={() => handleAction(item.variantId, "returned")}
                >
                  Returned
                </button>
                {actions[item.variantId] && (
                  <span> - {actions[item.variantId]}</span>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Submit Actions</button>
        </div>
      )}
    </section>
  );
};

export default Rider;
