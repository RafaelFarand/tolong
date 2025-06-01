const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('./config/Database');

const app = express();

// Load .env
dotenv.config();

// Updated CORS configuration
const allowedOrigins = [
  'https://gudang-sparepart-dot-b-01-450713.uc.r.appspot.com',
  'https://be-rest-1061342868557.us-central1.run.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
