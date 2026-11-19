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

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for uploaded medical records / reports
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
