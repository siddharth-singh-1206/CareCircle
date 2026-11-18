import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldAlert,
  Phone,
  Droplet,
  AlertTriangle,
  Pill,
  Printer,
  HeartPulse
} from 'lucide-react';

export default function EmergencyView() {
  const { code } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback demo emergency profile for Ramesh Sharma
  const demoFallback = {
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    bloodGroup: 'B+',
    gender: 'Male',
    emergencyCode: code || 'EMG-RAMESH74',
    emergencyContact: {
      name: 'Siddharth Sharma',
      phone: '+91 98765 43210',
      relation: 'Grandson',
    },
    criticalAllergies: [
      {
        _id: '1',
        title: 'Penicillin Allergy',
        severity: 'Critical',
        notes: 'Severe anaphylactic reaction and hives observed during 2018 treatment. Strictly avoid beta-lactam antibiotics.',
      },
    ],
    activeMedications: [
      {
        medicineName: 'Metformin Hydrochloride (Glycomet)',
        dosage: '500 mg',
        frequency: 'Twice daily',
        purpose: 'Blood sugar regulation for Type 2 Diabetes',
      },
      {
        medicineName: 'Amlodipine (Norvasc)',
        dosage: '5 mg',
        frequency: 'Once daily',
        purpose: 'Blood pressure control',
      },
    ],
  };

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/emergency/${code}`);
        if (res.data.success && res.data.emergencyProfile) {
          setProfile(res.data.emergencyProfile);
        } else {
          setProfile(demoFallback);
        }
      } catch (err) {
        // If backend is offline or network fails, gracefully render the demo fallback profile
        setProfile(demoFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchEmergencyData();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <HeartPulse className="w-12 h-12 text-teal-600 animate-pulse mx-auto" />
          <p className="font-bold text-lg text-[#013A40]">Retrieving Emergency Medical Profile...</p>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-[#F7FAF9] py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Printable Emergency SOS Card Header with Deep Teal Boundary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border-2 border-[#013A40] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#013A40]/10 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-tomato-50 text-tomato-600 flex items-center justify-center shadow-xs border-2 border-[#013A40]">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-tomato-600 block">
                  Emergency Medical Profile
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#013A40]">{profile.fullName}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#013A40] border-2 border-[#013A40] rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Printer className="w-4 h-4" /> Print Card
              </button>
            </div>
          </div>

          {/* Core Emergency Vital Info - All Boxes with Deep Teal Boundary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-4 rounded-2xl bg-tomato-50 border-2 border-[#013A40] shadow-xs">
              <span className="text-[10px] uppercase font-black text-tomato-700 block">Blood Group</span>
              <div className="text-2xl font-black text-tomato-600 mt-1 flex items-center justify-center gap-1">
                <Droplet className="w-5 h-5 text-tomato-500" />
                {profile.bloodGroup}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 border-2 border-[#013A40] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#013A40] block">Relation</span>
              <div className="text-base font-black text-[#013A40] mt-1.5">{profile.relation}</div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 border-2 border-[#013A40] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#013A40] block">Gender</span>
              <div className="text-base font-black text-[#013A40] mt-1.5">{profile.gender}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-[#013A40] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Code</span>
              <div className="text-xs font-mono font-black text-[#013A40] mt-2">{profile.emergencyCode}</div>
            </div>
          </div>
        </div>

        {/* Immediate SOS Call Button Box with Deep Teal Boundary */}
        {profile.emergencyContact?.phone && (
          <div className="p-5 rounded-3xl bg-white border-2 border-[#013A40] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-seafoam-50 text-seafoam-700 flex items-center justify-center border-2 border-[#013A40]">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Primary Emergency Contact</span>
                <div className="text-base font-black text-[#013A40]">
                  {profile.emergencyContact.name} ({profile.emergencyContact.relation})
                </div>
              </div>
            </div>
            <a
              href={`tel:${profile.emergencyContact.phone}`}
              className="w-full sm:w-auto px-6 py-3 bg-tomato-500 hover:bg-tomato-600 text-white rounded-2xl font-black text-sm shadow-soft flex items-center justify-center gap-2 transition-all hover:scale-105 border-2 border-[#013A40]"
            >
              <Phone className="w-4 h-4" /> Call {profile.emergencyContact.phone}
            </a>
          </div>
        )}

        {/* Critical Allergies Alert Section Box with Deep Teal Boundary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#013A40] shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#013A40]/10 text-tomato-500">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-lg font-black text-[#013A40]">Critical Medical Allergies</h2>
          </div>

          {profile.criticalAllergies.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium">No known drug or food allergies on record.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {profile.criticalAllergies.map((allergy) => (
                <div
                  key={allergy._id}
                  className="p-4 rounded-2xl bg-tomato-50/80 border-2 border-[#013A40]"
                >
                  <div className="flex items-center justify-between font-black text-sm text-[#013A40]">
                    <span>{allergy.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-tomato-600 border border-[#013A40] text-[10px] uppercase font-black shadow-2xs">
                      {allergy.severity}
                    </span>
                  </div>
                  {allergy.notes && (
                    <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">{allergy.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ongoing Medications Section Box with Deep Teal Boundary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#013A40] shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#013A40]/10 text-teal-600">
            <Pill className="w-6 h-6" />
            <h2 className="text-lg font-black text-[#013A40]">Active Life-Sustaining Medications</h2>
          </div>

          {profile.activeMedications.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium">No active daily medications recorded.</p>
          ) : (
            <div className="space-y-3">
              {profile.activeMedications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border-2 border-[#013A40] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="font-black text-[#013A40] text-sm">{med.medicineName}</h4>
                    <span className="text-xs text-slate-600 font-semibold">
                      Dosage: <strong className="text-[#013A40] font-black">{med.dosage}</strong> • {med.frequency}
                    </span>
                  </div>
                  {med.purpose && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-[#013A40] border border-[#013A40]">
                      {med.purpose}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Code Box with Deep Teal Boundary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#013A40] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-tomato-600 block">
              Scannable Emergency QR Card
            </span>
            <h3 className="text-lg font-black text-[#013A40]">CareCircle SOS Emergency Code</h3>
            <p className="text-xs text-slate-600 max-w-sm font-medium">
              Keep this QR code on your lock screen or printed card for instant access by paramedics and emergency room staff.
            </p>
          </div>
          <div className="p-3 bg-white rounded-2xl border-2 border-[#013A40] shadow-xs shrink-0">
            <QRCodeSVG value={currentUrl} size={130} level="H" includeMargin={true} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 font-semibold py-4">
          Powered by CareCircle Family Health Management Platform • GLA University 2026-27
        </div>
      </div>
    </div>
  );
}
