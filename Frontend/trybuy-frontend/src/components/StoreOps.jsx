import React, { useState, useEffect } from "react";
import axios from "axios";

const StoreOps = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newItem, setNewItem] = useState({
    variantId: "",
    size: "",
    price: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/store-ops/try-buy-orders"
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders");
    }
  };

  const handlePack = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/store-ops/try-buy-orders/${id}/pack`
      );
      fetchOrders();
    } catch (error) {
      console.error("Error packing order");
    }
  };

  const handleAddItem = async () => {
    if (!selectedOrder) return;
    try {
      await axios.put(
        `http://localhost:5000/api/store-ops/try-buy-orders/${selectedOrder._id}/items`,
        {
          action: "add",
          item: newItem,
        }
      );
      fetchOrders();
      setNewItem({ variantId: "", size: "", price: "" });
    } catch (error) {
      console.error("Error adding item");
    }
  };

  return (
    <section>
      <h2>Store Operations</h2>
      <h3>TRY_AND_BUY Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order.shopifyOrderId} - Status: {order.status}
            <button onClick={() => setSelectedOrder(order)}>View/Edit</button>
            {order.status === "pending" && (
              <button onClick={() => handlePack(order._id)}>Mark Packed</button>
            )}
          </li>
        ))}
      </ul>
      {selectedOrder && (
        <div>
          <h4>All Items</h4>
          <ul>
            {selectedOrder.allItems.map((item) => (
              <li key={item.variantId}>
                Size: {item.size}, Price: {item.price}
                <button
                  onClick={() =>
                    axios
                      .put(
                        `http://localhost:5000/api/store-ops/try-buy-orders/${selectedOrder._id}/items`,
                        {
                          action: "remove",
                          item: { variantId: item.variantId },
                        }
                      )
                      .then(fetchOrders)
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h4>Add Item</h4>
          <input
            placeholder="Variant ID"
            value={newItem.variantId}
            onChange={(e) =>
              setNewItem({ ...newItem, variantId: e.target.value })
            }
          />
          <input
            placeholder="Size"
            value={newItem.size}
            onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      )}
    </section>
  );
};

export default StoreOps;
