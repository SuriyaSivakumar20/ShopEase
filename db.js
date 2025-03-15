const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("shopease.db"); // Persistent file instead of memory

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL,
      stock INTEGER,
      image TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS carts (
      sessionId TEXT,
      productId INTEGER,
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT,
      total REAL,
      createdAt TEXT
    )
  `);

  // Seed initial products
  const stmt = db.prepare("INSERT OR IGNORE INTO products (id, name, price, stock, image) VALUES (?, ?, ?, ?, ?)");
  const products = [
    [1, "Wireless Noise-Cancelling Headphones", 299.99, 15, "https://public.readdy.ai/ai/img_res/fafa978e9a39b7bf46184cfe8b192d4a.jpg"],
    [2, "Smart Fitness Watch", 199.99, 8, "https://public.readdy.ai/ai/img_res/6c7cee3113a4a57540c58144f47bd87a.jpg"],
    [3, "Premium Coffee Maker", 159.99, 12, "https://public.readdy.ai/ai/img_res/34d96305a6f9180aa77e570a6461bc26.jpg"],
    [4, "4K Ultra HD Smart TV", 599.99, 5, "https://images.unsplash.com/photo-1593305841991-2b16a81a61c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    [5, "Leather Messenger Bag", 129.99, 20, "https://images.unsplash.com/photo-1584278432090-2461809dc8f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    [6, "Bluetooth Portable Speaker", 89.99, 25, "https://images.unsplash.com/photo-1605649487212-47bdab064df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    [7, "Ergonomic Office Chair", 249.99, 10, "https://images.unsplash.com/photo-1596162954151-cacb9126ec63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    [8, "Stainless Steel Cookware Set", 179.99, 7, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
  ];
  products.forEach((p) => stmt.run(p));
  stmt.finalize();
});

module.exports = db;