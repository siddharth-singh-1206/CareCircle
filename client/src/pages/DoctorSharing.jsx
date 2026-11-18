import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Share2,
  ShieldCheck,
  Clock,
  Copy,
  CheckCircle2,
  Lock,
  PlusCircle,
  ExternalLink,
  Ban,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorSharing() {
  const { members, selectedMember } = useAuth();
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [createdGrantInfo, setCreatedGrantInfo] = useState(null);

  const [formData, setFormData] = useState({
    memberId: selectedMember ? selectedMember._id : '',
    doctorName: '',
    doctorEmail: '',
    validityHours: '48',
    overview: true,
    medications: true,
    allergies: true,
    chronic_conditions: true,
    prescriptions: true,
    lab_reports: false,
    vaccinations: false,
    vitals: true,
  });

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shares');
      if (res.data.success) {
        setGrants(res.data.grants);
      }
    } catch (err) {
      console.error('Error fetching grants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  useEffect(() => {
    if (selectedMember && !formData.memberId) {
      setFormData((prev) => ({ ...prev, memberId: selectedMember._id }));
    }
  }, [selectedMember]);

  const handleCreateGrant = async (e) => {
    e.preventDefault();
    try {
      const permitted = [];
      if (formData.overview) permitted.push('overview');
      if (formData.medications) permitted.push('medications');
      if (formData.allergies) permitted.push('allergies');
      if (formData.chronic_conditions) permitted.push('chronic_conditions');
      if (formData.prescriptions) permitted.push('prescriptions');
      if (formData.lab_reports) permitted.push('lab_reports');
      if (formData.vaccinations) permitted.push('vaccinations');
      if (formData.vitals) permitted.push('vitals');

      const payload = {
        memberId: formData.memberId,
        doctorName: formData.doctorName,
        doctorEmail: formData.doctorEmail,
        validityHours: Number(formData.validityHours),
        permittedCategories: permitted,
      };

      const res = await api.post('/shares', payload);
      if (res.data.success) {
        setCreatedGrantInfo({
          shareUrl: `${window.location.origin}${res.data.shareUrl}`,
          passcode: res.data.passcode,
          token: res.data.grant.accessToken,
          doctorName: res.data.grant.doctorName,
        });
        setMsg('Doctor access grant generated successfully!');
        setShowModal(false);
        fetchGrants();
      }
    } catch (err) {
      console.error('Error creating grant:', err);
    }
  };

  const handleRevoke = async (id, doctorName) => {
    if (!window.confirm(`Revoke medical record access for "${doctorName}" immediately?`)) return;
    try {
      const res = await api.put(`/shares/${id}/revoke`);
      if (res.data.success) {
        setMsg(`Access revoked for ${doctorName}`);
        fetchGrants();
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error revoking grant:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#F7FAF9] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#013A40]/20">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#013A40]">
            Controlled Doctor Access Grants
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate time-limited, category-specific access links for physicians and hospitals.
          </p>
        </div>
        <button
          onClick={() => {
            setCreatedGrantInfo(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 border-2 border-[#013A40]"
        >
          <PlusCircle className="w-4 h-4" />
          Grant Access
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {msg}
        </div>
      )}

      {/* Generated Token Banner Modal */}
      {createdGrantInfo && (
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              Doctor Access Link Ready for {createdGrantInfo.doctorName}
            </div>
            <button
              onClick={() => setCreatedGrantInfo(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Share this link and security PIN with the doctor. They will strictly see only authorized categories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="md:col-span-2 bg-black/40 rounded-xl p-3 flex items-center justify-between border border-white/10">
              <span className="text-xs font-mono text-emerald-300 truncate mr-2">
                {createdGrantInfo.shareUrl}
              </span>
              <button
                onClick={() => copyToClipboard(createdGrantInfo.shareUrl)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </button>
            </div>
            <div className="bg-black/40 rounded-xl p-3 flex items-center justify-between border border-white/10">
              <div>
                <div className="text-[10px] uppercase text-slate-400">Security Passcode</div>
                <div className="font-mono text-base font-bold text-white">{createdGrantInfo.passcode}</div>
              </div>
              <Link
                to={`/doctor-access/${createdGrantInfo.token}`}
                target="_blank"
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Access Grants Table / List */}
      <div className="bg-white rounded-3xl border-2 border-[#013A40] shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-[#013A40]/10 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#013A40]">Active & Historical Permissions</h2>
          <span className="text-xs text-slate-500 font-bold">{grants.length} Total Grants</span>
        </div>

        <div className="divide-y divide-slate-100">
          {grants.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm font-medium">
              <Lock className="w-12 h-12 text-[#013A40] mx-auto mb-3" />
              No doctor access links generated yet.
            </div>
          ) : (
            grants.map((grant) => {
              const isExpired = new Date(grant.expiresAt) < new Date();
              const isRevoked = grant.status === 'revoked';
              const isActive = grant.status === 'active' && !isExpired;

              return (
                <div
                  key={grant._id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-[#013A40] text-base">{grant.doctorName}</h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#013A40] ${
                          isActive
                            ? 'bg-seafoam-50 text-seafoam-800'
                            : isRevoked
                            ? 'bg-rose-50 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isActive ? 'Active' : isRevoked ? 'Revoked' : 'Expired'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        Patient:{' '}
                        <strong className="text-[#013A40] font-bold">{grant.memberId?.fullName || 'Family Member'}</strong> (
                        {grant.memberId?.relation})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> Expires:{' '}
                        {new Date(grant.expiresAt).toLocaleString()}
                      </span>
                      {grant.accessLog?.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-seafoam-700 font-bold">
                            Accessed {grant.accessLog.length} times
                          </span>
                        </>
                      )}
                    </div>

                    {/* Authorized categories chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">Permitted:</span>
                      {grant.permittedCategories.map((cat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-teal-50 text-[#013A40] text-[11px] font-bold border border-[#013A40]/40"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/doctor-access/${grant.accessToken}`}
                      target="_blank"
                      className="px-3.5 py-2 rounded-xl border-2 border-[#013A40] bg-white hover:bg-slate-50 text-[#013A40] text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-seafoam-600" /> Portal View
                    </Link>

                    {isActive && (
                      <button
                        onClick={() => handleRevoke(grant._id, grant.doctorName)}
                        className="px-3.5 py-2 rounded-xl bg-tomato-50 hover:bg-tomato-100 text-tomato-700 text-xs font-bold border-2 border-[#013A40] flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <Ban className="w-3.5 h-3.5" /> Revoke Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Access Grant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto border-2 border-[#013A40]">
            <h2 className="text-xl font-bold text-[#013A40] mb-2">Grant Doctor Access</h2>
            <p className="text-xs text-slate-500 mb-4">
              Select which family member's records and which specific health categories to authorize.
            </p>

            <form onSubmit={handleCreateGrant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                  Target Family Member
                </label>
                <select
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm focus:ring-2 focus:ring-[#00A896] focus:outline-none font-semibold text-[#013A40]"
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                >
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName} ({m.relation}) - {m.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                  Doctor or Clinic Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arvind Mehta (Cardiologist)"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-medium"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                    Doctor Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-medium"
                    value={formData.doctorEmail}
                    onChange={(e) => setFormData({ ...formData, doctorEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                    Access Expiration
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-semibold"
                    value={formData.validityHours}
                    onChange={(e) => setFormData({ ...formData, validityHours: e.target.value })}
                  >
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours (2 Days)</option>
                    <option value="168">7 Days (1 Week)</option>
                    <option value="720">30 Days</option>
                  </select>
                </div>
              </div>

              {/* Granular category checklist */}
              <div className="border-2 border-[#013A40] rounded-2xl p-4 bg-teal-50/40 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#013A40] block">
                  Permitted Health Categories
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.checked })}
                    />
                    <span>Basic Overview & Vitals</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.checked })}
                    />
                    <span>Ongoing Medications</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.checked })}
                    />
                    <span>Critical Allergies</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.chronic_conditions}
                      onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.checked })}
                    />
                    <span>Chronic Illnesses</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prescriptions}
                      onChange={(e) => setFormData({ ...formData, prescriptions: e.target.checked })}
                    />
                    <span>Prescriptions</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#013A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.lab_reports}
                      onChange={(e) => setFormData({ ...formData, lab_reports: e.target.checked })}
                    />
                    <span>Lab Reports & Scans</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#013A40]/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl shadow-xs border border-[#013A40]"
                >
                  Generate Share Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
