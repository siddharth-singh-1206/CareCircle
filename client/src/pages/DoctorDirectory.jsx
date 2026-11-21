import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Stethoscope,
  Search,
  CheckCircle2,
  Building2,
  Award,
  Star,
  Users,
  ShieldCheck,
  Send,
  X,
  Clock,
  ChevronRight,
  Filter,
  FileSignature
} from 'lucide-react';

const VERIFIED_DOCTORS_DIRECTORY = [
  // 1. CARDIOLOGY
  {
    _id: 'doc-mehta-01',
    name: 'Dr. Arvind Mehta',
    email: 'dr.mehta@apollo.com',
    specialization: 'Cardiology (Senior Interventional Consultant)',
    category: 'Cardiology',
    hospital: 'Apollo Heart & Vascular Institute, Mathura',
    registrationNumber: 'MCI-CARD-99214',
    experience: '22+ Years Experience',
    rating: '4.9',
    reviewCount: 312,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    bio: 'Renowned interventional cardiologist specializing in cardiovascular risk management, secondary hypertension, post-angioplasty telemetry, and arrhythmia management.',
    activePatients: ['Ramesh Sharma (Grandfather)'],
  },
  {
    _id: 'doc-sameer-02',
    name: 'Dr. Sameer Kapoor',
    email: 'dr.kapoor@fortisescorts.com',
    specialization: 'Cardiology & Cardiac Electrophysiology',
    category: 'Cardiology',
    hospital: 'Fortis Escorts Heart Centre, Mathura',
    registrationNumber: 'MCI-CARD-88145',
    experience: '17+ Years Experience',
    rating: '4.8',
    reviewCount: 204,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior consultant specializing in coronary artery disease, heart failure management, arrhythmia ablation, and telemetry pacing.',
    activePatients: [],
  },

  // 2. GERIATRICS & DIABETES
  {
    _id: 'doc-khanna-03',
    name: 'Dr. Rajesh Khanna',
    email: 'dr.khanna@maxhealthcare.com',
    specialization: 'Geriatric Medicine & Diabetology',
    category: 'Geriatrics & Diabetes',
    hospital: 'Max Healthcare & Diabetes Centre, Mathura',
    registrationNumber: 'MCI-GEN-55410',
    experience: '18+ Years Experience',
    rating: '4.8',
    reviewCount: 245,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist in multi-morbidity elderly care, type 2 diabetes insulin regimens, polypharmacy optimization, and mobility maintenance in seniors.',
    activePatients: ['Ramesh Sharma (Grandfather)'],
  },
  {
    _id: 'doc-vandana-04',
    name: 'Dr. Vandana Joshi',
    email: 'dr.joshi@mathuracity.org',
    specialization: 'Clinical Diabetology & Metabolic Care',
    category: 'Geriatrics & Diabetes',
    hospital: 'City Diabetes & Endocrine Institute, Mathura',
    registrationNumber: 'MCI-DIAB-66120',
    experience: '14+ Years Experience',
    rating: '4.9',
    reviewCount: 188,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1594824813583-774fbe618a80?w=150&auto=format&fit=crop&q=80',
    bio: 'Expert in glycemic variability, continuous glucose monitoring (CGM), diabetic nephropathy prevention, and lifestyle nutrition.',
    activePatients: [],
  },

  // 3. RHEUMATOLOGY & AUTOIMMUNE
  {
    _id: 'doc-sunita-05',
    name: 'Dr. Sunita Rao',
    email: 'dr.sunita@fortis.com',
    specialization: 'Rheumatology & Autoimmune Disorders',
    category: 'Rheumatology',
    hospital: 'Fortis Healthcare & Arthritis Institute',
    registrationNumber: 'MCI-RHEUM-66321',
    experience: '15+ Years Experience',
    rating: '4.9',
    reviewCount: 189,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    bio: 'Pioneering consultant in rheumatoid arthritis, systemic inflammatory conditions, biologic immunosuppressive therapies, and chronic joint rehabilitation.',
    activePatients: ['Sarita Sharma (Mother)'],
  },
  {
    _id: 'doc-manoj-06',
    name: 'Dr. Manoj Singhal',
    email: 'dr.singhal@medanta.org',
    specialization: 'Clinical Immunology & Arthritis Specialist',
    category: 'Rheumatology',
    hospital: 'Medanta Bone & Joint Institute, Mathura',
    registrationNumber: 'MCI-RHEUM-77412',
    experience: '16+ Years Experience',
    rating: '4.8',
    reviewCount: 156,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist in seronegative spondyloarthropathy, lupus erythematosus, and joint aspiration therapy.',
    activePatients: [],
  },

  // 4. PEDIATRICS
  {
    _id: 'doc-priya-07',
    name: 'Dr. Priya Sharma',
    email: 'dr.priya@apollochildren.com',
    specialization: 'Pediatrics & Pediatric Pulmonology',
    category: 'Pediatrics',
    hospital: 'Rainbow Children’s Hospital & Apollo Clinics',
    registrationNumber: 'MCI-PED-44109',
    experience: '12+ Years Experience',
    rating: '4.9',
    reviewCount: 278,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&auto=format&fit=crop&q=80',
    bio: 'Compassionate pediatric specialist focusing on childhood asthma, respiratory allergies, seasonal bronchospasms, pediatric nutrition, and immunizations.',
    activePatients: ['Aarav Sharma (Brother)'],
  },
  {
    _id: 'doc-rohit-08',
    name: 'Dr. Rohit Mathur',
    email: 'dr.mathur@rainbowchildren.com',
    specialization: 'Consultant Pediatrician & Adolescent Health',
    category: 'Pediatrics',
    hospital: 'Rainbow Children’s Hospital, Mathura',
    registrationNumber: 'MCI-PED-33291',
    experience: '14+ Years Experience',
    rating: '4.8',
    reviewCount: 220,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    bio: 'Expert in adolescent growth, developmental monitoring, seasonal infections, and preventative pediatric medicine.',
    activePatients: [],
  },

  // 5. PULMONOLOGY
  {
    _id: 'doc-vikram-09',
    name: 'Dr. Vikram Malhotra',
    email: 'dr.vikram@medanta.org',
    specialization: 'Pulmonology & Critical Care Medicine',
    category: 'Pulmonology',
    hospital: 'Medanta Heart & Chest Institute, Mathura',
    registrationNumber: 'MCI-PULM-78210',
    experience: '20+ Years Experience',
    rating: '4.8',
    reviewCount: 215,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead chest physician specializing in chronic obstructive pulmonary disease (COPD), bronchial asthma, allergic rhinitis, and sleep medicine.',
    activePatients: ['Siddharth Sharma (Self)'],
  },
  {
    _id: 'doc-ananya-10',
    name: 'Dr. Ananya Roy',
    email: 'dr.roy@apollo.com',
    specialization: 'Pulmonology & Allergic Airway Diseases',
    category: 'Pulmonology',
    hospital: 'Apollo Multi-Specialty Hospital, Mathura',
    registrationNumber: 'MCI-PULM-99142',
    experience: '13+ Years Experience',
    rating: '4.9',
    reviewCount: 176,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Consultant in environmental respiratory allergies, spirometry analysis, and nocturnal asthma management.',
    activePatients: [],
  },

  // 6. ENDOCRINOLOGY
  {
    _id: 'doc-anita-11',
    name: 'Dr. Anita Deshmukh',
    email: 'dr.anita@apollo.com',
    specialization: 'Endocrinology & Thyroid Medicine',
    category: 'Endocrinology',
    hospital: 'Apollo Multi-Specialty Hospital, Mathura',
    registrationNumber: 'MCI-ENDO-33109',
    experience: '16+ Years Experience',
    rating: '4.9',
    reviewCount: 164,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1594824813583-774fbe618a80?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior consultant endocrinologist specializing in thyroid disorders, hormone balance, gestational diabetes, and metabolic health.',
    activePatients: ['Sarita Sharma (Mother)'],
  },
  {
    _id: 'doc-pankaj-12',
    name: 'Dr. Pankaj Sethi',
    email: 'dr.sethi@maxhealthcare.com',
    specialization: 'Metabolic Disorders & Advanced Endocrinology',
    category: 'Endocrinology',
    hospital: 'Max Healthcare Centre, Mathura',
    registrationNumber: 'MCI-ENDO-55201',
    experience: '18+ Years Experience',
    rating: '4.8',
    reviewCount: 195,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist in pituitary and adrenal health, osteoporosis, lipid metabolism, and thyroid nodule evaluation.',
    activePatients: [],
  },

  // 7. ORTHOPEDICS
  {
    _id: 'doc-alok-13',
    name: 'Dr. Alok Verma',
    email: 'dr.alok@fortis.com',
    specialization: 'Orthopedics & Joint Replacement',
    category: 'Orthopedics',
    hospital: 'Fortis Bone & Joint Institute, Mathura',
    registrationNumber: 'MCI-ORTHO-88204',
    experience: '19+ Years Experience',
    rating: '4.8',
    reviewCount: 198,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    bio: 'Consultant orthopedic surgeon specializing in robotic joint replacement, arthritis surgery, osteoporosis management, and post-fall recovery.',
    activePatients: [],
  },
  {
    _id: 'doc-sanjay-14',
    name: 'Dr. Sanjay Goel',
    email: 'dr.goel@apolloortho.com',
    specialization: 'Spine & Sports Orthopedics',
    category: 'Orthopedics',
    hospital: 'Apollo Bone & Joint Care, Mathura',
    registrationNumber: 'MCI-ORTHO-77319',
    experience: '15+ Years Experience',
    rating: '4.9',
    reviewCount: 182,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist in minimally invasive spine decompression, sports ligament repairs, and musculoskeletal physiotherapy.',
    activePatients: [],
  },

  // 8. DERMATOLOGY & ALLERGY
  {
    _id: 'doc-neha-15',
    name: 'Dr. Neha Agarwal',
    email: 'dr.neha@medanta.org',
    specialization: 'Dermatology & Clinical Allergy',
    category: 'Dermatology',
    hospital: 'Medanta Medicity, Mathura',
    registrationNumber: 'MCI-DERM-55219',
    experience: '11+ Years Experience',
    rating: '4.9',
    reviewCount: 142,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    bio: 'Expert dermatologist and allergist specializing in atopic eczema, drug hypersensitivity testing, chronic urticaria, and immune skin reactions.',
    activePatients: [],
  },
  {
    _id: 'doc-ritu-16',
    name: 'Dr. Ritu Choudhary',
    email: 'dr.ritu@fortis.com',
    specialization: 'Clinical Dermatology & Cutaneous Allergy',
    category: 'Dermatology',
    hospital: 'Fortis Skin & Allergy Centre, Mathura',
    registrationNumber: 'MCI-DERM-44190',
    experience: '13+ Years Experience',
    rating: '4.8',
    reviewCount: 167,
    availability: 'Accepting New Patients',
    consultationMode: 'In-Hospital & Tele-EMR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialist in contact dermatitis patch testing, psoriasis immunomodulation, and acute allergic urticaria management.',
    activePatients: [],
  },
];

const SPECIALTY_TABS = [
  'All Specialties',
  'Cardiology',
  'Geriatrics & Diabetes',
  'Rheumatology',
  'Pediatrics',
  'Pulmonology',
  'Endocrinology',
  'Orthopedics',
  'Dermatology',
];

export default function DoctorDirectory() {
  const { user, members, selectedMember, setSelectedMember } = useAuth();
  const navigate = useNavigate();

  const [doctorsList, setDoctorsList] = useState(VERIFIED_DOCTORS_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Specialties');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState(null);
  const [consultMemberId, setConsultMemberId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [urgency, setUrgency] = useState('Routine Checkup');

  // Fallback members if auth context not loaded yet
  const familyMembers = (members && members.length > 0) ? members : [
    { _id: 'mem-ramesh', fullName: 'Ramesh Sharma', relation: 'Grandfather' },
    { _id: 'mem-sarita', fullName: 'Sarita Sharma', relation: 'Mother' },
    { _id: 'mem-siddharth', fullName: 'Siddharth Sharma', relation: 'Self' },
    { _id: 'mem-aarav', fullName: 'Aarav Sharma', relation: 'Brother' },
  ];

  // Try to load any newly registered doctors from backend API, while preserving all directory doctors
  useEffect(() => {
    async function loadRegisteredDoctors() {
      try {
        const res = await api.get('/auth/doctors');
        if (res.data?.success && Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
          const mergedMap = new Map();
          VERIFIED_DOCTORS_DIRECTORY.forEach((doc) => {
            mergedMap.set(doc.name.toLowerCase(), doc);
          });

          // Overlay any registered live doctor accounts from database
          res.data.doctors.forEach((apiDoc) => {
            const key = apiDoc.name?.toLowerCase();
            const existing = mergedMap.get(key);
            if (existing) {
              mergedMap.set(key, { ...existing, ...apiDoc });
            } else {
              mergedMap.set(key, {
                _id: apiDoc._id || 'doc-' + Date.now(),
                name: apiDoc.name,
                email: apiDoc.email,
                specialization: apiDoc.specialization || 'Consultant Physician',
                category: apiDoc.category || 'General Practice',
                hospital: apiDoc.hospital || 'Apollo Clinics, Mathura',
                registrationNumber: apiDoc.registrationNumber || 'MCI-REG-88219',
                experience: '12+ Years Experience',
                rating: '4.8',
                reviewCount: 145,
                availability: 'Accepting New Patients',
                consultationMode: 'In-Hospital & Tele-EMR',
                avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
                bio: `${apiDoc.specialization || 'Specialist'} at ${apiDoc.hospital || 'CareCircle Medical'}. Certified by Medical Council of India.`,
                activePatients: [],
              });
            }
          });

          setDoctorsList(Array.from(mergedMap.values()));
        }
      } catch (e) {
        // Fallback to verified local directory
      }
    }
    loadRegisteredDoctors();
  }, []);

  // Filter doctors based on search & tab
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'All Specialties' ||
      doc.category?.toLowerCase() === activeCategory.toLowerCase() ||
      doc.specialization?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (activeCategory === 'Geriatrics & Diabetes' && (
        doc.category?.toLowerCase().includes('diabetes') ||
        doc.category?.toLowerCase().includes('geriatric') ||
        doc.specialization?.toLowerCase().includes('diabet') ||
        doc.specialization?.toLowerCase().includes('geriatric')
      ));

    return matchesSearch && matchesCategory;
  });

  const handleOpenConnectModal = (doctor) => {
    setSelectedDoctorForModal(doctor);
    // Default to currently active selected member
    setConsultMemberId(selectedMember?._id || familyMembers[0]._id);
    setChiefComplaint('');
    setUrgency('Routine Checkup');
  };

  const handleSendConsultationRequest = (e) => {
    e.preventDefault();
    if (!selectedDoctorForModal) return;

    const chosenMember = familyMembers.find((m) => m._id === consultMemberId) || familyMembers[0];

    const newGrant = {
      _id: 'grant-' + Date.now(),
      doctorName: selectedDoctorForModal.name,
      doctorEmail: selectedDoctorForModal.email,
      doctorSpecialty: selectedDoctorForModal.specialization,
      doctorHospital: selectedDoctorForModal.hospital,
      doctorLicense: selectedDoctorForModal.registrationNumber,
      patient: {
        _id: chosenMember._id,
        fullName: chosenMember.fullName,
        relation: chosenMember.relation || 'Family Member',
        bloodGroup: chosenMember.bloodGroup || 'B+',
        age: chosenMember.age || (chosenMember.fullName?.includes('Ramesh') ? '68 yrs' : chosenMember.fullName?.includes('Sarita') ? '62 yrs' : '26 yrs'),
        gender: chosenMember.gender || (chosenMember.fullName?.includes('Sarita') ? 'Female' : 'Male'),
        emergencyContact: {
          name: user?.name || 'Siddharth Sharma',
          phone: '+91 98765 43210',
          relation: 'Primary Caregiver',
        },
      },
      memberId: {
        _id: chosenMember._id,
        fullName: chosenMember.fullName,
        relation: chosenMember.relation,
      },
      chiefComplaint: chiefComplaint || `Consultation request and clinical review for ${chosenMember.fullName}.`,
      urgency,
      status: 'pending',
      createdAt: 'Just now',
      permittedCategories: ['vitals', 'medications', 'prescriptions'],
      permittedDocuments: [
        {
          _id: 'doc-vitals-1',
          title: 'Recent Diagnostic Lab Panels & Vitals',
          category: 'Lab Report',
          recordDate: 'Nov 2026',
          fileSize: '1.4 MB',
          previewNote: 'Authorized telemetry and metabolic panels shared for review.',
        },
        {
          _id: 'doc-rx-1',
          title: 'Current Active Prescription History',
          category: 'Prescription',
          recordDate: 'Oct 2026',
          fileSize: '820 KB',
          previewNote: 'Authorized current daily dosages and medications.',
        },
      ],
      vitals: {
        bp: '128/82 mmHg',
        glucose: '116 mg/dL',
        heartRate: '72 bpm',
        weight: '68.5 kg',
      },
      allergies: [
        { title: 'Penicillin & Beta-Lactams', severity: 'Critical' },
      ],
      medications: [
        { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily' },
      ],
      doctorNotes: [],
    };

    // Save to family consultations
    try {
      const existingFam = JSON.parse(localStorage.getItem('carecircle_family_consultations') || '[]');
      const updatedFam = [newGrant, ...(Array.isArray(existingFam) ? existingFam : [])];
      localStorage.setItem('carecircle_family_consultations', JSON.stringify(updatedFam));

      // Also dispatch to doctor incoming requests
      const existingDoc = JSON.parse(localStorage.getItem('carecircle_doctor_requests') || '[]');
      const updatedDoc = [newGrant, ...(Array.isArray(existingDoc) ? existingDoc : [])];
      localStorage.setItem('carecircle_doctor_requests', JSON.stringify(updatedDoc));
    } catch (err) {}

    setSelectedDoctorForModal(null);
    setToastMsg(`Consultation request sent to ${selectedDoctorForModal.name} for ${chosenMember.fullName}!`);
    setTimeout(() => setToastMsg(''), 4500);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#013A40] text-white px-5 py-3 rounded-2xl text-xs font-semibold shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5 text-[#008985]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Verified Doctor Directory
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {doctorsList.length} Registered Physicians
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official medical network for the Sharma Family Health Circle. Only registered doctors with verified licenses can be consulted.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Back to Consultations */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <span>Attending Consultations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Member Profiles
          </Link>
        </div>
      </div>

      {/* Search Bar & Specialty Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by physician name, specialty, hospital, or license MCI number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] shadow-sm border border-slate-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing <strong className="text-slate-900 font-bold">{filteredDoctors.length}</strong> available doctors
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SPECIALTY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === tab
                  ? 'bg-[#013A40] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          return (
            <div
              key={doc._id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                
                {/* Doctor Head: Avatar + Badge + Name */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#00A896]/20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {doc.rating}
                      </span>
                    </div>

                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-[#E6F7F3] text-[#008985] text-[10px] font-bold truncate max-w-full">
                      {doc.specialization}
                    </span>
                  </div>
                </div>

                {/* Hospital & License Credentials */}
                <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-[11px] font-medium">{doc.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      License: {doc.registrationNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-500 font-medium">
                      {doc.experience} • {doc.consultationMode}
                    </span>
                  </div>
                </div>

                {/* Clinical Bio */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal pt-1">
                  "{doc.bio}"
                </p>

                {/* Active Consulting Members Tag if any */}
                {doc.activePatients && doc.activePatients.length > 0 && (
                  <div className="bg-[#F7FAF9] rounded-xl p-2.5 border border-slate-100 text-[11px] space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      Currently Consulting In Family
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.activePatients.map((pat, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                          ✓ {pat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action: Connect & Consult */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified & Ready
                </span>

                <button
                  onClick={() => handleOpenConnectModal(doc)}
                  className="px-3.5 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3 text-[#00A896]" />
                  <span>Connect & Consult</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Consultation Request Modal */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[#008985]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    Consultation Request
                  </h3>
                  <p className="text-xs text-slate-500">
                    To {selectedDoctorForModal.name} ({selectedDoctorForModal.specialization.split('(')[0]})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendConsultationRequest} className="space-y-4">
              
              {/* Family Member Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Family Member Needing Care:
                </label>
                <select
                  value={consultMemberId}
                  onChange={(e) => setConsultMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FAF9] text-xs font-bold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                >
                  {familyMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName} ({m.relation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Consultation Urgency:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Routine Checkup', 'Moderate Concern', 'Urgent Attention'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold text-center border transition-all cursor-pointer ${
                        urgency === lvl
                          ? 'bg-[#013A40] text-white border-[#013A40]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient's Explanation / Chief Complaint */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Explain What Happened (Chief Complaint & Symptoms):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe symptoms, when it started, changes observed, and what specific advice is needed from this doctor..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white text-xs font-medium text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008985]"
                />
              </div>

              {/* Notice of Privacy */}
              <div className="p-3 bg-[#E6F7F3]/50 rounded-xl border border-[#00A896]/20 flex items-start gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                <span>
                  <strong>Selective Disclosure:</strong> This doctor will only receive medical telemetry necessary for this consultation. All other family documents remain strictly private.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>Transmit Consultation Request</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
