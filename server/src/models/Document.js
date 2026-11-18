const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide document title'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Prescription', 'Lab Report', 'Scan/X-Ray', 'Discharge Summary', 'Vaccine Certificate', 'Other'],
    default: 'Prescription',
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
  },
  fileType: {
    type: String,
  },
  fileSize: {
    type: Number,
  },
  doctorOrLab: {
    type: String,
    default: '',
  },
  recordDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', documentSchema);
