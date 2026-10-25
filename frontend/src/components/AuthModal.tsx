import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Shield, Key } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [adminSecretCode, setAdminSecretCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role, role === 'admin' ? adminSecretCode : undefined);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-soft-hover overflow-hidden transition-soft">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-semibold text-lg text-stone-900">
              {tab === 'login' ? 'Account Access' : 'Create Dealership Account'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex space-x-2 border-b border-stone-100">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`pb-2.5 text-xs font-semibold tracking-wide border-b-2 transition-soft ${
              tab === 'login'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`pb-2.5 text-xs font-semibold tracking-wide border-b-2 transition-soft ${
              tab === 'register'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Register
          </button>
        </div>


        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block font-medium text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saurabh Tiwari"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block font-medium text-stone-700 mb-1.5">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setRole('customer'); setAdminSecretCode(''); }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      role === 'customer'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-soft'
                        : 'border-stone-200 bg-[#FBFBFA] hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <UserIcon className={`w-3.5 h-3.5 ${role === 'customer' ? 'text-stone-300' : 'text-stone-500'}`} />
                      <span className="font-semibold text-xs">Customer</span>
                    </div>
                    <p className={`text-[10px] ${role === 'customer' ? 'text-stone-300' : 'text-stone-400'}`}>
                      Browse showroom & buy cars
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      role === 'admin'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-soft'
                        : 'border-stone-200 bg-[#FBFBFA] hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <Shield className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-champagne-300' : 'text-stone-500'}`} />
                      <span className="font-semibold text-xs">Administrator</span>
                    </div>
                    <p className={`text-[10px] ${role === 'admin' ? 'text-stone-300' : 'text-stone-400'}`}>
                      Manage inventory & stock
                    </p>
                  </button>
                </div>
              </div>

              {role === 'admin' && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl animate-fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-900 flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Passcode Required</span>
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md font-mono">
                      Staff Only
                    </span>
                  </div>
                  <input
                    type="password"
                    required={role === 'admin'}
                    value={adminSecretCode}
                    onChange={(e) => setAdminSecretCode(e.target.value)}
                    placeholder="Enter admin authorization passcode"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-amber-300 text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-amber-700 leading-tight">
                    Requires the authorization secret configured by the dealership owner.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-stone-100 font-medium hover:bg-stone-800 transition-soft shadow-soft"
            >
              {isSubmitting ? 'Verifying...' : tab === 'login' ? 'Sign In to Account' : 'Register Account'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
