import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import connectSocket from '../../lib/socket';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, Mail, Lock, User, CheckCircle, XCircle } from 'lucide-react';

const PasswordRule = ({ met, text }) => (
  <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-400' : 'text-gray-500'}`}>
    {met ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
    {text}
  </div>
);

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const rules = [
    { met: form.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(form.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(form.password), text: 'One number' },
  ];
  const passwordStrength = rules.filter((r) => r.met).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][passwordStrength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'][passwordStrength];
  const strengthTextColor = ['', 'text-red-400', 'text-yellow-400', 'text-green-400'][passwordStrength];

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      const token = data.token || data.accessToken;
      login(token, data.user);
      toast.success(`Welcome to InterviewAce, ${data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration Failed.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg shadow-violet-500/25 mb-5">
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start your interview prep journey — it's free</p>
        </div>

        {/* Server-level error banner */}
        {serverError && (
          <div className="mb-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="card shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  autoFocus
                  className={`input-field pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength ? strengthColor : 'bg-gray-700'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${strengthTextColor}`}>{strengthLabel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {rules.map((rule, i) => <PasswordRule key={i} {...rule} />)}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : form.confirmPassword && form.password === form.confirmPassword ? 'border-green-500/50' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 h-12 text-base">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : (
                'Create Free Account'
              )}
            </button>

            <p className="text-xs text-gray-600 text-center">
              By signing up you agree to our{' '}
              <span className="text-gray-500 cursor-pointer hover:text-gray-400">Terms of Service</span>{' '}
              and{' '}
              <span className="text-gray-500 cursor-pointer hover:text-gray-400">Privacy Policy</span>.
            </p>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>

        {/* Dev-only quick tests */}
        {import.meta.env.DEV && (
          <div className="mt-6 text-center space-y-2">
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { data } = await api.get('/health');
                    toast.success(`Backend: ${data.status} (uptime ${data.uptime}s)`);
                  } catch (err) {
                    toast.error('Health check failed');
                    console.error(err);
                  }
                }}
                className="btn-secondary px-3 py-2"
              >
                Ping Backend
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    const socket = connectSocket({ token });
                    socket.on('connect', () => {
                      toast.success('Socket connected: ' + socket.id);
                      // clean up after 2s
                      setTimeout(() => socket.close(), 2000);
                    });
                    socket.on('connect_error', (err) => {
                      toast.error('Socket connect error');
                      console.error(err);
                    });
                  } catch (err) {
                    toast.error('Socket test failed');
                    console.error(err);
                  }
                }}
                className="btn-secondary px-3 py-2"
              >
                Test Socket
              </button>
            </div>
            <p className="text-xs text-gray-500">Dev helpers: quick backend & socket tests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
