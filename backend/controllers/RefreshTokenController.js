const jwt = require('jsonwebtoken');

// Simpan refresh token di memory (untuk demo, gunakan database untuk produksi)
let refreshTokens = [];

// Generate Refresh Token
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '1m' });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

// Endpoint untuk mendapatkan access token baru
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ error: 'Invalid refresh token' });

  try {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Buat access token baru
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Endpoint untuk logout (menghapus refresh token)
exports.logout = (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.json({ message: 'Logged out successfully' });
};

// Export helper
exports.generateRefreshToken = generateRefreshToken;
