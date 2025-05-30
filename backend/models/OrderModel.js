const db = require("../config/Database");

exports.getAllOrders = () => {
  return db.execute(
    `SELECT o.*, p.name AS product_name, p.image_url, u.username AS user_username 
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    LEFT JOIN users u ON o.user_id = u.id` // Menyertakan JOIN ke tabel users untuk mendapatkan username
  );
};

exports.getOrderById = (id) => {
  return db.execute(
    "SELECT o.*, p.name as product_name, p.image_url FROM orders o LEFT JOIN products p ON o.product_id = p.id WHERE o.id = ?",
    [id]
  );
};

exports.createOrder = (user_id, product_id, quantity, total_price) => {
  return db.execute(
    "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
    [user_id, product_id, quantity, total_price]
  );
};

exports.updateOrder = (id, quantity, total_price) => {
  return db.execute(
    "UPDATE orders SET quantity = ?, total_price = ? WHERE id = ?",
    [quantity, total_price, id]
  );
};

exports.deleteOrder = (id) => {
  return db.execute("DELETE FROM orders WHERE id = ?", [id]);
};

exports.getOrdersByUserId = (user_id) => {
  return db.execute(
    "SELECT o.*, p.name as product_name, p.image_url FROM orders o LEFT JOIN products p ON o.product_id = p.id WHERE o.user_id = ? AND o.status = 'pending'",
    [user_id]
  );
};

exports.getPendingOrdersByUserId = (userId) => {
  if (!userId) {
    throw new Error("User ID is missing");
  }

  return db.execute(
    `SELECT * FROM orders WHERE user_id = ? AND status = 'pending'`,
    [userId]
  );
};

exports.checkoutAllOrdersByUserId = (userId) => {
  if (!userId) {
    throw new Error("User ID is missing");
  }

  return db.execute(
    `UPDATE orders SET status = 'checked_out' WHERE user_id = ? AND status = 'pending'`,
    [userId]
  );
};

exports.getOrderByIdAndUserId = (orderId, userId) => {
  return db.execute("SELECT * FROM orders WHERE id = ? AND user_id = ?", [
    orderId,
    userId,
  ]);
};

exports.checkoutOrderById = (orderId) => {
  return db.execute("UPDATE orders SET status = 'checked_out' WHERE id = ?", [
    orderId,
  ]);
};

exports.findPendingOrderByUserAndProduct = (user_id, product_id) => {
  return db.execute(
    "SELECT * FROM orders WHERE user_id = ? AND product_id = ? AND status = 'pending'",
    [user_id, product_id]
  );
};

// Ambil harga produk by id
exports.getProductById = (product_id) => {
  return db.execute("SELECT price FROM products WHERE id = ?", [product_id]);
};

exports.getCheckedOutOrdersByUserId = (user_id) => {
  return db.execute(
    "SELECT o.*, p.name as product_name, p.image_url FROM orders o LEFT JOIN products p ON o.product_id = p.id WHERE o.user_id = ? AND o.status = 'checked_out'",
    [user_id]
  );
};
