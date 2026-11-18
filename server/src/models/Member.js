const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Please provide member full name'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  },
  relation: {
    type: String,
    required: [true, 'Please specify relation to Family Owner (e.g. Self, Father, Mother, Child)'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown',
  },
  avatar: {
    type: String,
    default: '',
  },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' },
  },
  primaryDoctor: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    hospital: { type: String, default: '' },
  },
  insuranceInfo: {
    provider: { type: String, default: '' },
    policyNumber: { type: String, default: '' },
    validTill: { type: Date },
  },
  isEmergencyEnabled: {
    type: Boolean,
    default: true,
  },
  emergencyCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto generate emergency public access code if not present
memberSchema.pre('save', function (next) {
  if (!this.emergencyCode) {
    this.emergencyCode = 'EMG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
