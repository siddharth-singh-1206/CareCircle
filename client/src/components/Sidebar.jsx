import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Pill,
  Folder,
  Share2,
  LogOut,
  Siren,
  HeartPulse,
  Stethoscope
} from 'lucide-react';

export default function Sidebar() {
  const { user, members, logout } = useAuth();
  const navigate = useNavigate();
  const isDoctor = user?.role === 'doctor';

  // Check for pending review messages
  const hasPendingFamilyReview = (() => {
    try {
      const famGrants = JSON.parse(localStorage.getItem('carecircle_family_consultations') || '[]');
      return Array.isArray(famGrants) && famGrants.some((g) =>
        g.status === 'active' &&
        Array.isArray(g.doctorNotes) &&
        g.doctorNotes.some((n) => n.sender !== 'family' && n.status !== 'acknowledged')
      );
    } catch (e) {
      return false;
    }
  })();

  const hasPendingDoctorReview = (() => {
    try {
      const docReqs = JSON.parse(localStorage.getItem('carecircle_doctor_requests') || '[]');
      return Array.isArray(docReqs) && docReqs.some((r) =>
        r.status === 'pending' ||
        (Array.isArray(r.doctorNotes) &&
          r.doctorNotes.some((n) => n.sender === 'family' && n.status === 'pending_doctor_review'))
      );
    } catch (e) {
      return false;
    }
  })();

  const familyNavItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Family Members', to: '/members', icon: Users, badge: '4' },
    { name: 'Medicines', to: '/medications', icon: Pill, badge: '2 due' },
    { name: 'Documents', to: '/documents', icon: Folder },
    {
      name: 'Find Doctors',
      to: '/doctors',
      icon: Stethoscope,
      badge: '5 Verified',
    },
  ];

  const doctorNavItems = [
    { name: 'My Patients', to: '/doctor', icon: Users },
    {
      name: 'Patient Requests',
      to: '/doctor?tab=requests',
      icon: HeartPulse,
      badge: hasPendingDoctorReview ? 'Pending' : '',
    },
  ];

  const navItems = isDoctor ? doctorNavItems : familyNavItems;

  const primaryMember = (members && members.length > 0) ? members[0] : null;
  const emergencyCode = primaryMember?.emergencyCode || 'EMG-RAMESH74';
  const userName = isDoctor
    ? (user?.name || 'Dr. Arvind Mehta')
    : (user?.name || 'Siddharth Sharma');

  return (
    <aside className="w-60 bg-[#013A40] text-white h-screen sticky top-0 flex flex-col justify-between select-none z-30 shrink-0">
      
      {/* Top Section: Brand & Nav */}
      <div className="flex flex-col">
        
        {/* Brand Header matching screenshot */}
        <div className="h-18 flex items-center gap-3 px-5 border-b border-[#024D55]/50">
          <div className="w-9 h-9 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-bold shadow-xs">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
              CareCircle
            </span>
            <span className="block text-[9px] tracking-widest uppercase font-bold text-[#78B9B5] mt-0.5">
              {isDoctor ? 'DOCTOR CLINICAL' : 'FAMILY HEALTH'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#008985] text-white shadow-xs font-bold'
                      : 'text-[#94BDBB] hover:text-white hover:bg-[#024D55]/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#00B4A6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Emergency SOS & User Profile matching screenshot */}
      <div className="p-3.5 space-y-3">
        
        {/* If Family: Emergency SOS Button. If Doctor: Clinical On-Duty Badge */}
        {!isDoctor ? (
          <Link
            to={`/emergency/${emergencyCode}`}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#DE3B3B] hover:bg-[#C93030] text-white text-xs font-bold transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Siren className="w-4 h-4 text-white" />
              <span className="font-bold text-white tracking-wide">Emergency</span>
            </div>
            <span className="bg-white/95 text-[#DE3B3B] text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
              READY
            </span>
          </Link>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-[#024D55]/60 text-emerald-300 text-[11px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              On Clinical Duty
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-300">EMR Active</span>
          </div>
        )}

        {/* User Profile Strip */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-[#00A896] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              {isDoctor ? 'AM' : 'S'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate leading-tight">
                {userName}
              </div>
              <div className="text-[10px] text-[#86BCB9] truncate font-medium">
                {isDoctor ? 'Cardiologist • Apollo' : 'Primary Caregiver'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (user) {
                if (window.confirm('Do you want to log out of CareCircle?')) {
                  logout();
                  navigate('/login');
                }
              } else {
                navigate('/login');
              }
            }}
            title={user ? 'Sign Out' : 'Sign In'}
            className="p-1.5 rounded-lg text-[#86BCB9] hover:text-white hover:bg-[#024D55] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
}
