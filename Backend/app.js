require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ordersRoutes = require("./routes/orders");
const storeOpsRoutes = require("./routes/storeOps");
const riderRoutes = require("./routes/rider");
const recommendation = require("./routes/recommendation");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/orders", ordersRoutes);
app.use("/api/store-ops", storeOpsRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/recommendation", recommendation);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
