import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Clock, Target, CheckCircle, AlertCircle, Loader,
  Trash2, ChevronDown, ChevronUp, Brain, Star,
  ThumbsUp, TrendingUp, Filter, Search, Award
} from 'lucide-react';

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    : 'bg-red-500/10 text-red-400 border-red-500/20';
  return <span className={`badge border text-sm font-bold px-3 ${color}`}>{score}%</span>;
};

const categoryColor = {
  technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  behavioral: 'bg-green-500/10 text-green-400 border-green-500/20',
  situational: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const InterviewCard = ({ interview, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this interview?')) return;
    setDeleting(true);
    try {
      await api.delete(`/interviews/${interview._id}`);
      onDelete(interview._id);
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="card hover:border-gray-700 transition-all duration-200">
      {/* Card Header */}
      <div className="flex items-start gap-4">
        {/* Score circle */}
        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold ${
          interview.overallScore >= 80 ? 'bg-green-500/10 text-green-400'
          : interview.overallScore >= 60 ? 'bg-yellow-500/10 text-yellow-400'
          : 'bg-red-500/10 text-red-400'
        }`}>
          <span className="text-lg leading-tight">{interview.overallScore || '—'}</span>
          <span className="text-xs opacity-70">score</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">{interview.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Target className="w-3.5 h-3.5" />{interview.jobRole}
                </span>
                <span className="text-gray-700">·</span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5" />{formatDate(interview.createdAt)}
                </span>
                <span className="text-gray-700">·</span>
                <span className="text-sm text-gray-600 capitalize">{interview.experienceLevel} level</span>
                {interview.duration > 0 && (
                  <>
                    <span className="text-gray-700">·</span>
                    <span className="text-sm text-gray-600">{interview.duration}m duration</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {interview.status === 'completed' && <ScoreBadge score={interview.overallScore} />}
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 transition-colors font-medium"
              >
                {expanded ? <><ChevronUp className="w-4 h-4" />Hide</> : <><ChevronDown className="w-4 h-4" />Details</>}
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Feedback summary */}
          {interview.feedback && (
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{interview.feedback}</p>
          )}
        </div>
      </div>

      {/* Expanded: question-by-question review */}
      {expanded && interview.questions?.length > 0 && (
        <div className="mt-5 border-t border-gray-800 pt-5">
          <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" /> Question Review
          </h4>
          <div className="space-y-4">
            {interview.questions.map((q, i) => (
              <div key={i} className="bg-gray-800/40 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600 bg-gray-800 px-2 py-0.5 rounded">Q{i + 1}</span>
                    <span className={`badge border text-xs ${categoryColor[q.category] || categoryColor.general}`}>{q.category}</span>
                    {q.aiGenerated && <span className="text-xs text-violet-400 flex items-center gap-0.5"><Star className="w-3 h-3" />AI</span>}
                  </div>
                  <span className={`text-sm font-bold ${q.score >= 80 ? 'text-green-400' : q.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{q.score}%</span>
                </div>
                <p className="text-gray-200 text-sm font-medium mb-3 leading-relaxed">{q.question}</p>
                {q.userAnswer ? (
                  <div className="bg-gray-800/60 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Your Answer</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{q.userAnswer}</p>
                  </div>
                ) : (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-3">
                    <p className="text-red-400 text-sm">Not answered</p>
                  </div>
                )}
                {q.aiFeedback && (
                  <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-3">
                    <p className="text-xs text-violet-400 font-medium mb-1 flex items-center gap-1">
                      <Brain className="w-3 h-3" /> AI Feedback
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">{q.aiFeedback}</p>
                  </div>
                )}
                {/* Strengths & Improvements */}
                {(q.aiStrengths?.length > 0 || q.aiImprovements?.length > 0) && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {q.aiStrengths?.length > 0 && (
                      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-2">
                        <p className="text-xs text-green-400 mb-1 flex items-center gap-1"><ThumbsUp className="w-3 h-3" />Strengths</p>
                        {q.aiStrengths.map((s, j) => <p key={j} className="text-xs text-gray-400">• {s}</p>)}
                      </div>
                    )}
                    {q.aiImprovements?.length > 0 && (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-2">
                        <p className="text-xs text-yellow-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Improve</p>
                        {q.aiImprovements.map((s, j) => <p key={j} className="text-xs text-gray-400">• {s}</p>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await api.get('/interviews?limit=50');
        // Fetch full interview data including questions for completed ones
        const detailed = await Promise.all(
          data.interviews.filter(i => i.status === 'completed').slice(0, 20).map(i =>
            api.get(`/interviews/${i._id}`).then(r => r.data.interview).catch(() => i)
          )
        );
        const pendingOnes = data.interviews.filter(i => i.status !== 'completed');
        setInterviews([...detailed, ...pendingOnes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { toast.error('Failed to load interview history'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const filtered = interviews
    .filter((i) => {
      const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.jobRole.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || i.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'highest') return (b.overallScore || 0) - (a.overallScore || 0);
      if (sortBy === 'lowest') return (a.overallScore || 0) - (b.overallScore || 0);
      return 0;
    });

  const completed = interviews.filter(i => i.status === 'completed');
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((s, i) => s + i.overallScore, 0) / completed.length) : 0;
  const bestScore = completed.length > 0 ? Math.max(...completed.map(i => i.overallScore)) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Clock className="w-3.5 h-3.5" /> Interview History
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Interview History</h1>
            <p className="text-gray-400 mt-1">Review all your past sessions with full AI feedback.</p>
          </div>
          <Link to="/interview/new" className="btn-primary flex items-center gap-2 self-start text-sm">
            + New Interview
          </Link>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Sessions', value: interviews.length, icon: Clock, color: 'text-violet-400' },
          { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Best Score', value: `${bestScore}%`, icon: Award, color: 'text-yellow-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center py-4">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or role..." className="input-field pl-10 text-sm" />
        </div>
        <div className="flex gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="newest">Newest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Clock className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">{interviews.length === 0 ? 'No interviews yet' : 'No results found'}</h3>
          <p className="text-gray-500 mb-6 text-sm">
            {interviews.length === 0 ? 'Complete your first AI mock interview to see it here.' : 'Try adjusting your search or filters.'}
          </p>
          {interviews.length === 0 && (
            <Link to="/interview/new" className="btn-primary inline-flex items-center gap-2">Start Interview</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} onDelete={(id) => setInterviews(prev => prev.filter(i => i._id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
