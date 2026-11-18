const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const HealthRecord = require('../models/HealthRecord');
const Medication = require('../models/Medication');

// @route   GET /api/emergency/:code
// @desc    Public Emergency Profile - returns life-saving info instantly
router.get('/:code', async (req, res) => {
  try {
    const member = await Member.findOne({ emergencyCode: req.params.code });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Emergency profile not found' });
    }

    if (!member.isEmergencyEnabled) {
      return res.status(403).json({ success: false, message: 'Emergency view has been disabled for this member' });
    }

    // Fetch critical health parameters:
    // 1. Allergies (especially High & Critical)
    // 2. Chronic conditions
    // 3. Ongoing medications
    const [allergies, chronicConditions, activeMeds] = await Promise.all([
      HealthRecord.find({ memberId: member._id, type: 'allergy' }).sort({ severity: -1 }),
      HealthRecord.find({ memberId: member._id, type: 'chronic_condition' }),
      Medication.find({ memberId: member._id, isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      emergencyProfile: {
        fullName: member.fullName,
        relation: member.relation,
        bloodGroup: member.bloodGroup,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        emergencyContact: member.emergencyContact,
        primaryDoctor: member.primaryDoctor,
        insuranceInfo: member.insuranceInfo,
        emergencyCode: member.emergencyCode,
        criticalAllergies: allergies,
        chronicConditions: chronicConditions,
        activeMedications: activeMeds.map((m) => ({
          medicineName: m.medicineName,
          dosage: m.dosage,
          frequency: m.frequency,
          purpose: m.purpose,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
