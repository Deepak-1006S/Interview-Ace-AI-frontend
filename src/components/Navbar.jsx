import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  LogOut, LayoutDashboard, Mic, Zap, Trophy, User,
  Menu, X, Wifi, WifiOff, FileText, Code2, BarChart3,
  Clock, Shield, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const close = () => { setMobileOpen(false); setProfileOpen(false); };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    close();
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = user ? [
    { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/interview/new', icon: Mic,           label: 'Practice' },
    { to: '/resume',     icon: FileText,          label: 'Resume' },
    { to: '/coding',     icon: Code2,             label: 'Coding' },
    { to: '/analytics',  icon: BarChart3,          label: 'Analytics' },
    { to: '/history',    icon: Clock,             label: 'History' },
    { to: '/leaderboard',icon: Trophy,            label: 'Leaderboard' },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={close}>
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">InterviewAce</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to) ? 'bg-violet-600/20 text-violet-400' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Realtime dot */}
                <div className="hidden lg:block" title={connected ? 'Realtime connected' : 'Connecting...'}>
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-600'}`} />
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 hidden lg:block font-medium max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/40 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-800 mb-1">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={close} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                        <User className="w-4 h-4" />Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={close} className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors">
                          <Shield className="w-4 h-4" />Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-800 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                          <LogOut className="w-4 h-4" />Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 space-y-1">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-gray-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-600'}`} />
              </div>
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} onClick={close}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(to) ? 'bg-violet-600/20 text-violet-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                  <Icon className="w-4 h-4" />{label}
                </Link>
              ))}
              <Link to="/profile" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800">
                <User className="w-4 h-4" />Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10">
                  <Shield className="w-4 h-4" />Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                <LogOut className="w-4 h-4" />Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 py-2">
              <Link to="/login" onClick={close} className="btn-secondary text-sm text-center">Sign In</Link>
              <Link to="/register" onClick={close} className="btn-primary text-sm text-center">Get Started Free</Link>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close profile dropdown */}
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </nav>
  );
};

export default Navbar;
