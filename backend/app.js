const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('./config/Database');

const app = express();

// Load .env
dotenv.config();

// === Daftar domain yang diperbolehkan ===
const allowedOrigins = [
  'https://gudang-sparepart-dot-b-01-450713.uc.r.appspot.com'
];

// === CORS Middleware ===
app.use(cors({
  origin: function (origin, callback) {
    // Allow if no origin (e.g., mobile app, Postman), or if it's in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// === Middleware ===
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === JSON Syntax Error Handling ===
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

// === Import Routes ===
const userRoutes = require('./routes/UserRoutes');
const productRoutes = require('./routes/ProductRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const refreshTokenRoutes = require('./routes/RefreshTokenRoutes');

// === Register Routes ===
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/refresh', refreshTokenRoutes);

// === Default route for testing ===
app.get('/', (req, res) => {
  res.send('Sparepart API is running');
});

// === Global Error Handling ===
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await db.execute('SELECT 1');
    console.log('✅ Database connection successful');
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
});
