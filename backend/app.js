const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/Database');

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
app.use(express.json({ limit: '10mb' })); // Parsing body JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    // Test database connection
    const [result] = await db.execute('SELECT 1');
    console.log('Database connection successful');
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});
