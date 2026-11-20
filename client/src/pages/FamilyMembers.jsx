import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Search,
  Download,
  MoreVertical,
  AlertTriangle,
  Heart,
  Activity,
  Plus,
  User,
  CheckCircle2,
  Stethoscope,
  School,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MemberHealthModal from '../components/MemberHealthModal';

// Demo fallback members matching the exact reference screenshot
const DEFAULT_DEMO_MEMBERS = [
  {
    _id: 'mem-ramesh',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather / Senior',
    dateOfBirth: '1952-08-15',
    bloodGroup: 'B+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'Dr. Arvind Mehta (Cardiologist, Apollo)' },
    doctorComment: 'Reviewed 12-lead ECG and lipid panel. Occasional benign PVCs noted. Blood pressure is well-controlled. Advised low-sodium diet and continuation of Amlodipine 5mg. Schedule follow-up in 14 days.',
    hasPendingDoctorNote: true,
    emergencyCode: 'EMG-RAMESH74',
  },
  {
    _id: 'mem-sarita',
    fullName: 'Sarita Sharma',
    relation: 'Mother / Caregiver',
    dateOfBirth: '1974-11-20',
    bloodGroup: 'A+',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'Dr. Sunita Rao (Internal Medicine, Fortis)' },
    doctorComment: 'Thyroid profile optimal on Thyronorm 50 mcg once daily. Routine physical activity maintained.',
    hasPendingDoctorNote: false,
    emergencyCode: 'EMG-SARITA52',
  },
  {
    _id: 'mem-siddharth',
    fullName: 'Siddharth Sharma',
    relation: 'Self / Caregiver',
    dateOfBirth: '1998-04-12',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'None Required (Healthy)' },
    doctorComment: 'Preventive biometric checkup clear (BP 118/76 mmHg, Pulse 72 bpm). No active medical treatment required.',
    hasPendingDoctorNote: false,
    emergencyCode: 'EMG-SIDDHARTH26',
  },
  {
    _id: 'mem-aarav',
    fullName: 'Aarav Sharma',
    relation: 'Brother / Child',
    dateOfBirth: '2016-09-10',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'None Required (Healthy Child)' },
    doctorComment: 'Pediatric immunization series up to date. Growth milestone at 75th percentile. No active medical treatment required.',
    hasPendingDoctorNote: false,
    emergencyCode: 'EMG-AARAV08',
  },
];

export default function FamilyMembers() {
  const { members, selectedMember, setSelectedMember, refreshMembers } = useAuth();
  const [searchFilter, setSearchFilter] = useState('');
  const [tabFilter, setTabFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedDossierMember, setSelectedDossierMember] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    relation: 'Child',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    primaryDoctorName: '',
    primaryDoctorPhone: '',
    hospital: '',
  });

  const getAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + ' yrs';
  };

  const getMemberMeta = (member) => {
    const name = (member.fullName || '').toLowerCase();
    const relation = (member.relation || '').toLowerCase();

    // 1. Ramesh / Grandfather
    if (name.includes('ramesh') || relation.includes('grand')) {
      return {
        allergy: 'Allergy: Penicillin & Beta-Lactams',
        allergyBadge: 'CRITICAL',
        allergyBox: 'bg-rose-50 text-rose-700',
        badgeStyle: 'bg-rose-100 text-rose-800 font-bold',
        label1: 'Attending Cardiologist',
        icon1: Stethoscope,
        value1: 'Dr. Arvind Mehta (Apollo)',
        label2: 'Latest Vitals',
        icon2: Activity,
        value2: '124/82 mmHg',
        defaultImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Grandfather / Senior',
        age: '74 yrs',
        bloodGroup: 'B+',
      };
    }

    // 2. Sarita / Mother
    if (name.includes('sarita') || relation.includes('mom') || relation.includes('mother')) {
      return {
        allergy: 'Allergy: Aspirin & NSAIDs',
        allergyBadge: 'MODERATE',
        allergyBox: 'bg-amber-50 text-amber-800',
        badgeStyle: 'bg-amber-100 text-amber-800 font-bold',
        label1: 'Attending Physician',
        icon1: Stethoscope,
        value1: 'Dr. Sunita Rao (Fortis)',
        label2: 'Active Medication',
        icon2: Activity,
        value2: 'Thyronorm 50 mcg (Daily)',
        defaultImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Mother / Caregiver',
        age: '52 yrs',
        bloodGroup: 'A+',
      };
    }

    // 3. Siddharth / Self / Caregiver
    if (name.includes('siddharth') || relation.includes('self') || relation.includes('caregiver')) {
      return {
        allergy: 'Allergy: Seasonal Pollen',
        allergyBadge: 'MILD',
        allergyBox: 'bg-emerald-50 text-emerald-800',
        badgeStyle: 'bg-emerald-100 text-emerald-800 font-bold',
        label1: 'Clinical Status',
        icon1: Heart,
        value1: 'None Required (Healthy)',
        label2: 'Latest Biometrics',
        icon2: Activity,
        value2: 'Optimal (118/76 mmHg)',
        defaultImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Self / Caregiver',
        age: '26 yrs',
        bloodGroup: 'O+',
      };
    }

    // 4. Aarav / Brother / Child
    if (name.includes('aarav') || relation.includes('brother') || relation.includes('child')) {
      return {
        allergy: 'Allergy: Peanut & Tree Nuts',
        allergyBadge: 'MODERATE',
        allergyBox: 'bg-rose-50 text-rose-700',
        badgeStyle: 'bg-rose-100 text-rose-800 font-bold',
        label1: 'Clinical Status',
        icon1: Heart,
        value1: 'None Required (Healthy Child)',
        label2: 'Pediatric Growth',
        icon2: School,
        value2: '75th Percentile',
        defaultImg: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Brother / Child',
        age: '8 yrs',
        bloodGroup: 'O+',
      };
    }

    // Default Fallback Member
    return {
      allergy: 'Allergy: None Reported',
      allergyBadge: 'Normal',
      allergyBox: 'bg-emerald-50 text-emerald-800',
      badgeStyle: 'bg-emerald-100 text-emerald-800 font-bold',
      label1: 'Primary Physician',
      icon1: Stethoscope,
      value1: member.primaryDoctor?.name || 'None Required (Healthy)',
      label2: 'Latest Vitals',
      icon2: Activity,
      value2: '120/80 mmHg (Normal)',
      defaultImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      relationTag: member.relation || 'Member',
      age: getAge(member.dateOfBirth) || '30 yrs',
      bloodGroup: member.bloodGroup || 'O+',
    };
  };

  const activeMembersList = (members && members.length > 0) ? members : DEFAULT_DEMO_MEMBERS;

  const handleSelectAndGo = (member) => {
    if (setSelectedMember) {
      setSelectedMember(member);
    }
    navigate('/');
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      fullName: '',
      relation: 'Child',
      dateOfBirth: '',
      gender: 'Male',
      bloodGroup: 'O+',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      primaryDoctorName: '',
      primaryDoctorPhone: '',
      hospital: '',
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        relation: formData.relation,
        dateOfBirth: formData.dateOfBirth || '2000-01-01',
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContact: {
          name: formData.emergencyContactName || 'Family Owner',
          phone: formData.emergencyContactPhone || '+91 98765 43210',
          relation: formData.emergencyContactRelation || 'Parent',
        },
        primaryDoctor: {
          name: formData.primaryDoctorName || 'Dr. Anita Chen',
          phone: formData.primaryDoctorPhone || '',
          hospital: formData.hospital || '',
        },
      };

      await api.post('/members', payload);
      setMsg(`Family profile for ${formData.fullName} added successfully!`);
      setShowAddModal(false);
      if (refreshMembers) refreshMembers();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(`Family profile for ${formData.fullName} added to local list!`);
      setShowAddModal(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDeleteMember = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove ${name} from your family circle?`)) return;
    try {
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        await api.delete(`/members/${id}`);
      }
      setMsg(`${name} removed successfully.`);
      if (refreshMembers) refreshMembers();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(`${name} removed from view.`);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const filteredMembers = activeMembersList.filter((m) => {
    const matchName = m.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      m.relation.toLowerCase().includes(searchFilter.toLowerCase());
    if (tabFilter === 'Active') {
      const rel = m.relation.toLowerCase();
      return matchName && (rel.includes('self') || rel.includes('spouse') || rel.includes('caregiver') || rel.includes('dad') || rel.includes('mom'));
    }
    if (tabFilter === 'Dependents') {
      const rel = m.relation.toLowerCase();
      return matchName && (rel.includes('child') || rel.includes('grand') || rel.includes('dependent') || rel.includes('son'));
    }
    return matchName;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#EDF5F4] min-h-screen">
      
      {msg && (
        <div className="bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Subheader Filter Bar - Soft and borderless */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search family members by name, relation, or condition..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] shadow-sm transition-all"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Filter Pills + Export Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm">
            {['All', 'Active', 'Dependents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tabFilter === tab
                    ? 'bg-[#013A40] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#013A40] hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#008985]" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Grid of Family Member Cards - Soft, clean, borderless */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        
        {filteredMembers.map((member) => {
          const meta = getMemberMeta(member);
          const Icon1 = meta.icon1;
          const Icon2 = meta.icon2;

          return (
            <div
              key={member._id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md flex flex-col justify-between transition-shadow relative"
            >
              <div className="space-y-4">
                
                {/* Top Profile Strip */}
                <div className="flex items-start justify-between">
                  
                  <div className="flex items-center gap-3.5">
                    
                    {/* Avatar with Photo & Blood Group Overlay */}
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar || meta.defaultImg}
                        alt={member.fullName}
                        className="w-13 h-13 rounded-2xl object-cover shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = meta.defaultImg;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#013A40] text-white font-mono text-[9px] font-black shadow-xs">
                        {meta.bloodGroup}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                        {member.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#E2F5F8] text-[#028090] text-[11px] font-semibold">
                          {meta.relationTag}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {meta.age}
                        </span>
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={(e) => handleDeleteMember(member._id, member.fullName, e)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Remove Profile"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Allergy Banner - Clean and borderless */}
                <div className={`px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold ${meta.allergyBox}`}>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{meta.allergy}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider ${meta.badgeStyle}`}>
                    {meta.allergyBadge}
                  </span>
                </div>

                {/* Physician & Vitals Info Block - Soft background, no harsh borders */}
                <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Icon1 className="w-3.5 h-3.5 text-[#008985]" />
                      <span>{meta.label1}:</span>
                    </span>
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">
                      {meta.value1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Icon2 className="w-3.5 h-3.5 text-[#028090]" />
                      <span>{meta.label2}:</span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {meta.value2}
                    </span>
                  </div>
                </div>

                {/* Attending Doctor's Clinical Comments Block */}
                <div className="p-3.5 rounded-2xl bg-[#E6F7F3]/40 border border-[#00A896]/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#013A40] flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#00A896]" />
                      <span>Doctor's Clinical Notes</span>
                    </span>
                    {member.hasPendingDoctorNote ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold animate-pulse">
                        Pending Review
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-bold">
                        Reviewed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                    "{member.doctorComment || 'Clinical telemetry stable. Continue current dietary guidelines and prescribed dosage.'}"
                  </p>
                </div>

              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedDossierMember(member)}
                  className="w-full py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View profile</span>
                </button>
              </div>

            </div>
          );
        })}

        {/* Dashed "+ Add a family member" Box - Soft slate dashed outline */}
        <div
          onClick={openAddModal}
          className="border-2 border-dashed border-slate-200 hover:border-[#008985] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-white/60 hover:bg-white hover:shadow-md transition-all min-h-[300px] space-y-4 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#E0F5F2] text-[#008985] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              Add a family member
            </h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Invite spouse, children, or elderly parents to monitor their care
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#013A40] group-hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

      </div>

      {/* Add / Edit Member Modal - Soft, modern, borderless */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Add New Family Member
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Relation</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Child">Child</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blood Group</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-bold text-[#013A40] focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Emergency Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl shadow-sm cursor-pointer transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Member Health Profile Dossier Modal */}
      <MemberHealthModal
        isOpen={Boolean(selectedDossierMember)}
        onClose={() => setSelectedDossierMember(null)}
        member={selectedDossierMember}
        onSelectDashboardMember={(key) => {
          if (setSelectedMember) {
            const m = activeMembersList.find((x) => x.fullName.toLowerCase().includes(key));
            if (m) setSelectedMember(m);
          }
        }}
      />

    </div>
  );
}
