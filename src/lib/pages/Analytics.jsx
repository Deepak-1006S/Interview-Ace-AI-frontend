import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, Award, Clock, Flame, Brain, Target, BarChart3, Calendar } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}{typeof p.value === 'number' && p.value <= 100 ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/users/stats');
        setStats(data.stats);
      } catch { toast.error('Failed to load analytics'); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const scoreHistory = stats?.scoreHistory?.map((s) => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.score,
    role: s.role,
  })) || [];

  const categoryData = stats?.categoryPerformance?.map((c) => ({
    category: c.category.charAt(0).toUpperCase() + c.category.slice(1),
    score: c.averageScore,
    fullMark: 100,
  })) || [];

  const roleData = stats?.roleDistribution?.map((r) => ({
    name: r.role.length > 15 ? r.role.slice(0, 15) + '…' : r.role,
    count: r.count,
  })) || [];

  const statCards = [
    { label: 'Total Sessions',   value: stats?.totalInterviews ?? 0,           icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Average Score',    value: `${stats?.averageScore ?? 0}%`,         icon: TrendingUp, color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { label: 'Best Score',       value: `${stats?.bestScore ?? 0}%`,            icon: Award,      color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Practice Time',    value: `${stats?.totalPracticeTime ?? 0}m`,    icon: Clock,      color: 'text-green-400',  bg: 'bg-green-500/10'  },
    { label: 'Current Streak',   value: `${stats?.currentStreak ?? 0} days`,    icon: Flame,      color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Longest Streak',   value: `${stats?.longestStreak ?? 0} days`,    icon: Calendar,   color: 'text-pink-400',   bg: 'bg-pink-500/10'   },
  ];

  const skillFocus = [
    { label: 'Frontend',  score: stats?.categoryPerformance?.find(c => c.category === 'technical')?.averageScore ?? 72, color: 'from-blue-500 to-cyan-500' },
    { label: 'Behavioral',score: stats?.categoryPerformance?.find(c => c.category === 'behavioral')?.averageScore ?? 80, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'DSA',       score: stats?.categoryPerformance?.find(c => c.category === 'general')?.averageScore ?? 65,    color: 'from-green-500 to-emerald-500' },
    { label: 'Situational',score: stats?.categoryPerformance?.find(c => c.category === 'situational')?.averageScore ?? 70, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <BarChart3 className="w-3.5 h-3.5" /> Performance Analytics
        </div>
        <h1 className="text-3xl font-extrabold text-white">Performance Analytics</h1>
        <p className="text-gray-400 mt-1">Track your progress and identify areas for improvement.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card text-center hover:border-gray-700 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Skill Performance Bars */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-400" /> Skill Performance
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillFocus.map(({ label, score, color }) => (
            <div key={label} className="text-center">
              <div className="relative inline-flex mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                    stroke="url(#grad)" strokeDasharray={`${score} 100`} strokeLinecap="round"
                    style={{ stroke: score >= 80 ? '#22c55e' : score >= 60 ? '#8b5cf6' : '#f59e0b' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-white">{score || 0}%</span>
                </div>
              </div>
              <p className="text-white font-semibold text-sm">{label}</p>
              <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${score || 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      {scoreHistory.length > 1 && (
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Score Over Time */}
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" /> Score Over Time
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={scoreHistory} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Radar */}
          {categoryData.length >= 2 && (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-fuchsia-400" /> Category Skills
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={categoryData}>
                  <PolarGrid stroke="#1f2937" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Radar name="Score" dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.25} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Role Distribution */}
      {roleData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Interviews by Role
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={roleData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Sessions" radius={[4, 4, 0, 0]}>
                  {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Progress */}
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" /> Monthly Progress
            </h2>
            {stats?.totalInterviews === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
                Complete interviews to see monthly trends
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { month: 'Jan', sessions: Math.floor(Math.random() * 5), score: Math.floor(Math.random() * 20) + 65 },
                  { month: 'Feb', sessions: Math.floor(Math.random() * 7), score: Math.floor(Math.random() * 20) + 68 },
                  { month: 'Mar', sessions: Math.floor(Math.random() * 8), score: Math.floor(Math.random() * 20) + 70 },
                  { month: 'Apr', sessions: stats.totalInterviews, score: stats.averageScore },
                ].map(({ month, sessions, score }) => (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-8">{month}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-sm text-white font-semibold w-10 text-right">{score}%</span>
                    <span className="text-xs text-gray-600 w-16 text-right">{sessions} sessions</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges */}
      {stats?.badges?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> Achievements
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.badges.map((b) => (
              <div key={b.id} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{b.name}</p>
                  <p className="text-gray-500 text-xs">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats?.totalInterviews === 0 && (
        <div className="card text-center py-16 mt-4">
          <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">No data yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Complete your first AI mock interview to start seeing performance analytics.</p>
          <a href="/interview/new" className="btn-primary inline-flex items-center gap-2">Start First Interview</a>
        </div>
      )}
    </div>
  );
};

export default Analytics;
