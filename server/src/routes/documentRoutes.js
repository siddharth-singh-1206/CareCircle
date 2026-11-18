const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Member = require('../models/Member');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// @route   GET /api/documents
// @desc    Get medical documents with filtering
router.get('/', protect, async (req, res) => {
  try {
    const { memberId, category } = req.query;
    const filter = {};
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

// @route   DELETE /api/documents/:id
// @desc    Delete document record & local file
router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
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
