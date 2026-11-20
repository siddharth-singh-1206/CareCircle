const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Medication = require('../models/Medication');
const Member = require('../models/Member');
const { protect } = require('../middleware/auth');

// @route   GET /api/medications
// @desc    Get medications for a member or family
router.get('/', protect, async (req, res) => {
  try {
    const { memberId, activeOnly } = req.query;
    const filter = {};

    // Tenancy isolation
    if (req.userFamilyId) {
      filter.familyId = req.userFamilyId;
    }

    if (memberId && mongoose.Types.ObjectId.isValid(memberId)) {
      filter.memberId = memberId;
    }
    if (activeOnly === 'true') filter.isActive = true;

    const medications = await Medication.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: medications.length, medications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/medications/schedule/today
// @desc    Get consolidated schedule for today with taken status
router.get('/schedule/today', protect, async (req, res) => {
  try {
    const { memberId } = req.query;
    const filter = { isActive: true };

    // Tenancy isolation
    if (req.userFamilyId) {
      filter.familyId = req.userFamilyId;
    }

    if (memberId && mongoose.Types.ObjectId.isValid(memberId)) {
      filter.memberId = memberId;
    }

    const medications = await Medication.find(filter).populate('memberId', 'fullName relation avatar');
    
    // Format today as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const schedule = [];
    medications.forEach((med) => {
      // For each timing slot in the med, check if already taken today
      const slots = med.timingSlots && med.timingSlots.length > 0 
        ? med.timingSlots 
        : [{ slot: 'Morning', time: '08:00' }];

      slots.forEach((slotItem) => {
        const log = med.logs.find(
          (l) => l.date === today && l.timeSlot === slotItem.slot
        );

        schedule.push({
          medicationId: med._id,
          medicineName: med.medicineName,
          dosage: med.dosage,
          foodRelation: med.foodRelation,
          purpose: med.purpose,
          slot: slotItem.slot,
          time: slotItem.time || '',
          member: med.memberId,
          status: log ? log.status : 'pending',
          takenAt: log ? log.takenAt : null,
        });
      });
    });

    // Sort by typical routine: Morning -> Afternoon -> Evening -> Night
    const order = { Morning: 1, Afternoon: 2, Evening: 3, Night: 4 };
    schedule.sort((a, b) => (order[a.slot] || 5) - (order[b.slot] || 5));

    res.status(200).json({
      success: true,
      date: today,
      totalDoses: schedule.length,
      takenDoses: schedule.filter((s) => s.status === 'taken').length,
      schedule,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/medications
// @desc    Add new medication
router.post('/', protect, async (req, res) => {
  try {
    const {
      memberId,
      medicineName,
      dosage,
      frequency,
      timingSlots,
      foodRelation,
      purpose,
      prescribedBy,
      startDate,
      endDate,
      stockLeft,
    } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Tenancy check
    if (req.userFamilyId && member.familyId.toString() !== req.userFamilyId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot add medications to another family' });
    }

    const medication = await Medication.create({
      memberId,
      familyId: member.familyId,
      medicineName,
      dosage,
      frequency,
      timingSlots: timingSlots || [{ slot: 'Morning', time: '08:00' }],
      foodRelation: foodRelation || 'After Meal',
      purpose,
      prescribedBy,
      startDate: startDate || Date.now(),
      endDate,
      stockLeft: stockLeft !== undefined ? stockLeft : 30,
      isActive: true,
    });

    res.status(201).json({ success: true, medication });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/medications/:id/log
// @desc    Mark a dose as taken, missed, or skipped for a specific slot
router.post('/:id/log', protect, async (req, res) => {
  try {
    const { date, timeSlot, status } = req.body;
    const medDate = date || new Date().toISOString().split('T')[0];

    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    // Tenancy check
    if (req.userFamilyId && medication.familyId.toString() !== req.userFamilyId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify another family\'s medication' });
    }

    // Check if a log already exists for this date and timeSlot
    const existingIndex = medication.logs.findIndex(
      (l) => l.date === medDate && l.timeSlot === timeSlot
    );

    if (existingIndex > -1) {
      medication.logs[existingIndex].status = status || 'taken';
      medication.logs[existingIndex].takenAt = new Date();
    } else {
      medication.logs.push({
        date: medDate,
        timeSlot,
        status: status || 'taken',
        takenAt: new Date(),
      });
      // Deduct stock if taken
      if (status === 'taken' && medication.stockLeft > 0) {
        medication.stockLeft -= 1;
      }
    }

    await medication.save();
    res.status(200).json({ success: true, medication });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/medications/:id
// @desc    Update medication
router.put('/:id', protect, async (req, res) => {
  try {
    let medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    // Tenancy check
    if (req.userFamilyId && medication.familyId.toString() !== req.userFamilyId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify another family\'s medication' });
    }

    medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, medication });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/medications/:id
// @desc    Delete medication
router.delete('/:id', protect, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    // Tenancy check
    if (req.userFamilyId && medication.familyId.toString() !== req.userFamilyId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot delete another family\'s medication' });
    }

    await Medication.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Medication deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
