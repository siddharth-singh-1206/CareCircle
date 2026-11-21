import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Pill,
  Clock,
  CheckCircle2,
  Trash2,
  Package,
  Utensils,
  Check,
  User,
  Users,
  Plus,
  AlertTriangle,
  ShieldCheck,
  Sun,
  Moon,
  ExternalLink,
  Info,
  X,
  Stethoscope
} from 'lucide-react';

const STORAGE_DOSES_KEY = 'carecircle_member_doses';
const STORAGE_MEDS_KEY = 'carecircle_profile_medications';

// Master clinical profiles with verified prescriptions, allergy contraindications & doctors
const MASTER_FAMILY_MEDICATIONS = {
  ramesh: {
    memberKey: 'ramesh',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    age: 74,
    gender: 'Male',
    bloodGroup: 'B+',
    primaryDoctor: 'Dr. Arvind Mehta (Cardiologist, Apollo)',
    doctorLicense: 'MCI-CARD-99214',
    statusBadge: 'Active Treatment',
    allergies: [
      { allergen: 'Penicillin & Beta-Lactams', severity: 'CRITICAL (Anaphylaxis Risk)' },
      { allergen: 'Sulfa Drugs (Sulfonamides)', severity: 'SEVERE (Respiratory Reaction)' },
    ],
    pastTreatments: [
      { name: 'Drug-Eluting Stent in LAD (PCI)', year: '2022', hospital: 'Apollo Heart Institute', notes: 'Stable arterial patency on routine follow-up' },
      { name: 'Cataract Phacoemulsification (Left Eye)', year: '2020', hospital: 'Apollo Eye Centre', notes: 'Visual acuity restored to 6/6' },
    ],
    medications: [
      {
        _id: 'med-ramesh-1',
        medicineName: 'Amlodipine (Norvasc)',
        dosage: '5 mg',
        frequency: 'Once daily',
        timingSlots: [{ slot: 'Morning', time: '08:30 AM' }],
        foodRelation: 'After Meal',
        purpose: 'Hypertension Management & Arterial Vasodilation',
        prescribedBy: 'Dr. Arvind Mehta (Cardiology, Apollo)',
        dailyLimit: 1,
        stockLeft: 18,
        isRefillNeeded: false,
      },
      {
        _id: 'med-ramesh-2',
        medicineName: 'Metformin Hydrochloride (Glycomet)',
        dosage: '500 mg',
        frequency: 'Once daily',
        timingSlots: [{ slot: 'Morning', time: '08:30 AM' }],
        foodRelation: 'After Meal',
        purpose: 'Fasting Blood Glucose Regulation (Target < 120 mg/dL)',
        prescribedBy: 'Dr. Arvind Mehta (Cardiology, Apollo)',
        dailyLimit: 1,
        stockLeft: 4,
        isRefillNeeded: true,
      },
    ],
  },
  sarita: {
    memberKey: 'sarita',
    fullName: 'Sarita Sharma',
    relation: 'Mother',
    age: 52,
    gender: 'Female',
    bloodGroup: 'A+',
    primaryDoctor: 'Dr. Sunita Rao (Internal Medicine & Rheumatology, Fortis)',
    doctorLicense: 'MCI-RHEUM-66321',
    statusBadge: 'Preventive Care',
    allergies: [
      { allergen: 'Aspirin & NSAIDs (Ibuprofen, Naproxen)', severity: 'MODERATE (Gastric Bleed & Urticaria Risk)' },
    ],
    pastTreatments: [
      { name: 'Laparoscopic Appendectomy', year: '2019', hospital: 'Fortis Hospital, Mathura', notes: 'Complete recovery, no post-op adhesions' },
      { name: 'Comprehensive Annual Executive Health Checkup', year: '2024', hospital: 'Fortis Healthcare', notes: 'Normal metabolic, cardiac, liver & thyroid panels' },
    ],
    medications: [
      {
        _id: 'med-sarita-1',
        medicineName: 'Thyronorm (Levothyroxine Sodium)',
        dosage: '50 mcg',
        frequency: 'Once daily',
        timingSlots: [{ slot: 'Morning', time: '07:00 AM' }],
        foodRelation: 'Empty Stomach',
        purpose: 'Thyroid Hormone Regulation (Target TSH < 2.5 mIU/L)',
        prescribedBy: 'Dr. Sunita Rao (Internal Medicine, Fortis)',
        dailyLimit: 1,
        stockLeft: 45,
        isRefillNeeded: false,
      },
    ],
  },
  siddharth: {
    memberKey: 'siddharth',
    fullName: 'Siddharth Sharma',
    relation: 'Self',
    age: 26,
    gender: 'Male',
    bloodGroup: 'O+',
    primaryDoctor: 'None Required (Healthy Baseline)',
    doctorLicense: 'N/A',
    statusBadge: 'Caregiver • Healthy Baseline',
    allergies: [
      { allergen: 'Seasonal Pollen', severity: 'MILD (Rhinitis)' },
    ],
    pastTreatments: [
      { name: 'Wisdom Tooth Surgical Extraction', year: '2022', hospital: 'Apollo Dental', notes: 'Uneventful healing' },
      { name: 'Annual Biometric Screening', year: '2024', hospital: 'Medanta', notes: 'Optimal vitals (BP 118/76 mmHg, Pulse 72 bpm)' },
    ],
    medications: [],
  },
  aarav: {
    memberKey: 'aarav',
    fullName: 'Aarav Sharma',
    relation: 'Brother',
    age: 8,
    gender: 'Male',
    bloodGroup: 'O+',
    primaryDoctor: 'None Required (Healthy Child)',
    doctorLicense: 'N/A',
    statusBadge: 'Pediatric Wellness',
    allergies: [
      { allergen: 'Peanuts & Tree Nuts', severity: 'MODERATE (Strict Avoidance)' },
    ],
    pastTreatments: [
      { name: 'Childhood Immunization Series (MMR, DTaP, Polio)', year: '2016-2023', hospital: 'Rainbow Childrens', notes: 'Complete as per national schedule' },
      { name: 'Routine Pediatric Growth & Wellness Check', year: '2024', hospital: 'Rainbow Childrens', notes: 'Physical growth 75th percentile, vision 6/6' },
    ],
    medications: [],
  },
};

const DEFAULT_DASHBOARD_DOSES = {
  ramesh: [
    { id: 'dose-ramesh-1', medicineName: 'Amlodipine (Norvasc)', dosage: '5 mg', slot: 'Morning', foodRelation: 'After Meal', status: 'taken', dailyLimit: 1 },
    { id: 'dose-ramesh-2', medicineName: 'Metformin Hydrochloride (Glycomet)', dosage: '500 mg', slot: 'Morning', foodRelation: 'After Meal', status: 'pending', dailyLimit: 1 },
  ],
  sarita: [
    { id: 'dose-sarita-1', medicineName: 'Thyronorm (Levothyroxine Sodium)', dosage: '50 mcg', slot: 'Morning', foodRelation: 'Empty Stomach', status: 'taken', dailyLimit: 1 },
  ],
  siddharth: [],
  aarav: [],
};

export default function Medications() {
  const { user } = useAuth();

  // Active filter tab: 'all' | 'ramesh' | 'sarita' | 'siddharth' | 'aarav'
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('all');

  // Master family profiles with prescriptions
  const [familyMeds, setFamilyMeds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MEDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.sarita?.medications || parsed.sarita.medications.length === 0) {
            parsed.sarita = MASTER_FAMILY_MEDICATIONS.sarita;
          }
          parsed.siddharth = MASTER_FAMILY_MEDICATIONS.siddharth;
          parsed.aarav = MASTER_FAMILY_MEDICATIONS.aarav;
          return parsed;
        }
      }
    } catch (e) {}
    return MASTER_FAMILY_MEDICATIONS;
  });

  // Synced live intake doses from Dashboard
  const [dashboardDoses, setDashboardDoses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DOSES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.sarita || parsed.sarita.length === 0) {
            parsed.sarita = DEFAULT_DASHBOARD_DOSES.sarita;
          }
          parsed.siddharth = [];
          parsed.aarav = [];
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_DASHBOARD_DOSES;
  });

  const [toastMsg, setToastMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMemberKey, setModalMemberKey] = useState('ramesh');

  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '500 mg',
    frequency: 'Once daily',
    timingMorning: true,
    timingAfternoon: false,
    timingEvening: false,
    timingNight: false,
    morningTime: '08:30 AM',
    nightTime: '08:30 PM',
    foodRelation: 'After Meal',
    purpose: '',
    prescribedBy: '',
    stockLeft: 30,
    dailyLimit: 1,
  });

  const showToast = (text) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Sync dashboard doses instantaneously on custom events or storage changes
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_DOSES_KEY);
        if (saved) {
          setDashboardDoses(JSON.parse(saved));
        }
      } catch (e) {}
    };

    window.addEventListener('carecircle_doses_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('carecircle_doses_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Calculate live intake status for a specific medication from Dashboard doses
  const getMedicationIntakeStatus = (memberKey, med) => {
    const dosesForMember = dashboardDoses[memberKey] || DEFAULT_DASHBOARD_DOSES[memberKey] || [];
    const medLower = (med.medicineName || '').toLowerCase();
    const primaryName = medLower.split(' ')[0];

    // Match doses that belong to this medicine
    const matchingDoses = dosesForMember.filter((d) => {
      const dName = (d.medicineName || '').toLowerCase();
      return dName.includes(primaryName) || medLower.includes(dName.split(' ')[0]);
    });

    const totalPrescribed = matchingDoses.length > 0 
      ? matchingDoses.length 
      : (med.dailyLimit || (med.timingSlots?.length) || 1);

    const takenCount = matchingDoses.filter((d) => d.status === 'taken').length;
    const isCompleted = takenCount >= totalPrescribed && totalPrescribed > 0;
    const isPartiallyTaken = takenCount > 0 && takenCount < totalPrescribed;

    return {
      totalPrescribed,
      takenCount,
      isCompleted,
      isPartiallyTaken,
      matchingDoses,
    };
  };

  // Quick stock refill (+30 pills)
  const handleRefillStock = (memberKey, medId) => {
    setFamilyMeds((prev) => {
      const currentProfile = prev[memberKey];
      if (!currentProfile) return prev;

      const updatedMeds = currentProfile.medications.map((m) => {
        if (m._id === medId) {
          const newStock = (m.stockLeft || 0) + 30;
          return {
            ...m,
            stockLeft: newStock,
            isRefillNeeded: false,
          };
        }
        return m;
      });

      const nextState = {
        ...prev,
        [memberKey]: {
          ...currentProfile,
          medications: updatedMeds,
        },
      };

      try {
        localStorage.setItem(STORAGE_MEDS_KEY, JSON.stringify(nextState));
      } catch (e) {}

      return nextState;
    });

    showToast('Refill processed: +30 pills added to pharmacy stock.');
  };

  // Remove medication from profile
  const handleDelete = (memberKey, medId, medName) => {
    if (!window.confirm(`Remove "${medName}" from ${familyMeds[memberKey]?.fullName}'s routine?`)) return;

    setFamilyMeds((prev) => {
      const currentProfile = prev[memberKey];
      if (!currentProfile) return prev;

      const updatedMeds = currentProfile.medications.filter((m) => m._id !== medId);
      const nextState = {
        ...prev,
        [memberKey]: {
          ...currentProfile,
          medications: updatedMeds,
        },
      };

      try {
        localStorage.setItem(STORAGE_MEDS_KEY, JSON.stringify(nextState));
      } catch (e) {}

      return nextState;
    });

    showToast(`Prescription "${medName}" removed.`);
  };

  // Allergy Check Engine for New Additions
  const checkAllergyConflict = (targetMemberKey, medicineName) => {
    if (!medicineName) return null;
    const profile = familyMeds[targetMemberKey];
    if (!profile || !profile.allergies) return null;

    const lowerMed = medicineName.toLowerCase();
    for (const item of profile.allergies) {
      const allergenKey = item.allergen.toLowerCase();
      if (
        (allergenKey.includes('penicillin') && (lowerMed.includes('penicillin') || lowerMed.includes('amoxicillin') || lowerMed.includes('ampicillin'))) ||
        (allergenKey.includes('sulfa') && (lowerMed.includes('sulfa') || lowerMed.includes('bactrim'))) ||
        (allergenKey.includes('aspirin') && (lowerMed.includes('aspirin') || lowerMed.includes('ibuprofen') || lowerMed.includes('nsaid'))) ||
        (allergenKey.includes('peanut') && (lowerMed.includes('peanut') || lowerMed.includes('nut')))
      ) {
        return item;
      }
    }
    return null;
  };

  const activeModalAllergyAlert = checkAllergyConflict(modalMemberKey, formData.medicineName);

  // Handle adding a new medication
  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (activeModalAllergyAlert) {
      if (!window.confirm(`⚠️ CLINICAL ALLERGY ALERT: ${familyMeds[modalMemberKey]?.fullName} has a documented allergy to ${activeModalAllergyAlert.allergen} (${activeModalAllergyAlert.severity}). Are you sure you want to proceed?`)) {
        return;
      }
    }

    const slots = [];
    if (formData.timingMorning) slots.push({ slot: 'Morning', time: formData.morningTime });
    if (formData.timingAfternoon) slots.push({ slot: 'Afternoon', time: '02:00 PM' });
    if (formData.timingEvening) slots.push({ slot: 'Evening', time: '06:00 PM' });
    if (formData.timingNight) slots.push({ slot: 'Night', time: formData.nightTime });
    if (slots.length === 0) slots.push({ slot: 'Morning', time: '08:30 AM' });

    const newMed = {
      _id: 'med-' + Date.now(),
      medicineName: formData.medicineName,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timingSlots: slots,
      foodRelation: formData.foodRelation,
      purpose: formData.purpose || 'Prescribed treatment routine',
      prescribedBy: formData.prescribedBy || familyMeds[modalMemberKey]?.primaryDoctor || 'Primary Physician',
      dailyLimit: slots.length,
      stockLeft: Number(formData.stockLeft) || 30,
      isRefillNeeded: (Number(formData.stockLeft) || 30) <= 5,
    };

    setFamilyMeds((prev) => {
      const current = prev[modalMemberKey];
      const nextState = {
        ...prev,
        [modalMemberKey]: {
          ...current,
          medications: [newMed, ...(current?.medications || [])],
        },
      };
      try {
        localStorage.setItem(STORAGE_MEDS_KEY, JSON.stringify(nextState));
      } catch (e) {}
      return nextState;
    });

    // Also register corresponding daily dose slots in Dashboard doses
    setDashboardDoses((prev) => {
      const memberList = prev[modalMemberKey] || [];
      const newDoseSlots = slots.map((s, idx) => ({
        id: `dose-custom-${Date.now()}-${idx}`,
        medicineName: newMed.medicineName,
        dosage: newMed.dosage,
        slot: s.slot,
        foodRelation: newMed.foodRelation,
        status: 'pending',
        dailyLimit: slots.length,
      }));

      const updated = {
        ...prev,
        [modalMemberKey]: [...memberList, ...newDoseSlots],
      };

      try {
        localStorage.setItem(STORAGE_DOSES_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('carecircle_doses_updated'));
      } catch (e) {}

      return updated;
    });

    setShowAddModal(false);
    showToast(`Added ${newMed.medicineName} for ${familyMeds[modalMemberKey]?.fullName}.`);

    setFormData({
      medicineName: '',
      dosage: '500 mg',
      frequency: 'Once daily',
      timingMorning: true,
      timingAfternoon: false,
      timingEvening: false,
      timingNight: false,
      morningTime: '08:30 AM',
      nightTime: '08:30 PM',
      foodRelation: 'After Meal',
      purpose: '',
      prescribedBy: '',
      stockLeft: 30,
      dailyLimit: 1,
    });
  };

  // Determine which sections to render based on filter
  const memberKeysToRender = selectedProfileFilter === 'all'
    ? ['ramesh', 'sarita', 'siddharth', 'aarav']
    : [selectedProfileFilter];

  // Overall family regimen metrics
  const allProfiles = Object.values(familyMeds);
  const totalMedicationsCount = allProfiles.reduce((acc, p) => acc + (p.medications?.length || 0), 0);
  const totalRefillsNeeded = allProfiles.reduce(
    (acc, p) => acc + (p.medications?.filter((m) => (m.stockLeft || 0) <= 5).length || 0),
    0
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#013A40] text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Banner & Household Regimen Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00A896] animate-pulse"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008985]">
              CareCircle Clinical Prescription Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-[#00A896]" />
            </div>
            Medication Tracker & Regimens
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Prescriptions are grouped <strong>profile-wise for each family member</strong>. Dose intake and daily limits are verified directly on the Dashboard checklist to ensure safe adherence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8F8F3] hover:bg-[#D5F2E9] text-[#008985] text-xs font-bold transition-all cursor-pointer"
            title="Tick today's doses on Dashboard"
          >
            <Check className="w-4 h-4" />
            <span>Go to Dashboard Checklist →</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00A896]" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* 2. Top Family Member Switcher & Quick Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E6F7F3] text-[#008985] flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Filter by Profile:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedProfileFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedProfileFilter === 'all'
                ? 'bg-[#013A40] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Family Members ({totalMedicationsCount} Meds)
          </button>

          {Object.keys(MASTER_FAMILY_MEDICATIONS).map((k) => {
            const p = familyMeds[k] || MASTER_FAMILY_MEDICATIONS[k];
            const isSelected = selectedProfileFilter === k;
            const medCount = p.medications?.length || 0;

            return (
              <button
                key={k}
                onClick={() => setSelectedProfileFilter(k)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#013A40] text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{p.fullName.split(' ')[0]} ({p.relation})</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {medCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Helper Clinical Notice: Read-only adherence sync */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#008985] shrink-0" />
          <p className="font-medium">
            <strong>Dose Adherence Sync:</strong> All medicines listed below are synced with your live <strong>Dashboard</strong>. Ticking a dose is exclusively handled on the Dashboard to enforce daily prescribed dosage limits and avoid accidental double-dosing.
          </p>
        </div>
        <Link
          to="/"
          className="shrink-0 font-bold text-[#008985] hover:underline flex items-center gap-1"
        >
          <span>Dashboard</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* 4. PROFILE-WISE SECTIONS: Dedicated section for each member */}
      <div className="space-y-8">
        {memberKeysToRender.map((memberKey) => {
          const profile = familyMeds[memberKey] || MASTER_FAMILY_MEDICATIONS[memberKey];
          const meds = profile.medications || [];

          // Calculate member-level daily progress from dashboard doses
          const dosesForMember = dashboardDoses[memberKey] || DEFAULT_DASHBOARD_DOSES[memberKey] || [];
          const takenTodayCount = dosesForMember.filter((d) => d.status === 'taken').length;
          const totalDosesToday = dosesForMember.length;
          const memberProgressPercent = totalDosesToday > 0 
            ? Math.round((takenTodayCount / totalDosesToday) * 100) 
            : 0;

          return (
            <div
              key={memberKey}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 space-y-5"
            >
              
              {/* Member Section Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center font-black text-base shrink-0 shadow-2xs">
                    {profile.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">
                        {profile.fullName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F7F3] text-[#008985]">
                        {profile.relation}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Age {profile.age} • {profile.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200/60">
                        Blood: {profile.bloodGroup}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Stethoscope className="w-3.5 h-3.5 text-[#008985]" />
                        {profile.primaryDoctor}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{meds.length} Active Prescriptions</span>
                    </div>
                  </div>
                </div>

                {/* Right: Documented Allergies & Regimen Adherence Indicator */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Allergies Guard */}
                  {profile.allergies && profile.allergies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                      {profile.allergies.map((alg, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center gap-1"
                          title={`Severity: ${alg.severity}`}
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>{alg.allergen}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Today's Regimen Pill */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#F7FAF9] border border-slate-200/60 flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">Today's Intake:</span>
                    <span className={`font-black ${
                      memberProgressPercent === 100 ? 'text-[#008985]' : 'text-slate-900'
                    }`}>
                      {takenTodayCount}/{totalDosesToday} doses ({memberProgressPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Medication Cards Grid for this Member */}
              {meds.length === 0 ? (
                <div className="bg-[#F8FBFA] rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-900">
                            Preventive Care & Health Record
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            0 Active Prescriptions
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {profile.fullName} does not require active daily prescription medications. Clinical history, past treatments, and documented allergies are verified below.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 shrink-0">
                      Primary MD: <strong className="text-slate-800">{profile.primaryDoctor}</strong>
                    </span>
                  </div>

                  {/* Past Treatments, Surgeries & Checkup History */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/70 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Past Treatments & Surgical History
                      </span>
                      {profile.pastTreatments && profile.pastTreatments.length > 0 ? (
                        <div className="space-y-2.5">
                          {profile.pastTreatments.map((t, idx) => (
                            <div key={idx} className="text-xs space-y-0.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-800">{t.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {t.year}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {t.hospital} • <span className="text-emerald-700 font-semibold">{t.notes}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No major surgeries or hospitalizations on file.</p>
                      )}
                    </div>

                    {/* Documented Allergies & Clinical Cautions */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/70 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Documented Medical Allergies
                      </span>
                      {profile.allergies && profile.allergies.length > 0 ? (
                        <div className="space-y-2">
                          {profile.allergies.map((a, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/60 flex items-start gap-2 text-xs">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-rose-900 block">{a.allergen}</span>
                                <span className="text-[11px] text-rose-700 font-medium">Caution: {a.severity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-700 font-medium">No documented medical allergies.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {meds.map((med) => {
                    const isLowStock = (med.stockLeft || 0) <= 5;
                    const intake = getMedicationIntakeStatus(memberKey, med);

                    return (
                      <div
                        key={med._id}
                        className="bg-[#FBFDFD] rounded-3xl p-5 border border-slate-200/70 hover:border-[#00A896]/60 transition-all flex flex-col justify-between relative space-y-4 hover:shadow-sm"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E6F7F3] text-[#008985]">
                            Prescribed Daily Limit: {intake.totalPrescribed} dose{intake.totalPrescribed === 1 ? '' : 's'}/day
                          </span>

                          {isLowStock && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200/60 animate-pulse">
                              Low Stock ({med.stockLeft} left)
                            </span>
                          )}
                        </div>

                        {/* Title & Purpose */}
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                            {med.medicineName}
                          </h3>
                          <div className="text-xs font-bold text-[#00A896]">
                            {med.dosage} • {med.frequency}
                          </div>
                          {med.purpose && (
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed pt-0.5">
                              {med.purpose}
                            </p>
                          )}
                        </div>

                        {/* Timing Slots */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Daily Schedule Slots
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(med.timingSlots || []).map((slotItem, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200/70 text-[11px] font-semibold text-slate-700"
                              >
                                {slotItem.slot === 'Night' ? (
                                  <Moon className="w-3 h-3 text-indigo-500" />
                                ) : (
                                  <Sun className="w-3 h-3 text-amber-500" />
                                )}
                                <span>{slotItem.slot}</span>
                                {slotItem.time && (
                                  <span className="text-slate-400 text-[10px]">({slotItem.time})</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Details (Food, Stock, Prescribed By) */}
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1 font-medium">
                              <Utensils className="w-3.5 h-3.5 text-[#008985]" /> Food Timing:
                            </span>
                            <span className="font-semibold text-slate-800">
                              {med.foodRelation || 'After Meal'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 flex items-center gap-1 font-medium">
                              <Package className="w-3.5 h-3.5 text-[#008985]" /> Pharmacy Stock:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>
                                {med.stockLeft || 0} pills / doses
                              </span>
                              {isLowStock && (
                                <button
                                  onClick={() => handleRefillStock(memberKey, med._id)}
                                  className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                                  title="Add 30 pills to stock"
                                >
                                  +30 Refill
                                </button>
                              )}
                            </div>
                          </div>

                          {med.prescribedBy && (
                            <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-50">
                              <span className="text-slate-400">Prescribing MD:</span>
                              <span className="font-medium text-slate-700 truncate max-w-[150px]">
                                {med.prescribedBy}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Live Intake Status Banner (Read-only, strictly synced with Dashboard) */}
                        <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-2">
                          <div className="flex-1">
                            {intake.isCompleted ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>✓ All Doses Taken Today ({intake.takenCount}/{intake.totalPrescribed})</span>
                              </div>
                            ) : intake.isPartiallyTaken ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60">
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>⏳ {intake.takenCount}/{intake.totalPrescribed} Doses Taken (Remaining on Dashboard)</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>⏳ 0/{intake.totalPrescribed} Taken Today (Pending on Dashboard)</span>
                              </div>
                            )}
                            <span className="text-[10px] text-slate-400 block mt-1 pl-0.5">
                              Marked exclusively on Dashboard to enforce daily limits.
                            </span>
                          </div>

                          {/* Delete prescription action */}
                          <button
                            onClick={() => handleDelete(memberKey, med._id, med.medicineName)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                            title="Remove Prescription"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 5. ADD MEDICATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#008985]" />
                Schedule New Prescription
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Family Member Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Prescribe For Family Member:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(familyMeds).map((k) => {
                  const m = familyMeds[k];
                  const isTarget = modalMemberKey === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setModalMemberKey(k)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                        isTarget
                          ? 'border-[#008985] bg-[#E6F7F3] text-[#008985]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{m.fullName.split(' ')[0]}</span>
                      <span className="text-[10px] opacity-70">({m.relation})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Allergy Contraindication Alert */}
            {activeModalAllergyAlert && (
              <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3 text-rose-800 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-rose-900 uppercase tracking-wide">
                    ⚠️ CLINICAL CONTRAINDICATION: {activeModalAllergyAlert.allergen}
                  </div>
                  <p className="mt-1 text-rose-700 leading-relaxed font-medium">
                    {familyMeds[modalMemberKey]?.fullName} has a documented <strong>{activeModalAllergyAlert.severity}</strong> allergy. Prescribing this medication requires conscious clinical confirmation.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Medicine Name & Strength
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telmisartan 40mg, Metformin 500mg"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dosage Form</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 tablet, 5 ml"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Relation</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-semibold"
                    value={formData.foodRelation}
                    onChange={(e) => setFormData({ ...formData, foodRelation: e.target.value })}
                  >
                    <option value="After Meal">After Meal</option>
                    <option value="Before Meal">Before Meal</option>
                    <option value="With Meal">With Meal</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                    <option value="Before Bed">Before Bed</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              {/* Routine checklist */}
              <div className="rounded-2xl p-4 bg-slate-50 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Select Daily Dose Timings
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.timingMorning}
                      onChange={(e) => setFormData({ ...formData, timingMorning: e.target.checked })}
                      className="rounded text-[#008985] focus:ring-[#008985]"
                    />
                    <span>Morning (08:30 AM)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.timingAfternoon}
                      onChange={(e) => setFormData({ ...formData, timingAfternoon: e.target.checked })}
                      className="rounded text-[#008985] focus:ring-[#008985]"
                    />
                    <span>Afternoon (02:00 PM)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.timingEvening}
                      onChange={(e) => setFormData({ ...formData, timingEvening: e.target.checked })}
                      className="rounded text-[#008985] focus:ring-[#008985]"
                    />
                    <span>Evening (06:00 PM)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.timingNight}
                      onChange={(e) => setFormData({ ...formData, timingNight: e.target.checked })}
                      className="rounded text-[#008985] focus:ring-[#008985]"
                    />
                    <span>Night (08:30 PM)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prescribing Doctor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Arvind Mehta"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pharmacy Stock (Pills)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="30"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.stockLeft}
                    onChange={(e) => setFormData({ ...formData, stockLeft: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Medical Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Blood pressure regulation, joint pain relief"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#00A896]" />
                  <span>Save Prescription</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
