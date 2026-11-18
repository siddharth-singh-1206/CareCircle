import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  Users, 
  Pill, 
  FolderLock, 
  Share2, 
  ShieldAlert, 
  LogOut, 
  UserCircle2, 
  ChevronDown, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, family, members, selectedMember, setSelectedMember, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/', icon: HeartHandshake },
    { label: 'Family Members', path: '/members', icon: Users },
    { label: 'Medications', path: '/medications', icon: Pill },
    { label: 'Medical Vault', path: '/documents', icon: FolderLock },
    { label: 'Doctor Sharing', path: '/doctor-sharing', icon: Share2 },
  ];

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Care<span className="text-brand-600">Circle</span>
                </span>
                <span className="block text-[10px] font-semibold tracking-wider uppercase text-slate-400 -mt-1">
                  Family Health Hub
                </span>
              </div>
            </Link>

            {/* Active Family Member Selector Dropdown */}
            {user && members.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-medium transition-colors border border-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                  <span className="text-slate-500 font-normal">Active Member:</span>
                  <span className="font-semibold text-slate-900 max-w-[120px] truncate">
                    {selectedMember ? selectedMember.fullName : 'Select Member'}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-semibold">
                    {selectedMember?.bloodGroup || 'O+'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Select Family Member
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {members.map((m) => (
                        <button
                          key={m._id}
                          onClick={() => handleSelectMember(m)}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between text-sm hover:bg-slate-50 transition-colors ${
                            selectedMember?._id === m._id ? 'bg-brand-50/70 text-brand-700 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-800">{m.fullName}</div>
                            <div className="text-xs text-slate-400">{m.relation}</div>
                          </div>
                          <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {m.bloodGroup}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <Link
                        to="/members"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Manage / Add New Member
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick Emergency Mode Button */}
            {selectedMember && (
              <Link
                to={`/emergency/${selectedMember.emergencyCode}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-xs sm:text-sm font-bold tracking-tight shadow-sm hover:shadow transition-all group"
                title="Open Emergency SOS Profile"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse group-hover:scale-110 transition-transform" />
                <span>Emergency SOS</span>
              </Link>
            )}

            {/* Logout button */}
            {user ? (
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
