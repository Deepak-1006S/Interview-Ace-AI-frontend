import { useState, useRef, useCallback } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  Upload, FileText, CheckCircle, XCircle, AlertTriangle,
  TrendingUp, Star, Lightbulb, Tag, Trash2, RefreshCw,
  ArrowRight, Shield, Zap, Target
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

// ── Score Ring ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 140 }) => {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';
  const data = [{ name: 'Score', value: score, fill: color }];
  return (
    <div className="relative flex flex-col items-center">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#1f2937' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold" style={{ color }}>{label}</span>
      <span className="text-xs text-gray-500">ATS Score</span>
    </div>
  );
};

// ── Category Score Bar ─────────────────────────────────────────────────────
const ScoreBar = ({ label, score, color = 'violet' }) => {
  const colors = {
    violet: 'from-violet-500 to-fuchsia-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{score}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

// ── Chip list ─────────────────────────────────────────────────────────────
const ChipList = ({ items, color = 'violet' }) => {
  const colors = {
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    green:  'bg-green-500/10  text-green-300  border-green-500/20',
    red:    'bg-red-500/10    text-red-300    border-red-500/20',
    blue:   'bg-blue-500/10   text-blue-300   border-blue-500/20',
  };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colors[color]}`}>{item}</span>
      ))}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const ResumeAnalyzer = () => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.txt')) {
      toast.error('Please upload a PDF or TXT file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(data.resume);
      toast.success(`ATS Score: ${data.resume.atsScore}%`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [targetRole]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/resume');
      setHistory(data.resumes);
      setShowHistory(true);
    } catch { toast.error('Failed to load history'); }
  };

  const deleteResume = async (id) => {
    try {
      await api.delete(`/resume/${id}`);
      setHistory((prev) => prev.filter((r) => r._id !== id));
      if (resume?._id === id) setResume(null);
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <FileText className="w-3.5 h-3.5" /> Resume ATS Analyzer
          </div>
          <h1 className="text-3xl font-extrabold text-white">Resume Analyzer</h1>
          <p className="text-gray-400 mt-1">Upload your resume and get an instant ATS score with keyword analysis, strengths, and improvement tips.</p>
        </div>
        <button onClick={loadHistory} className="btn-secondary flex items-center gap-2 text-sm self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" /> My History
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Upload */}
        <div className="lg:col-span-2 space-y-4">
          {/* Target role input */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Role <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Software Engineer at Google"
              className="input-field text-sm"
            />
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`card flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[240px] border-2 border-dashed ${
              dragging ? 'border-violet-500 bg-violet-500/5' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/30'
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />

            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-white font-semibold">Analyzing your resume...</p>
                  <p className="text-gray-500 text-sm mt-1">Checking keywords, format, and ATS compatibility</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-violet-500/20' : 'bg-gray-800'}`}>
                  <Upload className={`w-6 h-6 ${dragging ? 'text-violet-400' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className="text-white font-semibold">Drop your resume here</p>
                  <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['PDF', 'TXT'].map((t) => (
                    <span key={t} className="text-xs text-gray-600 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded">{t}</span>
                  ))}
                  <span className="text-xs text-gray-600">Max 5 MB</span>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card bg-violet-500/5 border-violet-500/20">
            <p className="text-xs font-semibold text-violet-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Quick Tips
            </p>
            <ul className="space-y-1.5">
              {['Use a text-based PDF for best parsing', 'Include LinkedIn and GitHub URLs', 'Add quantified achievements (40%, $2M, 10x)', 'List tech skills in a dedicated section'].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          {!resume ? (
            <div className="card h-full flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-5">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No resume analyzed yet</h3>
              <p className="text-gray-500 text-sm max-w-xs">Upload your resume on the left to see your ATS score, keyword gaps, and improvement suggestions.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Score header */}
              <div className="card bg-gradient-to-br from-gray-900 to-gray-900/50">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ScoreRing score={resume.atsScore} />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-white mb-1">{resume.fileName}</h2>
                    <p className="text-gray-500 text-sm mb-4">
                      {resume.wordCount ? `${resume.wordCount} words · ` : ''}{new Date(resume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="space-y-3">
                      <ScoreBar label="Keyword Coverage" score={resume.keywordScore} color="violet" />
                      <ScoreBar label="Format & Structure" score={resume.formatScore} color="blue" />
                      <ScoreBar label="Content Quality" score={resume.contentScore} color="green" />
                      <ScoreBar label="Readability" score={resume.readabilityScore} color="yellow" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {resume.strengths?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {resume.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        </span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {resume.weaknesses?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" /> Issues Found
                  </h3>
                  <ul className="space-y-2">
                    {resume.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <XCircle className="w-3 h-3 text-red-400" />
                        </span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {resume.suggestions?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" /> Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {resume.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5 text-yellow-400 font-bold text-xs">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords found */}
              {resume.keywords?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-violet-400" /> Keywords Found ({resume.keywords.length})
                  </h3>
                  <ChipList items={resume.keywords.slice(0, 20)} color="violet" />
                </div>
              )}

              {/* Missing keywords */}
              {resume.missingKeywords?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> Missing Keywords
                  </h3>
                  <p className="text-gray-500 text-xs mb-3">Add these to your resume to improve ATS ranking:</p>
                  <ChipList items={resume.missingKeywords} color="red" />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => setResume(null)} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <Upload className="w-4 h-4" /> Analyze Another
                </button>
                <button onClick={() => deleteResume(resume._id)} className="btn-secondary flex items-center gap-2 text-sm text-red-400 hover:bg-red-400/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">Resume History</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
            </div>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No previous resumes found.</p>
            ) : (
              <div className="space-y-3">
                {history.map((r) => (
                  <div key={r._id} className="flex items-center justify-between gap-3 bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${r.atsScore >= 80 ? 'bg-green-500/20 text-green-400' : r.atsScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {r.atsScore}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{r.fileName}</p>
                        <p className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setResume(r); setShowHistory(false); }}
                        className="text-xs text-violet-400 hover:text-violet-300 font-medium">
                        View
                      </button>
                      <button onClick={() => deleteResume(r._id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
