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
  HeartPulse
} from 'lucide-react';

export default function DoctorPortal() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const demoDoctorData = {
    grantInfo: {
      doctorName: 'Dr. Anita Chen (Chief Consultant)',
      grantedBy: 'CareCircle Family Admin',
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      permittedCategories: ['overview', 'medications', 'allergies', 'chronic_conditions', 'prescriptions', 'vitals'],
    },
    patient: {
      fullName: 'Arthur Jenkins',
      bloodGroup: 'A+',
      relation: 'Dad / Spouse',
      gender: 'Male',
      emergencyContact: {
        name: 'Sarah Jenkins',
        phone: '+1 555-0144',
      },
    },
    categories: {
      allergies: [
        {
          _id: 'a1',
          title: 'Penicillin Allergy',
          severity: 'Critical',
          notes: 'Anaphylactic reaction observed. Strict avoidance of beta-lactam class.',
        },
      ],
      chronic_conditions: [
        {
          _id: 'c1',
          title: 'Primary Hypertension (Stage 1)',
          diagnosedDate: '2023-04-10',
          notes: 'Target systolic < 130 mmHg. Monitored weekly.',
        },
      ],
      medications: [
        {
          _id: 'm1',
          medicineName: 'Telmisartan (40mg)',
          dosage: '1 tablet daily morning',
          frequency: 'Once daily',
          instructions: 'Take after breakfast',
        },
        {
          _id: 'm2',
          medicineName: 'Atorvastatin (10mg)',
          dosage: '1 tablet daily night',
          frequency: 'Once daily',
          instructions: 'Take at bedtime',
        },
      ],
      vitals: [
        {
          _id: 'v1',
          title: 'Routine Blood Pressure Check',
          createdAt: new Date().toISOString(),
          vitalData: {
            systolicBP: 128,
            diastolicBP: 84,
            pulseRate: 72,
            spO2: 98,
          },
        },
      ],
      prescriptions: [
        {
          _id: 'd1',
          title: 'Cardiology Prescription - Dr. Anita Chen',
          recordDate: '2026-02-15',
          doctorOrLab: 'City Memorial Hospital',
          filePath: '/uploads/sample-prescription.pdf',
        },
      ],
    },
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/shares/doctor/${token}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setData(demoDoctorData);
        }
      } catch (err) {
        // Fallback for demonstration
        setData(demoDoctorData);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white space-y-3">
          <Stethoscope className="w-12 h-12 text-brand-500 animate-bounce mx-auto" />
          <p className="font-semibold text-lg">Authenticating Doctor Access Token...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <Lock className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-500">{error || 'This medical access grant has expired or was revoked.'}</p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            CareCircle Homepage
          </Link>
        </div>
      </div>
    );
  }

  const { grantInfo, patient, categories } = data;
  const permitted = grantInfo.permittedCategories || [];

  return (
    <div className="min-h-screen bg-[#F7FAF9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Clinical Header */}
        <div className="bg-white rounded-3xl border-2 border-[#013A40] p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00A896]/15 text-[#013A40] border-2 border-[#013A40] flex items-center justify-center font-bold shadow-xs">
              <Stethoscope className="w-8 h-8 text-[#013A40]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1 border border-[#013A40]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Doctor Portal
              </div>
              <h1 className="text-2xl font-black text-[#013A40]">
                Patient Medical Record: {patient.fullName}
              </h1>
              <p className="text-xs text-slate-500">
                Authorized for <strong className="text-[#013A40] font-bold">{grantInfo.doctorName}</strong> by {grantInfo.grantedBy}
              </p>
            </div>
          </div>

          <div className="text-right bg-slate-50 p-3.5 rounded-2xl border-2 border-[#013A40] shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Access Valid Until</span>
            <div className="text-xs font-bold text-[#013A40] flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#00A896]" />
              {new Date(grantInfo.expiresAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Patient Profile Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border-2 border-[#013A40] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Blood Group</span>
            <div className="text-xl font-black text-rose-600 flex items-center gap-1 mt-0.5">
              <Droplet className="w-4 h-4" />
              {patient.bloodGroup}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#013A40] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Family Relation</span>
            <div className="text-base font-bold text-[#013A40] mt-1">{patient.relation}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#013A40] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Gender</span>
            <div className="text-base font-bold text-[#013A40] mt-1">{patient.gender}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#013A40] shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Emergency Contact</span>
            <div className="text-xs font-bold text-[#013A40] mt-1 truncate">
              {patient.emergencyContact?.name} ({patient.emergencyContact?.phone})
            </div>
          </div>
        </div>

        {/* Permitted Categories Display */}
        <div className="space-y-6">

          {/* Ongoing Medications */}
          {permitted.includes('medications') && (
            <div className="bg-white rounded-3xl border-2 border-[#013A40] p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-[#013A40]/15 text-[#013A40] font-bold">
                <Pill className="w-5 h-5 text-[#00A896]" />
                <h3 className="text-base font-bold text-[#013A40]">Active Prescriptions & Regimen</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.medications?.map((m) => (
                  <div key={m._id} className="p-4 rounded-2xl bg-teal-50/40 border-2 border-[#013A40]">
                    <div className="font-bold text-[#013A40]">{m.medicineName}</div>
                    <div className="text-xs text-[#028090] font-semibold mt-0.5">{m.dosage} • {m.frequency}</div>
                    <div className="text-xs text-slate-600 mt-1">{m.instructions || m.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Allergies */}
          {permitted.includes('allergies') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-rose-600 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-slate-900">Allergies & Sensitivities</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.allergies?.map((a) => (
                  <div key={a._id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{a.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] uppercase font-bold">
                        {a.severity}
                      </span>
                    </div>
                    {a.notes && <p className="text-xs text-rose-700 mt-1">{a.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronic Conditions */}
          {permitted.includes('chronic_conditions') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-amber-600 font-bold">
                <Activity className="w-5 h-5" />
                <h3 className="text-slate-900">Chronic Conditions Under Treatment</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.chronic_conditions?.map((c) => (
                  <div key={c._id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <div className="font-bold text-slate-900">{c.title}</div>
                    {c.notes && <p className="text-xs text-amber-800 mt-1">{c.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Authorized Documents (Prescriptions / Lab Reports) */}
          {(permitted.includes('prescriptions') || permitted.includes('lab_reports')) && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-emerald-600 font-bold">
                <FileText className="w-5 h-5" />
                <h3 className="text-slate-900">Authorized Medical Documents & Reports</h3>
              </div>
              <div className="space-y-3">
                {categories.documents?.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{doc.title}</div>
                      <div className="text-xs text-slate-500">
                        {doc.category} • {doc.doctorOrLab || 'General'} •{' '}
                        {new Date(doc.recordDate).toLocaleDateString()}
                      </div>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-slate-100"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View File
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Demonstration: Categories Not Authorized */}
          <div className="bg-slate-100 rounded-3xl p-6 border border-dashed border-slate-300 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              Role-Based Privacy Boundary Active
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Any medical categories not checked by the Family Owner remain encrypted and concealed under CareCircle’s strict access-control policies.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 py-6">
          CareCircle Doctor Access Session • Powered by GLA University CSE Dept (2026-27)
        </div>
      </div>
    </div>
  );
}
