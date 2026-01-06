## Features
- ##### Customer Ordering:
  - Select an item and opt for Try & Buy; system auto-adds size variants and similar designs internally.
- ##### Store Operations:
  - View and modify TRY_AND_BUY orders in Shopify Admin, add/remove items, and mark as packed with inventory reservations.
- ##### Rider Management:
  - Deliver items, mark kept/returned, and update order values dynamically.
- ##### Inventory Handling:
  - Reserve inventory on order creation, deduct on kept items, and restock on returns.
- ##### Shopify Integration:
  - Leverages Shopify Orders, Inventory, and Admin APIs for real-time sync.
- ##### Responsive UI:
  - Basic React frontend for customer, store, and rider interactions.

## Tech Stack

- **Frontend**: React.js (with Axios for API calls)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **External APIs**: Shopify REST API
- **Other**: Axios, dotenv, CORS

## Installation and Setup

##### Backend Setup

1. Clone the repository and navigate to the backend folder:

```
git clone https://github.com/your-repo/trybuy-workflow.git
cd trybuy-workflow/backend
```

2. Install dependencies:

```
npm install
```

3. Create a .env file in the backend root:

```
MONGO_URI=mongodb://localhost:27017/trybuy
SHOPIFY_STORE_URL=https://yourstore.myshopify.com
SHOPIFY_API_KEY=your_api_key
SHOPIFY_PASSWORD=your_password
PORT=5000
```

4. Run the backend server:

```
npm start
```

##### Frontend Setup

1. Navigate to the frontend folder:

```
Copy code
cd ../frontend
```

2. Install dependencies:

```
npm install
```

3. Start the React app

```
npm start
```

## Usage

- **Customer Flow**: Use the React UI to place a Try & Buy order. The system adds hidden items (sizes and similars) and reserves inventory.
- **Store Ops**: Access the Store Operations section to view orders, add/remove items, and pack them.
- **Rider Flow**: Select a packed order, mark items as kept or returned, and submit to update inventory and order totals.

## Example Workflow

- Customer orders a Medium T-shirt.
- System adds Small, Large, and 2 similar designs internally.
- Store adds an XL size and packs the order.
- Rider delivers; customer keeps Medium and Large, returns others.
- Inventory updates: Kept items deducted, returned restocked; order total recalculated.

## API Endpoints

All endpoints are prefixed with http://localhost:5000/api.

Orders

```
POST /orders/try-buy: // Create a Try & Buy order.
Body:
{ itemId, variantId, size, price, customerId, category }
Response:
Order ID and success message.
```

Store Ops

```
GET /store-ops/try-buy-orders: Fetch all TRY_AND_BUY orders.
PUT /store-ops/try-buy-orders/:id/items: Add/remove items.
Body: { action: 'add'|'remove', item: { variantId, size, price } }
PUT /store-ops/try-buy-orders/:id/pack: Mark order as packed.
```

Rider

```
GET /rider/try-buy-orders/:id/items: Get items for delivery.
PUT /rider/try-buy-orders/:id/items: Update kept/returned items.
Body: { items: [{ variantId, action: 'kept'|'returned' }] }
```
