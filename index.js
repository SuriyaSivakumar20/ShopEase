const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./db");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true in production with HTTPS
}));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));