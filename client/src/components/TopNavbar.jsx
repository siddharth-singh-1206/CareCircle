import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Bell,
  Plus,
  Stethoscope,
  Pill,
  AlertTriangle,
  Clock,
  CheckCircle2,
  LogOut,
  Users,
  Share2,
  Phone,
  Droplet,
  ChevronRight,
  X,
  CheckCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const DEFAULT_CHIPS = [
  {
    _id: 'chip-ramesh',
    label: 'Ramesh (Grandfather)',
    name: 'Ramesh Sharma',
    fullName: 'Ramesh Sharma',
    relation: 'Grandfather',
    bloodGroup: 'B+',
    primaryDoctor: 'Dr. Arvind Mehta (Cardiologist)',
    household: 'Sharma Family Health Circle',
    emergencyCode: 'EMG-RAMESH74',
    emergencyContact: { name: 'Siddharth Sharma', phone: '+91 98765 43210' },
  },
  {
    _id: 'chip-sarita',
    label: 'Sarita (Mother)',
    name: 'Sarita Sharma',
    fullName: 'Sarita Sharma',
    relation: 'Mother',
    bloodGroup: 'A+',
    primaryDoctor: 'Dr. Sunita Rao (Rheumatology)',
    household: 'Sharma Family Health Circle',
    emergencyCode: 'EMG-SARITA84',
    emergencyContact: { name: 'Siddharth Sharma', phone: '+91 98765 43210' },
  },
  {
    _id: 'chip-siddharth',
    label: 'Siddharth (Self)',
    name: 'Siddharth Sharma',
    fullName: 'Siddharth Sharma',
    relation: 'Self',
    bloodGroup: 'O+',
    primaryDoctor: 'Dr. Vikram Malhotra (Pulmonology)',
    household: 'Sharma Family Health Circle',
    emergencyCode: 'EMG-SIDDHARTH98',
    emergencyContact: { name: 'Sarita Sharma', phone: '+91 98765 11223' },
  },
  {
    _id: 'chip-aarav',
    label: 'Aarav (Brother)',
    name: 'Aarav Sharma',
    fullName: 'Aarav Sharma',
    relation: 'Brother',
    bloodGroup: 'O+',
    primaryDoctor: 'Dr. Priya Sharma (Pediatrics)',
    household: 'Sharma Family Health Circle',
    emergencyCode: 'EMG-AARAV16',
    emergencyContact: { name: 'Sarita Sharma', phone: '+91 98765 11223' },
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-missed-1',
    type: 'missed_dose',
    title: 'Missed Dose Alert: Regimen Incomplete Yesterday',
    sender: 'Clinical Compliance Monitor',
    memberName: 'Ramesh Sharma',
    detail: 'Metformin Hydrochloride (500mg, Morning) went unmarked yesterday. Prescribed daily dose was missed.',
    time: 'Yesterday',
    unread: true,
    link: '/medications',
  },
  {
    id: 'notif-refill-1',
    type: 'medication_refill',
    title: 'Urgent: Medicine at Verge of Ending (Refill Needed)',
    sender: 'Medication Refill Engine',
    memberName: 'Ramesh Sharma',
    detail: 'Metformin Hydrochloride (500mg) has only 4 tablets remaining in household stock! Place refill order to avoid regimen interruption.',
    time: 'Critical Alert',
    unread: true,
    link: '/medications',
  },
  {
    id: 'notif-doc-1',
    type: 'doctor_comment',
    title: 'New Clinical Advice from Dr. Arvind Mehta',
    sender: 'Dr. Arvind Mehta (Cardiologist, Apollo)',
    memberName: 'Ramesh Sharma',
    detail: 'Blood pressure (126/82 mmHg) and fasting glucose look steady on current Amlodipine 5mg and Metformin 500mg routine. Maintain daily morning walks.',
    time: '15m ago',
    unread: true,
    link: '/',
  },
  {
    id: 'notif-doc-2',
    type: 'doctor_comment',
    title: 'Executive Health Screening Acknowledged',
    sender: 'Dr. Sunita Rao (Internal Medicine, Fortis)',
    memberName: 'Sarita Sharma',
    detail: 'Annual executive metabolic blood panels reviewed. Normal thyroid, liver, and cardiac markers. No medication intervention required.',
    time: '2h ago',
    unread: false,
    link: '/',
  },
  {
    id: 'notif-referral-default',
    type: 'doctor_referral',
    title: 'Physician Referral: Specialist Recommended for Sarita Sharma',
    sender: 'Dr. Sunita Rao (Internal Medicine, Fortis)',
    memberName: 'Sarita Sharma',
    detail: 'Dr. Sunita Rao reviewed joint mobility reports and recommends consulting Dr. Rajesh Khanna (Rheumatology & Bone Specialist, Max Healthcare) for dedicated knee stiffness management.',
    time: 'Today, 10:45 AM',
    unread: true,
    link: '/doctors',
  },
];

export default function TopNavbar({ onAddRecordClick }) {
  const { user, members, selectedMember, setSelectedMember, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'doctor' | 'missed' | 'refill'
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Load dynamic missed dose alerts if yesterday had unmarked doses
  useEffect(() => {
    try {
      const savedDate = localStorage.getItem('carecircle_regimen_date');
      const todayStr = new Date().toISOString().split('T')[0];
      if (savedDate && savedDate < todayStr) {
        const savedDoses = JSON.parse(localStorage.getItem('carecircle_member_doses') || '{}');
        const dynamicMissed = [];
        const memberNames = {
          ramesh: 'Ramesh Sharma',
          sarita: 'Sarita Sharma',
          siddharth: 'Siddharth Sharma',
          aarav: 'Aarav Sharma',
        };
        Object.entries(savedDoses).forEach(([mKey, doseArr]) => {
          if (Array.isArray(doseArr)) {
            doseArr.forEach((d) => {
              if (d.status === 'pending') {
                dynamicMissed.push({
                  id: `missed-auto-${d.id}-${savedDate}`,
                  type: 'missed_dose',
                  title: 'Missed Dose Alert: Regimen Incomplete Yesterday',
                  sender: 'Clinical Compliance Monitor',
                  memberName: memberNames[mKey] || 'Family Member',
                  detail: `${d.medicineName} (${d.dosage}, ${d.slot}) was not marked taken yesterday. Prescribed daily dose was missed.`,
                  time: 'Yesterday',
                  unread: true,
                  link: '/medications',
                });
              }
            });
          }
        });
        if (dynamicMissed.length > 0) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const newOnes = dynamicMissed.filter((n) => !existingIds.has(n.id));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch (e) {}
  }, []);

  // Load any dynamic consultation notes from storage to enrich notifications
  useEffect(() => {
    try {
      const famGrants = JSON.parse(localStorage.getItem('carecircle_family_consultations') || '[]');
      if (Array.isArray(famGrants) && famGrants.length > 0) {
        const dynamicNotifs = [];
        famGrants.forEach((grant) => {
          if (Array.isArray(grant.doctorNotes)) {
            grant.doctorNotes.forEach((note) => {
              if (note.sender !== 'family') {
                dynamicNotifs.push({
                  id: 'grant-note-' + (note.id || Math.random()),
                  type: 'doctor_comment',
                  title: `Consultation Note from ${grant.doctorName || 'Doctor'}`,
                  sender: `${grant.doctorName || 'Doctor'} (${grant.doctorSpecialty || 'Specialist'})`,
                  memberName: grant.memberId?.fullName || grant.patient?.fullName || 'Family Member',
                  detail: note.comment || 'Clinical review completed.',
                  time: note.createdAt || 'Recent',
                  unread: note.status !== 'acknowledged',
                  link: '/',
                });
              }
            });
          }
        });
        if (dynamicNotifs.length > 0) {
          setNotifications((prev) => {
            const ids = new Set(prev.map((n) => n.id));
            const fresh = dynamicNotifs.filter((n) => !ids.has(n.id));
            return [...fresh, ...prev];
          });
        }
      }
    } catch (e) {}
  }, []);

  // Load dynamic doctor referrals from storage
  useEffect(() => {
    const syncReferrals = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('carecircle_doctor_referrals') || '[]');
        if (Array.isArray(saved) && saved.length > 0) {
          setNotifications((prev) => {
            const existing = new Set(prev.map((n) => n.id));
            const fresh = saved.filter((s) => !existing.has(s.id));
            return [...fresh, ...prev];
          });
        }
      } catch (e) {}
    };
    syncReferrals();
    window.addEventListener('carecircle_referrals_updated', syncReferrals);
    window.addEventListener('storage', syncReferrals);
    return () => {
      window.removeEventListener('carecircle_referrals_updated', syncReferrals);
      window.removeEventListener('storage', syncReferrals);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setShowNotifications(false);
    navigate(item.link || '/');
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'doctor') return item.type === 'doctor_comment';
    if (activeFilter === 'missed') return item.type === 'missed_dose';
    if (activeFilter === 'refill') return item.type === 'medication_refill';
    if (activeFilter === 'referral') return item.type === 'doctor_referral';
    return true;
  });

  const chipsList = (members && members.length > 0)
    ? members.map((m) => ({
        _id: m._id,
        label: `${(m.fullName || 'Member').split(' ')[0]} (${m.relation || 'Member'})`,
        name: m.fullName,
        raw: m,
      }))
    : DEFAULT_CHIPS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      
      {/* Left Search Bar matching screenshot */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search health records, vitals, doctors..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F0F4F6] text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008985] focus:bg-white transition-all border border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Center: Doctor Clinical Console Badge OR Quiet Family Indicator (No crowded member profiles in navbar) */}
      {user?.role === 'doctor' ? (
        <div className="hidden lg:flex items-center gap-2 bg-[#E6F7F3] text-[#008985] px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs">
          <span>🩺 Attending Physician Console • Apollo Heart Institute (Reg: MCI-99214)</span>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#00A896]"></span>
          <span className="text-slate-700 font-bold">Sharma Family Health Circle</span>
        </div>
      )}

      {/* Right Actions: Notifications, Add Record & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Bell with red notification badge & interactive Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            className={`relative p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
              showNotifications
                ? 'bg-[#E6F7F3] border-[#008985] text-[#008985]'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Notifications & Clinical Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-[#DE3B3B] text-white text-[9px] font-black absolute -top-1 -right-1 ring-2 ring-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS POPOVER DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-84 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E6F7F3] text-[#008985] flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-tight">Notifications & Alerts</h3>
                    <span className="text-[10px] text-slate-400">
                      {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-[#008985] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="px-4 pt-2.5 pb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#013A40] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveFilter('missed')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'missed'
                      ? 'bg-[#013A40] text-white font-bold'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold'
                  }`}
                >
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Missed Meds ({notifications.filter((n) => n.type === 'missed_dose').length})</span>
                </button>
                <button
                  onClick={() => setActiveFilter('doctor')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'doctor'
                      ? 'bg-[#013A40] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Stethoscope className="w-3 h-3 text-[#00A896]" />
                  <span>Doctor Advice</span>
                </button>
                <button
                  onClick={() => setActiveFilter('referral')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'referral'
                      ? 'bg-[#013A40] text-white font-bold'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold'
                  }`}
                >
                  <Stethoscope className="w-3 h-3 text-indigo-600" />
                  <span>Referrals ({notifications.filter((n) => n.type === 'doctor_referral').length})</span>
                </button>
                <button
                  onClick={() => setActiveFilter('refill')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'refill'
                      ? 'bg-[#013A40] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Pill className="w-3 h-3 text-rose-500" />
                  <span>Refills</span>
                </button>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 px-2">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No notifications in this category.
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const isRefill = notif.type === 'medication_refill';
                    const isMissed = notif.type === 'missed_dose';
                    const isReferral = notif.type === 'doctor_referral';

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 my-1 ${
                          notif.unread
                            ? isMissed
                              ? 'bg-amber-50/50 border-l-3 border-amber-500'
                              : isReferral
                              ? 'bg-indigo-50/60 border-l-3 border-indigo-600'
                              : 'bg-[#F7FAF9] border-l-3 border-[#008985]'
                            : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isMissed
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-300'
                              : isRefill
                              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                              : isReferral
                              ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-300'
                              : 'bg-[#E6F7F3] text-[#008985] ring-1 ring-[#00A896]/30'
                          }`}
                        >
                          {isMissed ? (
                            <Clock className="w-4 h-4 text-amber-600" />
                          ) : isRefill ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Stethoscope className={`w-4 h-4 ${isReferral ? 'text-indigo-600' : 'text-[#008985]'}`} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                isMissed
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : isRefill
                                  ? 'bg-rose-100 text-rose-700'
                                  : isReferral
                                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                  : 'bg-[#E6F7F3] text-[#008985]'
                              }`}
                            >
                              {notif.memberName}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 mt-1 leading-tight line-clamp-1">
                            {notif.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.detail}
                          </p>

                          <div className={`flex items-center justify-between pt-1.5 mt-1 border-t border-slate-100/70 text-[10px] font-bold ${
                            isReferral ? 'text-indigo-700' : 'text-[#008985]'
                          }`}>
                            <span>
                              {isMissed
                                ? '⚠️ Review Regimen on Medication Tracker'
                                : isRefill
                                ? '⚡ Refill Medicine Stock'
                                : isReferral
                                ? '🏥 Consult Recommended Specialist in Directory'
                                : '🩺 View Consultation Advice'}
                            </span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to="/doctors"
                  onClick={() => setShowNotifications(false)}
                  className="text-[#008985] font-bold hover:underline"
                >
                  Find Recommended Doctors →
                </Link>
                <Link
                  to="/medications"
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-500 hover:text-slate-800"
                >
                  All Medicines
                </Link>
              </div>

            </div>
          )}
        </div>

        {/* Add Record Button matching screenshot */}
        <button
          onClick={() => {
            if (onAddRecordClick) {
              onAddRecordClick();
            } else {
              navigate('/medications');
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Record</span>
        </button>

        {/* User Circular Avatar with dynamic initial & Interactive Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-[#00A896] hover:bg-[#008985] text-white text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer ring-2 ring-transparent hover:ring-[#00A896]/30 transition-all"
            title={user?.name || 'CareCircle User Profile'}
          >
            {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'S'}
          </button>

          {/* PROFILE DROPDOWN MENU */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-76 sm:w-84 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Profile Card Header */}
              <div className="px-5 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#013A40] text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                    {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {user?.name || 'Siddharth Sharma'}
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#E6F7F3] text-[#008985] text-[10px] font-bold mt-0.5">
                      {user?.role === 'doctor' ? 'Attending Physician' : 'Primary Family Caregiver'}
                    </span>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {user?.email || 'siddharth@carecircle.com'}
                    </p>
                  </div>
                </div>

                {/* Household Info */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#F7FAF9] border border-slate-100 text-xs text-slate-600">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Household</div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">Sharma Family Health Circle</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">4 Members (Ramesh, Sarita, Siddharth, Aarav)</div>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="py-2 px-2 text-xs font-semibold text-slate-700">
                <Link
                  to="/members"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#00A896]" />
                    <span>Manage Family Profiles</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>

                <Link
                  to="/medications"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-[#00A896]" />
                    <span>Medications & Dosage Checklists</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>

                <Link
                  to="/doctors"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Stethoscope className="w-4 h-4 text-[#00A896]" />
                    <span>Verified Doctors Directory</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>

                <Link
                  to="/emergency/EMG-RAMESH74"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Droplet className="w-4 h-4 text-rose-600" />
                    <span>Emergency SOS Card (QR View)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-300" />
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="px-3 pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch Portal</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
