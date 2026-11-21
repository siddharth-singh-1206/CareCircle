const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Family = require('../models/Family');
const Member = require('../models/Member');
const { protect } = require('../middleware/auth');
const createRateLimiter = require('../middleware/rateLimiter');

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
});

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
      specialization: user.specialization || '',
      hospital: user.hospital || '',
      registrationNumber: user.registrationNumber || '',
    },
  });
};

// @route   POST /api/auth/register
// @desc    Register Family Owner or Healthcare Professional (Doctor)
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      role, 
      specialization, 
      hospital, 
      registrationNumber,
      familyName, 
      bloodGroup, 
      relation 
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    if (role === 'doctor') {
      const doctorUser = await User.create({
        name,
        email,
        password,
        phone,
        role: 'doctor',
        specialization: specialization || 'General Medicine',
        hospital: hospital || 'Apollo Hospital',
        registrationNumber: registrationNumber || 'MCI-REG-' + Math.floor(10000 + Math.random() * 90000),
      });

      return sendTokenResponse(doctorUser, 201, res);
    }

    // Default: Register Family Owner
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

// @route   GET /api/auth/doctors
// @desc    Get all verified registered doctors with specialty and hospital affiliation
router.get('/doctors', async (req, res) => {
  try {
    let doctors = await User.find({ role: 'doctor' }).select(
      'name email phone specialization hospital registrationNumber'
    );

    // If database has no doctors yet, return default verified registered doctors
    if (!doctors || doctors.length === 0) {
      doctors = [
        {
          _id: 'doc-mehta-01',
          name: 'Dr. Arvind Mehta',
          email: 'dr.mehta@apollo.com',
          specialization: 'Cardiology (Senior Consultant)',
          hospital: 'Apollo Heart & Vascular Institute, Mathura',
          registrationNumber: 'MCI-CARD-99214',
        },
        {
          _id: 'doc-khanna-02',
          name: 'Dr. Rajesh Khanna',
          email: 'drkhanna@rainbowhospitals.com',
          specialization: 'Pediatrics & Neonatology',
          hospital: 'Rainbow Children’s Superspecialty Clinic',
          registrationNumber: 'MCI-PED-45812',
        },
        {
          _id: 'doc-rao-03',
          name: 'Dr. Sunita Rao',
          email: 'dr.sunita.rao@metrocare.com',
          specialization: 'Rheumatology & Autoimmune Care',
          hospital: 'Metro Centre for Joint & Bone Diseases',
          registrationNumber: 'MCI-RHEUM-31290',
        },
        {
          _id: 'doc-verma-04',
          name: 'Dr. R. K. Verma',
          email: 'dr.verma@citychest.org',
          specialization: 'Pulmonology & Respiratory Medicine',
          hospital: 'City Chest & Allergy Institute',
          registrationNumber: 'MCI-PULM-78210',
        },
      ];
    }

    res.status(200).json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user & return JWT token (Supports Family Owner and Doctor roles)
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user = await User.findOne({ email }).select('+password');

    // Auto-seed Demo Doctor only in development / demo mode
    if (!user && (role === 'doctor' || email.toLowerCase().includes('mehta') || email.toLowerCase().includes('doctor'))) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ success: false, message: 'Invalid credentials: user not found' });
      }
      user = await User.create({
        name: 'Dr. Arvind Mehta',
        email: email.toLowerCase(),
        password: password || 'password123',
        phone: '+91 98200 12345',
        role: 'doctor',
        specialization: 'Senior Consultant Cardiologist',
        hospital: 'Apollo Heart & Vascular Institute',
        registrationNumber: 'MCI-CARD-99214',
      });
      return sendTokenResponse(user, 200, res);
    }

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
