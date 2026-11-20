import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldAlert,
  Phone,
  Droplet,
  AlertTriangle,
  Pill,
  Printer,
  CreditCard,
  User,
  ArrowLeft,
  Check,
  Stethoscope,
  Info
} from 'lucide-react';

// Comprehensive Emergency Profiles with clinically verified details
const EMERGENCY_PROFILES = {
  ramesh: {
    id: 'ramesh',
    emergencyCode: 'EMG-RAMESH74',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    age: 74,
    gender: 'Male',
    dateOfBirth: '1952-08-15',
    bloodGroup: 'B+',
    seriousEmergency: {
      condition: 'Critical Penicillin Anaphylaxis & Acute Coronary Risk',
      riskLevel: 'CRITICAL',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      summary: 'Patient has documented severe penicillin allergy (anaphylaxis) and history of coronary artery disease with stent in LAD.',
      protocols: [
        'STRICT CONTRAINDICATION: Under NO circumstances administer Penicillin, Ampicillin, Amoxicillin, or any beta-lactam antibiotics. Immediate fatal anaphylaxis shock hazard.',
        'In case of acute chest tightness or angina: Administer sublingual Sorbitrate/Nitroglycerin (5mg) immediately. Keep patient rested in semi-upright position.',
        'Maintain supplemental oxygen if SpO2 drops below 94%. Call Apollo ER Ambulance Helpline (1066) immediately.'
      ]
    },
    emergencyContact: {
      name: 'Siddharth Sharma',
      relation: 'Grandson / Primary Caregiver',
      phone: '+91 98765 43210',
      altPhone: '+91 98765 11223'
    },
    attendingDoctors: [
      {
        name: 'Dr. Arvind Mehta',
        specialty: 'Interventional Cardiology (Consultant)',
        hospital: 'Apollo Heart & Vascular Institute, Mathura',
        doctorPhone: '+91 98111 22334',
        hospitalErPhone: '1066',
        instructions: 'Drug-eluting stent (DES) placed in LAD (2022). On daily antiplatelet therapy (Ecosprin 75mg). In case of acute cardiac symptoms, direct cath-lab activation via Apollo ER (1066).'
      },
      {
        name: 'Dr. Rajesh Khanna',
        specialty: 'Internal Medicine & Diabetology',
        hospital: 'Fortis Hospital, Mathura',
        doctorPhone: '+91 98222 33445',
        hospitalErPhone: '105010',
        instructions: 'Type 2 Diabetes Mellitus managed with Metformin 500mg BID. Monitor capillary blood glucose during any emergency hospital admission.'
      }
    ],
    criticalAllergies: [
      {
        id: 'a1',
        title: 'Penicillin & Beta-Lactam Antibiotics',
        severity: 'Critical',
        reaction: 'Severe anaphylactic shock, laryngeal edema, hives, vascular collapse.',
        notes: 'Strictly avoid all penicillin class, ampicillin, augmentin. Use macrolides or fluoroquinolones instead.'
      },
      {
        id: 'a2',
        title: 'Sulfa Drugs (Sulfonamides)',
        severity: 'Severe',
        reaction: 'Diffuse skin rash and respiratory distress.',
        notes: 'Reported in 2015 during UTI treatment.'
      }
    ],
    chronicConditions: [
      { title: 'Coronary Artery Disease (CAD)', notes: 'Post-PCI stent in LAD (2022)' },
      { title: 'Type 2 Diabetes Mellitus', notes: 'Managed with Metformin 500mg twice daily' },
      { title: 'Primary Hypertension', notes: 'Target BP 120-130 / 80 mmHg' }
    ],
    activeMedications: [
      { name: 'Amlodipine (Norvasc)', dosage: '5 mg', frequency: 'Once daily (Morning)', purpose: 'Hypertension' },
      { name: 'Metformin Hydrochloride (Glycomet)', dosage: '500 mg', frequency: 'Once daily with meals', purpose: 'Blood Sugar Regulation' },
    ]
  },

  sarita: {
    id: 'sarita',
    emergencyCode: 'EMG-SARITA84',
    fullName: 'Sarita Sharma',
    relation: 'Mother',
    age: 52,
    gender: 'Female',
    dateOfBirth: '1974-11-20',
    bloodGroup: 'A+',
    seriousEmergency: {
      condition: 'Severe NSAID & Aspirin Gastrointestinal Anaphylactoid Risk',
      riskLevel: 'CRITICAL',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      summary: 'Patient has severe hypersensitivity to NSAIDs/Aspirin. Past history of laparoscopic appendectomy (2019, Fortis Hospital).',
      protocols: [
        'STRICT CONTRAINDICATION: Do NOT administer Aspirin, Ibuprofen, Diclofenac, Naproxen, or any NSAIDs. Extreme risk of acute gastric mucosal erosion and upper GI bleeding.',
        'For acute analgesia or fever, use Paracetamol (Acetaminophen) 500mg to 650mg ONLY.',
        'In case of accidental NSAID ingestion or severe acute epigastric pain, initiate IV Pantoprazole 40mg and contact Fortis ER (105010).'
      ]
    },
    emergencyContact: {
      name: 'Siddharth Sharma',
      relation: 'Son / Primary Caregiver',
      phone: '+91 98765 43210',
      altPhone: '+91 98765 11223'
    },
    attendingDoctors: [
      {
        name: 'Dr. Sunita Rao',
        specialty: 'Internal Medicine & Rheumatology',
        hospital: 'Fortis Hospital, Mathura',
        doctorPhone: '+91 98333 44556',
        hospitalErPhone: '105010',
        instructions: 'Patient on Thyronorm 50 mcg once daily (Morning, Empty Stomach). In case of accidental NSAID ingestion or severe acute epigastric pain, initiate IV Pantoprazole 40mg and contact Fortis ER (105010).'
      }
    ],
    criticalAllergies: [
      {
        id: 'a3',
        title: 'NSAIDs (Ibuprofen, Diclofenac, Aspirin, Naproxen)',
        severity: 'Critical',
        reaction: 'Severe gastric erosion, acute peptic mucosal bleeding, diffuse urticaria.',
        notes: 'Strictly avoid all non-steroidal anti-inflammatory drugs. Paracetamol is well tolerated.'
      }
    ],
    chronicConditions: [
      { title: 'Past Surgical Treatment: Appendectomy (2019)', notes: 'Laparoscopic procedure at Fortis Hospital. Fully resolved.' },
      { title: 'Thyroid Maintenance', notes: 'TSH stable on Thyronorm 50 mcg daily' }
    ],
    activeMedications: [
      { name: 'Thyronorm (Levothyroxine Sodium)', dosage: '50 mcg', frequency: 'Once daily (Morning, Empty Stomach)', purpose: 'Thyroid Hormone Regulation' },
    ]
  },

  siddharth: {
    id: 'siddharth',
    emergencyCode: 'EMG-SIDDHARTH26',
    fullName: 'Siddharth Sharma',
    relation: 'Self',
    age: 26,
    gender: 'Male',
    dateOfBirth: '1998-04-12',
    bloodGroup: 'O+',
    seriousEmergency: null,
    emergencyContact: {
      name: 'Sarita Sharma',
      relation: 'Mother',
      phone: '+91 98765 11223',
      altPhone: '+91 98765 43210'
    },
    attendingDoctors: [],
    criticalAllergies: [
      {
        id: 'a4',
        title: 'Mild Seasonal Pollen Rhinitis',
        severity: 'Mild',
        reaction: 'Mild sneezing and nasal congestion during spring pollination.',
        notes: 'Over-the-counter antihistamine SOS as needed.'
      }
    ],
    chronicConditions: [
      { title: 'Caregiver • Healthy Baseline', notes: 'Routine biometrics optimal (BP 118/76 mmHg, Pulse 72 bpm).' }
    ],
    activeMedications: []
  },

  aarav: {
    id: 'aarav',
    emergencyCode: 'EMG-AARAV08',
    fullName: 'Aarav Sharma',
    relation: 'Brother',
    age: 8,
    gender: 'Male',
    dateOfBirth: '2016-09-10',
    bloodGroup: 'O+',
    seriousEmergency: null,
    emergencyContact: {
      name: 'Sarita Sharma',
      relation: 'Mother',
      phone: '+91 98765 11223',
      altPhone: '+91 98765 43210'
    },
    attendingDoctors: [],
    criticalAllergies: [
      {
        id: 'a5',
        title: 'Peanut & Tree Nut Intolerance',
        severity: 'Moderate',
        reaction: 'Oral itching and mild hives on accidental contact.',
        notes: 'Strict dietary exclusion at school and home.'
      }
    ],
    chronicConditions: [
      { title: 'Healthy Child • Pediatric Growth 75th %', notes: 'Complete national immunization series. Normal developmental milestones.' }
    ],
    activeMedications: []
  }
};

export default function EmergencyView() {
  const { code } = useParams();
  const navigate = useNavigate();

  // Resolve which member corresponds to code or default to ramesh
  const resolveInitialMemberKey = () => {
    if (!code) return 'ramesh';
    const lower = code.toLowerCase();
    if (lower.includes('sarita')) return 'sarita';
    if (lower.includes('siddharth')) return 'siddharth';
    if (lower.includes('aarav')) return 'aarav';
    return 'ramesh';
  };

  const [selectedMemberKey, setSelectedMemberKey] = useState(resolveInitialMemberKey());
  const [showWalletCard, setShowWalletCard] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // When code URL parameter changes, re-sync member
  useEffect(() => {
    if (code) {
      const lower = code.toLowerCase();
      if (lower.includes('sarita')) setSelectedMemberKey('sarita');
      else if (lower.includes('siddharth')) setSelectedMemberKey('siddharth');
      else if (lower.includes('aarav')) setSelectedMemberKey('aarav');
      else setSelectedMemberKey('ramesh');
    }
  }, [code]);

  const profile = EMERGENCY_PROFILES[selectedMemberKey] || EMERGENCY_PROFILES.ramesh;
  const currentEmergencyUrl = `${window.location.origin}/emergency/${profile.emergencyCode}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(currentEmergencyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF5F4] text-slate-800 pb-16">
      
      {/* Top Calm Action Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Back to Dashboard inside same tab */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#013A40] hover:text-[#00A896] bg-[#F0FAF9] hover:bg-[#E2F5F2] px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Return to Main Family Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Central Title */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              CareCircle Emergency Medical Triage
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWalletCard(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-rose-600" />
              <span>Wallet Card</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Member Selector Chips: Clean, Uncrowded & Obvious */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xs border border-slate-200/70">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
            <span>Select Person with Serious Emergency Profile:</span>
            <span className="text-[10px] text-slate-400 font-medium">Click to switch patient record</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(EMERGENCY_PROFILES).map((m) => {
              const isActive = m.id === selectedMemberKey;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMemberKey(m.id);
                    navigate(`/emergency/${m.emergencyCode}`, { replace: true });
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#013A40] text-white shadow-md ring-2 ring-[#00A896]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold truncate">{m.fullName}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {m.bloodGroup}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isActive ? 'text-[#80CED7]' : 'text-slate-500 font-medium'}>
                      {m.relation}
                    </span>
                    <span
                      className={`text-[9px] font-semibold uppercase ${
                        isActive ? 'text-amber-300' : 'text-rose-600'
                      }`}
                    >
                      Emergency Profile
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Card: Patient Primary Identification & Blood Group */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/70 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80">
                    Serious Emergency Profile
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• Age {profile.age}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {profile.fullName}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Relation: <strong className="text-slate-700">{profile.relation}</strong> • Gender: <strong className="text-slate-700">{profile.gender}</strong> • DOB: {profile.dateOfBirth}
                </p>
              </div>
            </div>

            {/* Blood Group & Emergency ID Tag */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[10px] uppercase font-bold text-rose-600 block tracking-wider">Blood Group</span>
                <div className="text-2xl font-black text-rose-600 flex items-center justify-center gap-1 mt-0.5 font-mono">
                  <Droplet className="w-5 h-5 fill-rose-500 text-rose-500" />
                  <span>{profile.bloodGroup}</span>
                </div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Emergency Code</span>
                <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
                  {profile.emergencyCode}
                </span>
              </div>
            </div>
          </div>

          {/* CRITICAL EMERGENCY & LIFE-SAVING PROTOCOL BOX */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-rose-50/40 border border-rose-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Critical Emergency: {profile.seriousEmergency.condition}
                </h2>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${profile.seriousEmergency.badgeColor}`}>
                {profile.seriousEmergency.riskLevel}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-rose-100">
              <strong className="text-slate-900">Emergency Overview: </strong>
              {profile.seriousEmergency.summary}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                Immediate Action Protocol for First Responders & Caregivers:
              </span>
              <div className="space-y-2">
                {profile.seriousEmergency.protocols.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-800 bg-white p-3 rounded-xl border border-rose-100 shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TWO PRIMARY CONTACT PILLARS: EMERGENCY CONTACT & ATTENDING DOCTORS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pillar 1: Family Emergency Contact Person */}
            <div className="p-5 rounded-2xl bg-[#F0FAF9] border border-[#CDEAE5] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#008985] mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Primary Emergency Contact Person
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {profile.emergencyContact.name}
                </h3>
                <span className="text-xs text-slate-600 font-medium">
                  {profile.emergencyContact.relation}
                </span>
                <div className="mt-3 text-xs font-mono font-bold text-slate-800">
                  Phone: {profile.emergencyContact.phone}
                  {profile.emergencyContact.altPhone && (
                    <span className="block text-slate-500 font-normal">
                      Alt: {profile.emergencyContact.altPhone}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={`tel:${profile.emergencyContact.phone}`}
                className="w-full py-2.5 px-4 bg-[#013A40] hover:bg-[#00A896] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency Contact</span>
              </a>
            </div>

            {/* Pillar 2: Attending Doctor & Hospital ER Helpline */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Primary Attending Doctor & Hospital
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {profile.attendingDoctors[0]?.name}
                </h3>
                <span className="text-xs text-slate-600 font-medium block">
                  {profile.attendingDoctors[0]?.specialty}
                </span>
                <span className="text-xs text-slate-600 font-medium block mt-0.5">
                  <strong className="text-slate-800">Hospital: </strong>
                  {profile.attendingDoctors[0]?.hospital}
                </span>
                <div className="mt-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-amber-200/70">
                  <strong className="text-amber-900">Clinical Protocol: </strong>
                  {profile.attendingDoctors[0]?.instructions}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${profile.attendingDoctors[0]?.doctorPhone}`}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-amber-300 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call Doctor</span>
                </a>
                <a
                  href={`tel:${profile.attendingDoctors[0]?.hospitalErPhone}`}
                  className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer text-center"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>ER ({profile.attendingDoctors[0]?.hospitalErPhone})</span>
                </a>
              </div>
            </div>

          </div>

          {/* Secondary Consulting Doctor if available */}
          {profile.attendingDoctors.length > 1 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Consulting Specialist
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {profile.attendingDoctors[1].name} ({profile.attendingDoctors[1].specialty})
                </span>
                <p className="text-slate-500">{profile.attendingDoctors[1].hospital}</p>
                <p className="text-slate-600 italic mt-0.5">{profile.attendingDoctors[1].instructions}</p>
              </div>
              <a
                href={`tel:${profile.attendingDoctors[1].doctorPhone}`}
                className="shrink-0 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#008985]" />
                <span>Call {profile.attendingDoctors[1].name}</span>
              </a>
            </div>
          )}

          {/* CRITICAL ALLERGIES SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-rose-600 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                Critical Medical Allergies & Contraindications
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.criticalAllergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>{allergy.title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 text-[10px] font-extrabold uppercase">
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 font-semibold leading-relaxed">
                    Reaction: {allergy.reaction}
                  </p>
                  {allergy.notes && (
                    <p className="text-[11px] text-slate-600 leading-normal">
                      Note: {allergy.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE MEDICATIONS SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[#008985] border-b border-slate-100 pb-2">
              <Pill className="w-4 h-4" />
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                Active Daily Medications & Chronic Conditions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.activeMedications && profile.activeMedications.length > 0 ? (
                profile.activeMedications.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{med.name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Dosage: <strong className="text-slate-800 font-bold">{med.dosage}</strong> • {med.frequency}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#E6F7F3] text-[#008985] shrink-0">
                      {med.purpose}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No active daily medications required (Preventive Wellness baseline). First responders should note documented allergies and surgical history.</span>
                </div>
              )}
            </div>
          </div>

          {/* QR CODE & SHARING BAR */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Paramedic & First Responder Quick Access
              </span>
              <h4 className="text-base font-bold text-slate-900">Emergency SOS Profile QR Code</h4>
              <p className="text-xs text-slate-500 max-w-md">
                Scanning this QR code on any smartphone instantly presents this vital medical profile, contact person, and doctor instructions.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Info className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedLink ? 'Copied Emergency Link!' : 'Copy Emergency Link'}</span>
                </button>
              </div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0">
              <QRCodeSVG value={currentEmergencyUrl} size={110} level="M" />
              <span className="text-[9px] font-mono font-bold text-slate-400 block text-center mt-1">
                {profile.emergencyCode}
              </span>
            </div>
          </div>

        </section>

      </main>

      {/* Printable Physical Wallet ID Card Modal */}
      {showWalletCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 print:shadow-none print:p-0">
            <div className="flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#008985]" />
                <h3 className="font-bold text-slate-900 text-base">Printable Emergency Wallet ID Card</h3>
              </div>
              <button
                onClick={() => setShowWalletCard(false)}
                className="text-xs text-slate-400 hover:text-slate-800 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Physical Wallet Card: 3.375" x 2.125" Credit Card Proportion */}
            <div className="border-2 border-slate-800 rounded-2xl overflow-hidden bg-white shadow-md mx-auto max-w-md print:border-2 print:border-black">
              <div className="bg-rose-700 text-white px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span className="font-black text-xs tracking-wider uppercase">EMERGENCY MEDICAL ID</span>
                </div>
                <span className="bg-white text-rose-700 font-black text-xs px-2 py-0.5 rounded font-mono">
                  BLOOD: {profile.bloodGroup}
                </span>
              </div>

              <div className="p-4 grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
                    <div className="font-black text-base text-slate-900 leading-tight">{profile.fullName}</div>
                    <span className="text-[11px] text-slate-600 font-medium">Relation: {profile.relation} • Age: {profile.age}</span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-rose-600 font-black uppercase block">CRITICAL ALERT:</span>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      {profile.seriousEmergency.condition}
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">EMERGENCY CONTACT:</span>
                    <div className="text-xs font-black text-rose-700 font-mono">
                      {profile.emergencyContact.name}: {profile.emergencyContact.phone}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">DOCTOR & HOSPITAL:</span>
                    <div className="text-[11px] font-bold text-slate-800">
                      {profile.attendingDoctors[0]?.name} ({profile.attendingDoctors[0]?.hospitalErPhone})
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center pl-2 border-l border-slate-200">
                  <QRCodeSVG value={currentEmergencyUrl} size={84} level="M" />
                  <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase font-mono">
                    Scan for Full EMR
                  </span>
                </div>
              </div>

              <div className="bg-slate-100 px-4 py-1.5 flex items-center justify-between text-[9px] text-slate-500 font-medium border-t border-slate-200">
                <span>CareCircle Health SOS Network</span>
                <span className="font-mono font-bold">ID: {profile.emergencyCode}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setShowWalletCard(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical Wallet Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
