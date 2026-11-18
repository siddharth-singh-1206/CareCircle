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
  HeartPulse
} from 'lucide-react';

export default function Sidebar() {
  const { user, members, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Family Members', to: '/members', icon: Users, badge: '4' },
    { name: 'Medicines', to: '/medications', icon: Pill, badge: '2 due' },
    { name: 'Documents', to: '/documents', icon: Folder },
    { name: 'Sharing', to: '/doctor-sharing', icon: Share2 },
  ];

  const primaryMember = (members && members.length > 0) ? members[0] : null;
  const emergencyCode = primaryMember?.emergencyCode || 'EMG-RAMESH74';
  const userName = user?.name || 'Siddharth Sharma';

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
              FAMILY HEALTH
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
        
        {/* Emergency SOS Pill matching screenshot */}
        <Link
          to={`/emergency/${emergencyCode}`}
          target="_blank"
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

        {/* User Profile Strip */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-[#00A896] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              S
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate leading-tight">
                {userName}
              </div>
              <div className="text-[10px] text-[#86BCB9] truncate font-medium">
                Primary Caregiver
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (user) {
                if (window.confirm('Do you want to log out of CareCircle?')) {
                  logout();
                }
              } else {
                navigate('/login');
              }
            }}
            title={user ? 'Sign Out' : 'Sign In'}
            className="p-1.5 rounded-lg text-[#86BCB9] hover:text-white hover:bg-[#024D55] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </aside>
  );
}
