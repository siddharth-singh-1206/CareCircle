import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogIn, Sparkles, AlertCircle, Stethoscope, Users } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('family'); // 'family' | 'doctor'
  const [email, setEmail] = useState('siddharth@carecircle.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'doctor') {
      setEmail('dr.mehta@apollo.com');
      setPassword('password123');
    } else {
      setEmail('siddharth@carecircle.com');
      setPassword('password123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password, role === 'doctor' ? 'doctor' : 'family_owner');
      if (res.success) {
        if (role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    if (role === 'doctor') {
      setEmail('dr.mehta@apollo.com');
      setPassword('password123');
    } else {
      setEmail('siddharth@carecircle.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF5F4] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#013A40] text-white flex items-center justify-center mx-auto shadow-sm">
            {role === 'doctor' ? (
              <Stethoscope className="w-6 h-6 text-[#00A896]" />
            ) : (
              <HeartHandshake className="w-6 h-6 text-[#00A896]" />
            )}
          </div>
          <h1 className="text-2xl font-black text-[#013A40] tracking-tight">
            Care<span className="text-[#00A896]">Circle</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {role === 'doctor'
              ? 'Attending Physician & Clinical EMR Portal'
              : 'Centralized Family Health Management & Emergency Hub'}
          </p>
        </div>

        {/* Dual Role Segmented Selector */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleRoleSwitch('family')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'family'
                ? 'bg-white text-[#013A40] shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-[#00A896]" />
            <span>Family / Caregiver</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('doctor')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'doctor'
                ? 'bg-[#013A40] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#00A896]" />
            <span>Doctor / Physician</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {role === 'doctor' ? 'Doctor Work Email' : 'Family Account Email'}
            </label>
            <input
              type="email"
              required
              placeholder={role === 'doctor' ? 'dr.mehta@apollo.com' : 'siddharth@carecircle.com'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008985] focus:bg-white transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {loading
              ? 'Verifying...'
              : role === 'doctor'
              ? 'Sign In as Attending Doctor'
              : 'Sign In as Family Owner'}
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2.5 px-3 bg-[#E6F7F3] hover:bg-[#D5F2EB] text-[#008985] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00A896]" />
            {role === 'doctor'
              ? '⚡ Quick-Fill Demo Doctor (Dr. Arvind Mehta - Cardiologist)'
              : '⚡ Quick-Fill Demo Family (Siddharth Sharma)'}
          </button>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {role === 'doctor' ? (
            <span>
              Authorized healthcare provider network • Apollo Heart Institute
            </span>
          ) : (
            <span>
              Need a new family workspace?{' '}
              <Link to="/register" className="text-teal-600 font-bold hover:underline">
                Register Family
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
