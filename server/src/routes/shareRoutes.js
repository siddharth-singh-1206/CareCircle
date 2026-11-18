const express = require('express');
const router = express.Router();
const AccessGrant = require('../models/AccessGrant');
const Member = require('../models/Member');
const Family = require('../models/Family');
const HealthRecord = require('../models/HealthRecord');
const Medication = require('../models/Medication');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');

// @route   POST /api/shares
// @desc    Create a new time-bound, category-specific doctor access grant
router.post('/', protect, async (req, res) => {
  try {
    const { memberId, doctorName, doctorEmail, permittedCategories, validityHours } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const { token, passcode } = AccessGrant.generateAccessCredentials();

    const hours = Number(validityHours) || 48; // default 48 hours
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const grant = await AccessGrant.create({
      familyId: member.familyId,
      memberId,
      grantedBy: req.user._id,
      doctorName,
      doctorEmail: doctorEmail || '',
      accessToken: token,
      accessPasscode: passcode,
      permittedCategories: permittedCategories && permittedCategories.length > 0 
        ? permittedCategories 
        : ['overview', 'medications', 'allergies', 'prescriptions'],
      expiresAt,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      grant,
      shareUrl: `/doctor-access/${token}`,
      passcode,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/shares
// @desc    List all access grants created by this family
router.get('/', protect, async (req, res) => {
  try {
    const family = await Family.findOne({ ownerId: req.user._id });
    if (!family) {
      return res.status(200).json({ success: true, grants: [] });
    }

    const grants = await AccessGrant.find({ familyId: family._id })
      .populate('memberId', 'fullName relation bloodGroup')
      .sort({ createdAt: -1 });

    // Mark expired grants dynamically
    const now = new Date();
    grants.forEach((g) => {
      if (g.status === 'active' && g.expiresAt < now) {
        g.status = 'expired';
      }
    });

    res.status(200).json({ success: true, grants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/shares/:id/revoke
// @desc    Instantly revoke access for a doctor grant
router.put('/:id/revoke', protect, async (req, res) => {
  try {
    const grant = await AccessGrant.findById(req.params.id);
    if (!grant) {
      return res.status(404).json({ success: false, message: 'Access grant not found' });
    }

    grant.status = 'revoked';
    await grant.save();

    res.status(200).json({ success: true, message: 'Access revoked successfully', grant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/shares/doctor/:token
// @desc    Public/Doctor portal access: strictly returns only permitted categories
router.get('/doctor/:token', async (req, res) => {
  try {
    const grant = await AccessGrant.findOne({ accessToken: req.params.token })
      .populate('memberId')
      .populate('grantedBy', 'name email phone');

    if (!grant) {
      return res.status(404).json({ success: false, message: 'Invalid access link' });
    }

    if (grant.status === 'revoked') {
      return res.status(403).json({ success: false, message: 'Access has been revoked by the family' });
    }

    if (new Date() > grant.expiresAt) {
      grant.status = 'expired';
      await grant.save();
      return res.status(403).json({ success: false, message: 'Access grant has expired' });
    }

    // Log the doctor visit
    grant.accessLog.push({
      accessedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    await grant.save();

    const member = grant.memberId;
    const permitted = grant.permittedCategories;
    const responsePayload = {
      grantInfo: {
        doctorName: grant.doctorName,
        expiresAt: grant.expiresAt,
        permittedCategories: permitted,
        grantedBy: grant.grantedBy ? grant.grantedBy.name : 'Family Owner',
      },
      patient: {
        fullName: member.fullName,
        relation: member.relation,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        bloodGroup: member.bloodGroup,
        emergencyContact: member.emergencyContact,
        primaryDoctor: member.primaryDoctor,
      },
      categories: {},
    };

    const promises = [];

    // Filter data strictly by permitted categories
    if (permitted.includes('medications')) {
      promises.push(
        Medication.find({ memberId: member._id, isActive: true }).then((meds) => {
          responsePayload.categories.medications = meds;
        })
      );
    }

    if (permitted.includes('allergies')) {
      promises.push(
        HealthRecord.find({ memberId: member._id, type: 'allergy' }).then((allergies) => {
          responsePayload.categories.allergies = allergies;
        })
      );
    }

    if (permitted.includes('chronic_conditions')) {
      promises.push(
        HealthRecord.find({ memberId: member._id, type: 'chronic_condition' }).then((conditions) => {
          responsePayload.categories.chronic_conditions = conditions;
        })
      );
    }

    if (permitted.includes('vitals')) {
      promises.push(
        HealthRecord.find({ memberId: member._id, type: 'vital' }).sort({ createdAt: -1 }).limit(10).then((vitals) => {
          responsePayload.categories.vitals = vitals;
        })
      );
    }

    if (permitted.includes('vaccinations')) {
      promises.push(
        HealthRecord.find({ memberId: member._id, type: 'vaccination' }).then((vaccines) => {
          responsePayload.categories.vaccinations = vaccines;
        })
      );
    }

    if (permitted.includes('prescriptions') || permitted.includes('lab_reports')) {
      const docFilter = { memberId: member._id };
      const cats = [];
      if (permitted.includes('prescriptions')) cats.push('Prescription');
      if (permitted.includes('lab_reports')) cats.push('Lab Report', 'Scan/X-Ray');
      docFilter.category = { $in: cats };

      promises.push(
        Document.find(docFilter).sort({ recordDate: -1 }).then((docs) => {
          responsePayload.categories.documents = docs;
        })
      );
    }

    await Promise.all(promises);

    res.status(200).json({ success: true, data: responsePayload });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
