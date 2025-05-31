const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

// Konfigurasi dotenv untuk ambil variabel dari .env
dotenv.config();

// Update CORS configuration
app.use(cors({
  origin: [
    'https://gudang-sparepart-dot-b-01-450713.uc.r.appspot.com',
    'http://localhost:3000' // Keep for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json()); // Parsing body JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const userRoutes = require('./routes/UserRoutes');
const productRoutes = require('./routes/ProductRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const refreshTokenRoutes = require('./routes/RefreshTokenRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/refresh', refreshTokenRoutes);

// Tes koneksi awal
app.get('/', (req, res) => {
  res.send('Sparepart API is running');
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
