const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/HealthRecord');
const Member = require('../models/Member');
const { protect } = require('../middleware/auth');

// @route   GET /api/records
// @desc    Get health records, filterable by memberId and type
router.get('/', protect, async (req, res) => {
  try {
    const { memberId, type } = req.query;
    const filter = {};
    if (memberId) filter.memberId = memberId;
    if (type) filter.type = type;

    const records = await HealthRecord.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/records
// @desc    Create new health record (allergy, condition, surgery, vital, vaccination)
router.post('/', protect, async (req, res) => {
  try {
    const { memberId, type, title, severity, diagnosedDate, notes, vitalData, vaccineData, isOngoing } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const record = await HealthRecord.create({
      memberId,
      familyId: member.familyId,
      type,
      title,
      severity,
      diagnosedDate: diagnosedDate || Date.now(),
      notes,
      vitalData,
      vaccineData,
      isOngoing: isOngoing !== undefined ? isOngoing : true,
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/records/:id
// @desc    Update health record
router.put('/:id', protect, async (req, res) => {
  try {
    let record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/records/:id
// @desc    Delete health record
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    await HealthRecord.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
