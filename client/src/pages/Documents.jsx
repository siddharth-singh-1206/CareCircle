import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Calendar,
  FolderLock,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Stethoscope,
  Eye,
  Folder,
  Search,
  User,
  Users,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';

const STORAGE_KEY = 'carecircle_member_documents';

const FAMILY_MEMBERS = [
  {
    key: 'ramesh',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    age: 74,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B+',
  },
  {
    key: 'sarita',
    fullName: 'Sarita Sharma',
    relation: 'Mother',
    age: 52,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'A+',
  },
  {
    key: 'siddharth',
    fullName: 'Siddharth Sharma',
    relation: 'Self / Caregiver',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
  },
  {
    key: 'aarav',
    fullName: 'Aarav Sharma',
    relation: 'Brother / Child',
    age: 8,
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+',
  },
];

const MASTER_MEMBER_DOCUMENTS = {
  ramesh: [
    {
      _id: 'doc-ramesh-1',
      title: 'Resting 12-Lead Electrocardiogram (ECG) Report',
      category: 'Scan/X-Ray',
      recordDate: '2026-11-10',
      doctorOrLab: 'Apollo Heart & Vascular Institute (Dr. Arvind Mehta)',
      fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
      notes: 'Occasional benign PVCs noted. Normal sinus rhythm, rate 74 bpm. Stent patency in LAD intact.',
    },
    {
      _id: 'doc-ramesh-2',
      title: 'Comprehensive Fasting Lipid & Glycemic Panel (HbA1c)',
      category: 'Lab Report',
      recordDate: '2026-10-25',
      doctorOrLab: 'Dr. Lal PathLabs (Central Processing Unit)',
      fileUrl: 'http://localhost:5000/uploads/sample-hba1c-report.pdf',
      notes: 'HbA1c: 6.8%. Fasting Blood Glucose: 118 mg/dL. Total Cholesterol: 168 mg/dL.',
    },
    {
      _id: 'doc-ramesh-3',
      title: 'Cardiology Clinical Consultation & Prescription Slip',
      category: 'Prescription',
      recordDate: '2026-11-08',
      doctorOrLab: 'Dr. Arvind Mehta (Cardiology, Apollo)',
      fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
      notes: 'Prescribed Amlodipine 5mg and continuation of Metformin 500mg. Low-sodium diet advised.',
    },
  ],
  sarita: [
    {
      _id: 'doc-sarita-1',
      title: 'Laparoscopic Appendectomy Discharge Summary',
      category: 'Discharge Summary',
      recordDate: '2019-10-18',
      doctorOrLab: 'Fortis Hospital Mathura (Dept of General Surgery)',
      fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
      notes: 'Uneventful post-operative course. Complete wound healing with no secondary peritoneal adhesions.',
    },
    {
      _id: 'doc-sarita-2',
      title: 'Comprehensive Annual Executive Health Checkup Panel',
      category: 'Lab Report',
      recordDate: '2024-05-12',
      doctorOrLab: 'Fortis Healthcare Diagnostics',
      fileUrl: 'http://localhost:5000/uploads/sample-hba1c-report.pdf',
      notes: 'TSH: 2.2 mIU/L (Optimal on Thyronorm 50 mcg). Complete blood count, liver and kidney parameters normal.',
    },
    {
      _id: 'doc-sarita-3',
      title: 'Internal Medicine & Thyroid Prescription Slip',
      category: 'Prescription',
      recordDate: '2026-10-02',
      doctorOrLab: 'Dr. Sunita Rao (Internal Medicine, Fortis)',
      fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
      notes: 'Thyronorm 50 mcg once daily on empty stomach. Strict avoidance of NSAIDs / Aspirin reaffirmed.',
    },
  ],
  siddharth: [
    {
      _id: 'doc-siddharth-1',
      title: 'Caregiver Annual Preventive Biometric Screening',
      category: 'Lab Report',
      recordDate: '2024-08-20',
      doctorOrLab: 'Medanta Health & Preventive Care Centre',
      fileUrl: 'http://localhost:5000/uploads/sample-hba1c-report.pdf',
      notes: 'Blood Pressure: 118/76 mmHg. Resting Heart Rate: 72 bpm. SpO2: 99%. Healthy baseline established.',
    },
    {
      _id: 'doc-siddharth-2',
      title: 'Dental Maxillofacial Surgical Clearance Note',
      category: 'Discharge Summary',
      recordDate: '2022-04-14',
      doctorOrLab: 'Apollo Dental Centre (Oral Surgery Dept)',
      fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
      notes: 'Impacted third molar (wisdom tooth) extraction. Socket healed with no complications.',
    },
  ],
  aarav: [
    {
      _id: 'doc-aarav-1',
      title: 'National Pediatric Immunization & Vaccine Record Card',
      category: 'Vaccine Certificate',
      recordDate: '2023-10-05',
      doctorOrLab: 'Rainbow Children’s Hospital & Apollo Clinics',
      fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
      notes: 'All national pediatric schedule vaccines completed (MMR, DTP, Polio booster, Hepatitis B).',
    },
    {
      _id: 'doc-aarav-2',
      title: 'Annual School Health & Physical Growth Clearance',
      category: 'Lab Report',
      recordDate: '2024-07-15',
      doctorOrLab: 'Rainbow Children’s Hospital (Pediatric Wellness)',
      fileUrl: 'http://localhost:5000/uploads/sample-hba1c-report.pdf',
      notes: 'Height and weight tracking along 75th percentile. Visual acuity 6/6. Nut allergy noted on school emergency sheet.',
    },
  ],
};

const DISCLOSURES_STORAGE_KEY = 'carecircle_doctor_disclosures';

// Attending & Connected Physicians directory per member
const MEMBER_CONNECTED_DOCTORS = {
  ramesh: [
    {
      id: 'doc-mehta-01',
      name: 'Dr. Arvind Mehta',
      specialty: 'Cardiology (Senior Interventional Consultant)',
      hospital: 'Apollo Heart & Vascular Institute, Mathura',
      license: 'MCI-CARD-99214',
      badge: 'Primary Cardiologist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-khanna-02',
      name: 'Dr. Rajesh Khanna',
      specialty: 'Geriatric Medicine & Diabetology',
      hospital: 'Max Healthcare & Diabetes Centre',
      license: 'MCI-GEN-55410',
      badge: 'Consulting Diabetologist',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    },
  ],
  sarita: [
    {
      id: 'doc-sunita-03',
      name: 'Dr. Sunita Rao',
      specialty: 'Internal Medicine & Clinical Care',
      hospital: 'Fortis Healthcare, Mathura',
      license: 'MCI-IM-66321',
      badge: 'Primary Physician',
      avatar: 'https://images.unsplash.com/photo-1594824813583-774fbe618a80?w=150&auto=format&fit=crop&q=80',
    },
  ],
  siddharth: [
    {
      id: 'doc-vikram-05',
      name: 'Dr. Vikram Malhotra',
      specialty: 'General Medicine & Pulmonology',
      hospital: 'Medanta Heart & Chest Institute, Mathura',
      license: 'MCI-PULM-78210',
      badge: 'Network Specialist',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    },
  ],
  aarav: [
    {
      id: 'doc-priya-04',
      name: 'Dr. Priya Sharma',
      specialty: 'Pediatrics & Child Wellness',
      hospital: 'Rainbow Children’s Hospital & Apollo Clinics',
      license: 'MCI-PED-44109',
      badge: 'Pediatric Specialist',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    },
  ],
};

const INITIAL_DISCLOSURES = {
  'doc-mehta-01': [
    { docId: 'doc-ramesh-1', title: 'Resting 12-Lead Electrocardiogram (ECG) Report', memberKey: 'ramesh', sharedAt: '2026-11-16' },
    { docId: 'doc-ramesh-2', title: 'Comprehensive Fasting Lipid & Glycemic Panel (HbA1c)', memberKey: 'ramesh', sharedAt: '2026-11-16' },
  ],
  'doc-sunita-03': [
    { docId: 'doc-sarita-1', title: 'Laparoscopic Appendectomy Discharge Summary', memberKey: 'sarita', sharedAt: '2026-11-18' },
    { docId: 'doc-sarita-2', title: 'Comprehensive Annual Executive Health Checkup Panel', memberKey: 'sarita', sharedAt: '2026-11-18' },
  ],
};

const CATEGORIES = [
  'All',
  'Prescription',
  'Lab Report',
  'Scan/X-Ray',
  'Discharge Summary',
  'Vaccine Certificate',
];

export default function Documents() {
  const { selectedMember: contextSelectedMember } = useAuth();

  // Resolve initial active member tab
  const getInitialMemberKey = () => {
    if (contextSelectedMember?.fullName) {
      const name = contextSelectedMember.fullName.toLowerCase();
      if (name.includes('sarita')) return 'sarita';
      if (name.includes('siddharth')) return 'siddharth';
      if (name.includes('aarav')) return 'aarav';
    }
    return 'ramesh';
  };

  const [activeMemberKey, setActiveMemberKey] = useState(getInitialMemberKey);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareDoctorModal, setShowShareDoctorModal] = useState(false);
  const [documentToShare, setDocumentToShare] = useState(null);
  const [msg, setMsg] = useState('');

  // Per-doctor clinical disclosures map
  const [disclosures, setDisclosures] = useState(() => {
    try {
      const saved = localStorage.getItem(DISCLOSURES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return INITIAL_DISCLOSURES;
  });

  // Per-member isolated documents state with robust localStorage caching
  const [memberDocuments, setMemberDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Merge with defaults to ensure all members have clinical documents
          return {
            ramesh: Array.isArray(parsed.ramesh) && parsed.ramesh.length > 0 ? parsed.ramesh : MASTER_MEMBER_DOCUMENTS.ramesh,
            sarita: Array.isArray(parsed.sarita) && parsed.sarita.length > 0 ? parsed.sarita : MASTER_MEMBER_DOCUMENTS.sarita,
            siddharth: Array.isArray(parsed.siddharth) && parsed.siddharth.length > 0 ? parsed.siddharth : MASTER_MEMBER_DOCUMENTS.siddharth,
            aarav: Array.isArray(parsed.aarav) && parsed.aarav.length > 0 ? parsed.aarav : MASTER_MEMBER_DOCUMENTS.aarav,
          };
        }
      }
    } catch (e) {}
    return MASTER_MEMBER_DOCUMENTS;
  });

  // Save to localStorage whenever documents update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memberDocuments));
    } catch (e) {}
  }, [memberDocuments]);

  // Current active member details
  const activeMember = FAMILY_MEMBERS.find((m) => m.key === activeMemberKey) || FAMILY_MEMBERS[0];
  const currentMemberDocs = memberDocuments[activeMemberKey] || [];

  // Filtered documents for the active member's vault
  const filteredDocs = currentMemberDocs.filter((doc) => {
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.doctorOrLab || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Upload Form State: Must include target family member selector
  const [uploadData, setUploadData] = useState({
    targetMemberKey: activeMemberKey,
    title: '',
    category: 'Prescription',
    recordDate: new Date().toISOString().split('T')[0],
    doctorOrLab: '',
    notes: '',
    file: null,
  });

  // Keep upload target synced when opening modal
  const openUploadModal = () => {
    setUploadData({
      targetMemberKey: activeMemberKey,
      title: '',
      category: 'Prescription',
      recordDate: new Date().toISOString().split('T')[0],
      doctorOrLab: '',
      notes: '',
      file: null,
    });
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const targetKey = uploadData.targetMemberKey;
    const targetMemberObj = FAMILY_MEMBERS.find((m) => m.key === targetKey);

    const newDoc = {
      _id: `doc-${targetKey}-${Date.now()}`,
      title: uploadData.title,
      category: uploadData.category,
      recordDate: uploadData.recordDate,
      doctorOrLab: uploadData.doctorOrLab || 'Diagnostic Centre',
      notes: uploadData.notes,
      fileUrl: uploadData.file ? URL.createObjectURL(uploadData.file) : 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
    };

    // Store strictly in that specific member's section
    setMemberDocuments((prev) => ({
      ...prev,
      [targetKey]: [newDoc, ...(prev[targetKey] || [])],
    }));

    // Switch view to target member's section so user immediately sees their upload
    setActiveMemberKey(targetKey);
    setShowUploadModal(false);
    setMsg(`Document securely archived into ${targetMemberObj?.fullName}'s section!`);
    setTimeout(() => setMsg(''), 4500);

    // Also attempt backend synchronization if available
    try {
      const formData = new FormData();
      formData.append('memberKey', targetKey);
      formData.append('title', newDoc.title);
      formData.append('category', newDoc.category);
      formData.append('recordDate', newDoc.recordDate);
      formData.append('doctorOrLab', newDoc.doctorOrLab);
      formData.append('notes', newDoc.notes);
      if (uploadData.file) formData.append('file', uploadData.file);
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {}
  };

  const handleDelete = async (docId, docTitle) => {
    if (!window.confirm(`Delete "${docTitle}" from ${activeMember.fullName}'s vault?`)) return;

    setMemberDocuments((prev) => ({
      ...prev,
      [activeMemberKey]: (prev[activeMemberKey] || []).filter((d) => d._id !== docId),
    }));

    setMsg(`Document "${docTitle}" deleted from ${activeMember.fullName}'s section.`);
    setTimeout(() => setMsg(''), 4000);

    try {
      if (/^[0-9a-fA-F]{24}$/.test(docId)) {
        await api.delete(`/documents/${docId}`);
      }
    } catch (err) {}
  };

  // Get all doctors this document has been disclosed to
  const getDoctorsDisclosedTo = (docId) => {
    const list = [];
    Object.keys(disclosures).forEach((doctorId) => {
      const docs = disclosures[doctorId] || [];
      if (docs.some((d) => d.docId === docId || d.title === docId)) {
        for (const mKey of Object.keys(MEMBER_CONNECTED_DOCTORS)) {
          const match = MEMBER_CONNECTED_DOCTORS[mKey].find((d) => d.id === doctorId);
          if (match && !list.some((x) => x.id === match.id)) {
            list.push(match);
          }
        }
      }
    });
    return list;
  };

  const isDocSharedWithDoctor = (docId, doctorId) => {
    const docs = disclosures[doctorId] || [];
    return docs.some((d) => d.docId === docId || d.title === docId);
  };

  const handleOpenShareDoctorModal = (doc) => {
    setDocumentToShare(doc);
    setShowShareDoctorModal(true);
  };

  const handleToggleDoctorDisclosure = (doc, doctor) => {
    const docId = doc._id;
    const isAlreadyShared = isDocSharedWithDoctor(docId, doctor.id);

    let updated = { ...disclosures };
    const currentList = updated[doctor.id] || [];

    if (isAlreadyShared) {
      // Revoke
      updated[doctor.id] = currentList.filter((d) => d.docId !== docId && d.title !== doc.title);
      setMsg(`Revoked "${doc.title}" access from ${doctor.name}.`);
    } else {
      // Grant / Disclose
      const newDisclosedEntry = {
        docId: doc._id,
        title: doc.title,
        category: doc.category,
        memberKey: activeMemberKey,
        sharedAt: new Date().toISOString().split('T')[0],
        fileUrl: doc.fileUrl,
      };

      updated[doctor.id] = [...currentList, newDisclosedEntry];
      setMsg(`"${doc.title}" successfully delivered to ${doctor.name}! The doctor can now view this in their portal.`);

      // Also append discussion thread confirmation and update doctor's consultation profile
      try {
        const savedConsults = localStorage.getItem('carecircle_member_consultations');
        let consults = savedConsults ? JSON.parse(savedConsults) : null;
        if (!consults || typeof consults !== 'object') {
          consults = {
            ramesh: [
              {
                _id: 'grant-mehta-01',
                doctorName: 'Dr. Arvind Mehta',
                doctorSpecialty: 'Cardiology (Interventional Consultant)',
                doctorHospital: 'Apollo Heart & Vascular Institute, Mathura',
                doctorLicense: 'MCI-CARD-99214',
                permittedDocuments: ['Resting 12-Lead ECG Report', 'Comprehensive Lipid Profile'],
                doctorNotes: [
                  {
                    id: 'msg-mehta-1',
                    sender: 'doctor',
                    doctorName: 'Dr. Arvind Mehta (Cardiology, Apollo)',
                    comment: 'Reviewed 12-lead ECG and lipid panel. Blood pressure is well-controlled. Advised low-sodium diet and continuation of Amlodipine 5mg.',
                    createdAt: 'Today, 08:30 AM',
                    status: 'acknowledged',
                  },
                ],
              },
            ],
            sarita: [
              {
                _id: 'grant-sunita-01',
                doctorName: 'Dr. Sunita Rao',
                doctorSpecialty: 'Internal Medicine & Clinical Care',
                doctorHospital: 'Fortis Healthcare, Mathura',
                doctorLicense: 'MCI-IM-66321',
                permittedDocuments: ['Appendectomy Discharge Summary (2019)', 'Annual Executive Health Panel (2024)'],
                doctorNotes: [
                  {
                    id: 'msg-sunita-1',
                    sender: 'doctor',
                    doctorName: 'Dr. Sunita Rao (Internal Medicine, Fortis)',
                    comment: 'Thyroid profile optimal on Thyronorm 50 mcg. Continue morning dose on empty stomach.',
                    createdAt: 'Today, 10:15 AM',
                    status: 'acknowledged',
                  },
                ],
              },
            ],
            siddharth: [],
            aarav: [],
          };
        }

        const memberDoctorList = consults[activeMemberKey] || [];
        const docLastName = doctor.name.split(' ').slice(-1)[0];
        const matchingDoc = memberDoctorList.find((d) => d.doctorName.includes(docLastName) || d._id === doctor.id);
        if (matchingDoc) {
          if (!Array.isArray(matchingDoc.permittedDocuments)) matchingDoc.permittedDocuments = [];
          if (!matchingDoc.permittedDocuments.includes(doc.title)) {
            matchingDoc.permittedDocuments.push(doc.title);
          }
          if (!Array.isArray(matchingDoc.doctorNotes)) matchingDoc.doctorNotes = [];
          
          matchingDoc.doctorNotes.push({
            id: 'note-share-' + Date.now(),
            sender: 'family',
            authorName: 'Family Caregiver',
            comment: `Shared medical document: "${doc.title}" (${doc.category}) with ${doctor.name} for clinical consultation.`,
            createdAt: 'Just now',
            status: 'acknowledged',
          });
          matchingDoc.doctorNotes.push({
            id: 'note-ack-' + (Date.now() + 1),
            sender: 'doctor',
            doctorName: doctor.name,
            comment: `Received "${doc.title}". I have reviewed the report and added it to your clinical history.`,
            createdAt: 'Just now',
            status: 'acknowledged',
          });
          consults[activeMemberKey] = memberDoctorList;
          localStorage.setItem('carecircle_member_consultations', JSON.stringify(consults));
        }
      } catch (e) {}
    }

    setDisclosures(updated);
    try {
      localStorage.setItem(DISCLOSURES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('carecircle_disclosures_updated'));
    } catch (e) {}

    setTimeout(() => setMsg(''), 4500);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center shadow-xs">
              <Folder className="w-5 h-5" />
            </div>
            Medical Document Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Separated, isolated clinical vaults for each household member. Uploads are strictly stored under their designated person.
          </p>
        </div>

        <button
          onClick={openUploadModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-[#00A896]" />
          <span>Upload Document</span>
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* 1. MEMBER SECTION LOCKERS (OPTION A) - ISOLATED PER FAMILY MEMBER */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#008985]" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Family Member Document Sections
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Click a member to open their private archive
          </span>
        </div>

        {/* Member Locker Tabs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FAMILY_MEMBERS.map((m) => {
            const isSelected = activeMemberKey === m.key;
            const docCount = (memberDocuments[m.key] || []).length;

            return (
              <button
                key={m.key}
                onClick={() => {
                  setActiveMemberKey(m.key);
                  setCategoryFilter('All');
                }}
                className={`p-3.5 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#013A40] text-white border-[#013A40] shadow-md ring-2 ring-[#00A896]/30'
                    : 'bg-[#F8FAF9] hover:bg-slate-100 text-slate-800 border-slate-200/80'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={m.avatar}
                    alt={m.fullName}
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded font-mono text-[9px] font-black ${
                    isSelected ? 'bg-[#00A896] text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {m.bloodGroup}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {m.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-semibold truncate ${
                      isSelected ? 'text-white/80' : 'text-[#008985]'
                    }`}>
                      {m.relation}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                      • {m.age}y
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      isSelected ? 'bg-white/15 text-white' : 'bg-slate-200/80 text-slate-700'
                    }`}>
                      {docCount} {docCount === 1 ? 'Document' : 'Documents'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE MEMBER VAULT SUB-HEADER & FILTERS */}
      <div className="space-y-4">
        
        {/* Active Member Banner & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <FolderLock className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{activeMember.fullName}'s Documents</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E6F7F3] text-[#008985] text-[10px] font-extrabold">
                  {currentMemberDocs.length} Total
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                All records stored strictly in {activeMember.fullName}'s private health archive.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeMember.fullName.split(' ')[0]}'s records...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const countInCat = cat === 'All'
              ? currentMemberDocs.length
              : currentMemberDocs.filter((d) => d.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === cat
                    ? 'bg-[#013A40] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 shadow-xs'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  categoryFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DOCUMENTS GRID FOR ACTIVE MEMBER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl p-8 shadow-xs border border-slate-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center mx-auto">
              <FolderLock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No Documents in this Category for {activeMember.fullName}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload diagnostic reports, prescription slips, or scan certificates specifically into {activeMember.fullName}'s section.
            </p>
            <button
              onClick={openUploadModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#00A896]" />
              <span>Upload to {activeMember.fullName}'s Vault</span>
            </button>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E6F7F3] text-[#008985]">
                    {doc.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                  
                  {/* Doctor Disclosure Status Badge */}
                  {getDoctorsDisclosedTo(doc._id).length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#008985] bg-[#E8F8F3] border border-[#00A896]/20 px-2 py-0.5 rounded-lg w-fit mt-1.5">
                      <Stethoscope className="w-3 h-3 text-[#00A896] shrink-0" />
                      <span>Disclosed to {getDoctorsDisclosedTo(doc._id).map((d) => d.name).join(', ')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-[#008985] shrink-0" />
                    <span>Issued: {new Date(doc.recordDate).toLocaleDateString()}</span>
                  </div>

                  {doc.doctorOrLab && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-[#008985] shrink-0" />
                      <span className="truncate">{doc.doctorOrLab}</span>
                    </div>
                  )}

                  {doc.notes && (
                    <p className="text-xs text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-xl font-medium leading-relaxed border border-slate-100">
                      {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#008985]" />
                    <span>View</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenShareDoctorModal(doc)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      getDoctorsDisclosedTo(doc._id).length > 0
                        ? 'bg-[#E6F7F3] text-[#008985] hover:bg-[#D5EFEA] border border-[#00A896]/30'
                        : 'bg-[#013A40] hover:bg-[#024D55] text-white shadow-2xs'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                    <span>{getDoctorsDisclosedTo(doc._id).length > 0 ? 'Disclosed ✓' : 'Send to Doctor'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(doc._id, doc.title)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. UPLOAD MODAL WITH MANDATORY FAMILY MEMBER SELECTION */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            
            <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[#008985]" />
                  <span>Upload Medical Document</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select which family member this document belongs to. It will be stored exclusively in their section.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* PRIMARY REQUIREMENT: Select Family Member to Store Document Exclusively In */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Which Family Member Does This Document Belong To? *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {FAMILY_MEMBERS.map((m) => {
                    const isPicked = uploadData.targetMemberKey === m.key;
                    return (
                      <div
                        key={m.key}
                        onClick={() => setUploadData({ ...uploadData, targetMemberKey: m.key })}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isPicked
                            ? 'bg-[#E6F7F3] border-[#00A896] text-[#013A40] ring-2 ring-[#00A896]/30 font-bold'
                            : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img
                          src={m.avatar}
                          alt={m.fullName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate leading-tight">{m.fullName}</p>
                          <span className="text-[10px] text-slate-500">{m.relation}</span>
                        </div>
                        {isPicked && (
                          <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Document Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  2. Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Blood Sugar & Lipid Panel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium border border-slate-200"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-semibold border border-slate-200"
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Scan/X-Ray">Scan/X-Ray</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Vaccine Certificate">Vaccine Certificate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Record Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium border border-slate-200"
                    value={uploadData.recordDate}
                    onChange={(e) => setUploadData({ ...uploadData, recordDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Physician, Clinic or Diagnostic Facility
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospital / Dr. Lal PathLabs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium border border-slate-200"
                  value={uploadData.doctorOrLab}
                  onChange={(e) => setUploadData({ ...uploadData, doctorOrLab: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clinical Notes / Key Diagnostic Findings
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Fasting blood sugar normal, low-sodium diet advised"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium border border-slate-200"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                ></textarea>
              </div>

              {/* File Attachment Box */}
              <div className="border-2 border-dashed border-slate-200 hover:border-[#008985] rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors bg-slate-50/60 cursor-pointer">
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  <UploadCloud className="w-7 h-7 text-[#008985] mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-700 hover:text-[#008985]">
                    {uploadData.file ? uploadData.file.name : 'Select PDF, JPG, or PNG report file'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 15 MB</p>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Upload to Selected Person's Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 5. SHARE WITH DOCTOR MODAL */}
      {showShareDoctorModal && documentToShare && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            
            <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#008985]" />
                  <span>Share Document with Doctor</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grant selective clinical disclosure of this record for your connected physician.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowShareDoctorModal(false);
                  setDocumentToShare(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Document Summary */}
            <div className="p-3.5 rounded-2xl bg-[#F0FAF9] border border-[#D5EFEA] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Medical Record
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#013A40] text-white text-[10px] font-bold">
                  {documentToShare.category}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">{documentToShare.title}</h3>
              <p className="text-[11px] text-slate-500">
                Patient: <strong className="text-slate-800">{activeMember.fullName}</strong> ({activeMember.relation}) • Issued: {new Date(documentToShare.recordDate).toLocaleDateString()}
              </p>
            </div>

            {/* Connected Doctors for this Member */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Connected Attending Physicians
              </label>

              {(MEMBER_CONNECTED_DOCTORS[activeMemberKey] || []).length > 0 ? (
                (MEMBER_CONNECTED_DOCTORS[activeMemberKey] || []).map((doc) => {
                  const isShared = isDocSharedWithDoctor(documentToShare._id, doc.id);

                  return (
                    <div
                      key={doc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isShared
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                            <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[9px] font-extrabold">
                              {doc.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">{doc.specialty}</p>
                          <p className="text-[10px] text-slate-400">{doc.hospital}</p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-end">
                        {isShared ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active Access</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleDoctorDisclosure(documentToShare, doc)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                            >
                              Revoke
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleDoctorDisclosure(documentToShare, doc)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Stethoscope className="w-3.5 h-3.5 text-[#00A896]" />
                            <span>Send to Doctor</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Healthy Baseline Member</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {activeMember.fullName} is on a healthy baseline with no active physician assigned.
                  </p>
                </div>
              )}
            </div>

            {/* Privacy notice banner */}
            <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center gap-2 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-[#00A896] shrink-0" />
              <span>
                Disclosing this document gives the physician clinical access via their secure Doctor Portal. You can revoke this permission anytime.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowShareDoctorModal(false);
                  setDocumentToShare(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
