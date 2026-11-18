const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['allergy', 'chronic_condition', 'surgery', 'vaccination', 'vital'],
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title (e.g., Penicillin Allergy, Type 2 Diabetes)'],
    trim: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  diagnosedDate: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
  // Specific fields for vitals
  vitalData: {
    systolicBP: Number,
    diastolicBP: Number,
    sugarLevel: Number,
    pulseRate: Number,
    weightKg: Number,
    spO2: Number,
  },
  // Specific fields for vaccinations
  vaccineData: {
    doseNumber: Number,
    administeredBy: String,
    nextDueDate: Date,
  },
  isOngoing: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
