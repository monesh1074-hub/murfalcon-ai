import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

export default function SignupScreen({ onSwitchToLogin }) {
  const { signup, error, setError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }

    setIsLoading(true);
    const result = await signup(fullName, email, password);

    if (!result.success) {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold logo-font tracking-tight mb-2">Create Account</h2>
      <p className="text-zinc-400 text-sm mb-8">Start practicing interviews with Murf Falcon AI</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-2xl text-sm mb-6 flex items-center gap-2">
          <i className="fas fa-exclamation-circle" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
          <div className="relative">
            <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              minLength={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-11 pr-4 py-4 text-sm 
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 
                         placeholder:text-zinc-500 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
          <div className="relative">
            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-11 pr-4 py-4 text-sm 
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 
                         placeholder:text-zinc-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
          <div className="relative">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 chars with a number"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-11 pr-12 py-4 text-sm 
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 
                         placeholder:text-zinc-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
          <div className="relative">
            <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-11 pr-4 py-4 text-sm 
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 
                         placeholder:text-zinc-500 transition-all"
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-400 text-xs mt-2">Passwords don't match</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed 
                     py-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin" />
              Creating account...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-violet-400 hover:text-violet-300 font-medium transition"
        >
          Sign in
        </button>
      </div>
    </AuthLayout>
  );
}