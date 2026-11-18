const express = require('express');
const router = express.Router();
const Family = require('../models/Family');
const Member = require('../models/Member');
const { protect } = require('../middleware/auth');

// @route   GET /api/family
// @desc    Get current user's family with member list
router.get('/', protect, async (req, res) => {
  try {
    let family = await Family.findOne({ ownerId: req.user._id }).populate('members');
    if (!family) {
      // Create if doesn't exist
      family = await Family.create({
        familyName: `${req.user.name}'s Family`,
        ownerId: req.user._id,
      });
    }
    res.status(200).json({ success: true, family });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/family
// @desc    Update family name / notes
router.put('/', protect, async (req, res) => {
  try {
    const { familyName, notes } = req.body;
    let family = await Family.findOne({ ownerId: req.user._id });
    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found' });
    }
    if (familyName) family.familyName = familyName;
    if (notes !== undefined) family.notes = notes;
    await family.save();
    res.status(200).json({ success: true, family });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
