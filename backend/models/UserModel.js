const db = require("../config/Database");

exports.createUser = (username, passwordHash, email, role) => {
  return db.execute(
    "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
    [username, passwordHash, email, role]
  );
};

exports.findByUsername = (username) => {
  return db.execute("SELECT * FROM users WHERE username = ?", [username]);
};

exports.findById = (id) => {
  return db.execute(
    "SELECT id, username, email, role FROM users WHERE id = ?",
    [id]
  );
};

exports.getUserById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, username, email, role FROM users WHERE id = ?",
    [id]
  );
  return rows;
};

// UPDATE USER
exports.updateUser = async (id, username, password, email, role) => {
  // Ambil data user lama
  const [oldRows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
  if (!oldRows.length) return { affectedRows: 0 };
  const oldUser = oldRows[0];
  // Jika password tidak dikirim, gunakan password lama
  const newPassword = password ? password : oldUser.password;
  // Jika role tidak dikirim, gunakan role lama
  const newRole = role ? role : oldUser.role;
  return db.execute(
    "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?",
    [username, newPassword, email, newRole, id]
  );
};

// DELETE USER
exports.deleteUser = (id) => {
  return db.execute("DELETE FROM users WHERE id = ?", [id]);
};

// DELETE ALL ORDERS BY USER ID
exports.deleteOrdersByUserId = (userId) => {
  return db.execute("DELETE FROM orders WHERE user_id = ?", [userId]);
};
