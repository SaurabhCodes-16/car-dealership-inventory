import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (demoType: 'admin' | 'customer') => {
    if (demoType === 'admin') {
      setEmail('admin@dealership.com');
      setPassword('admin123');
    } else {
      setEmail('buyer@dealership.com');
      setPassword('buyer123');
    }
    setTab('login');
    setError(null);
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

        {/* 1-Click Demo Fillers */}
        <div className="px-6 pt-4">
          <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/60 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                1-Click Demo Logins:
              </span>
              <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('customer')}
                className="py-1.5 px-2.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-medium text-stone-800 transition-colors text-left"
              >
                <p className="font-semibold text-stone-900">Buyer Account</p>
                <p className="text-[10px] text-stone-400 truncate">buyer@dealership.com</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="py-1.5 px-2.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-medium text-stone-800 transition-colors text-left"
              >
                <p className="font-semibold text-stone-900">Admin Account</p>
                <p className="text-[10px] text-stone-400 truncate">admin@dealership.com</p>
              </button>
            </div>
          </div>
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
            <div>
              <label className="block font-medium text-stone-700 mb-1">Role Permission</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400"
              >
                <option value="customer">Customer (Standard Buyer)</option>
                <option value="admin">Administrator (Manager Privileges)</option>
              </select>
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
