const express = require('express');
const router = express.Router();
const Family = require('../models/Family');
const Member = require('../models/Member');
const HealthRecord = require('../models/HealthRecord');
const Medication = require('../models/Medication');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

// @route   GET /api/members
// @desc    List all members in the family
router.get('/', protect, async (req, res) => {
  try {
    const family = await Family.findOne({ ownerId: req.user._id });
    if (!family) {
      return res.status(200).json({ success: true, count: 0, members: [] });
    }
    const members = await Member.find({ familyId: family._id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: members.length, members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/members/:id
// @desc    Get single member with full health profile overview
router.get('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Get aggregated statistics
    const [allergies, chronicConditions, activeMeds, recentDocs, vitals] = await Promise.all([
      HealthRecord.find({ memberId: member._id, type: 'allergy' }),
      HealthRecord.find({ memberId: member._id, type: 'chronic_condition' }),
      Medication.find({ memberId: member._id, isActive: true }),
      Document.find({ memberId: member._id }).sort({ recordDate: -1 }).limit(5),
      HealthRecord.find({ memberId: member._id, type: 'vital' }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      member,
      summary: {
        allergyCount: allergies.length,
        chronicConditionCount: chronicConditions.length,
        activeMedicationCount: activeMeds.length,
        documentCount: recentDocs.length,
      },
      allergies,
      chronicConditions,
      activeMeds,
      recentDocs,
      vitals,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/members
// @desc    Add new family member
router.post('/', protect, async (req, res) => {
  try {
    let family = await Family.findOne({ ownerId: req.user._id });
    if (!family) {
      family = await Family.create({
        familyName: `${req.user.name}'s Family`,
        ownerId: req.user._id,
      });
    }

    const {
      fullName,
      dateOfBirth,
      gender,
      relation,
      bloodGroup,
      emergencyContact,
      primaryDoctor,
      insuranceInfo,
    } = req.body;

    const member = await Member.create({
      familyId: family._id,
      fullName,
      dateOfBirth,
      gender,
      relation,
      bloodGroup: bloodGroup || 'Unknown',
      emergencyContact,
      primaryDoctor,
      insuranceInfo,
    });

    family.members.push(member._id);
    await family.save();

    res.status(201).json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/members/:id
// @desc    Update member profile
router.put('/:id', protect, async (req, res) => {
  try {
    let member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/members/:id
// @desc    Delete member and associated medical data
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await Promise.all([
      Member.findByIdAndDelete(req.params.id),
      HealthRecord.deleteMany({ memberId: req.params.id }),
      Medication.deleteMany({ memberId: req.params.id }),
      Document.deleteMany({ memberId: req.params.id }),
      Family.updateOne({ _id: member.familyId }, { $pull: { members: member._id } }),
    ]);

    res.status(200).json({ success: true, message: 'Member and health records deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
