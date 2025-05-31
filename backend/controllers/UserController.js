const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const RefreshTokenController = require('./RefreshTokenController');

// REGISTER
exports.register = async (req, res) => {
  try {
    console.log("Register endpoint hit");
    console.log("Request body:", req.body); // Log raw request body

    const { username, password, email, role } = req.body;
    
    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ 
        message: "Username, password, and email are required" 
      });
    }

    // Set default role if not provided
    const userRole = role || 'user';
    
    const hashed = await bcrypt.hash(password, 10);
    await User.createUser(username, hashed, email, userRole);
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [user] = await User.findByUsername(username);
    if (!user.length)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user[0].id, username: user[0].username, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );
    // Generate refresh token
    const refreshToken = RefreshTokenController.generateRefreshToken({
      id: user[0].id,
      username: user[0].username,
      role: user[0].role
    });
    console.log('Refresh Token untuk user', user[0].username + ':', refreshToken); // Tampilkan di terminal
    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER BY ID
exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    if (!user.length)
      return res.status(404).json({ message: "User not found" });
    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EDIT USER
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, role } = req.body;
  let hashedPassword = password;

  try {
    // Jika password dikirim, hash password baru
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      hashedPassword = null; // Supaya model tahu password tidak diubah
    }
    // Update user di database
    const result = await User.updateUser(
      id,
      username,
      hashedPassword,
      email,
      role
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER (Dengan Menghapus Orders Terkait)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Hapus orders yang terkait dengan user terlebih dahulu
    await User.deleteOrdersByUserId(id); // Tambahkan fungsi ini di UserModel

    // Setelah itu, hapus user dari database
    const result = await User.deleteUser(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User and related orders deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
