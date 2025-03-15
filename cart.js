const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  const sessionId = req.sessionID;
  db.all("SELECT p.* FROM carts c JOIN products p ON c.productId = p.id WHERE c.sessionId = ?", [sessionId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = rows.reduce((sum, item) => sum + item.price, 0);
    res.json({ items: rows, total });
  });
});

router.post("/add", (req, res) => {
  const { productId } = req.body;
  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
    if (err || !product || product.stock <= 0) return res.status(400).json({ error: "Invalid product or out of stock" });
    db.run("INSERT INTO carts (sessionId, productId) VALUES (?, ?)", [req.sessionID, productId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      db.run("UPDATE products SET stock = stock - 1 WHERE id = ?", [productId]);
      res.status(200).json({ success: true });
    });
  });
});

router.post("/remove", (req, res) => {
  const { productId } = req.body;
  db.run("DELETE FROM carts WHERE sessionId = ? AND productId = ? LIMIT 1", [req.sessionID, productId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run("UPDATE products SET stock = stock + 1 WHERE id = ?", [productId]);
    res.status(200).json({ success: true });
  });
});

module.exports = router;