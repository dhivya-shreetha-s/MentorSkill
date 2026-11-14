import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import api from '../lib/api';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpErr } = await signUp(email, password, {
          data: { full_name: fullName }
        });
        if (signUpErr) throw signUpErr;

        // Try creating/updating initial profile
        try {
          await api.post('/api/profile', {
            full_name: fullName,
            email: email
          });
        } catch (profileErr) {
          console.warn('Initial profile create notice:', profileErr);
        }

        navigate('/onboarding');
      } else {
        const { data, error: signInErr } = await signIn(email, password);
        if (signInErr) throw signInErr;

        // Check if onboarding was completed
        try {
          const profileRes = await api.get('/api/profile');
          if (profileRes.data?.profile?.onboarding_completed) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } catch {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-violet-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <Brain className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Mentor<span className="text-violet-400">Skill</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isSignUp ? 'Create your learner account' : 'Welcome back to your co-pilot'}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {isSignUp
            ? 'Start your personalized AI-guided engineering path'
            : 'Sign in to access your roadmaps and assessment scores'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card p-8 shadow-2xl border-white/10">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="input-field pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In to MentorSkill'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 mb-3">Hackathon Reviewer? Jump right into the live app:</p>
            <button
              type="button"
              onClick={() => {
                loginDemoUser();
                navigate('/dashboard');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/20"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Explore as Alex Johnson (Demo Profile)</span>
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            By signing in, you agree to the MentorSkill terms and privacy standards.
          </div>
        </div>
      </div>
    </div>
  );
}
