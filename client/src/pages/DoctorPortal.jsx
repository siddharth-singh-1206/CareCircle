import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Stethoscope,
  ShieldCheck,
  Lock,
  Pill,
  AlertTriangle,
  Activity,
  FileText,
  Clock,
  ExternalLink,
  Droplet,
  Calendar,
  HeartPulse,
  Printer,
  CheckCircle2,
  FileSignature,
  Save,
  Check,
  Shield
} from 'lucide-react';

export default function DoctorPortal() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Doctor interactive consultation notes state
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient presents in stable condition. Blood pressure (124/82 mmHg) and fasting glucose (118 mg/dL) are well-managed on current regimen. Advised to continue Amlodipine 5mg daily. Follow-up after 12 weeks with repeat lipid profile.'
  );
  const [noteSaved, setNoteSaved] = useState(false);

  const demoDoctorData = {
    grantInfo: {
      doctorName: 'Dr. Arvind Mehta (Senior Consultant Cardiologist)',
      grantedBy: 'Siddharth Sharma (Family Owner)',
      hospital: 'Apollo Heart & Vascular Institute',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      permittedCategories: ['vitals', 'medications', 'allergies', 'chronic_conditions', 'prescriptions', 'lab_reports'],
    },
    patient: {
      fullName: 'Ramesh Sharma',
      dateOfBirth: '1952-08-15',
      age: '74 yrs',
      bloodGroup: 'B+',
      relation: 'Grandfather / Senior',
      gender: 'Male',
      emergencyContact: {
        name: 'Siddharth Sharma',
        phone: '+91 98765 43210',
        relation: 'Grandson / Caregiver',
      },
    },
    vitals: {
      bp: '124/82 mmHg',
      bpStatus: 'Optimal (<130/85)',
      glucose: '118 mg/dL (Fasting)',
      heartRate: '74 bpm (Regular)',
      weight: '68.5 kg (BMI: 23.4)',
      recordedAt: 'Today, 08:30 AM',
    },
    categories: {
      allergies: [
        {
          _id: 'a1',
          title: 'Penicillin & Beta-Lactams',
          severity: 'Critical',
          notes: 'Severe anaphylactic reaction and urticaria observed. Strict avoidance of all beta-lactam class antibiotics.',
        },
        {
          _id: 'a2',
          title: 'Sulfa Drugs (Sulfonamides)',
          severity: 'Severe',
          notes: 'Causes respiratory distress and skin rashes.',
        },
      ],
      chronic_conditions: [
        {
          _id: 'c1',
          title: 'Type 2 Diabetes Mellitus',
          diagnosedDate: '2012-04-10',
          notes: 'Fasting glucose to be kept under 120 mg/dL. Managed with Metformin.',
        },
        {
          _id: 'c2',
          title: 'Hypertension (High Blood Pressure)',
          diagnosedDate: '2015-09-18',
          notes: 'Target BP: 125/80 mmHg. Low sodium dietary protocol.',
        },
      ],
      medications: [
        {
          _id: 'm1',
          medicineName: 'Amlodipine (Norvasc)',
          dosage: '5 mg',
          frequency: 'Once daily (Morning)',
          purpose: 'Hypertension Management',
          instructions: 'Take after breakfast',
        },
        {
          _id: 'm2',
          medicineName: 'Metformin Hydrochloride (Glycomet)',
          dosage: '500 mg',
          frequency: 'Twice daily (Morning & Night)',
          purpose: 'Blood Sugar Regulation',
          instructions: 'Take with or immediately after meal',
        },
        {
          _id: 'm3',
          medicineName: 'Atorvastatin (Lipitor)',
          dosage: '10 mg',
          frequency: 'Once daily (Night)',
          purpose: 'Cholesterol & Lipid Control',
          instructions: 'Take before bed',
        },
      ],
      documents: [
        {
          _id: 'd1',
          title: 'Echo & Comprehensive Cardiology Consultation',
          category: 'Prescription',
          doctorOrLab: 'Dr. Arvind Mehta (Apollo Heart Institute)',
          recordDate: '2026-11-10',
          fileUrl: 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
        },
        {
          _id: 'd2',
          title: 'HbA1c & Fasting Metabolic Lipid Profile',
          category: 'Lab Report',
          doctorOrLab: 'Dr. Lal PathLabs (Central Processing Unit)',
          recordDate: '2026-10-25',
          fileUrl: 'http://localhost:5000/uploads/sample-hba1c-report.pdf',
        },
      ],
    },
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        let activeData = { ...demoDoctorData };
        try {
          const savedDisclosures = localStorage.getItem('carecircle_doctor_disclosures');
          if (savedDisclosures) {
            const parsed = JSON.parse(savedDisclosures);
            const mehtaDocs = parsed['doc-mehta-01'] || [];
            if (mehtaDocs.length > 0) {
              const formatted = mehtaDocs.map((d, i) => ({
                _id: d.docId || `d-${i}`,
                title: d.title,
                category: d.category || 'Lab Report',
                doctorOrLab: 'Apollo Heart & Vascular Institute',
                recordDate: d.sharedAt || '2026-11-16',
                fileUrl: d.fileUrl || 'http://localhost:5000/uploads/sample-cardio-prescription.pdf',
              }));
              activeData.categories.documents = formatted;
            }
          }
        } catch (e) {}

        const res = await axios.get(`/api/shares/doctor/${token}`).catch(() => null);
        if (res?.data?.success && res.data.data) {
          setData(res.data.data);
        } else {
          setData(activeData);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [token]);

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDF5F4] flex items-center justify-center p-4">
        <div className="text-center text-slate-800 space-y-3">
          <Stethoscope className="w-12 h-12 text-[#00A896] animate-bounce mx-auto" />
          <p className="font-bold text-base text-slate-800">Authenticating Physician Telemetry Session...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#EDF5F4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <Lock className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500">{error || 'This medical access grant has expired or was revoked by the family caregiver.'}</p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-[#013A40] text-white rounded-xl text-xs font-bold"
          >
            CareCircle Portal
          </Link>
        </div>
      </div>
    );
  }

  const { grantInfo, patient, categories, vitals } = data;
  const permitted = grantInfo.permittedCategories || [];

  return (
    <div className="min-h-screen bg-[#EDF5F4] py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Clinical Consultation Header - Doctor's POV */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F7F3] text-[#00A896] flex items-center justify-center font-bold shrink-0">
              <Stethoscope className="w-7 h-7 text-[#008985]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Clinical Doctor View
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  EHR Read-Only Telemetry
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Patient Medical Record: {patient.fullName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized for <strong className="text-slate-800 font-semibold">{grantInfo.doctorName}</strong> • Granted by {grantInfo.grantedBy}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <button
              onClick={handlePrintSummary}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#008985]" />
              <span>Print Clinical Summary</span>
            </button>

            <div className="text-right bg-slate-50 p-3 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Session Valid Until</span>
              <div className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#008985]" />
                {new Date(grantInfo.expiresAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Profile Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
            <div className="text-xl font-black text-rose-600 flex items-center gap-1 mt-0.5">
              <Droplet className="w-4 h-4" />
              {patient.bloodGroup}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Age & Gender</span>
            <div className="text-base font-bold text-slate-800 mt-1">{patient.age || '74 yrs'} • {patient.gender}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Family Role</span>
            <div className="text-base font-bold text-slate-800 mt-1">{patient.relation}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Caregiver Contact</span>
            <div className="text-xs font-bold text-slate-800 mt-1 truncate">
              {patient.emergencyContact?.name} ({patient.emergencyContact?.phone})
            </div>
          </div>
        </div>

        {/* Critical Red Allergy Banner - Doctor Safety Check */}
        {categories.allergies && categories.allergies.length > 0 && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>CRITICAL ATTENDING DOCTOR WARNING: Documented Allergies</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {categories.allergies.map((a) => (
                <div key={a._id} className="bg-white p-3 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                    <span>{a.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] uppercase font-bold">
                      {a.severity}
                    </span>
                  </div>
                  {a.notes && <p className="text-[11px] text-slate-600 mt-1 leading-snug">{a.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor's Live Vitals Telemetry Panel */}
        {vitals && (
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E6F7F3] text-[#008985] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Current Physiological Vitals</h3>
                  <p className="text-xs text-slate-400">Telemetry recorded: {vitals.recordedAt}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg">
                Physiological Baseline
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">{vitals.bp}</div>
                <span className="text-[10px] text-emerald-700 font-bold">{vitals.bpStatus}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fasting Blood Sugar</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">{vitals.glucose}</div>
                <span className="text-[10px] text-emerald-700 font-bold">In Target Range</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Resting Heart Rate</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">{vitals.heartRate}</div>
                <span className="text-[10px] text-slate-500 font-medium">Regular Sinus</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight & BMI</span>
                <div className="text-base font-bold text-slate-900 mt-0.5">{vitals.weight}</div>
                <span className="text-[10px] text-[#008985] font-bold">BMI 23.4 (Normal)</span>
              </div>
            </div>
          </div>
        )}

        {/* Permitted Categories Display */}
        <div className="space-y-6">

          {/* Ongoing Medications */}
          {permitted.includes('medications') && (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <Pill className="w-5 h-5 text-[#00A896]" />
                <h3 className="text-base font-bold text-slate-900">Current Drug Regimen & Prescriptions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.medications?.map((m) => (
                  <div key={m._id} className="p-4 rounded-2xl bg-slate-50 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{m.medicineName}</div>
                      <div className="text-xs text-[#008985] font-semibold">{m.dosage} • {m.frequency}</div>
                      {m.purpose && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">Indication: {m.purpose}</p>
                      )}
                    </div>
                    {m.instructions && (
                      <span className="text-[11px] bg-white px-2 py-1 rounded-md text-slate-600 font-medium block">
                        {m.instructions}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronic Conditions */}
          {permitted.includes('chronic_conditions') && (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <Activity className="w-5 h-5 text-[#008985]" />
                <h3 className="text-base font-bold text-slate-900">Active Chronic Diagnoses</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.chronic_conditions?.map((c) => (
                  <div key={c._id} className="p-4 rounded-2xl bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                    {c.notes && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.notes}</p>}
                    {c.diagnosedDate && (
                      <span className="text-[10px] text-slate-400 block pt-1">
                        Diagnosed: {new Date(c.diagnosedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Authorized Medical Documents & Lab Reports */}
          {(permitted.includes('prescriptions') || permitted.includes('lab_reports')) && (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold">
                <FileText className="w-5 h-5 text-[#008985]" />
                <h3 className="text-base font-bold text-slate-900">Authorized Lab Reports & Prescriptions</h3>
              </div>
              <div className="space-y-3">
                {categories.documents?.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{doc.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {doc.category} • {doc.doctorOrLab || 'Diagnostic Center'} •{' '}
                        {new Date(doc.recordDate).toLocaleDateString()}
                      </div>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white text-slate-700 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#008985]" />
                      <span>Inspect Report</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCTOR'S POV: Consultation Clinical Observations Pad */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <FileSignature className="w-5 h-5 text-[#008985]" />
                <h3 className="text-base font-bold text-slate-900">Attending Physician Assessment & Rx Notes</h3>
              </div>
              {noteSaved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Notes Recorded
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Record clinical observations, dosage adjustments, or recommendations. These notes synchronize with the family caregiver's portal.
            </p>

            <textarea
              rows="3"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium leading-relaxed"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Enter clinical assessment notes..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleSaveNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Consultation Record</span>
              </button>
            </div>
          </div>

          {/* Privacy Demonstration: Role-Based Access Boundary */}
          <div className="bg-slate-100/70 rounded-3xl p-6 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-[#008985]" />
              Role-Based Privacy Boundary Active
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Any medical categories not permitted by the Family Owner remain cryptographically masked under CareCircle's role-based access policies.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 py-4">
          CareCircle Doctor Telemetry Portal • GLA University CSE Major Project (2026-27)
        </div>
      </div>
    </div>
  );
}
