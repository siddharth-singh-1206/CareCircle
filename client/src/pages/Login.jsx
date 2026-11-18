import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
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
    setEmail('siddharth@carecircle.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-soft border-2 border-[#013A40] space-y-6">
        
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#013A40] text-white flex items-center justify-center mx-auto shadow-sm border-2 border-[#013A40]">
            <HeartHandshake className="w-6 h-6 text-[#00A896]" />
          </div>
          <h1 className="text-2xl font-black text-[#013A40] tracking-tight">
            Sign In to Care<span className="text-seafoam-600">Circle</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Centralized Family Health Management & Emergency Hub
          </p>
        </div>

        {error && (
          <div className="bg-tomato-50 border-2 border-tomato-500 text-tomato-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-tomato-500 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#013A40] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="siddharth@carecircle.com"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#013A40] bg-[#F7FAF9] text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#013A40] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#013A40] bg-[#F7FAF9] text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:bg-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#013A40] hover:bg-[#024D55] text-white rounded-xl font-bold text-sm shadow-soft transition-colors flex items-center justify-center gap-2 border-2 border-[#013A40]"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing In...' : 'Sign In as Family Owner'}
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2.5 px-3 bg-seafoam-50 hover:bg-seafoam-100 border-2 border-[#013A40] text-[#013A40] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-seafoam-600" />
            Fill Viva / Demo Account (Siddharth Sharma)
          </button>
        </div>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Need a new family workspace?{' '}
          <Link to="/register" className="text-teal-500 font-bold hover:underline">
            Register Family
          </Link>
        </div>
      </div>
    </div>
  );
}
