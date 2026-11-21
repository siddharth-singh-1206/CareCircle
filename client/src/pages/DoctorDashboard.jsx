import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Activity,
  HeartPulse,
  Send,
  Printer,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  FileSignature,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

// Initial pre-loaded clinical patient requests for seamless viva demonstration
const INITIAL_DOCTOR_REQUESTS = [
  {
    _id: 'req-ramesh-sharma',
    patient: {
      fullName: 'Ramesh Sharma',
      relation: 'Grandfather / Senior',
      age: '74 yrs',
      gender: 'Male',
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Siddharth Sharma',
        phone: '+91 98765 43210',
        relation: 'Grandson / Caregiver',
      },
    },
    chiefComplaint:
      'Patient reports experiencing episodic shortness of breath after climbing stairs, mild dizziness, and occasional irregular heartbeats over the last 4 days. Morning fasting glucose is borderline elevated (118 mg/dL).',
    urgency: 'urgent',
    permittedCategories: ['vitals', 'medications', 'allergies', 'prescriptions', 'lab_reports'],
    permittedDocuments: [
      {
        _id: 'doc-ecg-01',
        title: 'Resting 12-Lead ECG Report',
        category: 'Lab Report',
        recordDate: 'Nov 16, 2026',
        fileSize: '1.8 MB',
        previewNote: 'Normal sinus rhythm with occasional premature ventricular contractions (PVCs).',
      },
      {
        _id: 'doc-lipid-02',
        title: 'Comprehensive Lipid & Fasting Glucose Profile',
        category: 'Lab Report',
        recordDate: 'Nov 14, 2026',
        fileSize: '840 KB',
        previewNote: 'Total Cholesterol: 215 mg/dL, Fasting Sugar: 118 mg/dL, HbA1c: 6.4%.',
      },
    ],
    vitals: {
      bp: '124/82 mmHg',
      heartRate: '74 bpm',
      glucose: '118 mg/dL',
      weight: '68.5 kg',
    },
    allergies: [
      { title: 'Penicillin & Beta-Lactams', severity: 'Critical', note: 'Severe anaphylaxis history' },
      { title: 'Aspirin / NSAIDs', severity: 'Moderate', note: 'Gastric mucosal irritation' },
    ],
    medications: [
      { name: 'Metformin HCl', dosage: '500 mg', frequency: 'Twice daily after meals' },
      { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily at 08:00 AM' },
    ],
    status: 'pending', // 'pending' | 'active' | 'rejected'
    createdAt: 'Today, 08:30 AM',
    rejectionReason: '',
    referralDoctor: '',
    doctorNotes: [
      {
        comment:
          'Baseline cardiac telemetry noted. Advised low-sodium Mediterranean diet and adherence to current Amlodipine regimen. Follow up in 14 days.',
        doctorName: 'Dr. Arvind Mehta',
        createdAt: 'Nov 18, 2026, 04:15 PM',
      },
    ],
  },
];

const getPatientDetails = (req) => {
  if (!req) return {
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    age: '74 yrs',
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: { name: 'Siddharth Sharma', phone: '+91 98765 43210' },
  };

  const p = req.patient || req.memberId || {};
  return {
    fullName: p.fullName || req.patientName || 'Ramesh Sharma',
    relation: p.relation || 'Family Member',
    age: p.age || '68 yrs',
    gender: p.gender || 'Male',
    bloodGroup: p.bloodGroup || 'B+',
    emergencyContact: p.emergencyContact || {
      name: 'Siddharth Sharma',
      phone: '+91 98765 43210',
    },
  };
};

const getPatientVitals = (req) => {
  return req?.vitals || {
    bp: '124/82 mmHg',
    heartRate: '74 bpm',
    glucose: '118 mg/dL',
    weight: '68.5 kg',
  };
};

const getPatientAllergies = (req) => {
  if (Array.isArray(req?.allergies) && req.allergies.length > 0) return req.allergies;
  return [
    { title: 'Penicillin & Beta-Lactams', severity: 'Critical', note: 'Severe anaphylaxis history' },
    { title: 'Aspirin / NSAIDs', severity: 'Moderate', note: 'Gastric mucosal irritation' }
  ];
};

const getPatientMedications = (req) => {
  if (Array.isArray(req?.medications) && req.medications.length > 0) return req.medications;
  return [
    { name: 'Metformin HCl', dosage: '500 mg', frequency: 'Twice daily after meals' },
    { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily at 08:00 AM' }
  ];
};

const getPermittedDocs = (req) => {
  try {
    const saved = localStorage.getItem('carecircle_doctor_disclosures');
    if (saved) {
      const parsed = JSON.parse(saved);
      const patientName = (req?.patient?.fullName || req?.patient?.name || '').toLowerCase();
      let docList = [];
      if (patientName.includes('sarita')) {
        docList = parsed['doc-sunita-03'] || [];
      } else {
        docList = parsed['doc-mehta-01'] || [];
      }

      if (Array.isArray(docList) && docList.length > 0) {
        return docList.map((doc, idx) => ({
          _id: doc.docId || `disclosed-${idx}`,
          title: doc.title,
          category: doc.category || 'Lab Report',
          recordDate: doc.sharedAt || 'Today',
          fileSize: '1.4 MB',
          fileUrl: doc.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          previewNote: 'Delivered securely to physician EMR from CareCircle Member Vault.',
        }));
      }
    }
  } catch (e) {}

  if (Array.isArray(req?.permittedDocuments) && req.permittedDocuments.length > 0) {
    return req.permittedDocuments.map((doc, idx) => {
      if (typeof doc === 'string') {
        return {
          _id: `doc-${idx}`,
          title: doc,
          category: 'Health Record',
          recordDate: 'Nov 2026',
          fileSize: '1.2 MB',
          previewNote: 'Verified clinical telemetry and lab profile.',
        };
      }
      return {
        _id: doc._id || `doc-${idx}`,
        title: doc.title || 'Diagnostic Report',
        category: doc.category || 'Lab Report',
        recordDate: doc.recordDate || 'Nov 2026',
        fileSize: doc.fileSize || '1.0 MB',
        previewNote: doc.previewNote || 'Clinical diagnostic documentation.',
      };
    });
  }
  return [
    {
      _id: 'doc-default-1',
      title: 'Resting 12-Lead ECG Report',
      category: 'Lab Report',
      recordDate: 'Nov 16, 2026',
      fileSize: '1.8 MB',
      previewNote: 'Normal sinus rhythm with occasional benign PVCs.',
    },
    {
      _id: 'doc-default-2',
      title: 'Comprehensive Lipid & Fasting Glucose Profile',
      category: 'Lab Report',
      recordDate: 'Nov 14, 2026',
      fileSize: '840 KB',
      previewNote: 'Total Cholesterol: 215 mg/dL, Fasting Sugar: 118 mg/dL, HbA1c: 6.4%.',
    },
  ];
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('carecircle_doctor_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(r => r && r._id)) {
          return parsed;
        }
      }
      return INITIAL_DOCTOR_REQUESTS;
    } catch (e) {
      return INITIAL_DOCTOR_REQUESTS;
    }
  });

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'patients'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [msg, setMsg] = useState('');

  // Decline Modal State
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [requestToDecline, setRequestToDecline] = useState(null);
  const [declineReason, setDeclineReason] = useState(
    'Specialty mismatch — patient requires urgent in-person coronary angiography and structural evaluation.'
  );
  const [referralDoctor, setReferralDoctor] = useState(
    'Dr. Sunita Rao (Interventional Cardiologist, Metro Heart Centre, Phone: +91 98111 22334)'
  );

  // New Clinical Note Input State
  const [newClinicalNote, setNewClinicalNote] = useState('');

  // Save requests to local storage for persistence across reloads
  useEffect(() => {
    try {
      localStorage.setItem('carecircle_doctor_requests', JSON.stringify(requests));
    } catch (e) {}
  }, [requests]);

  const [disclosuresRev, setDisclosuresRev] = useState(0);
  useEffect(() => {
    const handleSync = () => setDisclosuresRev((v) => v + 1);
    window.addEventListener('carecircle_disclosures_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('carecircle_disclosures_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const safeRequests = Array.isArray(requests) ? requests.filter((r) => r && r.status) : INITIAL_DOCTOR_REQUESTS;
  const pendingRequests = safeRequests.filter((r) => r.status === 'pending');
  const activePatients = safeRequests.filter((r) => r.status === 'active');

  // Handle Accept
  const handleAccept = (reqId) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === reqId ? { ...r, status: 'active' } : r))
    );
    setMsg('Patient consultation accepted. Moved to your Active Patients roster.');
    setTimeout(() => setMsg(''), 4000);
  };

  // Open Decline Modal
  const openDeclineModal = (req) => {
    setRequestToDecline(req);
    setDeclineModalOpen(true);
  };

  // Confirm Decline with Reason & Referral
  const confirmDecline = () => {
    if (!requestToDecline) return;
    const patientName = requestToDecline.patient?.fullName || requestToDecline.memberId?.fullName || 'Family Member';
    setRequests((prev) =>
      prev.map((r) =>
        r._id === requestToDecline._id
          ? {
              ...r,
              status: 'rejected',
              rejectionReason: declineReason,
              referralDoctor: referralDoctor,
            }
          : r
      )
    );

    // Save referral alert for the family notification center
    try {
      const savedReferrals = JSON.parse(localStorage.getItem('carecircle_doctor_referrals') || '[]');
      const newReferralNotif = {
        id: 'referral-' + Date.now(),
        type: 'doctor_referral',
        title: `Doctor Referral: Specialist Recommended for ${patientName}`,
        sender: user?.name || 'Dr. Arvind Mehta (Cardiology)',
        memberName: patientName,
        detail: `Attending physician reviewed the file: "${declineReason}". Recommends consulting: ${referralDoctor}.`,
        time: 'Just now',
        unread: true,
        link: '/doctors',
      };
      localStorage.setItem('carecircle_doctor_referrals', JSON.stringify([newReferralNotif, ...savedReferrals]));
      window.dispatchEvent(new Event('carecircle_referrals_updated'));
    } catch (e) {}

    setDeclineModalOpen(false);
    setRequestToDecline(null);
    setMsg('Consultation request declined with clinical referral transmitted to family.');
    setTimeout(() => setMsg(''), 4000);
  };

  // Handle Adding Doctor Clinical Comment
  const handleAddClinicalNote = (patientId) => {
    if (!newClinicalNote.trim()) return;

    const newEntry = {
      id: 'msg-' + Date.now(),
      sender: 'doctor',
      comment: newClinicalNote.trim(),
      doctorName: user?.name || 'Dr. Arvind Mehta (Cardiologist)',
      createdAt: 'Just now',
      status: 'pending_family_review', // Marked as pending until family acknowledges
    };

    setRequests((prev) =>
      prev.map((r) =>
        r._id === patientId
          ? { ...r, doctorNotes: [newEntry, ...(r.doctorNotes || [])] }
          : r
      )
    );

    if (selectedPatient && selectedPatient._id === patientId) {
      setSelectedPatient((prev) => ({
        ...prev,
        doctorNotes: [newEntry, ...(prev.doctorNotes || [])],
      }));
    }

    // Sync to family storage as well so family portal immediately shows it as pending review
    try {
      const famGrants = JSON.parse(localStorage.getItem('carecircle_family_consultations') || '[]');
      const updatedFam = famGrants.map((g) => {
        if (g._id === patientId) {
          return { ...g, doctorNotes: [...(g.doctorNotes || []), newEntry] };
        }
        return g;
      });
      localStorage.setItem('carecircle_family_consultations', JSON.stringify(updatedFam));
    } catch (e) {
      console.warn(e);
    }

    setNewClinicalNote('');
    setMsg('Clinical advice posted and marked as "Pending Family Review".');
    setTimeout(() => setMsg(''), 4000);
  };

  // Doctor marks a family query as reviewed
  const handleMarkQueryReviewed = (patientId, noteIndex) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r._id === patientId) {
          const updated = (r.doctorNotes || []).map((n, i) =>
            i === noteIndex ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Doctor' } : n
          );
          return { ...r, doctorNotes: updated };
        }
        return r;
      })
    );

    if (selectedPatient && selectedPatient._id === patientId) {
      setSelectedPatient((prev) => {
        const updated = (prev.doctorNotes || []).map((n, i) =>
          i === noteIndex ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Doctor' } : n
        );
        return { ...prev, doctorNotes: updated };
      });
    }

    // Sync to family storage
    try {
      const famGrants = JSON.parse(localStorage.getItem('carecircle_family_consultations') || '[]');
      const updatedFam = famGrants.map((g) => {
        if (g._id === patientId) {
          const updated = (g.doctorNotes || []).map((n, i) =>
            i === noteIndex ? { ...n, status: 'acknowledged', acknowledgedAt: 'Just now by Doctor' } : n
          );
          return { ...g, doctorNotes: updated };
        }
        return g;
      });
      localStorage.setItem('carecircle_family_consultations', JSON.stringify(updatedFam));
    } catch (e) {
      console.warn(e);
    }

    setMsg('Family query marked as reviewed.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Doctor Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F7F3] text-[#008985] text-xs font-bold">
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Clinical Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#013A40] tracking-tight">
            Welcome, {user?.name || 'Dr. Arvind Mehta'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Senior Consultant Cardiologist • Apollo Heart & Vascular Institute • Reg: MCI-99214
          </p>
        </div>

        {/* Quick Triage Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-[#EDF5F4] px-4 py-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-2xl font-black text-[#013A40]">{pendingRequests.length}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending</div>
          </div>
          <div className="bg-[#E6F7F3] px-4 py-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-2xl font-black text-[#00A896]">{activePatients.length}</div>
            <div className="text-[11px] font-bold text-[#008985] uppercase tracking-wider">Active</div>
          </div>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-50 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1">
        <button
          onClick={() => {
            setActiveTab('requests');
            setSelectedPatient(null);
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#013A40] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Incoming Consultation Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#00A896] text-white text-[10px] font-black">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'patients'
              ? 'bg-[#013A40] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>My Active Patients</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
            {activePatients.length}
          </span>
        </button>
      </div>

      {/* TAB 1: INCOMING REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#00A896]" />
              </div>
              <h3 className="text-base font-bold text-slate-800">All Consultation Requests Reviewed</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No new pending requests from families. Switch to the Active Patients tab to review ongoing consultations.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => {
              const patient = getPatientDetails(req);
              const vitals = getPatientVitals(req);
              const allergies = getPatientAllergies(req);
              const permittedDocs = getPermittedDocs(req);

              return (
                <div
                  key={req._id}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Header Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#013A40] text-white font-extrabold flex items-center justify-center text-sm">
                        {patient.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-slate-900">{patient.fullName}</h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7F3] text-[#008985] text-[11px] font-bold">
                            {patient.bloodGroup}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                            {req.urgency || 'routine'} triage
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {patient.relation} • {patient.age} • Caregiver: {patient.emergencyContact?.name} ({patient.emergencyContact?.phone})
                        </p>
                      </div>
                    </div>

                    {/* Action Handshake Buttons */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="px-4 py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-[#00A896]" />
                        <span>Accept Consultation</span>
                      </button>
                      <button
                        onClick={() => openDeclineModal(req)}
                        className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Decline Request</span>
                      </button>
                    </div>
                  </div>

                  {/* Patient's Chief Complaint Box */}
                  <div className="bg-[#F7FAF9] rounded-2xl p-5 space-y-2 border-l-4 border-[#00A896]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#013A40] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00A896]" />
                      <span>Patient's Explanation & Reported Symptoms (Chief Complaint)</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      "{req.chiefComplaint || 'Patient requested clinical review and advice.'}"
                    </p>
                  </div>

                  {/* Vitals & Critical Allergies Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vitals Snapshot */}
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Permitted Vital Signs
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block">Blood Pressure</span>
                          <strong className="text-slate-800 font-bold text-sm">{vitals.bp}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Fasting Sugar</span>
                          <strong className="text-slate-800 font-bold text-sm">{vitals.glucose}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Heart Rate</span>
                          <strong className="text-slate-800 font-bold text-sm">{vitals.heartRate}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Weight</span>
                          <strong className="text-slate-800 font-bold text-sm">{vitals.weight}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Allergies Snapshot */}
                    <div className="p-4 rounded-2xl bg-rose-50/50 space-y-2">
                      <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Critical Drug Allergies
                      </span>
                      <div className="space-y-1.5 pt-1">
                        {allergies.map((alg, i) => (
                          <div key={i} className="text-xs flex items-center justify-between">
                            <span className="font-bold text-rose-900">{alg.title}</span>
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                              {alg.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selective Document Disclosure (Privacy-Preserved) */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#00A896]" />
                        Documents Permitted by Family ({permittedDocs.length} Attached)
                      </span>
                      <span className="text-[11px] text-slate-400 italic">
                        Private family records not selected are restricted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {permittedDocs.map((doc) => (
                        <div
                          key={doc._id}
                          className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-8 h-8 rounded-lg bg-[#E6F7F3] text-[#00A896] flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-bold text-slate-800 truncate">{doc.title}</div>
                              <div className="text-[10px] text-slate-400">
                                {doc.category} • {doc.recordDate}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                            {doc.fileSize}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE PATIENTS ROSTER */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Patient List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Patient Roster ({activePatients.length})
            </h3>
            
            {activePatients.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-500 shadow-sm">
                No active patients yet. Accept an incoming request to start a consultation.
              </div>
            ) : (
              activePatients.map((patientItem) => {
                const patient = getPatientDetails(patientItem);
                const isSelected = selectedPatient?._id === patientItem._id;
                return (
                  <div
                    key={patientItem._id}
                    onClick={() => setSelectedPatient(patientItem)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-[#013A40] text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-[#00A896] text-white'
                              : 'bg-slate-100 text-[#013A40]'
                          }`}
                        >
                          {(patient.fullName || 'P').charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm leading-tight">{patient.fullName}</h4>
                          <span
                            className={`text-[11px] font-medium ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {patient.relation} • {patient.age}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${isSelected ? 'text-[#00A896]' : 'text-slate-300'}`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Detailed Patient Clinical Record & Doctor Notes */}
          <div className="lg:col-span-2">
            {selectedPatient ? (() => {
              const patient = getPatientDetails(selectedPatient);
              const vitals = getPatientVitals(selectedPatient);
              const permittedDocs = getPermittedDocs(selectedPatient);
              return (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-[#013A40]">
                        {patient.fullName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7F3] text-[#008985] text-xs font-bold">
                        Blood Group: {patient.bloodGroup}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {patient.age} • Gender: {patient.gender} • Emergency Contact: {patient.emergencyContact?.name || 'Primary Contact'} ({patient.emergencyContact?.phone || 'On File'})
                    </p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Printer className="w-4 h-4 text-[#008985]" />
                    <span>Print Consultation Summary</span>
                  </button>
                </div>

                {/* Vitals Telemetry */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
                    <div className="text-base font-black text-[#013A40] mt-0.5">{vitals.bp}</div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Fasting Sugar</span>
                    <div className="text-base font-black text-[#013A40] mt-0.5">{vitals.glucose}</div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
                    <div className="text-base font-black text-[#013A40] mt-0.5">{vitals.heartRate}</div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Weight</span>
                    <div className="text-base font-black text-[#013A40] mt-0.5">{vitals.weight}</div>
                  </div>
                </div>

                {/* Permitted Documents */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00A896]" />
                    Family-Authorized Medical Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {permittedDocs.map((doc, idx) => (
                      <div
                        key={doc._id || idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{doc.title}</span>
                          <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
                            {doc.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {doc.previewNote || doc.recordDate || 'Authorized medical file'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DOCTOR CONSULTATION & COMMENTS SECTION */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#013A40] uppercase tracking-wider flex items-center gap-2">
                      <FileSignature className="w-4 h-4 text-[#00A896]" />
                      Doctor Clinical Recommendations & Advice Feed
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Instantly visible to family portal
                    </span>
                  </div>

                  {/* Add New Note Box */}
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Type clinical recommendations, dietary instructions, or prescription adjustments for this patient..."
                      className="w-full p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium resize-none"
                      value={newClinicalNote}
                      onChange={(e) => setNewClinicalNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAddClinicalNote(selectedPatient._id)}
                        disabled={!newClinicalNote.trim()}
                        className="px-4 py-2 bg-[#013A40] hover:bg-[#024D55] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-[#00A896]" />
                        <span>Post Clinical Advice</span>
                      </button>
                    </div>
                  </div>

                  {/* Past Consultation Notes Feed */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Consultation History & Discussion Thread
                    </span>
                    {selectedPatient.doctorNotes?.map((note, index) => {
                      const isFamilyMsg = note.sender === 'family';
                      const isFamilyPending = isFamilyMsg && note.status === 'pending_doctor_review';
                      const isDoctorPending = !isFamilyMsg && note.status !== 'acknowledged';

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-2xl space-y-2 border transition-all ${
                            isFamilyPending
                              ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                              : isFamilyMsg
                              ? 'bg-[#E6F7F3]/40 border-[#00A896]/20'
                              : 'bg-[#F7FAF9] border-slate-100'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                  isFamilyMsg
                                    ? 'bg-[#00A896] text-white'
                                    : 'bg-[#013A40] text-white'
                                }`}
                              >
                                {isFamilyMsg ? 'Patient Family' : 'Attending Doctor'}
                              </span>
                              <strong className="text-slate-900 font-bold">
                                {note.authorName || note.doctorName || 'Dr. Arvind Mehta'}
                              </strong>
                              <span className="text-slate-400">• {note.createdAt}</span>
                            </div>

                            {/* Status and Doctor Action */}
                            <div className="flex items-center gap-2">
                              {isFamilyPending ? (
                                <>
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                                    <Clock className="w-3 h-3" /> New Family Query (Pending)
                                  </span>
                                  <button
                                    onClick={() => handleMarkQueryReviewed(selectedPatient._id, index)}
                                    className="px-3 py-1 bg-[#013A40] hover:bg-[#024D55] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#00A896]" />
                                    <span>Mark Reviewed</span>
                                  </button>
                                </>
                              ) : isFamilyMsg ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Reviewed by Doctor
                                </span>
                              ) : isDoctorPending ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-600" /> Pending Family Review
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Acknowledged by Family
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-800 leading-relaxed font-medium pl-1">
                            {note.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
              );
            })() : (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-400 shadow-sm space-y-3">
                <HeartPulse className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Select a Patient to Review EMR</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click any patient from the left roster to view their authorized vitals, medical files, and post clinical notes.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* DECLINE REASON & REFERRAL MODAL */}
      {declineModalOpen && requestToDecline && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>Decline Consultation Request</span>
              </div>
              <button
                onClick={() => setDeclineModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide a professional clinical explanation for {getPatientDetails(requestToDecline).fullName}'s family and recommend an appropriate specialist referral.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reason for Decline (Clinical Rationale)
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium resize-none"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Recommended Specialist / Doctor Referral
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
                  value={referralDoctor}
                  onChange={(e) => setReferralDoctor(e.target.value)}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  The family will be given a 1-click button to redirect their consultation request to this referral.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDecline}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Decline & Referral</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}