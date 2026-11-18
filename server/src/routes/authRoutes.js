const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Family = require('../models/Family');
const Member = require('../models/Member');
const { protect } = require('../middleware/auth');

// Helper to sign JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'carecircle_super_secret_jwt_key_2026_gla',
    { expiresIn: '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
};

// @route   POST /api/auth/register
// @desc    Register Family Owner, auto-create Family & Primary Member profile
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, familyName, bloodGroup, relation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'family_owner',
    });

    // Auto-create Family
    const family = await Family.create({
      familyName: familyName || `${name.split(' ')[0]}'s Family`,
      ownerId: user._id,
    });

    // Auto-create 'Self' Member Profile
    const selfMember = await Member.create({
      familyId: family._id,
      fullName: name,
      relation: relation || 'Self',
      bloodGroup: bloodGroup || 'O+',
      emergencyContact: {
        name: name,
        phone: phone || '',
        relation: 'Self',
      },
    });

    family.members.push(selfMember._id);
    await family.save();

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & return JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user info with family summary
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const family = await Family.findOne({ ownerId: user._id }).populate('members');

    res.status(200).json({
      success: true,
      user,
      family,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
