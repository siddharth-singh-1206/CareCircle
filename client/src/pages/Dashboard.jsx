import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Users,
  Droplet,
  Edit3,
  Share2,
  Calendar,
  Phone,
  Heart,
  FileText,
  Pill,
  Sun,
  Moon,
  Clock,
  Check,
  AlertTriangle,
  Activity,
  ArrowRight,
  Stethoscope,
  CheckCircle2,
  Plus,
  Building2,
  Award,
  ChevronRight,
  X,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import MemberHealthModal from '../components/MemberHealthModal';

const ALL_NETWORK_DOCTORS = [
  {
    _id: 'doc-mehta-01',
    name: 'Dr. Arvind Mehta',
    specialization: 'Cardiology (Interventional Consultant)',
    hospital: 'Apollo Heart & Vascular Institute, Mathura',
    registrationNumber: 'MCI-CARD-99214',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'doc-khanna-02',
    name: 'Dr. Rajesh Khanna',
    specialization: 'Geriatric Medicine & Diabetology',
    hospital: 'Max Healthcare & Diabetes Centre',
    registrationNumber: 'MCI-GEN-55410',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'doc-sunita-03',
    name: 'Dr. Sunita Rao',
    specialization: 'Rheumatology & Autoimmune Disorders',
    hospital: 'Fortis Healthcare & Arthritis Institute',
    registrationNumber: 'MCI-RHEUM-66321',
    avatar: 'https://images.unsplash.com/photo-1594824813583-774fbe618a80?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'doc-priya-04',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrics & Pediatric Pulmonology',
    hospital: 'Rainbow Children’s Hospital & Apollo Clinics',
    registrationNumber: 'MCI-PED-44109',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  },
  {
    _id: 'doc-vikram-05',
    name: 'Dr. Vikram Malhotra',
    specialization: 'Pulmonology & Critical Care',
    hospital: 'Medanta Heart & Chest Institute, Mathura',
    registrationNumber: 'MCI-PULM-78210',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
  },
];

const MEMBER_DATA_REGISTRY = {
  ramesh: {
    name: 'Ramesh',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    age: 74,
    gender: 'Male',
    bloodGroup: 'B+',
    household: 'Sharma Family Health Circle',
    primaryDoctor: 'Dr. Arvind Mehta (Cardiologist, Apollo)',
    emergencyContact: { name: 'Siddharth Sharma', phone: '+91 98765 43210' },
    conditionsCount: 2,
    reportsCount: 2,
    allergy: {
      title: 'Penicillin Allergy',
      severity: 'CRITICAL',
      badgeColor: 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]',
      boxBg: 'bg-[#FFF6F6] border-[#FFDFDF]',
      titleColor: 'text-[#881337]',
      desc: 'Severe anaphylactic reaction and hives observed during 2018 treatment.',
    },
    chronic: {
      title: 'Essential Hypertension & Glucose Management',
      boxBg: 'bg-[#F0FAF9] border-[#D5EFEA]',
      titleColor: 'text-[#013A40]',
      desc: 'Blood pressure & fasting glucose maintained with morning Amlodipine & Metformin.',
    },
    doses: [
      {
        id: 'dose-ramesh-1',
        medicineName: 'Amlodipine (Norvasc)',
        dosage: '5 mg',
        slot: 'Morning',
        icon: Sun,
        slotBadge: 'bg-[#E8F8F3] text-[#008985]',
        foodRelation: 'After Meal',
        status: 'taken',
        dailyLimit: 1,
      },
      {
        id: 'dose-ramesh-2',
        medicineName: 'Metformin Hydrochloride (Glycomet)',
        dosage: '500 mg',
        slot: 'Morning',
        icon: Sun,
        slotBadge: 'bg-[#E8F8F3] text-[#008985]',
        foodRelation: 'After Meal',
        status: 'pending',
        dailyLimit: 1,
      },
    ],
    doctors: [
      {
        _id: 'grant-mehta-01',
        doctorName: 'Dr. Arvind Mehta',
        doctorSpecialty: 'Cardiology (Interventional Consultant)',
        doctorHospital: 'Apollo Heart & Vascular Institute, Mathura',
        doctorLicense: 'MCI-CARD-99214',
        doctorAvatar: 'AM',
        status: 'active',
        permittedCategories: ['vitals', 'medications', 'allergies', 'prescriptions'],
        permittedDocuments: ['Resting 12-Lead ECG Report', 'Comprehensive Lipid Profile'],
        doctorNotes: [
          {
            id: 'msg-mehta-1',
            sender: 'doctor',
            doctorName: 'Dr. Arvind Mehta (Cardiology, Apollo)',
            comment:
              'Reviewed 12-lead ECG and lipid panel. Occasional benign PVCs noted. Blood pressure (124/82) is well-controlled. Advised low-sodium diet and continuation of Amlodipine 5mg. Schedule follow-up in 14 days.',
            createdAt: 'Today, 08:30 AM',
            status: 'pending_family_review',
          },
        ],
      },
    ],
  },
  sarita: {
    name: 'Sarita',
    fullName: 'Sarita Sharma',
    relation: 'Mother',
    age: 52,
    gender: 'Female',
    bloodGroup: 'A+',
    household: 'Sharma Family Health Circle',
    primaryDoctor: 'Dr. Sunita Rao (Internal Medicine & Rheumatology, Fortis)',
    emergencyContact: { name: 'Siddharth Sharma', phone: '+91 98765 43210' },
    conditionsCount: 1,
    reportsCount: 2,
    allergy: {
      title: 'Aspirin & NSAID Allergy',
      severity: 'MODERATE',
      badgeColor: 'bg-[#FEF3E2] text-[#D97706] border-[#FDE68A]',
      boxBg: 'bg-[#FFFDF6] border-[#FDE68A]',
      titleColor: 'text-[#92400E]',
      desc: 'Avoid Aspirin, Ibuprofen, and Naproxen. Triggers severe gastric irritation and urticaria.',
    },
    chronic: {
      title: 'Past Surgical Treatment: Appendectomy (2019)',
      boxBg: 'bg-[#F0FAF9] border-[#D5EFEA]',
      titleColor: 'text-[#013A40]',
      desc: 'Laparoscopic appendectomy performed at Fortis Hospital (Oct 2019). Fully resolved. Annual health screening normal.',
    },
    doses: [
      {
        id: 'dose-sarita-1',
        medicineName: 'Thyronorm (Levothyroxine Sodium)',
        dosage: '50 mcg',
        slot: 'Morning',
        icon: Sun,
        slotBadge: 'bg-[#E8F8F3] text-[#008985]',
        foodRelation: 'Empty Stomach',
        status: 'taken',
        dailyLimit: 1,
      },
    ],
    doctors: [
      {
        _id: 'grant-sunita-01',
        doctorName: 'Dr. Sunita Rao',
        doctorSpecialty: 'Internal Medicine & Clinical Care',
        doctorHospital: 'Fortis Healthcare & Medical Institute',
        doctorLicense: 'MCI-IM-66321',
        doctorAvatar: 'SR',
        status: 'active',
        permittedCategories: ['vitals', 'allergies', 'medications'],
        permittedDocuments: ['Appendectomy Discharge Summary (2019)', 'Annual Executive Health Panel (2024)'],
        doctorNotes: [
          {
            id: 'msg-sunita-1',
            sender: 'doctor',
            doctorName: 'Dr. Sunita Rao (Internal Medicine, Fortis)',
            comment:
              'Thyroid profile optimal (TSH 2.2 mIU/L) on Thyronorm 50 mcg. Continue morning dose on empty stomach. Routine physical activity maintained.',
            createdAt: 'Today, 10:15 AM',
            status: 'acknowledged',
          },
        ],
      },
    ],
  },
  siddharth: {
    name: 'Siddharth',
    fullName: 'Siddharth Sharma',
    relation: 'Self',
    age: 26,
    gender: 'Male',
    bloodGroup: 'O+',
    household: 'Sharma Family Health Circle',
    primaryDoctor: 'None Required (Healthy)',
    emergencyContact: { name: 'Sarita Sharma', phone: '+91 98765 11223' },
    conditionsCount: 0,
    reportsCount: 1,
    allergy: {
      title: 'Mild Seasonal Pollen Rhinitis',
      severity: 'MILD',
      badgeColor: 'bg-[#E8F8F3] text-[#008985] border-[#A7E7D9]',
      boxBg: 'bg-[#F0FAF9] border-[#D5EFEA]',
      titleColor: 'text-[#013A40]',
      desc: 'Occasional mild spring sneezing. Managed with over-the-counter antihistamine SOS as needed.',
    },
    chronic: {
      title: 'Healthy Caregiver • Normal Annual Screening',
      boxBg: 'bg-[#F0FAF9] border-[#D5EFEA]',
      titleColor: 'text-[#013A40]',
      desc: 'Optimal biometrics: Blood Pressure 118/76 mmHg, resting heart rate 72 bpm. Wisdom tooth extraction (2022) healed. No daily medications.',
    },
    doses: [],
    doctors: [],
  },
  aarav: {
    name: 'Aarav',
    fullName: 'Aarav Sharma',
    relation: 'Brother',
    age: 8,
    gender: 'Male',
    bloodGroup: 'O+',
    household: 'Sharma Family Health Circle',
    primaryDoctor: 'None Required (Healthy Child)',
    emergencyContact: { name: 'Sarita Sharma', phone: '+91 98765 11223' },
    conditionsCount: 0,
    reportsCount: 1,
    allergy: {
      title: 'Peanut & Tree Nut Allergy',
      severity: 'MODERATE',
      badgeColor: 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]',
      boxBg: 'bg-[#FFF6F6] border-[#FFDFDF]',
      titleColor: 'text-[#881337]',
      desc: 'Documented pediatric intolerance. School health sheet updated. Strictly avoid peanut snacks.',
    },
    chronic: {
      title: 'Healthy Child • Pediatric Growth 75th Percentile',
      boxBg: 'bg-[#F0FAF9] border-[#D5EFEA]',
      titleColor: 'text-[#013A40]',
      desc: 'National pediatric immunization schedule complete (MMR, DTP, Polio booster). Regular growth milestone checks normal. No daily medications.',
    },
    doses: [],
    doctors: [],
  },
};

const getProfileKey = (m) => {
  const name = (m?.fullName || '').toLowerCase();
  const rel = (m?.relation || '').toLowerCase();
  if (name.includes('sarita') || rel.includes('mother') || rel.includes('mom')) return 'sarita';
  if (name.includes('siddharth') || rel.includes('self')) return 'siddharth';
  if (name.includes('aarav') || rel.includes('brother') || rel.includes('child')) return 'aarav';
  return 'ramesh';
};

export default function Dashboard() {
  const { user, family, members, selectedMember, setSelectedMember } = useAuth();
  const navigate = useNavigate();

  const [customProfileOverride, setCustomProfileOverride] = useState(null);

  // Defensively retrieve patient with robust fallback
  const basePatient =
    (selectedMember && selectedMember.fullName ? selectedMember : null) ||
    (members && members.length > 0 && members[0]?.fullName ? members[0] : null) ||
    MEMBER_DATA_REGISTRY.ramesh;

  const [activeTabMember, setActiveTabMember] = useState(null);
  const patient = customProfileOverride || basePatient;
  const activeProfileKey = activeTabMember || getProfileKey(patient);
  const activeProfile = MEMBER_DATA_REGISTRY[activeProfileKey] || MEMBER_DATA_REGISTRY.ramesh;

  // Safely extract doctor name string from object or string, avoiding React child object crash
  const getPrimaryDoctorName = (p, fallbackDoc) => {
    if (!p) return fallbackDoc;
    if (typeof p.primaryDoctor === 'string' && p.primaryDoctor.trim()) {
      return p.primaryDoctor;
    }
    if (typeof p.primaryDoctor === 'object' && p.primaryDoctor?.name && p.primaryDoctor.name.trim()) {
      return p.primaryDoctor.name;
    }
    return fallbackDoc;
  };

  // Member-keyed state dictionaries for instantaneous, lag-free switching
  const [memberDoses, setMemberDoses] = useState(() => {
    try {
      const saved = localStorage.getItem('carecircle_member_doses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // If sarita was empty or missing, restore her prescribed Thyronorm dose
          if (!parsed.sarita || parsed.sarita.length === 0) {
            parsed.sarita = MEMBER_DATA_REGISTRY.sarita.doses;
          }
          parsed.siddharth = [];
          parsed.aarav = [];
          return parsed;
        }
      }
    } catch (e) {}
    return {
      ramesh: MEMBER_DATA_REGISTRY.ramesh.doses,
      sarita: MEMBER_DATA_REGISTRY.sarita.doses,
      siddharth: [],
      aarav: [],
    };
  });

  // Listen for dose updates across tabs and components
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('carecircle_member_doses');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            if (!parsed.sarita || parsed.sarita.length === 0) {
              parsed.sarita = MEMBER_DATA_REGISTRY.sarita.doses;
            }
            parsed.siddharth = [];
            parsed.aarav = [];
            setMemberDoses(parsed);
          }
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

  const [disclosureRevision, setDisclosureRevision] = useState(0);
  useEffect(() => {
    const handleDisclosuresSync = () => {
      setDisclosureRevision((r) => r + 1);
      try {
        const saved = localStorage.getItem('carecircle_member_consultations');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setMemberConsultations({
              ramesh: parsed.ramesh || MEMBER_DATA_REGISTRY.ramesh.doctors,
              sarita: parsed.sarita || MEMBER_DATA_REGISTRY.sarita.doctors,
              siddharth: [],
              aarav: [],
            });
          }
        }
      } catch (e) {}
    };
    window.addEventListener('carecircle_disclosures_updated', handleDisclosuresSync);
    window.addEventListener('carecircle_consultations_updated', handleDisclosuresSync);
    window.addEventListener('storage', handleDisclosuresSync);
    return () => {
      window.removeEventListener('carecircle_disclosures_updated', handleDisclosuresSync);
      window.removeEventListener('carecircle_consultations_updated', handleDisclosuresSync);
      window.removeEventListener('storage', handleDisclosuresSync);
    };
  }, []);

  const [memberConsultations, setMemberConsultations] = useState(() => {
    try {
      const saved = localStorage.getItem('carecircle_member_consultations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ramesh: parsed.ramesh || MEMBER_DATA_REGISTRY.ramesh.doctors,
            sarita: parsed.sarita || MEMBER_DATA_REGISTRY.sarita.doctors,
            siddharth: [],
            aarav: [],
          };
        }
      }
    } catch (e) {}
    return {
      ramesh: MEMBER_DATA_REGISTRY.ramesh.doctors,
      sarita: MEMBER_DATA_REGISTRY.sarita.doctors,
      siddharth: [],
      aarav: [],
    };
  });

  const [selectedDoctorByMember, setSelectedDoctorByMember] = useState({
    ramesh: 'grant-mehta-01',
    sarita: 'grant-sunita-01',
  });

  const handleSelectDoctor = (docId) => {
    setSelectedDoctorByMember((prev) => ({
      ...prev,
      [activeProfileKey]: docId,
    }));
  };

  const [selectedDossierMember, setSelectedDossierMember] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [doctorReplyInput, setDoctorReplyInput] = useState('');

  // Modals for Interactive Button actions
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Directly derived active state without ANY asynchronous useEffect lag
  const doses = memberDoses[activeProfileKey] || activeProfile.doses || MEMBER_DATA_REGISTRY.ramesh.doses;
  const consultations = memberConsultations[activeProfileKey] || activeProfile.doctors || MEMBER_DATA_REGISTRY.ramesh.doctors;
  const selectedDoctorId = selectedDoctorByMember[activeProfileKey] || consultations[0]?._id;

  const currentDoctor =
    (Array.isArray(consultations) && consultations.find((c) => c && c._id === selectedDoctorId)) ||
    (Array.isArray(consultations) && consultations[0]) ||
    null;

  const pendingDoctorNote = currentDoctor?.doctorNotes?.find(
    (n) => n && n.sender !== 'family' && n.status !== 'acknowledged'
  );

  const getCurrentDoctorDisclosedDocs = () => {
    try {
      const saved = localStorage.getItem('carecircle_doctor_disclosures');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (currentDoctor?.doctorName?.includes('Mehta') || currentDoctor?._id === 'grant-mehta-01') {
          if (parsed['doc-mehta-01'] && parsed['doc-mehta-01'].length > 0) {
            return parsed['doc-mehta-01'];
          }
        } else if (currentDoctor?.doctorName?.includes('Sunita') || currentDoctor?._id === 'grant-sunita-01') {
          if (parsed['doc-sunita-03'] && parsed['doc-sunita-03'].length > 0) {
            return parsed['doc-sunita-03'];
          }
        } else if (currentDoctor?._id && parsed[currentDoctor._id] && parsed[currentDoctor._id].length > 0) {
          return parsed[currentDoctor._id];
        }
      }
    } catch (e) {}

    // Initial canonical disclosures fallback
    if (currentDoctor?.doctorName?.includes('Mehta') || currentDoctor?._id === 'grant-mehta-01') {
      return [
        {
          docId: 'doc-ramesh-1',
          title: 'Resting 12-Lead ECG Report',
          category: 'Lab Report',
          sharedAt: '2026-11-16',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        {
          docId: 'doc-ramesh-2',
          title: 'Comprehensive Lipid & Fasting Glucose Profile',
          category: 'Lab Report',
          sharedAt: '2026-11-14',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
      ];
    } else if (currentDoctor?.doctorName?.includes('Sunita') || currentDoctor?._id === 'grant-sunita-01') {
      return [
        {
          docId: 'doc-sarita-1',
          title: 'Appendectomy Surgical Discharge Summary',
          category: 'Discharge Summary',
          sharedAt: '2026-05-12',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        {
          docId: 'doc-sarita-2',
          title: 'Annual Executive Health Panel (2024)',
          category: 'Lab Report',
          sharedAt: '2026-10-04',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
      ];
    }

    return [];
  };

  // Family-Wide Tracking Metrics across all 4 household members
  const familyKeys = ['ramesh', 'sarita', 'siddharth', 'aarav'];
  
  const familyTrackingData = familyKeys.map((key) => {
    const reg = MEMBER_DATA_REGISTRY[key];
    const mDoses = memberDoses[key] || reg.doses;
    const mTaken = (mDoses || []).filter((d) => d && d.status === 'taken').length;
    const mTotal = mDoses?.length || 0;
    const mPercent = mTotal > 0 ? Math.round((mTaken / mTotal) * 100) : 0;
    const nextDose = (mDoses || []).find((d) => d && d.status === 'pending');
    const doctorObj = (memberConsultations[key] && memberConsultations[key][0]) || reg.doctors[0];
    const hasPendingNote = doctorObj?.doctorNotes?.some((n) => n && n.sender !== 'family' && n.status !== 'acknowledged');

    return {
      key,
      name: reg.name,
      fullName: reg.fullName,
      relation: reg.relation,
      age: reg.age,
      bloodGroup: reg.bloodGroup,
      avatar: reg.avatar,
      doses: mDoses,
      takenCount: mTaken,
      totalCount: mTotal,
      percentage: mPercent,
      nextDose,
      doctor: doctorObj,
      hasPendingNote,
      emergencyCode: reg.emergencyCode,
    };
  });

  const householdTotalDoses = familyTrackingData.reduce((acc, m) => acc + m.totalCount, 0);
  const householdTakenDoses = familyTrackingData.reduce((acc, m) => acc + m.takenCount, 0);
  const householdPercentage = householdTotalDoses > 0 ? Math.round((householdTakenDoses / householdTotalDoses) * 100) : 0;

  // Active Member Regimen Progress Calculation (100% synchronous)
  const totalCount = doses?.length || 0;
  const takenCount = doses?.filter((d) => d && d.status === 'taken').length || 0;
  const percentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const toggleDose = (id, memberKey = activeProfileKey) => {
    setMemberDoses((prev) => {
      const currentList = prev[memberKey] || [];
      const targetItem = currentList.find((d) => d.id === id);
      if (!targetItem) return prev;

      const isCurrentlyTaken = targetItem.status === 'taken';

      // Daily Prescribed Limit Safeguard: cannot exceed prescribed daily doses
      if (!isCurrentlyTaken) {
        const sameMedDoses = currentList.filter(
          (d) => d.medicineName === targetItem.medicineName
        );
        const sameMedTakenCount = sameMedDoses.filter((d) => d.status === 'taken').length;
        const prescribedLimit = targetItem.dailyLimit || sameMedDoses.length || 1;

        if (sameMedTakenCount >= prescribedLimit) {
          setToastMsg(
            `⚠️ Prescribed daily limit of ${prescribedLimit} dose(s) already reached for ${targetItem.medicineName}. Cannot mark more than prescribed for today.`
          );
          setTimeout(() => setToastMsg(''), 4000);
          return prev;
        }
      }

      const updatedList = currentList.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'taken' ? 'pending' : 'taken' }
          : item
      );

      const nextState = {
        ...prev,
        [memberKey]: updatedList,
      };

      try {
        localStorage.setItem('carecircle_member_doses', JSON.stringify(nextState));
        localStorage.setItem('carecircle_regimen_date', new Date().toISOString().split('T')[0]);
        window.dispatchEvent(new Event('carecircle_doses_updated'));
      } catch (e) {}

      const totalPrescribed = targetItem.dailyLimit || updatedList.filter((d) => d.medicineName === targetItem.medicineName).length || 1;
      const nowTaken = updatedList.filter((d) => d.medicineName === targetItem.medicineName && d.status === 'taken').length;

      if (!isCurrentlyTaken) {
        setToastMsg(
          `✓ Dose recorded: ${targetItem.medicineName} (${targetItem.slot}). ${nowTaken}/${totalPrescribed} daily doses completed.`
        );
      } else {
        setToastMsg(
          `Dose unmarked: ${targetItem.medicineName} (${targetItem.slot}) reset to pending.`
        );
      }
      setTimeout(() => setToastMsg(''), 3500);

      return nextState;
    });
  };

  const setSelectedDoctorId = (docId) => {
    setSelectedDoctorByMember((prev) => ({
      ...prev,
      [activeProfileKey]: docId,
    }));
  };

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    relation: '',
    bloodGroup: '',
    primaryDoctor: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const handleOpenEditModal = () => {
    setEditFormData({
      fullName: patient.fullName || '',
      relation: patient.relation || '',
      bloodGroup: patient.bloodGroup || 'B+',
      primaryDoctor: getPrimaryDoctorName(patient, activeProfile.primaryDoctor),
      emergencyContactName: patient.emergencyContact?.name || 'Siddharth Sharma',
      emergencyContactPhone: patient.emergencyContact?.phone || '+91 98765 43210',
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...patient,
      fullName: editFormData.fullName,
      relation: editFormData.relation,
      bloodGroup: editFormData.bloodGroup,
      primaryDoctor: editFormData.primaryDoctor,
      emergencyContact: {
        name: editFormData.emergencyContactName,
        phone: editFormData.emergencyContactPhone,
      },
    };
    setCustomProfileOverride(updated);
    if (setSelectedMember) {
      setSelectedMember(updated);
    }
    setShowEditModal(false);
    setToastMsg(`Health profile for ${editFormData.fullName} updated successfully!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenShareModal = () => {
    const link = `${window.location.origin}/emergency/${patient.emergencyCode || 'EMG-RAMESH74'}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setToastMsg(`Emergency Access Link copied to clipboard!`);
    setShowShareModal(true);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Acknowledge clinical note for specific doctor
  const handleAcknowledgeFromDashboard = (grantId) => {
    setMemberConsultations((prev) => ({
      ...prev,
      [activeProfileKey]: (prev[activeProfileKey] || []).map((c) => {
        if (c._id === grantId) {
          const notes = (c.doctorNotes || []).map((n) =>
            n.sender !== 'family' ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Caregiver' } : n
          );
          return { ...c, doctorNotes: notes };
        }
        return c;
      }),
    }));

    try {
      const doc = JSON.parse(localStorage.getItem('carecircle_doctor_requests') || '[]');
      const docUpdated = Array.isArray(doc) ? doc.map((d) => {
        if (d._id === grantId) {
          const notes = (d.doctorNotes || []).map((n) =>
            n.sender !== 'family' ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Caregiver' } : n
          );
          return { ...d, doctorNotes: notes };
        }
        return d;
      }) : [];
      localStorage.setItem('carecircle_doctor_requests', JSON.stringify(docUpdated));
    } catch (e) {}

    setToastMsg(`Clinical recommendations from ${currentDoctor?.doctorName || 'Doctor'} acknowledged.`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Send query strictly to the selected doctor
  const handleSendDoctorQuery = (doctorId) => {
    if (!doctorReplyInput.trim()) return;

    const newQuery = {
      id: 'query-' + Date.now(),
      sender: 'family',
      authorName: `${user?.name || 'Siddharth Sharma'} (Caregiver)`,
      comment: doctorReplyInput.trim(),
      createdAt: 'Just now',
      status: 'pending_doctor_review',
    };

    setMemberConsultations((prev) => {
      const updated = {
        ...prev,
        [activeProfileKey]: (prev[activeProfileKey] || []).map((c) => {
          if (c._id === doctorId) {
            return { ...c, doctorNotes: [...(c.doctorNotes || []), newQuery] };
          }
          return c;
        }),
      };
      try {
        localStorage.setItem('carecircle_member_consultations', JSON.stringify(updated));
        window.dispatchEvent(new Event('carecircle_consultations_updated'));
      } catch (e) {}
      return updated;
    });

    try {
      const doc = JSON.parse(localStorage.getItem('carecircle_doctor_requests') || '[]');
      const docUpdated = Array.isArray(doc) ? doc.map((d) => {
        if (d._id === doctorId) {
          return { ...d, doctorNotes: [...(d.doctorNotes || []), newQuery] };
        }
        return d;
      }) : [];
      localStorage.setItem('carecircle_doctor_requests', JSON.stringify(docUpdated));
    } catch (e) {}

    setDoctorReplyInput('');
    setToastMsg(`Question transmitted to ${currentDoctor?.doctorName || 'Doctor'}.`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#013A40] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00A896]"></span>
          {toastMsg}
        </div>
      )}

      {/* 1. Household Care & Member Tracking Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A896] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008985]">
              Sharma Family Health Circle
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Family Care & Member Health Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Live regimen adherence, medication schedules, and attending physician updates across all 4 family members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#00A896]" />
            <span>Find Doctors</span>
          </Link>

          <Link
            to="/members"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E8F8F3] hover:bg-[#D5F2E9] text-[#008985] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            title="View Individual Member Health Dossiers"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Go to Family Members →</span>
          </Link>
        </div>
      </div>

      {/* 2. Top 4 Household Metric Cards: Total Regimen, Family Members, Attending Doctors, Clinical Advice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: HOUSEHOLD REGIMEN with circular Donut progress ring */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#E8F8F3] text-[#00A896] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#00A896]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                HOUSEHOLD REGIMEN
              </span>
            </div>

            <div className="pt-1">
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {householdTakenDoses} <span className="text-xs font-medium text-slate-500">/ {householdTotalDoses} doses</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {householdPercentage}% family adherence today
              </p>
            </div>
          </div>

          {/* Circular SVG Donut Progress Chart */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00B4A6] transition-all duration-500"
                strokeDasharray={`${householdPercentage}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-slate-800">
              {householdPercentage}%
            </span>
          </div>
        </div>

        {/* Metric 2: MEMBERS TRACKED */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
                <Users className="w-4 h-4 text-[#00A896]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                MEMBERS TRACKED
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              4 Active
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              4 <span className="text-xs font-medium text-slate-500">individuals</span>
            </div>
            <Link
              to="/members"
              className="text-xs text-[#008985] font-bold hover:underline mt-0.5 inline-flex items-center gap-1"
            >
              Manage Family Profiles →
            </Link>
          </div>
        </div>

        {/* Metric 3: ATTENDING DOCTORS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                ATTENDING DOCTORS
              </span>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Connected
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              4 <span className="text-xs font-medium text-slate-500">specialists</span>
            </div>
            <Link
              to="/doctors"
              className="text-xs text-[#2563EB] font-bold hover:underline mt-0.5 inline-flex items-center gap-1"
            >
              Browse Doctor Directory →
            </Link>
          </div>
        </div>

        {/* Metric 4: CLINICAL ADVICE STATUS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FEF3E2] text-[#D97706] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#D97706]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                CLINICAL ADVICE
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md animate-pulse">
              1 New Advice
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-base font-bold text-slate-900 truncate">
              Dr. Arvind Mehta
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Pending review for Ramesh Sharma
            </div>
          </div>
        </div>

      </div>

      {/* 3. FAMILY MEMBER TRACKER: KEEP TRACK OF EVERY FAMILY MEMBER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center font-bold">
                <Users className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Family Member Health Tracking
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time daily regimen progress, attending physician advice, and clinical status for every household member.
            </p>
          </div>

          <Link
            to="/members"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E8F8F3] hover:bg-[#D5F2E9] text-[#008985] rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span>Go to Family Members Section →</span>
          </Link>
        </div>

        {/* 4 Member Tracking Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {familyTrackingData.map((member) => (
            <div
              key={member.key}
              onClick={() => setSelectedDossierMember(member.key)}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00A896]/60 bg-[#F7FAF9] transition-all flex flex-col justify-between space-y-3.5 cursor-pointer group"
            >
              <div>
                {/* Header: Name, Relation, Blood Group */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight group-hover:text-[#008985] transition-colors">
                      {member.fullName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-[#008985] bg-[#E6F7F3] px-2 py-0.5 rounded-full">
                        {member.relation}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Age {member.age}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md font-mono shrink-0">
                    {member.bloodGroup}
                  </span>
                </div>

                {/* Today's Regimen Progress or Preventive Wellness Status */}
                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {member.totalCount > 0 ? "Today's Regimen" : "Health Status"}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      member.totalCount > 0
                        ? 'bg-slate-100 text-slate-900'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}>
                      {member.totalCount > 0 
                        ? `${member.takenCount}/${member.totalCount} doses (${member.percentage}%)`
                        : 'Preventive Wellness'}
                    </span>
                  </div>

                  {member.totalCount > 0 ? (
                    <>
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            member.percentage === 100 ? 'bg-emerald-500' : 'bg-[#00A896]'
                          }`}
                          style={{ width: `${member.percentage}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 pt-0.5 truncate">
                        {member.nextDose ? (
                          <span>Next: <strong className="text-slate-700">{member.nextDose.medicineName}</strong> ({member.nextDose.slot})</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">✓ All prescribed doses completed today</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-600 pt-0.5 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {member.key === 'siddharth'
                          ? 'Caregiver • Healthy Baseline (0 Active Meds)'
                          : 'Pediatric Growth 75th % • Up to Date'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Attending Doctor & Clinical Status */}
                <div className="mt-2 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Attending Physician
                  </span>
                  {member.doctor ? (
                    <>
                      <div className="font-bold text-slate-800 text-xs truncate">
                        {member.doctor.doctorName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {member.doctor.doctorSpecialty?.split('(')[0] || 'Specialist'}
                      </div>
                      {member.hasPendingNote ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" /> New Advice Received
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Advice Up to Date
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-slate-700 text-xs">
                        None Required (Healthy)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {member.key === 'aarav' ? 'Pediatric Wellness Baseline' : 'Active Caregiver Baseline'}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Fit & Well • No Active Treatment
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action: Open full comprehensive health dossier modal */}
              <div className="pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDossierMember(member.key);
                  }}
                  className="w-full text-[11px] font-bold text-[#008985] hover:text-[#013A40] flex items-center justify-between group cursor-pointer"
                >
                  <span>View Member Health Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEDICATED PER-DOCTOR SPECIALIST CONSULTATION SECTIONS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 space-y-5">
        
        {/* Hub Header with Doctor Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center font-bold">
                <Stethoscope className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Attending Physicians & Specialist Consultations
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct clinical consultation channels, doctor notes, and medical advice from your family's attending physicians.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#008985]" />
            <span>+ Find & Connect Doctors</span>
          </Link>
        </div>

        {/* Doctor Switcher Pills or Healthy State */}
        {consultations && consultations.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {consultations.map((doc) => {
              const isSelected = selectedDoctorId === doc._id;
              const hasPending = doc.doctorNotes?.some(
                (n) => n.sender !== 'family' && n.status !== 'acknowledged'
              );

              return (
                <button
                  key={doc._id}
                  onClick={() => handleSelectDoctor(doc._id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#013A40] text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <Stethoscope className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00A896]' : 'text-slate-400'}`} />
                  <span>{doc.doctorName}</span>
                  {hasPending ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Pending Review" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Reviewed" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#F0FAF9] border border-[#D5EFEA] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#013A40]">
                Preventive Wellness Baseline — No Attending Physician Required
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {activeProfile.fullName} maintains optimal vitals and biometrics. No specialist consultations or active treatments are currently scheduled.
              </p>
            </div>
          </div>
        )}

        {/* SELECTED DOCTOR DEDICATED SECTION (STRICTLY CONTAINED) */}
        {currentDoctor && (
          <div id="attending-doctor-section" className="bg-[#F7FAF9] rounded-2xl p-5 border border-slate-200/60 space-y-4">
            
            {/* Doctor Info & Scope Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{currentDoctor.doctorName}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#013A40] text-white text-[10px] font-bold">
                    {currentDoctor.doctorSpecialty}
                  </span>
                  {pendingDoctorNote ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" /> Action Required: Pending Review
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Advice Reviewed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {currentDoctor.doctorHospital} • License: <span className="font-mono">{currentDoctor.doctorLicense}</span>
                </p>
              </div>

              {/* Permitted Documents Isolated for this Doctor */}
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Disclosed Records to this Doctor
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {(() => {
                    let docTitles = [];
                    try {
                      const saved = localStorage.getItem('carecircle_doctor_disclosures');
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        if (currentDoctor.doctorName.includes('Mehta')) {
                          docTitles = (parsed['doc-mehta-01'] || []).map((d) => d.title);
                        } else if (currentDoctor.doctorName.includes('Sunita')) {
                          docTitles = (parsed['doc-sunita-03'] || []).map((d) => d.title);
                        } else if (parsed[currentDoctor._id]) {
                          docTitles = parsed[currentDoctor._id].map((d) => d.title);
                        }
                      }
                    } catch (e) {}
                    if (docTitles.length === 0) {
                      docTitles = Array.isArray(currentDoctor?.permittedDocuments)
                        ? currentDoctor.permittedDocuments.map((d) => typeof d === 'string' ? d : d?.title || 'Record')
                        : ['Vitals & Medications'];
                    }
                    return docTitles.join(', ');
                  })()}
                </span>
              </div>
            </div>

            {/* Specialist Referral Card (if recommended by attending physician) */}
            {activeProfileKey === 'sarita' && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded">
                        Specialist Referral Recommendation
                      </span>
                      <span className="text-[10px] text-slate-400">From Dr. Sunita Rao</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      Recommended: Dr. Rajesh Khanna (Rheumatology & Joint Care, Max Healthcare)
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Advised for specialized musculoskeletal review of morning knee stiffness and localized swelling.
                    </p>
                  </div>
                </div>

                <Link
                  to="/doctors"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <span>View in Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Disclosed Reports & Documents Box in Doctor's EMR */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Disclosed Reports & Documents in {currentDoctor.doctorName.split('(')[0].trim()}'s EMR
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Transmitted directly to physician clinical workstation with cryptographic vault verification.
                    </p>
                  </div>
                </div>

                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F7F3] hover:bg-[#D5F2E9] text-[#008985] rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Share Document from Vault</span>
                </Link>
              </div>

              {/* Document Cards Grid */}
              {getCurrentDoctorDisclosedDocs().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getCurrentDoctorDisclosedDocs().map((doc, idx) => (
                    <div
                      key={doc.docId || idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-[#F9FBFA] hover:border-[#00A896]/60 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#013A40] shrink-0 group-hover:border-[#00A896]/40 transition-colors">
                          <FileText className="w-4 h-4 text-[#008985]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#008985] bg-[#E6F7F3] px-1.5 py-0.5 rounded">
                              {doc.category || 'Clinical Record'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> In Doctor's EMR ✓
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 mt-1 truncate" title={doc.title}>
                            {doc.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Delivered: {doc.sharedAt || 'Active'} • Verified by CareCircle Vault
                          </p>
                        </div>
                      </div>

                      <a
                        href={doc.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-[#008985] hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shrink-0 cursor-pointer"
                        title="Inspect Document"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center space-y-1.5 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-600">No documents currently disclosed to this physician.</p>
                  <p className="text-[11px] text-slate-400">
                    Disclose diagnostic records or discharge summaries safely from the Medical Documents section.
                  </p>
                </div>
              )}
            </div>

            {/* Doctor Notes & Discussion Feed (Strictly for this Doctor) */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Doctor's Clinical Notes & Discussion Thread
              </span>

              {(currentDoctor.doctorNotes || []).map((note, index) => {
                const isFromDoctor = note.sender !== 'family';
                const isPendingReview = isFromDoctor && note.status !== 'acknowledged';

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl space-y-2 border transition-all ${
                      isPendingReview
                        ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                        : isFromDoctor
                        ? 'bg-white border-slate-100 shadow-2xs'
                        : 'bg-[#E6F7F3]/40 border-[#00A896]/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                            isFromDoctor ? 'bg-[#013A40] text-white' : 'bg-[#00A896] text-white'
                          }`}
                        >
                          {isFromDoctor ? 'Attending Physician' : 'Family Caregiver'}
                        </span>
                        <strong className="text-slate-900 font-bold">
                          {note.authorName || note.doctorName || currentDoctor.doctorName}
                        </strong>
                        <span className="text-slate-400">• {note.createdAt}</span>
                      </div>

                      {/* Acknowledge Action or Status */}
                      <div className="flex items-center gap-2">
                        {isPendingReview ? (
                          <button
                            onClick={() => handleAcknowledgeFromDashboard(currentDoctor._id)}
                            className="px-3 py-1 bg-[#013A40] hover:bg-[#024D55] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896]" />
                            <span>Mark as Read & Acknowledge</span>
                          </button>
                        ) : isFromDoctor ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Acknowledged by Family
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> Pending Doctor Review
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-medium pl-1">
                      "{note.comment}"
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Direct Query Input strictly for this Doctor */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask ${currentDoctor.doctorName} a question or report symptoms...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008985] font-medium"
                value={doctorReplyInput}
                onChange={(e) => setDoctorReplyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendDoctorQuery(currentDoctor._id);
                  }
                }}
              />
              <button
                onClick={() => handleSendDoctorQuery(currentDoctor._id)}
                disabled={!doctorReplyInput.trim()}
                className="px-4 py-2.5 bg-[#013A40] hover:bg-[#024D55] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5 text-[#00A896]" />
                <span>Send to {(currentDoctor?.doctorName || 'Doctor').split(' ')[1] || currentDoctor?.doctorName || 'Doctor'}</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 3. Bottom Two Columns matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Medication Routine (2 cols wide) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
                <Pill className="w-5 h-5 text-[#00A896]" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900 leading-tight">
                  Medication Routine
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily dosage tracker and checklist
                </p>
              </div>
            </div>

            <Link
              to="/medications"
              className="text-xs font-bold text-[#013A40] hover:text-[#008985] inline-flex items-center gap-1"
            >
              All Meds →
            </Link>
          </div>

          {/* Member Dosage Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Member:
            </span>
            {familyKeys.map((k) => {
              const reg = MEMBER_DATA_REGISTRY[k];
              const isSelected = activeProfileKey === k;
              return (
                <button
                  key={k}
                  onClick={() => setActiveTabMember(k)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#013A40] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                  }`}
                >
                  {reg.fullName.split(' ')[0]} ({reg.relation})
                </button>
              );
            })}
          </div>

          {/* Doses Checklist Items */}
          <div className="space-y-3 pt-1">
            {doses.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#F7FAF9] border border-slate-200/70 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">
                  No Daily Prescription Medications Required
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {activeProfile.fullName} is on <strong>Preventive Wellness</strong>. Documented medical allergies, past treatments, and annual screenings are securely maintained in their profile.
                </p>
                <Link
                  to="/medications"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#008985] hover:underline pt-1"
                >
                  <span>View Medical Profile & Clinical History →</span>
                </Link>
              </div>
            ) : (
              doses.map((item) => {
                const isTaken = item.status === 'taken';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleDose(item.id)}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Checkbox square matching screenshot */}
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                          isTaken
                            ? 'border-[#008985] bg-[#008985] text-white'
                            : 'border-slate-300 bg-white hover:border-[#008985]'
                        }`}
                      >
                        {isTaken && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">
                            {item.medicineName}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            Prescribed: {item.dailyLimit || 1} dose/day
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="font-medium text-slate-600">{item.dosage}</span>
                          <span className="text-slate-300">•</span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${item.slotBadge || 'bg-[#E8F8F3] text-[#008985]'}`}>
                            {item.slot === 'Night' ? (
                              <Moon className="w-3 h-3" />
                            ) : (
                              <Sun className="w-3 h-3" />
                            )}
                            {item.slot}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">{item.foodRelation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status pill matching screenshot */}
                    <div>
                      {isTaken ? (
                        <span className="bg-[#D9F2EB] text-[#008985] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          Taken
                        </span>
                      ) : (
                        <span className="bg-[#FEF3E2] text-[#D97706] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Doctor Comments & Remarks + Allergies & Alerts + Chronic Illnesses */}
        <div className="space-y-6">
          
          {/* Card 1: Attending Doctor's Clinical Comments & Remarks */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
                  <Stethoscope className="w-4.5 h-4.5 text-[#00A896]" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900 leading-tight">
                    Doctor's Comments
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {currentDoctor?.doctorName || 'Doctor'}
                  </p>
                </div>
              </div>

              {pendingDoctorNote ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" /> Pending Review
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Acknowledged
                </span>
              )}
            </div>

            {/* Quick Doctor Switcher for Member's Doctors */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl">
              {(consultations || []).map((d) => (
                <button
                  key={d?._id || Math.random()}
                  onClick={() => d?._id && setSelectedDoctorId(d._id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold truncate transition-all cursor-pointer ${
                    selectedDoctorId === d?._id
                      ? 'bg-white text-[#013A40] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {(d?.doctorName || 'Doctor').split(' ')[1] || d?.doctorName || 'Doctor'}
                </button>
              ))}
            </div>

            {/* Doctor Note Box */}
            <div className={`p-4 rounded-2xl space-y-2 border transition-all ${
              pendingDoctorNote
                ? 'bg-amber-50/70 border-amber-200'
                : 'bg-[#F7FAF9] border-slate-100'
            }`}>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <strong className="text-[#013A40] font-bold">
                  {currentDoctor?.doctorName || 'Doctor'}
                </strong>
                <span className="text-[10px] text-slate-400">
                  {currentDoctor?.doctorNotes?.[0]?.createdAt || 'Today'}
                </span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                "{currentDoctor?.doctorNotes?.[0]?.comment || 'Clinical telemetry stable. Continue current dietary guidelines and prescribed dosage.'}"
              </p>

              {pendingDoctorNote && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-amber-800 font-semibold">Action required by family</span>
                  <button
                    onClick={() => handleAcknowledgeFromDashboard(currentDoctor?._id)}
                    className="px-3 py-1 bg-[#013A40] hover:bg-[#024D55] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#00A896]" />
                    <span>Acknowledge Advice</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                document.getElementById('attending-doctor-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-[#008985] font-bold hover:underline flex items-center justify-between pt-1 cursor-pointer w-full text-left"
            >
              <span>View Full Clinical Thread Above</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Prescription Supply & Refill Status */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
                  <Pill className="w-4 h-4 text-[#00A896]" />
                </div>
                <h2 className="font-bold text-base text-slate-900">
                  Prescription Supply
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Healthy
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F0FAF9] border border-[#D0EFEA] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Monthly Refill Status</span>
                <span className="text-[#008985]">All Meds Covered</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                All daily doses are in stock. Automated reminders will notify caregivers 5 days prior to prescription expiration.
              </p>
              <div className="pt-1">
                <Link
                  to="/medications"
                  className="text-xs text-[#008985] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Manage Prescriptions & Refills →
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Find Doctors Directory Gateway */}
          <div className="bg-gradient-to-br from-[#013A40] to-[#024D55] text-white rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#80CED7]">
                <Stethoscope className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-white">Find More Doctors</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Explore verified specialists in cardiology, pulmonology, pediatrics, and geriatrics in our directory to initiate new consultations.
            </p>
            <div className="pt-1">
              <Link
                to="/doctors"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#00A896] hover:bg-[#008985] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer gap-1.5"
              >
                <span>Browse Find Doctors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Interactive Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center">
                  <Edit3 className="w-4.5 h-4.5 text-[#008985]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">Edit Member Profile</h3>
                  <p className="text-xs text-slate-500">Update health demographics and care team</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relation Tag</label>
                  <input
                    type="text"
                    required
                    value={editFormData.relation}
                    onChange={(e) => setEditFormData({ ...editFormData, relation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={editFormData.bloodGroup}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Primary Attending Physician</label>
                <input
                  type="text"
                  value={editFormData.primaryDoctor}
                  onChange={(e) => setEditFormData({ ...editFormData, primaryDoctor: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={editFormData.emergencyContactName}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyContactName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={editFormData.emergencyContactPhone}
                    onChange={(e) => setEditFormData({ ...editFormData, emergencyContactPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Link Interactive Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
                  <Share2 className="w-4.5 h-4.5 text-[#008985]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">Share Health & Emergency Links</h3>
                  <p className="text-xs text-slate-500">Secure access tokens for {patient.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Option 1: Emergency Public SOS Link */}
              <div className="p-4 rounded-2xl bg-[#FFF6F6] border border-[#FFDFDF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#881337] flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-[#DC2626]" />
                    Emergency Responder SOS Portal
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded-md">
                    {patient.emergencyCode || 'EMG-RAMESH74'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Instant vital stats, blood group, critical allergies, and primary contact for first responders and ER triage.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/emergency/${patient.emergencyCode || 'EMG-RAMESH74'}`}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-[11px] font-mono text-slate-700"
                  />
                  <button
                    onClick={() => {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(`${window.location.origin}/emergency/${patient.emergencyCode || 'EMG-RAMESH74'}`);
                      }
                      setToastMsg('Copied SOS Link to clipboard!');
                      setTimeout(() => setToastMsg(''), 2500);
                    }}
                    className="px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <Link
                    to={`/emergency/${patient.emergencyCode || 'EMG-RAMESH74'}`}
                    className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-pointer"
                    title="Open View"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Option 2: Doctor Clinical EMR Consultation Portal */}
              <div className="p-4 rounded-2xl bg-[#F0FAF9] border border-[#D5EFEA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#013A40] flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#00A896]" />
                    Physician Clinical EMR Consultation
                  </span>
                  <span className="text-[10px] font-bold bg-[#E6F7F3] text-[#008985] px-2 py-0.5 rounded-md">
                    Doctor Secure Channel
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Full EMR access with selective document authorization and attending doctor consultation thread.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    to="/documents"
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Disclose Records from Medical Vault</span>
                  </Link>

                  <button
                    onClick={() => {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(`${window.location.origin}/doctor-access/demo-doctor-grant-ramesh`);
                      }
                      setToastMsg('Doctor access token link copied!');
                      setTimeout(() => setToastMsg(''), 2500);
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#008985]" />
                    <span>Copy Doctor Link</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Full Member Health Dossier Modal */}
      <MemberHealthModal
        isOpen={Boolean(selectedDossierMember)}
        onClose={() => setSelectedDossierMember(null)}
        member={selectedDossierMember}
        onSelectDashboardMember={(key) => setActiveTabMember(key)}
      />

    </div>
  );
}
