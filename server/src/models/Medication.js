const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema({
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
  },
  timeSlot: {
    type: String, // 'Morning', 'Afternoon', 'Evening', 'Night' or specific time '08:00'
    required: true,
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'skipped'],
    default: 'taken',
  },
  takenAt: {
    type: Date,
    default: Date.now,
  },
});

const medicationSchema = new mongoose.Schema({
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
  medicineName: {
    type: String,
    required: [true, 'Please provide medicine name'],
    trim: true,
  },
  dosage: {
    type: String,
    required: [true, 'Please provide dosage (e.g. 500mg, 1 tablet, 5ml)'],
    trim: true,
  },
  frequency: {
    type: String,
    enum: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed (SOS)', 'Weekly'],
    default: 'Once daily',
  },
  timingSlots: [{
    slot: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    },
    time: String, // e.g. "08:00"
  }],
  foodRelation: {
    type: String,
    enum: ['Before Meal', 'After Meal', 'With Meal', 'Empty Stomach', 'Anytime'],
    default: 'After Meal',
  },
  purpose: {
    type: String,
    default: '',
  },
  prescribedBy: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  stockLeft: {
    type: Number,
    default: 30,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  logs: [medicationLogSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Medication', medicationSchema);
