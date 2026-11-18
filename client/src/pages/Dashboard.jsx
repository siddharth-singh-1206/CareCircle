import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
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
  ArrowRight
} from 'lucide-react';

const DEFAULT_PATIENT = {
  _id: 'default-ramesh',
  fullName: 'Ramesh Sharma',
  relation: 'Grandfather',
  bloodGroup: 'B+',
  household: 'Sharma Family Health Circle',
  primaryDoctor: 'Dr. Arvind Mehta (Cardiologist)',
  emergencyContact: {
    name: 'Siddharth Sharma',
    phone: '+91 98765 43210',
  },
  emergencyCode: 'EMG-RAMESH74',
};

const DEFAULT_DOSES = [
  {
    id: 1,
    medicineName: 'Amlodipine (Norvasc)',
    dosage: '5 mg',
    slot: 'Morning',
    icon: Sun,
    slotBadge: 'bg-[#E8F8F3] text-[#008985]',
    foodRelation: 'After Meal',
    status: 'taken', // 'taken' | 'pending'
  },
  {
    id: 2,
    medicineName: 'Metformin Hydrochloride (Glycomet)',
    dosage: '500 mg',
    slot: 'Morning',
    icon: Sun,
    slotBadge: 'bg-[#E8F8F3] text-[#008985]',
    foodRelation: 'After Meal',
    status: 'pending',
  },
  {
    id: 3,
    medicineName: 'Metformin Hydrochloride (Glycomet)',
    dosage: '500 mg',
    slot: 'Night',
    icon: Moon,
    slotBadge: 'bg-[#E2F0FE] text-[#1D4ED8]',
    foodRelation: 'After Meal',
    status: 'pending',
  },
];

export default function Dashboard() {
  const { user, family, members, selectedMember, setSelectedMember } = useAuth();
  const navigate = useNavigate();

  const [doses, setDoses] = useState(DEFAULT_DOSES);
  const [toastMsg, setToastMsg] = useState('');

  // Use selected member or fallback to Ramesh Sharma matching the screenshot
  const patient = selectedMember || (members && members.length > 0 ? members[0] : DEFAULT_PATIENT);

  const toggleDose = (id) => {
    setDoses((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'taken' ? 'pending' : 'taken';
          setToastMsg(`${item.medicineName} marked as ${nextStatus}`);
          setTimeout(() => setToastMsg(''), 2500);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const totalCount = doses.length;
  const percentage = Math.round((takenCount / totalCount) * 100);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#013A40] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00A896]"></span>
          {toastMsg}
        </div>
      )}

      {/* 1. Patient Profile Header Card matching screenshot */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#D5F0EB] text-[#013A40] flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-[#013A40]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {patient.fullName}
              </h1>

              {/* Grandfather badge */}
              <span className="bg-[#D7F2EC] text-[#008985] text-xs font-bold px-3 py-0.5 rounded-full">
                {patient.relation}
              </span>

              {/* Blood Group badge */}
              <span className="bg-[#FFF0F0] text-[#DE3B3B] border border-[#FFD5D5] text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Droplet className="w-3 h-3 text-[#DE3B3B]" />
                {patient.bloodGroup}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1.5 font-normal">
              Household: <strong className="text-slate-800 font-bold">{family?.familyName || patient.household || 'Sharma Family Health Circle'}</strong> • 
              Primary Physician: <strong className="text-slate-800 font-bold">{patient.primaryDoctor?.name || patient.primaryDoctor || 'Dr. Arvind Mehta (Cardiologist)'}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/members')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>

          <Link
            to="/doctor-sharing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#013A40] hover:bg-[#024D55] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </Link>
        </div>

      </div>

      {/* 2. Four Metric Cards Row matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: TODAY'S REGIMEN with circular Donut progress ring */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#E8F8F3] text-[#00A896] flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#00A896]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                TODAY'S REGIMEN
              </span>
            </div>

            <div className="pt-1">
              <div className="text-2xl font-black text-slate-900 leading-tight">
                {takenCount} <span className="text-xs font-medium text-slate-500">/ {totalCount} doses</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {percentage}% completed
              </p>
            </div>
          </div>

          {/* Compact Circular SVG Donut Progress Chart */}
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
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-slate-800">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Metric 2: EMERGENCY CONTACT */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EAF2FF] text-[#2563EB] flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#2563EB]" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              EMERGENCY CONTACT
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-base font-bold text-slate-900 truncate">
              {patient.emergencyContact?.name || 'Siddharth Sharma'}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              {patient.emergencyContact?.phone || '+91 98765 43210'}
            </div>
          </div>
        </div>

        {/* Metric 3: CONDITIONS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FEE8E8] text-[#DE3B3B] flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#DE3B3B]" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              CONDITIONS
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              2
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Under active care
            </div>
          </div>
        </div>

        {/* Metric 4: ARCHIVED REPORTS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#F0EBFE] text-[#7C3AED] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#7C3AED]" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              ARCHIVED REPORTS
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              2
            </div>
            <Link
              to="/documents"
              className="text-xs text-[#2563EB] font-bold hover:underline mt-0.5 inline-flex items-center gap-1"
            >
              View reports →
            </Link>
          </div>
        </div>

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

          {/* Doses Checklist Items */}
          <div className="space-y-3 pt-1">
            {doses.map((item) => {
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
                      <h3 className="font-bold text-sm text-slate-900">
                        {item.medicineName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                        <span className="font-medium text-slate-600">{item.dosage}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${item.slotBadge}`}>
                          <item.icon className="w-3 h-3" />
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
            })}
          </div>

        </div>

        {/* Right Column: Allergies & Alerts + Chronic Illnesses (1 col wide) */}
        <div className="space-y-6">
          
          {/* Card 1: Allergies & Alerts */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-[#FEE8E8] text-[#DE3B3B] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#DE3B3B]" />
              </div>
              <h2 className="font-bold text-base text-slate-900">
                Allergies & Alerts
              </h2>
            </div>

            {/* Inner allergy container matching screenshot */}
            <div className="bg-[#FFF6F6] border border-[#FFDFDF] rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#881337]">
                  Penicillin Allergy
                </h3>
                <span className="bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Severe anaphylactic reaction and hives observed during 2018 treatment.
              </p>
            </div>
          </div>

          {/* Card 2: Chronic Illnesses */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-[#E0F7F5] text-[#00A896] flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#00A896]" />
              </div>
              <h2 className="font-bold text-base text-slate-900">
                Chronic Illnesses
              </h2>
            </div>

            {/* Inner chronic condition container matching screenshot */}
            <div className="bg-[#F0FAF9] border border-[#D5EFEA] rounded-2xl p-4.5 space-y-1.5">
              <h3 className="font-bold text-sm text-[#013A40]">
                Type 2 Diabetes Mellitus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Fasting glucose to be kept under 120 mg/dL. Managed with Metformin.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
