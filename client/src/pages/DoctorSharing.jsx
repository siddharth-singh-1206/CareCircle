import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Share2,
  PlusCircle,
  Clock,
  ShieldCheck,
  Ban,
  ExternalLink,
  Copy,
  CheckCircle2,
  XCircle,
  Activity,
  FileText,
  UserCheck,
  ArrowRight,
  AlertCircle,
  FileSignature,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_FAMILY_DOCUMENTS = [
  {
    _id: 'doc-ecg-01',
    title: 'Resting 12-Lead ECG Report',
    category: 'Lab Report',
    recordDate: 'Nov 16, 2026',
    fileSize: '1.8 MB',
  },
  {
    _id: 'doc-lipid-02',
    title: 'Comprehensive Lipid & Fasting Glucose Profile',
    category: 'Lab Report',
    recordDate: 'Nov 14, 2026',
    fileSize: '840 KB',
  },
  {
    _id: 'doc-chest-03',
    title: 'Chest Digital X-Ray & Radiologist Review',
    category: 'Scan/X-Ray',
    recordDate: 'Oct 28, 2026',
    fileSize: '4.2 MB',
  },
  {
    _id: 'doc-rx-04',
    title: 'Prescription for Hypertension (Amlodipine 5mg)',
    category: 'Prescription',
    recordDate: 'Sep 12, 2026',
    fileSize: '420 KB',
  },
];

const INITIAL_DEMO_CONSULTATIONS = [
  {
    _id: 'grant-demo-1',
    doctorName: 'Dr. Arvind Mehta (Cardiologist)',
    doctorEmail: 'dr.mehta@apollo.com',
    memberId: {
      _id: 'mem-ramesh',
      fullName: 'Ramesh Sharma',
      relation: 'Grandfather',
      bloodGroup: 'B+',
    },
    chiefComplaint:
      'Shortness of breath on exertion, mild dizziness in morning hours, and irregular heart rate during physical activity. Fasting glucose borderline high.',
    permittedCategories: ['vitals', 'medications', 'allergies', 'prescriptions', 'lab_reports'],
    permittedDocuments: ['doc-ecg-01', 'doc-lipid-02'],
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    status: 'active', // 'pending' | 'active' | 'rejected'
    accessToken: 'demo-doctor-grant-ramesh',
    passcode: '482910',
    rejectionReason: '',
    referralDoctor: '',
    doctorNotes: [
      {
        comment:
          'Reviewed 12-lead ECG and lipid panel. Occasional benign PVCs noted. Blood pressure is well-controlled. Advised low-sodium diet and continuation of Amlodipine 5mg. Schedule follow-up in 14 days.',
        doctorName: 'Dr. Arvind Mehta',
        createdAt: 'Nov 18, 2026, 04:15 PM',
      },
    ],
  },
  {
    _id: 'grant-demo-2',
    doctorName: 'Dr. Rajesh Khanna (Orthopedic Specialist)',
    doctorEmail: 'dr.khanna@maxhealthcare.com',
    memberId: {
      _id: 'mem-sarita',
      fullName: 'Sarita Sharma',
      relation: 'Mother',
      bloodGroup: 'A+',
    },
    chiefComplaint:
      'Persistent morning knee joint stiffness and localized swelling after walking.',
    permittedCategories: ['vitals', 'prescriptions'],
    permittedDocuments: ['doc-chest-03'],
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    status: 'rejected',
    accessToken: 'demo-doctor-grant-sarita',
    passcode: '319201',
    rejectionReason:
      'Specialty mismatch — patient condition exhibits classic inflammatory arthritis indications requiring a Rheumatology sub-specialist consult.',
    referralDoctor:
      'Dr. Sunita Rao (Senior Consultant Rheumatologist, City Arthritis & Joint Care, Phone: +91 98111 22334)',
    doctorNotes: [],
  },
];

const DEFAULT_REGISTERED_DOCTORS = [
  {
    _id: 'doc-mehta-01',
    name: 'Dr. Arvind Mehta',
    email: 'dr.mehta@apollo.com',
    specialization: 'Cardiology (Senior Interventional Consultant)',
    hospital: 'Apollo Heart & Vascular Institute, Mathura',
    registrationNumber: 'MCI-CARD-99214',
    badge: 'Cardiologist',
  },
  {
    _id: 'doc-khanna-02',
    name: 'Dr. Rajesh Khanna',
    email: 'drkhanna@rainbowhospitals.com',
    specialization: 'Pediatrics & Neonatology',
    hospital: 'Rainbow Children’s Superspecialty Clinic',
    registrationNumber: 'MCI-PED-45812',
    badge: 'Pediatrician',
  },
  {
    _id: 'doc-rao-03',
    name: 'Dr. Sunita Rao',
    email: 'dr.sunita.rao@metrocare.com',
    specialization: 'Rheumatology & Autoimmune Care',
    hospital: 'Metro Centre for Joint & Bone Diseases',
    registrationNumber: 'MCI-RHEUM-31290',
    badge: 'Rheumatologist',
  },
  {
    _id: 'doc-verma-04',
    name: 'Dr. R. K. Verma',
    email: 'dr.verma@citychest.org',
    specialization: 'Pulmonology & Respiratory Medicine',
    hospital: 'City Chest & Allergy Institute',
    registrationNumber: 'MCI-PULM-78210',
    badge: 'Pulmonologist',
  },
];

export default function DoctorSharing() {
  const { user, members } = useAuth();
  const [registeredDoctors, setRegisteredDoctors] = useState(() => {
    const saved = localStorage.getItem('carecircle_registered_doctors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...DEFAULT_REGISTERED_DOCTORS.filter(d => !parsed.some(p => p.email === d.email))];
      } catch (e) {
        return DEFAULT_REGISTERED_DOCTORS;
      }
    }
    return DEFAULT_REGISTERED_DOCTORS;
  });

  const [grants, setGrants] = useState(() => {
    const saved = localStorage.getItem('carecircle_family_consultations');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_CONSULTATIONS;
  });

  const [showModal, setShowModal] = useState(false);
  const [createdGrantInfo, setCreatedGrantInfo] = useState(null);
  const [msg, setMsg] = useState('');

  // Selected Doctor state from directory
  const [selectedDoctorId, setSelectedDoctorId] = useState(DEFAULT_REGISTERED_DOCTORS[0]._id);

  // Form State
  const [formData, setFormData] = useState({
    memberId: '',
    chiefComplaint: '',
    urgency: 'routine',
    validityHours: '48',
    selectedDocIds: ['doc-ecg-01', 'doc-lipid-02'],
    vitals: true,
    medications: true,
    allergies: true,
    prescriptions: true,
    lab_reports: true,
  });

  useEffect(() => {
    if (members && members.length > 0 && !formData.memberId) {
      setFormData((prev) => ({ ...prev, memberId: members[0]._id }));
    }
  }, [members]);

  useEffect(() => {
    localStorage.setItem('carecircle_family_consultations', JSON.stringify(grants));
  }, [grants]);

  // Toggle document selection for selective privacy
  const handleToggleDoc = (docId) => {
    setFormData((prev) => {
      const exists = prev.selectedDocIds.includes(docId);
      return {
        ...prev,
        selectedDocIds: exists
          ? prev.selectedDocIds.filter((id) => id !== docId)
          : [...prev.selectedDocIds, docId],
      };
    });
  };

  // Submit Connection Request
  const handleCreateRequest = async (e) => {
    e.preventDefault();

    const targetMember = members.find((m) => m._id === formData.memberId) || {
      _id: 'mem-ramesh',
      fullName: 'Ramesh Sharma',
      relation: 'Grandfather',
      bloodGroup: 'B+',
    };

    const targetDoctor = registeredDoctors.find((d) => d._id === selectedDoctorId) || registeredDoctors[0];

    const permittedCategories = [];
    if (formData.vitals) permittedCategories.push('vitals');
    if (formData.medications) permittedCategories.push('medications');
    if (formData.allergies) permittedCategories.push('allergies');
    if (formData.prescriptions) permittedCategories.push('prescriptions');
    if (formData.lab_reports) permittedCategories.push('lab_reports');

    const newGrant = {
      _id: 'grant-' + Date.now(),
      doctorName: `${targetDoctor.name} (${targetDoctor.specialization})`,
      doctorEmail: targetDoctor.email,
      doctorHospital: targetDoctor.hospital,
      doctorLicense: targetDoctor.registrationNumber,
      memberId: targetMember,
      chiefComplaint: formData.chiefComplaint || 'Patient requested consultation for clinical review.',
      urgency: formData.urgency,
      permittedCategories,
      permittedDocuments: formData.selectedDocIds,
      expiresAt: new Date(Date.now() + Number(formData.validityHours) * 3600 * 1000).toISOString(),
      status: 'pending', // Starts as pending doctor triage
      accessToken: 'token-' + Math.random().toString(36).substring(2, 10),
      passcode: Math.floor(100000 + Math.random() * 900000).toString(),
      rejectionReason: '',
      referralDoctor: '',
      doctorNotes: [],
    };

    setGrants((prev) => [newGrant, ...prev]);

    // Also update doctor's side in local storage so doctor dashboard immediately sees the request
    try {
      const existingDocRequests = JSON.parse(
        localStorage.getItem('carecircle_doctor_requests') || '[]'
      );
      const docPayload = {
        _id: newGrant._id,
        patient: {
          fullName: targetMember.fullName,
          relation: targetMember.relation,
          age: '74 yrs',
          gender: 'Male',
          bloodGroup: targetMember.bloodGroup || 'B+',
          emergencyContact: {
            name: user?.name || 'Siddharth Sharma',
            phone: '+91 98765 43210',
            relation: 'Caregiver',
          },
        },
        chiefComplaint: newGrant.chiefComplaint,
        urgency: formData.urgency,
        permittedCategories,
        permittedDocuments: SAMPLE_FAMILY_DOCUMENTS.filter((d) =>
          formData.selectedDocIds.includes(d._id)
        ),
        vitals: {
          bp: '124/82 mmHg',
          heartRate: '74 bpm',
          glucose: '118 mg/dL',
          weight: '68.5 kg',
        },
        allergies: [
          { title: 'Penicillin & Beta-Lactams', severity: 'Critical' },
        ],
        medications: [
          { name: 'Metformin HCl', dosage: '500 mg', frequency: 'Twice daily' },
        ],
        status: 'pending',
        createdAt: 'Just now',
        doctorNotes: [],
      };
      localStorage.setItem(
        'carecircle_doctor_requests',
        JSON.stringify([docPayload, ...existingDocRequests])
      );
    } catch (e) {
      console.warn(e);
    }

    setShowModal(false);
    setCreatedGrantInfo({
      doctorName: newGrant.doctorName,
      passcode: newGrant.passcode,
      shareUrl: `${window.location.origin}/doctor-access/${newGrant.accessToken}`,
    });
    setMsg(`Consultation request transmitted to ${targetDoctor.name} (${targetDoctor.specialization}).`);
    setTimeout(() => setMsg(''), 5000);
  };

  // Acknowledge a doctor's clinical note
  const handleAcknowledgeNote = (grantId, noteIndex) => {
    setGrants((prev) =>
      prev.map((g) => {
        if (g._id === grantId) {
          const updatedNotes = (g.doctorNotes || []).map((n, i) =>
            i === noteIndex ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Caregiver' } : n
          );
          return { ...g, doctorNotes: updatedNotes };
        }
        return g;
      })
    );

    // Sync to doctor storage as well
    try {
      const existingDoc = JSON.parse(localStorage.getItem('carecircle_doctor_requests') || '[]');
      const updatedDoc = existingDoc.map((d) => {
        if (d._id === grantId) {
          const updatedNotes = (d.doctorNotes || []).map((n, i) =>
            i === noteIndex ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Caregiver' } : n
          );
          return { ...d, doctorNotes: updatedNotes };
        }
        return d;
      });
      localStorage.setItem('carecircle_doctor_requests', JSON.stringify(updatedDoc));
    } catch (e) {
      console.warn(e);
    }

    setMsg('Clinical advice acknowledged and marked as reviewed. Status updated for doctor.');
    setTimeout(() => setMsg(''), 4000);
  };

  // Family sends a follow-up query/message to the doctor
  const [familyReplies, setFamilyReplies] = useState({});

  const handleSendFamilyReply = (grantId) => {
    const text = familyReplies[grantId]?.trim();
    if (!text) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: 'family',
      authorName: `${user?.name || 'Siddharth Sharma'} (Caregiver)`,
      comment: text,
      createdAt: 'Just now',
      status: 'pending_doctor_review',
    };

    setGrants((prev) =>
      prev.map((g) => {
        if (g._id === grantId) {
          return { ...g, doctorNotes: [...(g.doctorNotes || []), newMsg] };
        }
        return g;
      })
    );

    // Sync to doctor storage
    try {
      const existingDoc = JSON.parse(localStorage.getItem('carecircle_doctor_requests') || '[]');
      const updatedDoc = existingDoc.map((d) => {
        if (d._id === grantId) {
          return { ...d, doctorNotes: [...(d.doctorNotes || []), newMsg] };
        }
        return d;
      });
      localStorage.setItem('carecircle_doctor_requests', JSON.stringify(updatedDoc));
    } catch (e) {
      console.warn(e);
    }

    setFamilyReplies((prev) => ({ ...prev, [grantId]: '' }));
    setMsg('Follow-up query transmitted to Doctor. Status: Pending Doctor Review.');
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            Doctor Consultations & Selective Access
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Request doctor review with your symptoms, privacy-protected documents, and view clinical feedback.
          </p>
        </div>
        <button
          onClick={() => {
            setCreatedGrantInfo(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-sm transition-colors shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#00A896]" />
          <span>Request Doctor Consultation</span>
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Consultations List */}
      <div className="bg-white rounded-3xl shadow-sm divide-y divide-slate-100 overflow-hidden">
        {grants.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No active doctor consultation requests. Click "Request Doctor Consultation" above to connect with a physician.
          </div>
        ) : (
          grants.map((grant) => {
            const isPending = grant.status === 'pending';
            const isActive = grant.status === 'active';
            const isRejected = grant.status === 'rejected';

            return (
              <div key={grant._id} className="p-6 sm:p-8 space-y-4">
                
                {/* Doctor & Status Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#013A40] flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5 text-[#00A896]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{grant.doctorName}</h3>
                      <p className="text-xs text-slate-500">
                        Patient: <strong className="text-slate-800">{grant.memberId?.fullName}</strong> ({grant.memberId?.relation})
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Pending Doctor Acceptance
                      </span>
                    )}
                    {isActive && (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Consultation
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Consultation Declined
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient's Reported Explanation / Chief Complaint */}
                <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Reported Symptoms & Case Explanation
                  </span>
                  <p className="text-slate-700 font-medium">"{grant.chiefComplaint}"</p>
                </div>

                {/* IF REJECTED: Show Doctor's Reason & Referral */}
                {isRejected && (
                  <div className="bg-rose-50/60 rounded-2xl p-4.5 border border-rose-100 space-y-3">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Doctor's Clinical Rationale for Decline</span>
                    </div>
                    <p className="text-xs text-rose-800 font-medium pl-6">
                      "{grant.rejectionReason}"
                    </p>

                    {grant.referralDoctor && (
                      <div className="mt-2 pt-2 border-t border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-rose-950 font-medium">
                          <strong>Doctor's Recommended Referral:</strong> {grant.referralDoctor}
                        </div>
                        <button
                          onClick={() => handleRedirectToReferral(grant)}
                          className="px-3 py-1.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer shrink-0"
                        >
                          <span>Redirect to Referral</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#00A896]" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* IF ACTIVE: Two-Way Doctor Consultation & Discussion Feed */}
                {isActive && (
                  <div className="bg-[#F7FAF9] rounded-2xl p-5 border border-slate-200/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                      <div className="flex items-center gap-2 text-[#013A40] font-bold text-xs">
                        <FileSignature className="w-4 h-4 text-[#00A896]" />
                        <span>Clinical Discussion & Attending Doctor Advice Thread</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Secure HIPAA-compliant family thread
                      </span>
                    </div>

                    {/* Discussion Messages */}
                    <div className="space-y-3">
                      {(grant.doctorNotes || []).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No notes posted yet. Attending physician is reviewing records.</p>
                      ) : (
                        grant.doctorNotes.map((note, index) => {
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
                                      isFromDoctor
                                        ? 'bg-[#013A40] text-white'
                                        : 'bg-[#00A896] text-white'
                                    }`}
                                  >
                                    {isFromDoctor ? 'Attending Doctor' : 'Family Caregiver'}
                                  </span>
                                  <strong className="text-slate-900 font-bold">
                                    {note.authorName || note.doctorName || 'Dr. Arvind Mehta'}
                                  </strong>
                                  <span className="text-slate-400">• {note.createdAt}</span>
                                </div>

                                {/* Status Tag & Acknowledge Action */}
                                <div className="flex items-center gap-2">
                                  {isPendingReview ? (
                                    <>
                                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                                        <Clock className="w-3 h-3" /> Pending Family Review
                                      </span>
                                      <button
                                        onClick={() => handleAcknowledgeNote(grant._id, index)}
                                        className="px-3 py-1 bg-[#013A40] hover:bg-[#024D55] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 className="w-3 h-3 text-[#00A896]" />
                                        <span>Mark as Read & Acknowledge</span>
                                      </button>
                                    </>
                                  ) : isFromDoctor ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Acknowledged by Family
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-400" /> Pending Doctor Review
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="text-xs text-slate-800 leading-relaxed font-medium pl-1">
                                {note.comment}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Family Reply Box */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Ask a follow-up question or update ${grant.doctorName.split('(')[0].trim()}...`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008985] font-medium"
                        value={familyReplies[grant._id] || ''}
                        onChange={(e) =>
                          setFamilyReplies({ ...familyReplies, [grant._id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendFamilyReply(grant._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSendFamilyReply(grant._id)}
                        disabled={!familyReplies[grant._id]?.trim()}
                        className="px-4 py-2.5 bg-[#013A40] hover:bg-[#024D55] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#00A896]" />
                        <span>Send to Doctor</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Documents Permitted Checklist */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Permitted Files:
                  </span>
                  {grant.permittedDocuments?.map((docId) => {
                    const match = SAMPLE_FAMILY_DOCUMENTS.find((d) => d._id === docId);
                    return (
                      <span
                        key={docId}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                      >
                        {match ? match.title : docId}
                      </span>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* MODAL: REQUEST DOCTOR CONSULTATION */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#013A40] flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#00A896]" />
                  Request Doctor Consultation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explain what happened and selectively grant permission to needed medical files.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              {/* Target Member */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Family Member
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] font-semibold"
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                >
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName} ({m.relation}) - Blood Group: {m.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Registered Doctors Directory Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Registered Doctor / Specialist
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Network Only
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {registeredDoctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc._id;
                    return (
                      <div
                        key={doc._id}
                        onClick={() => setSelectedDoctorId(doc._id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-[#E6F7F3] border-[#00A896] shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isSelected ? 'bg-[#00A896] text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              <Stethoscope className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                                <span className="px-2 py-0.5 rounded-full bg-[#013A40] text-white text-[9px] font-bold">
                                  {doc.badge || doc.specialization?.split(' ')[0] || 'Specialist'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium block">
                                {doc.specialization} • {doc.hospital}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">
                            {doc.registrationNumber}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Only physicians officially registered with active medical council licenses are available for family consultations.
                </p>
              </div>

              {/* Patient's Explanation & Symptoms (Chief Complaint) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Explain What Happened to the Patient (Symptoms & Duration)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Experiencing shortness of breath after climbing stairs, dizziness in morning hours for past 3 days. Morning fasting glucose 118 mg/dL."
                  className="w-full p-3.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] font-medium resize-none"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                />
              </div>

              {/* Selective Document Privacy Checkboxes */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Selective Document Privacy (Choose files to disclose)
                  </label>
                  <span className="text-[10px] text-slate-400">Unselected files stay hidden</span>
                </div>

                <div className="space-y-2">
                  {SAMPLE_FAMILY_DOCUMENTS.map((doc) => {
                    const isChecked = formData.selectedDocIds.includes(doc._id);
                    return (
                      <label
                        key={doc._id}
                        className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#E6F7F3] border border-[#00A896]'
                            : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDoc(doc._id)}
                            className="rounded text-[#008985] focus:ring-[#008985]"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{doc.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {doc.category} • {doc.recordDate}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">{doc.fileSize}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#00A896]" />
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