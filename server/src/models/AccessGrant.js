const mongoose = require('mongoose');
const crypto = require('crypto');

const accessGrantSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  grantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: {
    type: String,
    required: [true, 'Please provide doctor or clinic name'],
    trim: true,
  },
  doctorEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  accessToken: {
    type: String,
    unique: true,
    required: true,
  },
  accessPasscode: {
    type: String, // 4 to 6 digit quick PIN or passcode
  },
  // Granular categories authorized by Family Owner
  permittedCategories: [{
    type: String,
    enum: [
      'overview',        // basic info, blood group, emergency contacts
      'medications',     // ongoing meds and schedule
      'allergies',       // critical & non-critical allergies
      'chronic_conditions', // diabetes, hypertension, asthma, etc.
      'prescriptions',   // prescription documents
      'lab_reports',     // lab tests, blood work
      'vaccinations',    // vaccine history
      'vitals'           // BP, sugar, pulse
    ],
    default: ['overview', 'medications', 'allergies', 'prescriptions'],
  }],
  // Selective Document Privacy: only specific documents authorized by family
  permittedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
  // Patient Chief Complaint: what happened and symptoms
  chiefComplaint: {
    type: String,
    trim: true,
    default: '',
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'follow_up'],
    default: 'routine',
  },
  // If doctor rejects request
  rejectionReason: {
    type: String,
    trim: true,
    default: '',
  },
  // Doctor recommendation / specialist referral if rejected
  referralDoctor: {
    type: String,
    trim: true,
    default: '',
  },
  // Interactive consultation comments left by attending doctor
  doctorNotes: [{
    comment: { type: String, required: true },
    doctorName: { type: String, default: 'Attending Physician' },
    createdAt: { type: Date, default: Date.now },
  }],
  validFrom: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'revoked', 'expired'],
    default: 'pending',
  },
  accessLog: [{
    accessedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Helper static method to create unique token and passcode
accessGrantSchema.statics.generateAccessCredentials = function () {
  const token = crypto.randomBytes(24).toString('hex');
  const passcode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
  return { token, passcode };
};

module.exports = mongoose.model('AccessGrant', accessGrantSchema);
