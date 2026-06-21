import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis
} from 'recharts';
import {
  Plus, TrendingUp, Award, Clock, Target, Trash2,
  CheckCircle, AlertCircle, Loader, BarChart3, ArrowRight,
  Flame, Trophy, Star, Zap, Brain
} from 'lucide-react';

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    : 'bg-red-500/10 text-red-400 border-red-500/20';
  return <span className={`badge border ${color}`}>{score}%</span>;
};

const StatusBadge = ({ status }) => {
  const map = {
    completed: { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle, label: 'Completed' },
    'in-progress': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Loader, label: 'In Progress' },
    pending: { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: AlertCircle, label: 'Pending' },
  };
  const { color, icon: Icon, label } = map[status] || map.pending;
  return (
    <span className={`badge border ${color}`}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-violet-400 font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes, statsRes] = await Promise.all([
          api.get('/interviews'),
          api.get('/users/stats'),
        ]);
        setInterviews(interviewsRes.data.interviews);
        setStats(statsRes.data.stats);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview session?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/interviews/${id}`);
      setInterviews((prev) => prev.filter((i) => i._id !== id));
      toast.success('Interview deleted');
    } catch {
      toast.error('Failed to delete interview');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Sessions', value: stats?.totalInterviews ?? 0, icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Average Score', value: `${stats?.averageScore ?? 0}%`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Best Score', value: `${stats?.bestScore ?? 0}%`, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Practice Time', value: `${stats?.totalPracticeTime ?? 0}m`, icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Current Streak', value: `${stats?.currentStreak ?? 0}d`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Longest Streak', value: `${stats?.longestStreak ?? 0}d`, icon: Trophy, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const scoreHistoryData = stats?.scoreHistory?.map((item) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
    title: item.title,
  })) || [];

  const radarData = stats?.categoryPerformance?.map((c) => ({
    category: c.category.charAt(0).toUpperCase() + c.category.slice(1),
    score: c.averageScore,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400 mt-1">Track your interview progress and keep practicing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/leaderboard" className="btn-secondary flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
          <Link to="/interview/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Interview
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card hover:border-gray-700 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      {scoreHistoryData.length > 1 && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Score History */}
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" /> Score History
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={scoreHistoryData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#8b5cf6', r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Radar */}
          {radarData.length >= 3 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-fuchsia-400" /> Skills
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1f2937" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <Radar name="Score" dataKey="score" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      {stats?.badges?.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" /> Badges Earned
          </h2>
          <div className="flex flex-wrap gap-3">
            {stats.badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Interview Sessions</h2>
          {interviews.length > 0 && (
            <span className="text-sm text-gray-500">{interviews.length} total</span>
          )}
        </div>

        {interviews.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No interviews yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start your first mock interview and begin tracking your progress.
            </p>
            <Link to="/interview/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Start First Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <div key={interview._id} className="card hover:border-gray-700 transition-all duration-200 group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{interview.title}</h3>
                      <StatusBadge status={interview.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />{interview.jobRole}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(interview.createdAt)}</span>
                      {interview.experienceLevel && (
                        <span className="capitalize text-gray-600">{interview.experienceLevel} level</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {interview.status === 'completed' && <ScoreBadge score={interview.overallScore} />}
                    {interview.status !== 'completed' && (
                      <Link to={`/interview/${interview._id}`}
                        className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button onClick={() => handleDelete(interview._id)} disabled={deletingId === interview._id}
                      className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Delete interview">
                      {deletingId === interview._id
                        ? <Loader className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
