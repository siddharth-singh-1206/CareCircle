const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Middlewares & Controlled CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Access denied for this origin'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static folder for uploaded medical records / reports (sample records remain accessible for prototype viva)
app.use(
  '/uploads',
  (req, res, next) => {
    // Whitelist demo sample reports for presentations
    if (req.path.includes('sample-')) {
      return next();
    }
    // In production, block direct unauthenticated access to uploaded medical files
    if (process.env.NODE_ENV === 'production' && !req.headers.authorization) {
      return res.status(401).json({ success: false, message: 'Authentication required to access medical records' });
    }
    next();
  },
  express.static(path.join(__dirname, '../uploads'))
);

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/shares', require('./routes/shareRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));

// Root API welcome
app.get('/', (req, res) => {
  res.status(200).json({
    app: 'CareCircle - Family Health Management Platform',
    status: 'active',
    documentation: '/api/health',
    version: '1.0.1',
  });
});

// Base health check & diagnostics
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  res.status(200).json({
    status: 'online',
    app: 'CareCircle - Family Health Management Platform API',
    version: '1.0.1',
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CareCircle API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
