import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, UserPlus, AlertCircle, Stethoscope, Users, CheckCircle2 } from 'lucide-react';

const COMMON_SPECIALTIES = [
  'Cardiology (Heart & Vascular)',
  'General Medicine / Physician',
  'Pediatrics (Child Healthcare)',
  'Orthopedics (Bone & Joint)',
  'Neurology (Brain & Spine)',
  'Pulmonology (Chest & Lungs)',
  'Dermatology (Skin & Hair)',
  'Endocrinology & Diabetology',
  'Gynecology & Obstetrics',
];

export default function Register() {
  const [role, setRole] = useState('family'); // 'family' | 'doctor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Family specific
    familyName: '',
    bloodGroup: 'O+',
    // Doctor specific
    specialization: 'Cardiology (Heart & Vascular)',
    hospital: '',
    registrationNumber: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...formData,
      role: role === 'doctor' ? 'doctor' : 'family_owner',
    };

    try {
      const res = await register(payload);
      setLoading(false);
      if (res.success) {
        // If doctor registered, also update local directory of doctors
        if (role === 'doctor') {
          try {
            const existing = JSON.parse(localStorage.getItem('carecircle_registered_doctors') || '[]');
            const newDoc = {
              _id: 'doc-' + Date.now(),
              name: formData.name,
              email: formData.email,
              specialization: formData.specialization,
              hospital: formData.hospital || 'Apollo Hospital',
              registrationNumber: formData.registrationNumber || 'MCI-REG-99120',
            };
            localStorage.setItem('carecircle_registered_doctors', JSON.stringify([newDoc, ...existing]));
          } catch (e) {
            console.warn(e);
          }
          navigate('/doctor');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration error');
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF5F4] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#013A40] text-white flex items-center justify-center mx-auto shadow-sm">
            {role === 'doctor' ? (
              <Stethoscope className="w-6 h-6 text-[#00A896]" />
            ) : (
              <HeartHandshake className="w-6 h-6 text-[#00A896]" />
            )}
          </div>
          <h1 className="text-2xl font-black text-[#013A40] tracking-tight">
            Register <span className="text-[#00A896]">CareCircle</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {role === 'doctor'
              ? 'Join as an authorized Healthcare Provider & Physician'
              : 'Create a centralized health vault for your family'}
          </p>
        </div>

        {/* Dual Role Segmented Selector */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setRole('family');
              setError('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'family'
                ? 'bg-white text-[#013A40] shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-[#00A896]" />
            <span>Family Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('doctor');
              setError('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'doctor'
                ? 'bg-[#013A40] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#00A896]" />
            <span>Doctor Profile</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {role === 'doctor' ? 'Doctor Full Name & Title' : 'Your Full Name (Primary Caregiver)'}
            </label>
            <input
              type="text"
              required
              placeholder={role === 'doctor' ? 'e.g. Dr. Arvind Mehta, MD' : 'e.g. Siddharth Sharma'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* DOCTOR-SPECIFIC FIELDS */}
          {role === 'doctor' ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Clinical Specialty / Department
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  {COMMON_SPECIALTIES.map((spec, i) => (
                    <option key={i} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Hospital / Clinic & City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apollo Hospital, Mathura"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Medical License / Reg No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MCI-CARD-99214"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>
              </div>
            </>
          ) : (
            /* FAMILY-SPECIFIC FIELDS */
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Family Group Name
                </label>
                <input
                  type="text"
                  placeholder="Sharma Family"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
                  value={formData.familyName}
                  onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Blood Group
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-semibold"
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
          )}

          {/* Email & Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {role === 'doctor' ? 'Doctor Work Email' : 'Family Account Email'}
            </label>
            <input
              type="email"
              required
              placeholder={role === 'doctor' ? 'doctor@hospital.com' : 'siddharth@gmail.com'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Secure Password (min. 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#00A896]" />
            {loading
              ? 'Creating Profile...'
              : role === 'doctor'
              ? 'Register Doctor Profile & Access EMR'
              : 'Create Family Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already registered on CareCircle?{' '}
          <Link to="/login" className="text-teal-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}