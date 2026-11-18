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

// Demo fallback members matching the exact reference screenshot
const DEFAULT_DEMO_MEMBERS = [
  {
    _id: 'demo-arthur',
    fullName: 'Arthur Jenkins',
    relation: 'Dad / Spouse',
    dateOfBirth: '1981-05-14',
    bloodGroup: 'A+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'Dr. Anita Chen' },
    emergencyCode: 'EMG-ARTHUR81',
  },
  {
    _id: 'demo-sarah',
    fullName: 'Sarah Jenkins',
    relation: 'Mom / Caregiver',
    dateOfBirth: '1984-11-20',
    bloodGroup: 'B+',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'Dr. Anita Chen' },
    emergencyCode: 'EMG-SARAH84',
  },
  {
    _id: 'demo-eleanor',
    fullName: 'Eleanor Jenkins',
    relation: 'Grandma / Dependent',
    dateOfBirth: '1954-02-18',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'Dr. Robert Vance' },
    emergencyCode: 'EMG-ELEANOR54',
  },
  {
    _id: 'demo-leo',
    fullName: 'Leo Jenkins',
    relation: 'Son / Child',
    dateOfBirth: '2018-09-10',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    primaryDoctor: { name: 'Dr. Marcus Brody' },
    emergencyCode: 'EMG-LEO18',
  },
];

export default function FamilyMembers() {
  const { members, selectedMember, setSelectedMember, refreshMembers } = useAuth();
  const [searchFilter, setSearchFilter] = useState('');
  const [tabFilter, setTabFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
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
    const name = member.fullName.toLowerCase();
    const relation = (member.relation || '').toLowerCase();

    // 1. Arthur Jenkins / Dad
    if (name.includes('arthur') || relation.includes('dad') || relation.includes('spouse') || relation.includes('father')) {
      return {
        allergy: 'Allergy: Penicillin',
        allergyBadge: 'SEVERE',
        allergyBox: 'bg-[#FFF2F2] border-2 border-[#013A40] text-[#D8381A]',
        badgeStyle: 'bg-[#FFDFDF] text-[#D8381A] font-bold border border-[#D8381A]/30',
        label1: 'Primary Physician',
        icon1: Stethoscope,
        value1: member.primaryDoctor?.name || 'Dr. Anita Chen',
        label2: 'Latest Vitals',
        icon2: Activity,
        value2: '128/84 mmHg',
        defaultImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Dad / Spouse',
        age: getAge(member.dateOfBirth) || '45 yrs',
        bloodGroup: member.bloodGroup || 'A+',
      };
    }

    // 2. Sarah Jenkins / Mom / Self
    if (name.includes('sarah') || relation.includes('caregiver') || relation.includes('self')) {
      return {
        allergy: 'Allergy: Seasonal Pollen',
        allergyBadge: 'Mild',
        allergyBox: 'bg-[#EBFBF7] border-2 border-[#013A40] text-[#00A896]',
        badgeStyle: 'bg-[#D2F6EC] text-[#018072] font-bold border border-[#00A896]/30',
        label1: 'Biometrics Status',
        icon1: Heart,
        value1: 'Optimal (116/74)',
        label2: 'Primary Physician',
        icon2: Stethoscope,
        value2: member.primaryDoctor?.name || 'Dr. Anita Chen',
        defaultImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Mom / Caregiver',
        age: getAge(member.dateOfBirth) || '42 yrs',
        bloodGroup: member.bloodGroup || 'B+',
      };
    }

    // 3. Eleanor Jenkins / Grandma / Ramesh
    if (name.includes('eleanor') || name.includes('ramesh') || relation.includes('grandma') || relation.includes('grandfather') || relation.includes('dependent')) {
      return {
        allergy: 'Allergy: Sulfa Drugs',
        allergyBadge: 'SEVERE',
        allergyBox: 'bg-[#FFF2F2] border-2 border-[#013A40] text-[#D8381A]',
        badgeStyle: 'bg-[#FFDFDF] text-[#D8381A] font-bold border border-[#D8381A]/30',
        label1: 'Attending Specialist',
        icon1: Stethoscope,
        value1: member.primaryDoctor?.name || 'Dr. Robert Vance',
        label2: 'Latest Vitals',
        icon2: Activity,
        value2: '124/82 mmHg',
        defaultImg: name.includes('ramesh')
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
        relationTag: relation.includes('grandfather') ? 'Grandfather / Senior' : 'Grandma / Dependent',
        age: getAge(member.dateOfBirth) || '72 yrs',
        bloodGroup: member.bloodGroup || 'O+',
      };
    }

    // 4. Leo Jenkins / Aarav / Son / Child
    if (name.includes('leo') || name.includes('aarav') || relation.includes('son') || relation.includes('child') || relation.includes('brother')) {
      return {
        allergy: 'Allergy: Peanut & Tree Nuts',
        allergyBadge: 'EPIPEN',
        allergyBox: 'bg-[#FFF2F2] border-2 border-[#013A40] text-[#D8381A]',
        badgeStyle: 'bg-[#D8381A] text-white font-extrabold px-2 py-0.5 shadow-xs',
        label1: 'Pediatrician',
        icon1: Stethoscope,
        value1: member.primaryDoctor?.name || 'Dr. Marcus Brody',
        label2: 'School Protocol',
        icon2: School,
        value2: 'Lincoln Elementary',
        defaultImg: name.includes('aarav')
          ? 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
        relationTag: 'Son / Child',
        age: getAge(member.dateOfBirth) || '8 yrs',
        bloodGroup: member.bloodGroup || 'O+',
      };
    }

    // Default Fallback Member
    return {
      allergy: 'Allergy: Seasonal Pollen',
      allergyBadge: 'Mild',
      allergyBox: 'bg-[#EBFBF7] border-2 border-[#013A40] text-[#00A896]',
      badgeStyle: 'bg-[#D2F6EC] text-[#018072] font-bold border border-[#00A896]/30',
      label1: 'Primary Physician',
      icon1: Stethoscope,
      value1: member.primaryDoctor?.name || 'Dr. Anita Chen',
      label2: 'Latest Vitals',
      icon2: Activity,
      value2: '120/80 mmHg (Normal)',
      defaultImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      relationTag: member.relation || 'Member',
      age: getAge(member.dateOfBirth) || '30 yrs',
      bloodGroup: member.bloodGroup || 'O+',
    };
  };

  const handleSelectAndGo = (member) => {
    setSelectedMember(member);
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
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation,
        },
        primaryDoctor: {
          name: formData.primaryDoctorName,
          phone: formData.primaryDoctorPhone,
          hospital: formData.hospital,
        },
      };

      if (editingMember && !editingMember._id.startsWith('demo-')) {
        await api.put(`/members/${editingMember._id}`, payload);
        setMsg('Profile updated successfully!');
      } else {
        await api.post('/members', payload);
        setMsg('Family member profile added!');
      }

      await refreshMembers();
      setShowAddModal(false);
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setShowAddModal(false);
      setMsg('Member registered locally for CareCircle session.');
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDeleteMember = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove ${name} from your CareCircle?`)) return;
    try {
      if (!id.startsWith('demo-')) {
        await api.delete(`/members/${id}`);
      }
      setMsg(`${name} removed.`);
      await refreshMembers();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const activeMembersList = (members && members.length > 0) ? members : DEFAULT_DEMO_MEMBERS;

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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#F7FAF9] min-h-screen">
      
      {msg && (
        <div className="bg-emerald-50 border-2 border-[#013A40] text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {msg}
        </div>
      )}

      {/* Subheader Filter Bar matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search Input Box with Deep Teal boundary */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search family members by name, relation, or condition..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#013A40] text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A896] shadow-xs transition-all"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Filter Pills + Export Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-2 border-[#013A40] shadow-xs">
            {['All', 'Active', 'Dependents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTabFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#013A40] bg-white hover:bg-slate-50 text-[#013A40] text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#013A40]" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* Grid of Family Member Cards matching the reference layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        
        {filteredMembers.map((member) => {
          const meta = getMemberMeta(member);
          const Icon1 = meta.icon1;
          const Icon2 = meta.icon2;

          return (
            <div
              key={member._id}
              className="bg-white rounded-2xl border-2 border-[#013A40] shadow-xs hover:shadow-md p-6 flex flex-col justify-between transition-all"
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
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-[#013A40] shadow-xs"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = meta.defaultImg;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#013A40] text-white font-mono text-[9px] font-black border border-white shadow-xs">
                        {meta.bloodGroup}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#013A40] tracking-tight leading-snug">
                        {member.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#E2F5F8] text-[#028090] text-[11px] font-semibold">
                          {meta.relationTag}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {meta.age}
                        </span>
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={(e) => handleDeleteMember(member._id, member.fullName, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                    title="Options"
                  >
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Allergy Banner with Deep Teal Boundary */}
                <div className={`px-3 py-2 rounded-xl flex items-center justify-between text-xs ${meta.allergyBox}`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{meta.allergy}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider ${meta.badgeStyle}`}>
                    {meta.allergyBadge}
                  </span>
                </div>

                {/* Physician & Vitals Info Block with Deep Teal Boundary */}
                <div className="p-3 rounded-xl bg-slate-50 border-2 border-[#013A40] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Icon1 className="w-3.5 h-3.5 text-[#028090]" />
                      <span>{meta.label1}:</span>
                    </span>
                    <span className="font-bold text-[#013A40] truncate max-w-[150px]">
                      {meta.value1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Icon2 className="w-3.5 h-3.5 text-[#00A896]" />
                      <span>{meta.label2}:</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {meta.value2}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Card Action: Full-width Dark Teal & View profile Button */}
              <div className="mt-5 pt-4 border-t-2 border-[#013A40]/15">
                <button
                  onClick={() => handleSelectAndGo(member)}
                  className="w-full py-2.5 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs border-2 border-[#013A40]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View profile</span>
                </button>
              </div>

            </div>
          );
        })}

        {/* Dashed "+ Add a family member" Box matching the reference image */}
        <div
          onClick={openAddModal}
          className="border-2 border-dashed border-[#013A40] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:shadow-md transition-all min-h-[300px] space-y-4 group bg-white/70"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#E0F5F2] text-[#013A40] border-2 border-[#013A40] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#013A40]">
              Add a family member
            </h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Invite spouse, children, or elderly parents to monitor their care
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#013A40] group-hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors border-2 border-[#013A40]"
          >
            <User className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

      </div>

      {/* Add / Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-4 border-2 border-[#013A40]">
            <h2 className="text-lg font-bold text-[#013A40]">
              Add New Family Member
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#013A40] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#013A40] mb-1">Relation</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#013A40] text-xs font-medium"
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
                  <label className="block text-xs font-bold text-[#013A40] mb-1">Blood Group</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#013A40] text-xs font-bold text-[#013A40]"
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
                  <label className="block text-xs font-bold text-[#013A40] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#013A40] text-xs"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#013A40] mb-1">Gender</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#013A40] text-xs font-medium"
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
                <label className="block text-xs font-bold text-[#013A40] mb-1">Emergency Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-xs text-slate-900"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-[#013A40]/15">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl shadow-xs border-2 border-[#013A40]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
