const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Family = require('./models/Family');
const Member = require('./models/Member');
const HealthRecord = require('./models/HealthRecord');
const Medication = require('./models/Medication');
const Document = require('./models/Document');
const AccessGrant = require('./models/AccessGrant');

dotenv.config();

const seedData = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carecircle';
    await mongoose.connect(connUri);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Family.deleteMany({}),
      Member.deleteMany({}),
      HealthRecord.deleteMany({}),
      Medication.deleteMany({}),
      Document.deleteMany({}),
      AccessGrant.deleteMany({}),
    ]);
    console.log('🧹 Cleaned existing data.');

    // 1. Create Family Owner User
    const owner = await User.create({
      name: 'Siddharth Sharma',
      email: 'siddharth@carecircle.com',
      password: 'password123',
      phone: '+91 98765 43210',
      role: 'family_owner',
    });

    // 2. Create Family
    const family = await Family.create({
      familyName: 'Sharma Family Health Circle',
      ownerId: owner._id,
      notes: 'Primary household records for Siddharth, Grandfather Ramesh, Mother Sarita, and Brother Aarav.',
    });

    // 3. Create 4 Diverse Family Members
    const grandfather = await Member.create({
      familyId: family._id,
      fullName: 'Ramesh Sharma',
      dateOfBirth: new Date('1952-08-15'),
      gender: 'Male',
      relation: 'Grandfather',
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Siddharth Sharma',
        phone: '+91 98765 43210',
        relation: 'Grandson',
      },
      primaryDoctor: {
        name: 'Dr. Arvind Mehta (Cardiologist)',
        phone: '+91 98234 56789',
        hospital: 'Apollo Multi-Specialty Hospital',
      },
      insuranceInfo: {
        provider: 'Star Health Senior Citizen Red Carpet',
        policyNumber: 'SH-SC-889923',
        validTill: new Date('2027-12-31'),
      },
      emergencyCode: 'EMG-RAMESH74',
    });

    const mother = await Member.create({
      familyId: family._id,
      fullName: 'Sarita Sharma',
      dateOfBirth: new Date('1977-03-22'),
      gender: 'Female',
      relation: 'Mother',
      bloodGroup: 'A+',
      emergencyContact: {
        name: 'Siddharth Sharma',
        phone: '+91 98765 43210',
        relation: 'Son',
      },
      primaryDoctor: {
        name: 'Dr. Neha Verma (Endocrinologist)',
        phone: '+91 98450 11223',
        hospital: 'Max Healthcare',
      },
      insuranceInfo: {
        provider: 'HDFC ERGO Optima Restore',
        policyNumber: 'HE-OPT-441299',
        validTill: new Date('2028-06-30'),
      },
      emergencyCode: 'EMG-SARITA49',
    });

    const selfUser = await Member.create({
      familyId: family._id,
      fullName: 'Siddharth Sharma',
      dateOfBirth: new Date('2004-11-10'),
      gender: 'Male',
      relation: 'Self',
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Sarita Sharma',
        phone: '+91 98765 11223',
        relation: 'Mother',
      },
      emergencyCode: 'EMG-SID22',
    });

    const child = await Member.create({
      familyId: family._id,
      fullName: 'Aarav Sharma',
      dateOfBirth: new Date('2018-05-14'),
      gender: 'Male',
      relation: 'Brother',
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Sarita Sharma',
        phone: '+91 98765 11223',
        relation: 'Mother',
      },
      primaryDoctor: {
        name: 'Dr. Rajesh Khanna (Pediatrician)',
        phone: '+91 98111 22334',
        hospital: 'Rainbow Children’s Hospital',
      },
      emergencyCode: 'EMG-AARAV08',
    });

    family.members = [grandfather._id, mother._id, selfUser._id, child._id];
    await family.save();

    // 4. Create Chronic Conditions, Allergies & Vitals
    await HealthRecord.create([
      // Grandfather: Chronic conditions & Allergies
      {
        memberId: grandfather._id,
        familyId: family._id,
        type: 'chronic_condition',
        title: 'Type 2 Diabetes Mellitus',
        severity: 'High',
        diagnosedDate: new Date('2012-04-10'),
        notes: 'Fasting glucose to be kept under 120 mg/dL. Strict low-carb diet.',
        isOngoing: true,
      },
      {
        memberId: grandfather._id,
        familyId: family._id,
        type: 'chronic_condition',
        title: 'Hypertension (High Blood Pressure)',
        severity: 'High',
        diagnosedDate: new Date('2015-09-18'),
        notes: 'Target BP: 125/80 mmHg. Low sodium intake.',
        isOngoing: true,
      },
      {
        memberId: grandfather._id,
        familyId: family._id,
        type: 'allergy',
        title: 'Penicillin Allergy',
        severity: 'Critical',
        notes: 'Severe anaphylactic reaction and hives observed during 2018 treatment.',
      },
      {
        memberId: grandfather._id,
        familyId: family._id,
        type: 'vital',
        title: 'Weekly Routine Checkup',
        vitalData: {
          systolicBP: 128,
          diastolicBP: 82,
          sugarLevel: 114,
          pulseRate: 72,
          spO2: 98,
        },
        notes: 'Vitals stable post morning medication.',
      },
      // Mother: Hypothyroidism & Allergy
      {
        memberId: mother._id,
        familyId: family._id,
        type: 'chronic_condition',
        title: 'Hypothyroidism',
        severity: 'Medium',
        diagnosedDate: new Date('2019-02-14'),
        notes: 'TSH monitoring every 6 months. Take medication empty stomach.',
        isOngoing: true,
      },
      {
        memberId: mother._id,
        familyId: family._id,
        type: 'allergy',
        title: 'Sulfa Drugs (Sulfonamides)',
        severity: 'High',
        notes: 'Causes skin rashes and itching.',
      },
      // Child Aarav: Asthma & Vaccinations
      {
        memberId: child._id,
        familyId: family._id,
        type: 'chronic_condition',
        title: 'Mild Pediatric Asthma',
        severity: 'Medium',
        diagnosedDate: new Date('2022-10-05'),
        notes: 'Triggered by sudden weather change and excessive dust.',
        isOngoing: true,
      },
      {
        memberId: child._id,
        familyId: family._id,
        type: 'vaccination',
        title: 'MMR Booster (Measles, Mumps, Rubella)',
        severity: 'Low',
        diagnosedDate: new Date('2023-06-12'),
        vaccineData: {
          doseNumber: 2,
          administeredBy: 'Dr. Rajesh Khanna',
          nextDueDate: new Date('2028-06-12'),
        },
        notes: 'Administered at Rainbow Hospital, no adverse reaction.',
      },
      // Self Siddharth
      {
        memberId: selfUser._id,
        familyId: family._id,
        type: 'allergy',
        title: 'Peanut & Tree Nut Allergy',
        severity: 'High',
        notes: 'Carry antihistamine in travel kit.',
      },
    ]);

    // 5. Create Medications & Schedules
    const todayStr = new Date().toISOString().split('T')[0];

    await Medication.create([
      // Grandfather: Metformin
      {
        memberId: grandfather._id,
        familyId: family._id,
        medicineName: 'Metformin Hydrochloride (Glycomet)',
        dosage: '500 mg',
        frequency: 'Twice daily',
        timingSlots: [
          { slot: 'Morning', time: '08:30' },
          { slot: 'Night', time: '20:30' },
        ],
        foodRelation: 'After Meal',
        purpose: 'Blood sugar regulation for Type 2 Diabetes',
        prescribedBy: 'Dr. Arvind Mehta',
        stockLeft: 45,
        isActive: true,
        logs: [
          { date: todayStr, timeSlot: 'Morning', status: 'taken', takenAt: new Date() },
        ],
      },
      // Grandfather: Amlodipine
      {
        memberId: grandfather._id,
        familyId: family._id,
        medicineName: 'Amlodipine (Norvasc)',
        dosage: '5 mg',
        frequency: 'Once daily',
        timingSlots: [
          { slot: 'Morning', time: '09:00' },
        ],
        foodRelation: 'After Meal',
        purpose: 'Blood pressure control',
        prescribedBy: 'Dr. Arvind Mehta',
        stockLeft: 22,
        isActive: true,
        logs: [
          { date: todayStr, timeSlot: 'Morning', status: 'taken', takenAt: new Date() },
        ],
      },
      // Mother: Thyronorm
      {
        memberId: mother._id,
        familyId: family._id,
        medicineName: 'Thyronorm (Levothyroxine Sodium)',
        dosage: '50 mcg',
        frequency: 'Once daily',
        timingSlots: [
          { slot: 'Morning', time: '07:00' },
        ],
        foodRelation: 'Empty Stomach',
        purpose: 'Thyroid hormone replacement',
        prescribedBy: 'Dr. Neha Verma',
        stockLeft: 60,
        isActive: true,
        logs: [
          { date: todayStr, timeSlot: 'Morning', status: 'taken', takenAt: new Date() },
        ],
      },
      // Child Aarav: Levolin Inhaler
      {
        memberId: child._id,
        familyId: family._id,
        medicineName: 'Levolin Inhaler (Levosalbutamol)',
        dosage: '50 mcg (2 puffs)',
        frequency: 'As needed (SOS)',
        timingSlots: [
          { slot: 'Night', time: '21:00' },
        ],
        foodRelation: 'Anytime',
        purpose: 'Relief during acute wheezing / coughing',
        prescribedBy: 'Dr. Rajesh Khanna',
        stockLeft: 120,
        isActive: true,
      },
    ]);

    // 6. Create Documents (Prescriptions and Lab Reports)
    await Document.create([
      {
        memberId: grandfather._id,
        familyId: family._id,
        title: 'Comprehensive Lipid & HbA1c Lab Report',
        category: 'Lab Report',
        fileUrl: '/uploads/sample-hba1c-report.pdf',
        fileName: 'HbA1c_Lipid_Profile_RameshSharma.pdf',
        fileType: 'application/pdf',
        fileSize: 452000,
        doctorOrLab: 'Dr. Lal PathLabs',
        recordDate: new Date('2026-10-15'),
        notes: 'HbA1c level recorded at 6.8%. Fasting glucose 118 mg/dL.',
      },
      {
        memberId: grandfather._id,
        familyId: family._id,
        title: 'Cardiology Consultation & Rx',
        category: 'Prescription',
        fileUrl: '/uploads/sample-cardio-prescription.pdf',
        fileName: 'Dr_ArvindMehta_Prescription.pdf',
        fileType: 'application/pdf',
        fileSize: 285000,
        doctorOrLab: 'Dr. Arvind Mehta (Apollo)',
        recordDate: new Date('2026-09-20'),
        notes: 'Advised continued dosage of Metformin 500mg and Amlodipine 5mg.',
      },
      {
        memberId: mother._id,
        familyId: family._id,
        title: 'Thyroid Function Test (FT3, FT4, TSH)',
        category: 'Lab Report',
        fileUrl: '/uploads/sample-thyroid-test.pdf',
        fileName: 'Thyroid_Profile_SaritaSharma.pdf',
        fileType: 'application/pdf',
        fileSize: 310000,
        doctorOrLab: 'SRL Diagnostics',
        recordDate: new Date('2026-08-11'),
        notes: 'TSH is within optimal range (2.4 uIU/mL) on 50mcg dosage.',
      },
    ]);

    // 7. Create Doctor Access Grant
    const { token, passcode } = AccessGrant.generateAccessCredentials();
    await AccessGrant.create({
      familyId: family._id,
      memberId: grandfather._id,
      grantedBy: owner._id,
      doctorName: 'Dr. Arvind Mehta (Cardiologist)',
      doctorEmail: 'dr.mehta@apollohospitals.demo',
      accessToken: 'demo-doctor-grant-ramesh',
      accessPasscode: '123456',
      permittedCategories: ['overview', 'medications', 'vitals', 'prescriptions'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'active',
    });

    console.log('🎉 Seed Data Created Successfully!');
    console.log('----------------------------------------------------');
    console.log('👨‍👩‍👧‍👦 Family Owner: siddharth@carecircle.com / password123');
    console.log('🚨 Grandfather Emergency URL: /emergency/EMG-RAMESH74');
    console.log('🩺 Doctor Portal Demo Access URL: /doctor-access/demo-doctor-grant-ramesh');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
