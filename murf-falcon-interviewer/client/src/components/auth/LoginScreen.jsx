import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

export default function LoginScreen({ onSwitchToSignup }) {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);

    if (!result.success) {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold logo-font tracking-tight mb-2">Welcome Back</h2>
      <p className="text-zinc-400 text-sm mb-8">Sign in to continue your interview practice</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3 rounded-2xl text-sm mb-6 flex items-center gap-2">
          <i className="fas fa-exclamation-circle" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••••"
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
              Signing in...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt" />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-8 text-center text-sm text-zinc-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-violet-400 hover:text-violet-300 font-medium transition"
        >
          Create one
        </button>
      </div>
    </AuthLayout>
  );
}