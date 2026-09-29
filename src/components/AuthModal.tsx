import React, { useState } from 'react';
import { X, Eye, EyeOff, ShieldCheck, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginAsDemo
  } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (authModalMode === 'login') {
      await login(email, password);
    } else if (authModalMode === 'register') {
      await register(name, email, password, referralCode);
    } else {
      // Forgot password demo flow
      showToast(`Password reset link dispatched to ${email}`, 'success');
      setAuthModalMode('login');
    }
    setLoading(false);
  };

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { score: 0, label: '', color: '' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 10) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3">
            <span className="text-white font-extrabold text-base font-heading">N</span>
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            {authModalMode === 'login'
              ? 'Welcome to NEXORA'
              : authModalMode === 'register'
              ? 'Create Your Tech Vault'
              : 'Recover Your Access'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {authModalMode === 'login'
              ? 'Sign in to access your orders, wishlist, and reward tier.'
              : authModalMode === 'register'
              ? 'Join NEXORA and earn 100 reward points instantly.'
              : 'Enter your verified account email to reset credentials.'}
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Buttons */}
        <div className="mb-5 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold">
            <span>⚡ 1-Click Demo Accounts:</span>
            <span className="text-neutral-500">Ready to test</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginAsDemo('customer')}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-left text-xs transition-colors flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-white">Customer Demo</div>
                <div className="text-[10px] text-neutral-400">Alex Rivera</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => loginAsDemo('admin')}
              className="px-3 py-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-800/50 text-left text-xs transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-amber-300">Admin Demo</div>
                <div className="text-[10px] text-neutral-400">Marcus Vance</div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Rivera"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex@nexora.store"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {authModalMode === 'register' && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Password Strength</span>
                    <span className="font-semibold text-neutral-200">{strength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ALEX-NEX99"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <span>
              {authModalMode === 'login'
                ? loading ? 'Signing in...' : 'Sign In'
                : authModalMode === 'register'
                ? loading ? 'Creating Account...' : 'Create Account (+100 Pts)'
                : 'Send Recovery Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Bottom mode toggles */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
