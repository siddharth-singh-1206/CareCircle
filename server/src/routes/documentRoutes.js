const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Member = require('../models/Member');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// @route   GET /api/documents
// @desc    Get medical documents with filtering (isolated to requester's family)
router.get('/', protect, async (req, res) => {
  try {
    const { memberId, category } = req.query;
    const filter = {};

    // Tenancy isolation: restrict to user's family
    if (req.userFamilyId) {
      filter.familyId = req.userFamilyId;
    }

    if (memberId) filter.memberId = memberId;
    if (category) filter.category = category;

    const documents = await Document.find(filter)
      .populate('memberId', 'fullName relation')
      .sort({ recordDate: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: documents.length, documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/documents
// @desc    Upload document file and create record
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { memberId, title, category, doctorOrLab, recordDate, notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach a document or report file' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Tenancy check: Ensure member belongs to requester's family
    if (req.userFamilyId && member.familyId.toString() !== req.userFamilyId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot upload records to another family' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await Document.create({
      memberId,
      familyId: member.familyId,
      title: title || req.file.originalname,
      category: category || 'Prescription',
      fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      doctorOrLab,
      recordDate: recordDate || Date.now(),
      notes,
    });

    res.status(201).json({ success: true, document });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/documents/:id/file
// @desc    Secure, authenticated document download with tenant verification
router.get('/:id/file', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Tenancy check: Ensure document belongs to requester's family (or authorized doctor)
    const isFamilyOwner = req.userFamilyId && doc.familyId.toString() === req.userFamilyId.toString();
    const isDoctor = req.user && req.user.role === 'doctor';
    if (!isFamilyOwner && !isDoctor && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Forbidden: Access to this record is denied' });
    }

    if (doc.fileUrl && doc.fileUrl.startsWith('/uploads/')) {
      const filename = path.basename(doc.fileUrl);
      const filePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }

    // If external or remote file URL
    res.redirect(doc.fileUrl);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document record & local file
router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Tenancy check: Ensure document belongs to requester's family
    if (req.userFamilyId && doc.familyId.toString() !== req.userFamilyId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot delete another family\'s document' });
    }

    // Try deleting physical file if stored locally
    if (doc.fileUrl && doc.fileUrl.startsWith('/uploads/')) {
      const filename = path.basename(doc.fileUrl);
      const filePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
