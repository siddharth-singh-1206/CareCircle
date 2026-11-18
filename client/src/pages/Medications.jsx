import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Pill,
  PlusCircle,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Package,
  Utensils
} from 'lucide-react';

const DEMO_MEDICATIONS = [
  {
    _id: 'demo-med-1',
    medicineName: 'Telmisartan (40mg)',
    dosage: '1 tablet',
    frequency: 'Once daily',
    timings: { morning: '08:00 AM' },
    foodRelation: 'After Meal',
    purpose: 'Hypertension Management',
    prescribedBy: 'Dr. Anita Chen',
    stockLeft: 18,
    isRefillNeeded: false,
  },
  {
    _id: 'demo-med-2',
    medicineName: 'Metformin (500mg)',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    timings: { morning: '08:30 AM', night: '08:30 PM' },
    foodRelation: 'With Meal',
    purpose: 'Blood Sugar Regulation',
    prescribedBy: 'Dr. Anita Chen',
    stockLeft: 6,
    isRefillNeeded: true,
  },
  {
    _id: 'demo-med-3',
    medicineName: 'Atorvastatin (10mg)',
    dosage: '1 tablet',
    frequency: 'Once daily',
    timings: { night: '09:00 PM' },
    foodRelation: 'Before Bed',
    purpose: 'Cholesterol Control',
    prescribedBy: 'Dr. Robert Vance',
    stockLeft: 24,
    isRefillNeeded: false,
  },
];

export default function Medications() {
  const { members, selectedMember: selectedMemberFromContext } = useAuth();
  const selectedMember = selectedMemberFromContext || (members && members.length > 0 ? members[0] : {
    _id: 'demo-arthur',
    fullName: 'Arthur Jenkins',
    relation: 'Dad / Spouse',
  });

  const [medications, setMedications] = useState(DEMO_MEDICATIONS);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '500 mg',
    frequency: 'Once daily',
    timingMorning: true,
    timingAfternoon: false,
    timingEvening: false,
    timingNight: false,
    morningTime: '08:30',
    nightTime: '20:30',
    foodRelation: 'After Meal',
    purpose: '',
    prescribedBy: '',
    stockLeft: 30,
  });

  const fetchMedications = async () => {
    if (!selectedMember) return;
    try {
      setLoading(true);
      const res = await api.get(`/medications?memberId=${selectedMember._id}`);
      if (res.data.success) {
        setMedications(res.data.medications);
      }
    } catch (err) {
      console.error('Error fetching meds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [selectedMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const slots = [];
      if (formData.timingMorning) slots.push({ slot: 'Morning', time: formData.morningTime });
      if (formData.timingAfternoon) slots.push({ slot: 'Afternoon', time: '14:00' });
      if (formData.timingEvening) slots.push({ slot: 'Evening', time: '18:00' });
      if (formData.timingNight) slots.push({ slot: 'Night', time: formData.nightTime });

      const payload = {
        memberId: selectedMember._id,
        medicineName: formData.medicineName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        timingSlots: slots.length > 0 ? slots : [{ slot: 'Morning', time: '08:00' }],
        foodRelation: formData.foodRelation,
        purpose: formData.purpose,
        prescribedBy: formData.prescribedBy,
        stockLeft: Number(formData.stockLeft) || 30,
      };

      await api.post('/medications', payload);
      setMsg('Medication added to schedule successfully!');
      setShowAddModal(false);
      setFormData({
        medicineName: '',
        dosage: '500 mg',
        frequency: 'Once daily',
        timingMorning: true,
        timingAfternoon: false,
        timingEvening: false,
        timingNight: false,
        morningTime: '08:30',
        nightTime: '20:30',
        foodRelation: 'After Meal',
        purpose: '',
        prescribedBy: '',
        stockLeft: 30,
      });
      fetchMedications();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error('Error adding medication:', err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete medication "${name}"?`)) return;
    try {
      await api.delete(`/medications/${id}`);
      setMsg(`Medication "${name}" removed.`);
      fetchMedications();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error('Error deleting medication:', err);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#F7FAF9] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#013A40]/20">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#013A40]">
            Medication & Reminder Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking active prescriptions, routine timings, and stock for{' '}
            <strong className="text-[#013A40]">{selectedMember.fullName}</strong>.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 border-2 border-[#013A40]"
        >
          <PlusCircle className="w-4 h-4" />
          Add Medication
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {msg}
        </div>
      )}

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-[#013A40] shadow-soft">
            <Pill className="w-12 h-12 text-[#013A40] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#013A40]">No Medications Scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add medicines to track doses and ensure consistent adherence.
            </p>
          </div>
        ) : (
          medications.map((med) => {
            const isLowStock = med.stockLeft <= 5;
            return (
              <div
                key={med._id}
                className="bg-white rounded-2xl border-2 border-[#013A40] shadow-soft p-6 flex flex-col justify-between hover:shadow-soft-hover transition-all relative overflow-hidden"
              >
                {isLowStock && (
                  <div className="absolute top-0 right-0 bg-tomato-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl border-b border-l border-[#013A40]">
                    Refill Needed ({med.stockLeft} left)
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#013A40] pr-12">{med.medicineName}</h3>
                    <div className="text-xs font-black text-seafoam-700 mt-0.5">{med.dosage}</div>
                    {med.purpose && (
                      <p className="text-xs text-slate-600 mt-1">For: {med.purpose}</p>
                    )}
                  </div>

                  {/* Timing slots pills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Daily Routine Slots
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {med.timingSlots.map((slot, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs border border-[#013A40]"
                        >
                          <Clock className="w-3 h-3 text-[#013A40]" />
                          {slot.slot} {slot.time && `(${slot.time})`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details summary */}
                  <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#013A40]" /> Food Timing:
                      </span>
                      <span className="font-bold text-[#013A40]">{med.foodRelation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#013A40]" /> Pills Remaining:
                      </span>
                      <span className={`font-black ${isLowStock ? 'text-tomato-600' : 'text-[#013A40]'}`}>
                        {med.stockLeft} doses
                      </span>
                    </div>
                    {med.prescribedBy && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Doctor:</span>
                        <span className="font-semibold text-slate-800">{med.prescribedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-seafoam-50 text-seafoam-800 font-bold text-[10px] border border-[#013A40]">
                    Active Schedule
                  </span>
                  <button
                    onClick={() => handleDelete(med._id, med.medicineName)}
                    className="p-1.5 text-slate-400 hover:text-tomato-600 hover:bg-tomato-50 rounded-lg transition-colors"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto border-2 border-[#013A40]">
            <h2 className="text-xl font-bold text-[#013A40] mb-4">
              Add Medication for {selectedMember.fullName}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                  Medicine Name & Strength
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm focus:ring-2 focus:ring-[#00A896] focus:outline-none"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">Dosage Form</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 mg / 1 tab / 5 ml"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-semibold"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">Food Relation</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-semibold"
                    value={formData.foodRelation}
                    onChange={(e) => setFormData({ ...formData, foodRelation: e.target.value })}
                  >
                    <option value="After Meal">After Meal</option>
                    <option value="Before Meal">Before Meal</option>
                    <option value="With Meal">With Meal</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              {/* Slot checklist */}
              <div className="border-2 border-[#013A40] rounded-2xl p-4 bg-teal-50/40 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#013A40] block">
                  Select Routine Timings
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.timingMorning}
                      onChange={(e) => setFormData({ ...formData, timingMorning: e.target.checked })}
                    />
                    <span>Morning (08:30 AM)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.timingAfternoon}
                      onChange={(e) => setFormData({ ...formData, timingAfternoon: e.target.checked })}
                    />
                    <span>Afternoon (02:00 PM)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.timingEvening}
                      onChange={(e) => setFormData({ ...formData, timingEvening: e.target.checked })}
                    />
                    <span>Evening (06:00 PM)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.timingNight}
                      onChange={(e) => setFormData({ ...formData, timingNight: e.target.checked })}
                    />
                    <span>Night (08:30 PM)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                    Condition / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blood Sugar / BP"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="30"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-bold"
                    value={formData.stockLeft}
                    onChange={(e) => setFormData({ ...formData, stockLeft: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                  Prescribed By (Doctor Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arvind Mehta"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#013A40]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl shadow-xs border border-[#013A40]"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
