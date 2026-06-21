import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Users, BarChart3, Award, Clock, TrendingUp, Shield,
  Trash2, Crown, Search, Loader, Star, Cpu, FileText,
  RefreshCw, AlertTriangle, CheckCircle, Tag
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#fb7185', '#34d399'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Guard: only admins
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, search, page]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch { toast.error('Failed to load admin stats'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setTotalPages(data.pages);
    } catch { toast.error('Failed to load users'); }
    finally { setUsersLoading(false); }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
    finally { setUpdatingRole(null); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all their data? This cannot be undone.')) return;
    setDeletingUser(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
    finally { setDeletingUser(null); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
  ];

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', delta: '+12%' },
    { label: 'Total Interviews', value: stats.totalInterviews, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10', delta: '+8%' },
    { label: 'Completed', value: stats.completedInterviews, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', delta: '+15%' },
    { label: 'Avg Score', value: `${stats.overallAvgScore}%`, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10', delta: '+3pts' },
    { label: 'Resumes Analyzed', value: stats.totalResumes, icon: FileText, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', delta: '+20%' },
    { label: 'Practice Hours', value: `${stats.totalPracticeHours}h`, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', delta: '+5h' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Shield className="w-3.5 h-3.5" /> Admin Access
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Platform-wide analytics and user management.</p>
        </div>
        <button onClick={fetchStats} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-800 pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === id ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
            }`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div>
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map(({ label, value, icon: Icon, color, bg, delta }) => (
                  <div key={label} className="card hover:border-gray-700 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className="text-2xl font-extrabold text-white">{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    <p className="text-xs text-green-400 mt-1">{delta} this month</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* User Growth */}
                {stats.userGrowth?.length > 1 && (
                  <div className="card">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-violet-400" /> User Growth (30 days)
                    </h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={stats.userGrowth} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <defs>
                          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="count" name="New Users" stroke="#8b5cf6" fill="url(#userGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Interviews by Role */}
                {stats.interviewsByRole?.length > 0 && (
                  <div className="card">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" /> Interviews by Role
                    </h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={stats.interviewsByRole} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="role" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Sessions" radius={[3, 3, 0, 0]}>
                          {stats.interviewsByRole.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Skills */}
                {stats.topSkills?.length > 0 && (
                  <div className="card">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-green-400" /> Top Skills in Resumes
                    </h2>
                    <div className="space-y-3">
                      {stats.topSkills.slice(0, 8).map(({ skill, count }, i) => (
                        <div key={skill} className="flex items-center gap-3">
                          <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                          <span className="text-gray-300 text-sm w-24 truncate">{skill}</span>
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (count / (stats.topSkills[0]?.count || 1)) * 100)}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                          </div>
                          <span className="text-gray-500 text-xs w-6 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Performers */}
                {stats.topPerformers?.length > 0 && (
                  <div className="card">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" /> Top Performers
                    </h2>
                    <div className="space-y-3">
                      {stats.topPerformers.map((u, i) => (
                        <div key={u._id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-amber-700/20 text-amber-600' : 'bg-gray-800 text-gray-500'}`}>{i + 1}</span>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{u.name}</p>
                            <p className="text-gray-600 text-xs">{u.interviewsCompleted} interviews</p>
                          </div>
                          <span className={`text-sm font-bold ${u.averageScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{u.averageScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Signups */}
              {stats.recentUsers?.length > 0 && (
                <div className="card mt-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-400" /> Recent Signups
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">User</th>
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">Email</th>
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">Role</th>
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">Interviews</th>
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentUsers.map((u) => (
                          <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-gray-400">{u.email}</td>
                            <td className="py-3 px-3">
                              <span className={`badge border text-xs ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{u.role}</span>
                            </td>
                            <td className="py-3 px-3 text-gray-400">{u.interviewsCompleted}</td>
                            <td className="py-3 px-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === 'users' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search users by name or email..." className="input-field pl-10 text-sm" />
                </div>
                <button onClick={fetchUsers} className="btn-secondary flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="card p-0 overflow-hidden">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-violet-400 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-4 py-3 text-gray-500 font-medium">User</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Email</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Stats</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Joined</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-white">{u.name}</p>
                                  <p className="text-gray-500 text-xs sm:hidden">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{u.email}</td>
                            <td className="px-4 py-3">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                disabled={updatingRole === u._id || u._id === user._id}
                                className={`text-xs rounded-lg px-2 py-1 border focus:outline-none focus:ring-1 focus:ring-violet-500 ${u.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                              <span>{u.interviewsCompleted} interviews</span>
                              {u.averageScore > 0 && <span className="ml-2 text-violet-400">· {u.averageScore}% avg</span>}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                              {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3">
                              {u._id !== user._id && (
                                <button onClick={() => handleDeleteUser(u._id)} disabled={deletingUser === u._id}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                  {deletingUser === u._id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">←</button>
                  <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">→</button>
                </div>
              )}
            </div>
          )}

          {/* ── ACTIVITY TAB ── */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {stats?.interviewsByDay?.length > 1 && (
                <div className="card">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" /> Interviews per Day (Last 14 days)
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={stats.interviewsByDay} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <defs>
                        <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="_id" tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" name="Interviews" stroke="#22c55e" fill="url(#actGrad)" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Score distribution */}
              {stats?.interviewsByRole?.length > 0 && (
                <div className="card">
                  <h2 className="text-lg font-bold text-white mb-4">Average Score by Role</h2>
                  <div className="space-y-3">
                    {stats.interviewsByRole.map(({ role, count, avgScore }, i) => (
                      <div key={role} className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm w-36 truncate">{role}</span>
                        <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${avgScore}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                        </div>
                        <span className="text-white text-sm font-semibold w-12 text-right">{avgScore}%</span>
                        <span className="text-gray-600 text-xs w-16 text-right">{count} sessions</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
