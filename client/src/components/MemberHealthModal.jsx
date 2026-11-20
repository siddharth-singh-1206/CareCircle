import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Phone,
  Droplet,
  Heart,
  AlertTriangle,
  Stethoscope,
  Pill,
  History,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  ExternalLink,
  Printer
} from 'lucide-react';

const CANONICAL_MEMBERS = {
  ramesh: {
    key: 'ramesh',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    age: 74,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyCode: 'EMG-RAMESH74',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Siddharth Sharma',
      relation: 'Grandson / Primary Caregiver',
      phone: '+91 98765 43210',
    },
    isUnderMedicalTreatment: true,
    attendingDoctor: {
      name: 'Dr. Arvind Mehta',
      specialty: 'Cardiology (Interventional Consultant)',
      hospital: 'Apollo Heart & Vascular Institute, Mathura',
      license: 'MCI-CARD-99214',
      status: 'Active Consulting Physician',
      clinicalNote:
        'Reviewed 12-lead ECG and lipid panel. Occasional benign PVCs noted. Blood pressure is well-controlled. Advised low-sodium diet and continuation of Amlodipine 5mg. Schedule follow-up in 14 days.',
      noteTime: 'Today, 08:30 AM',
      pendingReview: true,
    },
    medications: [
      {
        name: 'Amlodipine (Norvasc)',
        dosage: '5 mg',
        slot: 'Morning (08:30 AM)',
        foodRelation: 'After Meal',
        purpose: 'Essential Hypertension & Vasodilation',
        prescribedBy: 'Dr. Arvind Mehta (Apollo)',
      },
      {
        name: 'Metformin Hydrochloride (Glycomet)',
        dosage: '500 mg',
        slot: 'Morning (08:30 AM)',
        foodRelation: 'After Meal',
        purpose: 'Fasting Blood Glucose Regulation',
        prescribedBy: 'Dr. Arvind Mehta (Apollo)',
      },
    ],
    allergies: [
      {
        name: 'Penicillin & Beta-Lactams',
        severity: 'CRITICAL',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        reaction: 'Severe anaphylactic reaction and hives observed during 2018 treatment. Strictly avoid all penicillins, ampicillin, and augmentin.',
      },
      {
        name: 'Sulfa Drugs (Sulfonamides)',
        severity: 'SEVERE',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        reaction: 'Diffuse rash and respiratory distress during 2015 UTI course.',
      },
    ],
    pastTreatments: [
      {
        treatment: 'Drug-Eluting Stent in LAD (PCI)',
        year: '2022',
        facility: 'Apollo Heart Institute, Mathura',
        status: 'Stable arterial patency verified on 2024 angiography review',
      },
      {
        treatment: 'Cataract Phacoemulsification (Left Eye)',
        year: '2020',
        facility: 'Apollo Eye Centre',
        status: 'Visual acuity restored to 6/6',
      },
    ],
  },

  sarita: {
    key: 'sarita',
    fullName: 'Sarita Sharma',
    relation: 'Mother',
    age: 52,
    gender: 'Female',
    bloodGroup: 'A+',
    emergencyCode: 'EMG-SARITA52',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Siddharth Sharma',
      relation: 'Son / Primary Caregiver',
      phone: '+91 98765 43210',
    },
    isUnderMedicalTreatment: true,
    attendingDoctor: {
      name: 'Dr. Sunita Rao',
      specialty: 'Internal Medicine & Clinical Care',
      hospital: 'Fortis Healthcare, Mathura',
      license: 'MCI-IM-66321',
      status: 'Active Consulting Physician',
      clinicalNote:
        'Thyroid profile optimal (TSH 2.2 mIU/L) on Thyronorm 50 mcg once daily. Continue morning dose on empty stomach. Routine physical activity maintained.',
      noteTime: 'Today, 10:15 AM',
      pendingReview: false,
    },
    medications: [
      {
        name: 'Thyronorm (Levothyroxine Sodium)',
        dosage: '50 mcg',
        slot: 'Morning (07:00 AM)',
        foodRelation: 'Empty Stomach',
        purpose: 'Thyroid Hormone Regulation (Target TSH < 2.5 mIU/L)',
        prescribedBy: 'Dr. Sunita Rao (Fortis)',
      },
    ],
    allergies: [
      {
        name: 'Aspirin & NSAIDs (Ibuprofen, Naproxen, Diclofenac)',
        severity: 'MODERATE',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        reaction: 'Severe gastric mucosal erosion, epigastric irritation, and acute urticaria. Paracetamol is well tolerated.',
      },
    ],
    pastTreatments: [
      {
        treatment: 'Laparoscopic Appendectomy',
        year: '2019',
        facility: 'Fortis Hospital, Mathura',
        status: 'Complete surgical recovery, no post-op adhesions',
      },
      {
        treatment: 'Annual Executive Health Screening',
        year: '2024',
        facility: 'Fortis Healthcare',
        status: 'Optimal metabolic, cardiac, liver and kidney biometrics',
      },
    ],
  },

  siddharth: {
    key: 'siddharth',
    fullName: 'Siddharth Sharma',
    relation: 'Self / Caregiver',
    age: 26,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyCode: 'EMG-SIDDHARTH26',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Sarita Sharma',
      relation: 'Mother',
      phone: '+91 98765 11223',
    },
    isUnderMedicalTreatment: false,
    attendingDoctor: null,
    medications: [],
    allergies: [
      {
        name: 'Mild Seasonal Pollen Rhinitis',
        severity: 'MILD',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reaction: 'Occasional spring sneezing. Managed with over-the-counter antihistamine SOS as needed.',
      },
    ],
    pastTreatments: [
      {
        treatment: 'Wisdom Tooth Surgical Extraction',
        year: '2022',
        facility: 'Apollo Dental Centre',
        status: 'Complete uneventful healing',
      },
      {
        treatment: 'Annual Preventive Biometric Screening',
        year: '2024',
        facility: 'Medanta Health Wellness',
        status: 'Optimal vitals: Blood Pressure 118/76 mmHg, Pulse 72 bpm, SpO2 99%',
      },
    ],
  },

  aarav: {
    key: 'aarav',
    fullName: 'Aarav Sharma',
    relation: 'Brother / Dependent',
    age: 8,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyCode: 'EMG-AARAV08',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Sarita Sharma',
      relation: 'Mother',
      phone: '+91 98765 11223',
    },
    isUnderMedicalTreatment: false,
    attendingDoctor: null,
    medications: [],
    allergies: [
      {
        name: 'Peanut & Tree Nut Intolerance',
        severity: 'MODERATE',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        reaction: 'Documented pediatric intolerance. School health sheet updated. Strictly avoid peanut snacks.',
      },
    ],
    pastTreatments: [
      {
        treatment: 'Childhood Immunization Schedule (MMR, DTP, Polio Booster)',
        year: '2016 - 2023',
        facility: 'Rainbow Children’s Hospital',
        status: '100% complete as per national pediatric schedule',
      },
      {
        treatment: 'Annual Pediatric Growth & Developmental Wellness',
        year: '2024',
        facility: 'Rainbow Children’s Hospital',
        status: 'Growth milestone at 75th percentile, visual acuity 6/6',
      },
    ],
  },
};

export default function MemberHealthModal({ isOpen, onClose, member, onSelectDashboardMember }) {
  const navigate = useNavigate();

  if (!isOpen || !member) return null;

  // Determine canonical profile key
  let profileKey = 'ramesh';
  if (typeof member === 'string') {
    profileKey = member.toLowerCase();
  } else if (member.key) {
    profileKey = member.key.toLowerCase();
  } else if (member.fullName || member.name) {
    const name = (member.fullName || member.name || '').toLowerCase();
    const rel = (member.relation || '').toLowerCase();
    if (name.includes('sarita') || rel.includes('mother') || rel.includes('mom')) profileKey = 'sarita';
    else if (name.includes('siddharth') || rel.includes('self') || rel.includes('caregiver')) profileKey = 'siddharth';
    else if (name.includes('aarav') || rel.includes('brother') || rel.includes('child')) profileKey = 'aarav';
    else profileKey = 'ramesh';
  }

  const profile = CANONICAL_MEMBERS[profileKey] || CANONICAL_MEMBERS.ramesh;

  const handleOpenEmergency = () => {
    onClose();
    navigate(`/emergency/${profile.emergencyCode || profile.key}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSwitchToDashboard = () => {
    if (onSelectDashboardMember) {
      onSelectDashboardMember(profile.key);
    }
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Bar */}
        <div className="bg-[#013A40] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#00A896] text-white text-[10px] font-black font-mono shadow-xs">
                {profile.bloodGroup}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{profile.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#E6F7F3] text-xs font-bold">
                  {profile.relation}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1 flex items-center gap-3">
                <span>Age: <strong className="text-white font-semibold">{profile.age} yrs</strong></span>
                <span>•</span>
                <span>Gender: <strong className="text-white font-semibold">{profile.gender}</strong></span>
                <span>•</span>
                <span>Code: <span className="font-mono text-white/90 font-bold">{profile.emergencyCode}</span></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Print Clinical Record Summary"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Clinical Profile Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#F8FAF9] flex-1">
          
          {/* 1. Primary Emergency Contact Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Designated Emergency Contact
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {profile.emergencyContact.name} ({profile.emergencyContact.relation})
                </span>
                <span className="text-xs text-slate-500 block font-mono">
                  {profile.emergencyContact.phone}
                </span>
              </div>
            </div>

            <a
              href={`tel:${profile.emergencyContact.phone}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Contact Now</span>
            </a>
          </div>

          {/* 2. Attending Physician Status */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#008985]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Attending Physician & Clinical Status
                </h3>
              </div>
              {profile.isUnderMedicalTreatment ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-[10px] font-bold">
                  Active Clinical Treatment
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] font-bold">
                  Fit & Well • Healthy Baseline
                </span>
              )}
            </div>

            {profile.attendingDoctor ? (
              <div className="p-3.5 rounded-xl bg-[#F0FAF9] border border-[#D5EFEA] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{profile.attendingDoctor.name}</h4>
                    <p className="text-xs text-slate-600 font-medium">{profile.attendingDoctor.specialty}</p>
                    <p className="text-[11px] text-slate-400">{profile.attendingDoctor.hospital} • License: {profile.attendingDoctor.license}</p>
                  </div>
                  {profile.attendingDoctor.pendingReview ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold self-start sm:self-center">
                      Advice Received Today
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold self-start sm:self-center">
                      Reviewed & Acknowledged
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-[#D5EFEA] text-xs text-slate-700 leading-relaxed italic bg-white/70 p-2.5 rounded-lg">
                  "{profile.attendingDoctor.clinicalNote}"
                </div>

                {/* Verified Reports Delivered to Physician */}
                {(() => {
                  let disclosedDocs = [];
                  try {
                    const saved = localStorage.getItem('carecircle_doctor_disclosures');
                    if (saved) {
                      const parsed = JSON.parse(saved);
                      if (profile.key === 'ramesh') {
                        disclosedDocs = parsed['doc-mehta-01'] || [];
                      } else if (profile.key === 'sarita') {
                        disclosedDocs = parsed['doc-sunita-03'] || [];
                      }
                    }
                  } catch (e) {}

                  if (disclosedDocs.length === 0) {
                    if (profile.key === 'ramesh') {
                      disclosedDocs = [
                        { docId: 'd-1', title: 'Resting 12-Lead ECG Report', category: 'Lab Report', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                        { docId: 'd-2', title: 'Comprehensive Lipid & Fasting Glucose Profile', category: 'Lab Report', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                      ];
                    } else if (profile.key === 'sarita') {
                      disclosedDocs = [
                        { docId: 'd-3', title: 'Appendectomy Surgical Discharge Summary', category: 'Discharge Summary', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                        { docId: 'd-4', title: 'Annual Executive Health Panel (2024)', category: 'Lab Report', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                      ];
                    }
                  }

                  if (disclosedDocs.length === 0) return null;

                  return (
                    <div className="mt-3 pt-3 border-t border-[#D5EFEA] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Verified Reports Delivered to {profile.attendingDoctor.name}:
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                          {disclosedDocs.length} Active in EMR
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {disclosedDocs.map((doc, dIdx) => (
                          <div
                            key={doc.docId || dIdx}
                            className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold uppercase text-[#008985] block truncate">
                                {doc.category || 'Report'} • In Doctor's EMR ✓
                              </span>
                              <strong className="text-slate-800 text-[11px] block truncate" title={doc.title}>
                                {doc.title}
                              </strong>
                            </div>
                            <a
                              href={doc.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 bg-[#E6F7F3] hover:bg-[#D5F2E9] text-[#008985] rounded text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Clinical Discussion & Responses between Member and Doctor */}
                {(() => {
                  let discussionNotes = [];
                  try {
                    const saved = localStorage.getItem('carecircle_member_consultations');
                    if (saved) {
                      const parsed = JSON.parse(saved);
                      const doctors = parsed[profile.key] || [];
                      if (doctors[0]?.doctorNotes && doctors[0].doctorNotes.length > 0) {
                        discussionNotes = doctors[0].doctorNotes;
                      }
                    }
                  } catch (e) {}

                  if (discussionNotes.length === 0) {
                    discussionNotes = [
                      {
                        id: 'initial-doc-note',
                        sender: 'doctor',
                        doctorName: profile.attendingDoctor.name,
                        comment: profile.attendingDoctor.clinicalNote,
                        createdAt: profile.attendingDoctor.noteTime || 'Today, 08:30 AM',
                      },
                    ];
                  }

                  return (
                    <div className="mt-3 pt-3 border-t border-[#D5EFEA] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Doctor's Advice & Patient Discussion Thread:
                        </span>
                        <span className="text-[10px] font-bold text-[#008985] bg-[#E6F7F3] px-2 py-0.5 rounded">
                          {discussionNotes.length} Messages
                        </span>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {discussionNotes.map((note, nIdx) => (
                          <div
                            key={note.id || nIdx}
                            className={`p-3 rounded-xl text-xs space-y-1.5 border transition-all ${
                              note.sender !== 'family'
                                ? 'bg-white border-[#D5EFEA] shadow-2xs'
                                : 'bg-[#E6F7F3]/40 border-[#00A896]/20'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                                  note.sender !== 'family' ? 'bg-[#013A40] text-white' : 'bg-[#00A896] text-white'
                                }`}>
                                  {note.sender !== 'family' ? 'Doctor' : 'Family'}
                                </span>
                                <strong className="text-slate-900">
                                  {note.sender !== 'family' ? note.doctorName || profile.attendingDoctor.name : 'Caregiver'}
                                </strong>
                              </div>
                              <span className="text-slate-400">{note.createdAt || 'Recent'}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed italic">
                              "{note.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">No Attending Physician Required</strong>
                  <span>Member is in optimal health. Routine vitals and pediatric or caregiver wellness baselines are maintained with zero active medical treatments.</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Daily Active Medications */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#00A896]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Daily Prescriptions
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {profile.medications.length} {profile.medications.length === 1 ? 'Medication' : 'Medications'}
              </span>
            </div>

            {profile.medications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.medications.map((med, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-[#FBFDFD] space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900">{med.name}</strong>
                      <span className="px-2 py-0.5 rounded-md bg-[#E8F8F3] text-[#008985] text-[10px] font-bold font-mono">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Timing: <strong className="text-slate-700">{med.slot}</strong> • {med.foodRelation}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Indication: {med.purpose}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No daily prescription medications required for this profile.</span>
              </div>
            )}
          </div>

          {/* 4. Documented Allergies & Contraindications */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Documented Allergies & Drug Contraindications
              </h3>
            </div>

            <div className="space-y-2">
              {profile.allergies.map((alg, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{alg.name}</strong>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${alg.badgeClass}`}>
                      {alg.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {alg.reaction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Medical History & Past Treatments */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-[#013A40]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Medical History & Resolved Past Treatments
              </h3>
            </div>

            <div className="space-y-2">
              {profile.pastTreatments.map((pt, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <strong className="text-slate-900 font-bold block">{pt.treatment}</strong>
                    <span className="text-slate-500 text-[11px]">{pt.facility} • {pt.status}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold font-mono self-start sm:self-auto shrink-0">
                    {pt.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleOpenEmergency}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-rose-600" />
            <span>Open Public Emergency QR Profile</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSwitchToDashboard}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#008985] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Track in Dashboard</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
