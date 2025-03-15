const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/create", (req, res) => {
  const { items } = req.body;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  db.run("INSERT INTO orders (sessionId, total, createdAt) VALUES (?, ?, ?)", [req.sessionID, total, new Date().toISOString()], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run("DELETE FROM carts WHERE sessionId = ?", [req.sessionID]);
    res.status(200).json({ success: true });
  });
});

module.exports = router;