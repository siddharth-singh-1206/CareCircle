import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users2,
  Pill,
  FolderLock,
  Share2,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Plus,
  HeartHandshake,
  Stethoscope
} from 'lucide-react';

export default function RightSidebar() {
  const { user, members, selectedMember, setSelectedMember, logout } = useAuth();
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', to: '/', icon: LayoutDashboard },
    { name: 'Family', to: '/members', icon: Users2 },
    { name: 'Medications', to: '/medications', icon: Pill },
    { name: 'Documents', to: '/documents', icon: FolderLock },
    { name: 'Find Doctors', to: '/doctors', icon: Stethoscope },
  ];

  return (
    <aside className="w-64 bg-[#013A40] text-white h-screen sticky top-0 flex flex-col justify-between p-5 select-none z-30 shrink-0 shadow-lg">
      
      {/* Top Section: Brand & Active Member Picker */}
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#024D55]">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#00A896] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white">
                Care<span className="text-[#00A896]">Circle</span>
              </span>
              <span className="block text-[10px] text-[#A3D2D6] font-medium">Family Health Hub</span>
            </div>
          </Link>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#024D55] text-[#A3D2D6] border border-[#03646F]">
            v1.0
          </span>
        </div>

        {/* Member Switcher */}
        {members.length > 0 && (
          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3D2D6] mb-1.5 block">
              Active Member
            </span>

            <button
              onClick={() => setMemberMenuOpen(!memberMenuOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#03646F] bg-[#024D55] hover:bg-[#035C66] text-left transition-colors shadow-xs"
            >
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-white truncate">
                  {selectedMember ? selectedMember.fullName : 'Select Member'}
                </div>
                <div className="text-[11px] text-[#A3D2D6] flex items-center gap-1.5 mt-0.5">
                  <span>{selectedMember?.relation}</span>
                  <span>•</span>
                  <span className="font-bold text-[#00A896]">{selectedMember?.bloodGroup}</span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#A3D2D6] transition-transform ${memberMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {memberMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-full bg-[#024D55] rounded-xl shadow-xl border border-[#03646F] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {members.map((m) => {
                    const active = selectedMember?._id === m._id;
                    return (
                      <button
                        key={m._id}
                        onClick={() => {
                          setSelectedMember(m);
                          setMemberMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          active
                            ? 'bg-[#028090] text-white font-bold'
                            : 'text-[#E0F3F5] hover:bg-[#035C66]'
                        }`}
                      >
                        <span className="truncate">{m.fullName}</span>
                        <span className={`text-[10px] font-mono px-1 rounded ${active ? 'bg-white/20 text-white' : 'bg-[#013A40] text-[#00A896]'}`}>
                          {m.bloodGroup}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 mt-1 border-t border-[#03646F]">
                  <Link
                    to="/members"
                    onClick={() => setMemberMenuOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#00A896] hover:bg-[#013A40] w-full"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Member
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3D2D6] mb-2 block">
            Navigation
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#028090] text-white shadow-sm'
                      : 'text-[#B2D8DC] hover:text-white hover:bg-[#024D55]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Emergency SOS & User Logout */}
      <div className="space-y-3 pt-6 border-t border-[#024D55]">
        
        {/* Emergency SOS Button */}
        {selectedMember && (
          <Link
            to={`/emergency/${selectedMember.emergencyCode || 'EMG-RAMESH74'}`}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-tomato-500 hover:bg-tomato-600 text-white text-xs font-bold transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>Emergency SOS</span>
            </div>
            <ShieldAlert className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </Link>
        )}

        {/* User Profile & Logout */}
        {user && (
          <div className="flex items-center justify-between pt-1">
            <div className="truncate pr-2">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[#A3D2D6] truncate">Family Owner</div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-[#A3D2D6] hover:text-white hover:bg-[#024D55] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
