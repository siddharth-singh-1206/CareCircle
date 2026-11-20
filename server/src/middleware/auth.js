const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Family = require('../models/Family');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, token missing',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'carecircle_super_secret_jwt_key_2026_gla'
    );
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    // Attach family ID for tenancy isolation
    if (req.user.role === 'family_owner' || req.user.role === 'member') {
      const family = await Family.findOne({ ownerId: req.user._id });
      if (family) {
        req.userFamilyId = family._id;
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired',
    });
  }
};

module.exports = { protect };
