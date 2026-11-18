import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CHIPS = [
  { _id: 'chip-ramesh', label: 'Ramesh (Grandfather)', name: 'Ramesh Sharma' },
  { _id: 'chip-sarita', label: 'Sarita (Mother)', name: 'Sarita Sharma' },
  { _id: 'chip-siddharth', label: 'Siddharth (Self)', name: 'Siddharth Sharma' },
  { _id: 'chip-aarav', label: 'Aarav (Brother)', name: 'Aarav Sharma' },
];

export default function TopNavbar({ onAddRecordClick }) {
  const { user, members, selectedMember, setSelectedMember } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const chipsList = (members && members.length > 0)
    ? members.map((m) => ({
        _id: m._id,
        label: `${m.fullName.split(' ')[0]} (${m.relation})`,
        name: m.fullName,
        raw: m,
      }))
    : DEFAULT_CHIPS;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      
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

      {/* Center: Member Quick Selector Pills matching screenshot */}
      <div className="hidden lg:flex items-center gap-2 overflow-x-auto py-1">
        <button
          onClick={() => setSelectedMember(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            !selectedMember
              ? 'bg-[#013A40] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All
        </button>

        {chipsList.map((chip) => {
          const isSelected = selectedMember && (selectedMember._id === chip._id || selectedMember.fullName === chip.name);

          return (
            <button
              key={chip._id}
              onClick={() => {
                if (chip.raw) {
                  setSelectedMember(chip.raw);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#013A40] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Right Actions: Notifications, Add Record & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Bell with red notification badge */}
        <button
          className="relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#DE3B3B] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* Add Record Button matching screenshot */}
        <button
          onClick={() => {
            if (onAddRecordClick) {
              onAddRecordClick();
            } else {
              navigate('/medications');
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Record</span>
        </button>

        {/* User Circular Avatar with letter S */}
        <div
          className="w-8 h-8 rounded-full bg-[#00A896] text-white text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer"
          title={user?.name || 'Siddharth Sharma'}
        >
          S
        </div>

      </div>

    </header>
  );
}
