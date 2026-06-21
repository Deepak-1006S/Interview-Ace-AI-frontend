import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import {
  Code2, ChevronRight, Clock, CheckCircle, XCircle, Tag,
  Play, Send, Lightbulb, BookOpen, Building2, ArrowLeft,
  Filter, Search, Loader, Terminal, Eye
} from 'lucide-react';

// ── Difficulty badge ──────────────────────────────────────────────────────
const DiffBadge = ({ diff }) => {
  const map = {
    easy:   'bg-green-500/10 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    hard:   'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${map[diff] || map.easy}`}>{diff}</span>
  );
};

// ── Problem List ──────────────────────────────────────────────────────────
const ProblemList = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const params = new URLSearchParams();
        if (filter !== 'all') params.append('difficulty', filter);
        if (search) params.append('search', search);
        const { data } = await api.get(`/coding?${params}`);
        setChallenges(data.challenges);
      } catch { toast.error('Failed to load challenges'); }
      finally { setLoading(false); }
    };
    fetchChallenges();
  }, [filter, search]);

  const diffCount = { all: challenges.length, easy: 0, medium: 0, hard: 0 };
  challenges.forEach((c) => { if (diffCount[c.difficulty] !== undefined) diffCount[c.difficulty]++; });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <Code2 className="w-3.5 h-3.5" /> Coding Challenges
        </div>
        <h1 className="text-3xl font-extrabold text-white">Coding Challenges</h1>
        <p className="text-gray-400 mt-1">Practice real interview problems asked at Google, Amazon, Meta and more.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..." className="input-field pl-10 text-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((d) => {
            const colors = { all: 'border-gray-600 text-gray-300', easy: 'border-green-500/50 text-green-400', medium: 'border-yellow-500/50 text-yellow-400', hard: 'border-red-500/50 text-red-400' };
            return (
              <button key={d} onClick={() => setFilter(d)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${filter === d ? (colors[d] + ' bg-gray-800') : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}>
                {d} {diffCount[d] > 0 ? `(${diffCount[d]})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Easy', count: challenges.filter(c => c.difficulty === 'easy').length, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Medium', count: challenges.filter(c => c.difficulty === 'medium').length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Hard', count: challenges.filter(c => c.difficulty === 'hard').length, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-2xl font-extrabold ${color}`}>{count}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Problem Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">#</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Title</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden sm:table-cell">Tags</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Difficulty</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Acceptance</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c, i) => (
                <tr key={c._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                  <td className="px-5 py-4 text-gray-600 font-mono">{i + 1}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => navigate(`/coding/${c.slug}`)}
                      className="font-semibold text-white hover:text-violet-400 transition-colors text-left">
                      {c.title}
                    </button>
                    {c.companies?.length > 0 && (
                      <p className="text-xs text-gray-600 mt-0.5">{c.companies.slice(0, 3).join(' · ')}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4"><DiffBadge diff={c.difficulty} /></td>
                  <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{c.acceptanceRate}%</td>
                  <td className="px-5 py-4">
                    <button onClick={() => navigate(`/coding/${c.slug}`)}
                      className="opacity-0 group-hover:opacity-100 btn-primary py-1.5 px-3 text-xs flex items-center gap-1 transition-opacity">
                      Solve <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {challenges.length === 0 && (
            <div className="text-center py-12 text-gray-500">No problems found.</div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Code Editor Page ──────────────────────────────────────────────────────
const CodeEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/coding/${slug}`);
        setChallenge(data.challenge);
        setCode(data.challenge.starterCode?.[language] || '');
      } catch {
        toast.error('Challenge not found');
        navigate('/coding');
      } finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    if (challenge) setCode(challenge.starterCode?.[language] || '');
  }, [language, challenge]);

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Write some code first'); return; }
    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await api.post(`/coding/${slug}/submit`, { code, language });
      setResult(data.result);
      if (data.result.status === 'accepted') toast.success('All test cases passed! 🎉');
      else toast.error(`${data.result.passedTests}/${data.result.totalTests} test cases passed`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  const monacoLang = { javascript: 'javascript', python: 'python', java: 'java' };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-8 h-8 text-violet-400 animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Left: Problem Description ── */}
      <div className="lg:w-[45%] flex flex-col border-r border-gray-800 overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-800 bg-gray-900/50 shrink-0">
          <button onClick={() => navigate('/coding')}
            className="mr-2 text-gray-500 hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {[
            { id: 'description', icon: BookOpen, label: 'Description' },
            { id: 'hints', icon: Lightbulb, label: `Hints (${challenge?.hints?.length || 0})` },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === id ? 'bg-violet-600/20 text-violet-400' : 'text-gray-500 hover:text-gray-300'}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'description' ? (
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div>
                  <h1 className="text-xl font-bold text-white mb-2">{challenge.title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <DiffBadge diff={challenge.difficulty} />
                    {challenge.category && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded capitalize">{challenge.category}</span>
                    )}
                    <span className="text-xs text-gray-500">{challenge.acceptanceRate}% acceptance</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert prose-sm max-w-none mb-6">
                {challenge.description.split('\n').map((line, i) => (
                  <p key={i} className="text-gray-300 text-sm leading-relaxed mb-2"
                    dangerouslySetInnerHTML={{ __html: line.replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                ))}
              </div>

              {/* Examples */}
              {challenge.examples?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Examples</h3>
                  {challenge.examples.map((ex, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-4 mb-3 font-mono text-sm">
                      <p className="text-gray-400 mb-1"><span className="text-gray-500">Input:</span> <span className="text-green-300">{ex.input}</span></p>
                      <p className="text-gray-400 mb-1"><span className="text-gray-500">Output:</span> <span className="text-blue-300">{ex.output}</span></p>
                      {ex.explanation && <p className="text-gray-500 text-xs mt-2">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {challenge.constraints && (
                <div className="mb-5">
                  <h3 className="text-white font-semibold mb-2 text-sm">Constraints</h3>
                  <div className="bg-gray-800/40 rounded-xl p-3">
                    {challenge.constraints.split('\n').map((c, i) => (
                      <p key={i} className="text-gray-400 text-xs font-mono leading-relaxed">{c}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies */}
              {challenge.companies?.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> Asked at
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {challenge.companies.map((c) => (
                      <span key={c} className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-1 rounded-lg">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-white font-semibold mb-4">Hints</h3>
              <p className="text-gray-500 text-sm mb-4">Try to solve it yourself first! Hints are here when you're stuck.</p>
              {challenge.hints?.map((hint, i) => (
                <div key={i} className={`mb-3 transition-all duration-300 ${i <= hintIndex ? '' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-400 text-xs font-semibold mb-2">Hint {i + 1}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{hint}</p>
                  </div>
                </div>
              ))}
              {hintIndex < (challenge.hints?.length || 0) - 1 && (
                <button onClick={() => setHintIndex(h => h + 1)} className="btn-secondary text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Reveal Next Hint
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Editor ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50 shrink-0 gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-500" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCode(challenge.starterCode?.[language] || '')}
              className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
              Reset
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4">
              {submitting
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running...</>
                : <><Send className="w-3.5 h-3.5" />Submit</>
              }
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={monacoLang[language]}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: true,
              padding: { top: 16, bottom: 16 },
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Result panel */}
        {result && (
          <div className={`shrink-0 border-t p-4 ${result.status === 'accepted' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <div className="flex items-start gap-3">
              {result.status === 'accepted'
                ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              }
              <div className="flex-1">
                <p className={`font-semibold text-sm ${result.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                  {result.message}
                </p>
                {result.status === 'accepted' && result.runtime && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Runtime: {result.runtime} ms</span>
                    <span>Memory: {(result.memory / 1024).toFixed(1)} MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Router ────────────────────────────────────────────────────────────────
const CodingChallengePage = () => {
  const { slug } = useParams();
  return slug ? <CodeEditor /> : <ProblemList />;
};

export default CodingChallengePage;
