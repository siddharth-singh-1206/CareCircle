import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FolderLock,
  UploadCloud,
  FileText,
  ExternalLink,
  Trash2,
  Calendar,
  Filter,
  CheckCircle2,
  Tag,
  Stethoscope
} from 'lucide-react';

const DEMO_DOCUMENTS = [
  {
    _id: 'doc-1',
    title: 'Cardiology Follow-Up & ECG Report',
    category: 'Lab Report',
    doctorOrLab: 'Apollo Diagnostic Lab',
    recordDate: '2026-02-10',
    notes: 'Normal sinus rhythm, BP reading 128/84',
    filePath: '/uploads/sample-prescription.pdf',
    fileName: 'apollo_ecg_feb2026.pdf',
    fileSize: 420000,
  },
  {
    _id: 'doc-2',
    title: 'Annual Blood Chemistry & Lipid Profile',
    category: 'Lab Report',
    doctorOrLab: 'Max Healthcare Pathology',
    recordDate: '2026-01-18',
    notes: 'HbA1c 5.8%, Total Cholesterol 185 mg/dL',
    filePath: '/uploads/sample-blood-report.pdf',
    fileName: 'lipid_profile_jan2026.pdf',
    fileSize: 780000,
  },
  {
    _id: 'doc-3',
    title: 'Prescription - Blood Pressure Regimen',
    category: 'Prescription',
    doctorOrLab: 'Dr. Anita Chen',
    recordDate: '2026-02-15',
    notes: 'Telmisartan 40mg daily morning',
    filePath: '/uploads/sample-prescription.pdf',
    fileName: 'dr_chen_rx_feb2026.pdf',
    fileSize: 310000,
  },
];

export default function Documents() {
  const { members, selectedMember: selectedMemberFromContext } = useAuth();
  const selectedMember = selectedMemberFromContext || (members && members.length > 0 ? members[0] : {
    _id: 'demo-arthur',
    fullName: 'Arthur Jenkins',
    relation: 'Dad / Spouse',
  });

  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [msg, setMsg] = useState('');

  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'Prescription',
    doctorOrLab: '',
    recordDate: new Date().toISOString().split('T')[0],
    notes: '',
    file: null,
  });

  const categories = ['All', 'Prescription', 'Lab Report', 'Scan/X-Ray', 'Discharge Summary', 'Vaccine Certificate'];

  const fetchDocuments = async () => {
    if (!selectedMember) return;
    try {
      setLoading(true);
      const url = categoryFilter === 'All'
        ? `/documents?memberId=${selectedMember._id}`
        : `/documents?memberId=${selectedMember._id}&category=${encodeURIComponent(categoryFilter)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedMember, categoryFilter]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      alert('Please choose a file to upload');
      return;
    }
    try {
      const data = new FormData();
      data.append('memberId', selectedMember._id);
      data.append('title', uploadData.title || uploadData.file.name);
      data.append('category', uploadData.category);
      data.append('doctorOrLab', uploadData.doctorOrLab);
      data.append('recordDate', uploadData.recordDate);
      data.append('notes', uploadData.notes);
      data.append('file', uploadData.file);

      const res = await api.post('/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setMsg('Medical document uploaded to vault successfully!');
        setShowUploadModal(false);
        setUploadData({
          title: '',
          category: 'Prescription',
          doctorOrLab: '',
          recordDate: new Date().toISOString().split('T')[0],
          notes: '',
          file: null,
        });
        fetchDocuments();
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error uploading doc:', err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete document "${title}" from vault?`)) return;
    try {
      await api.delete(`/documents/${id}`);
      setMsg(`Document "${title}" deleted.`);
      fetchDocuments();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error('Error deleting doc:', err);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 bg-[#F7FAF9] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#013A40]/20">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#013A40]">
            Medical Document Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Prescriptions, lab reports, and diagnostic imaging for{' '}
            <strong className="text-[#013A40]">{selectedMember.fullName}</strong>.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 border-2 border-[#013A40]"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {msg}
        </div>
      )}

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border-2 border-[#013A40] ${
              categoryFilter === cat
                ? 'bg-[#013A40] text-white shadow-xs'
                : 'bg-white text-[#013A40] hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-[#013A40] shadow-soft">
            <FolderLock className="w-12 h-12 text-[#013A40] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#013A40]">No Documents in this Category</h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload prescription slips or lab reports to organize this member's health archive.
            </p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border-2 border-[#013A40] shadow-soft p-6 flex flex-col justify-between hover:shadow-soft-hover transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#013A40] flex items-center justify-center shrink-0 border border-[#013A40]/40">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#013A40] border border-[#013A40]">
                    {doc.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#013A40] line-clamp-2">{doc.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Issued: {new Date(doc.recordDate).toLocaleDateString()}</span>
                  </div>
                  {doc.doctorOrLab && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1 font-semibold">
                      <Stethoscope className="w-3.5 h-3.5 text-seafoam-600" />
                      <span>{doc.doctorOrLab}</span>
                    </div>
                  )}
                  {doc.notes && (
                    <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-[#013A40]/30 font-medium">
                      {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#013A40] rounded-lg text-xs font-bold transition-colors border border-[#013A40]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-seafoam-600" />
                  View Document
                </a>
                <button
                  onClick={() => handleDelete(doc._id, doc.title)}
                  className="p-1.5 text-slate-400 hover:text-tomato-600 hover:bg-tomato-50 rounded-lg transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto border-2 border-[#013A40]">
            <h2 className="text-xl font-bold text-[#013A40] mb-4">
              Upload Medical Document for {selectedMember.fullName}
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Blood Sugar & Lipid Panel"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm focus:ring-2 focus:ring-[#00A896] focus:outline-none"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">Category</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-semibold"
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Scan/X-Ray">Scan/X-Ray</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Vaccine Certificate">Vaccine Certificate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">Record Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-medium"
                    value={uploadData.recordDate}
                    onChange={(e) => setUploadData({ ...uploadData, recordDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">
                  Physician, Clinic or Diagnostic Lab
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Lal PathLabs / Apollo Clinic"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-medium"
                  value={uploadData.doctorOrLab}
                  onChange={(e) => setUploadData({ ...uploadData, doctorOrLab: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#013A40] uppercase mb-1">Notes / Key Findings</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Fasting blood sugar normal, cholesterol slightly elevated"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#013A40] text-sm font-medium"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                ></textarea>
              </div>

              {/* File picker with Deep Teal Boundary */}
              <div className="border-2 border-dashed border-[#013A40] rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors bg-teal-50/20">
                <input
                  type="file"
                  id="fileUpload"
                  required
                  className="hidden"
                  onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  <UploadCloud className="w-8 h-8 text-[#013A40] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#013A40] hover:underline">
                    {uploadData.file ? uploadData.file.name : 'Click to select PDF, JPG, or PNG report file'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Maximum file size: 15 MB</p>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#013A40]/20">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl shadow-xs border border-[#013A40]"
                >
                  Upload & Secure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
