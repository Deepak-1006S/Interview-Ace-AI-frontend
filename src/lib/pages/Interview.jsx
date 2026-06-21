import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import useInterviewTimer from '../../hooks/useInterviewTimer';
import {
  ChevronLeft, ChevronRight, CheckCircle, Send, Briefcase,
  Clock, Target, Award, RotateCcw, Home, Mic, MicOff,
  Save, Wifi, WifiOff, TrendingUp, Star, AlertTriangle,
  Brain, ThumbsUp, ThumbsDown, Code2
} from 'lucide-react';

// ── Setup Form ───────────────────────────────────────────────────────────────
const SetupForm = ({ onStart, loading }) => {
  const [form, setForm] = useState({
    title: '', jobRole: '', jobDescription: '', experienceLevel: 'mid', questionCount: 5,
  });
  const [errors, setErrors] = useState({});

  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Site Reliability Engineer',
    'Mobile Developer', 'Security Engineer', 'Data Engineer', 'Product Manager',
    'Engineering Manager', 'QA Engineer', 'Other',
  ];
  const levels = [
    { value: 'entry', label: 'Entry Level (0–2 yrs)' },
    { value: 'mid', label: 'Mid Level (2–5 yrs)' },
    { value: 'senior', label: 'Senior Level (5–8 yrs)' },
    { value: 'lead', label: 'Lead / Principal (8+ yrs)' },
  ];

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Session title is required';
    if (!form.jobRole.trim()) errs.jobRole = 'Job role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">New Interview Session</h1>
        <p className="text-gray-400">Configure your mock interview to get the most relevant questions.</p>
      </div>
      <div className="card">
        <form onSubmit={(e) => { e.preventDefault(); if (validate()) onStart(form); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Session Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: '' }); }}
              placeholder="e.g., Google SWE Prep, Meta Frontend Round"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Role</label>
            <div className="relative">
              <select
                value={form.jobRole}
                onChange={(e) => { setForm({ ...form, jobRole: e.target.value }); if (errors.jobRole) setErrors({ ...errors, jobRole: '' }); }}
                className={`input-field appearance-none pr-8 ${errors.jobRole ? 'border-red-500' : ''}`}
              >
                <option value="" disabled>Select a role...</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            {errors.jobRole && <p className="text-red-400 text-xs mt-1">{errors.jobRole}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map(({ value, label }) => (
                <button key={value} type="button"
                  onClick={() => setForm({ ...form, experienceLevel: value })}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 text-left ${
                    form.experienceLevel === value
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[3, 5, 7, 10].map((n) => (
                <button key={n} type="button"
                  onClick={() => setForm({ ...form, questionCount: n })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.questionCount === n
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}>{n}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Job Description <span className="text-gray-600 font-normal">(optional — enables AI-tailored questions)</span>
            </label>
            <textarea
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              placeholder="Paste the job description here to get AI-generated questions tailored to this specific role..."
              rows={4}
              className="input-field resize-none"
            />
            {form.jobDescription.length > 50 && (
              <p className="text-violet-400 text-xs mt-1 flex items-center gap-1">
                <Brain className="w-3 h-3" /> AI will generate custom questions from this description
              </p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating questions...</>
            ) : (
              <><Target className="w-4 h-4" /> Start Interview</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Timer Bar ─────────────────────────────────────────────────────────────────
const TimerBar = ({ timer }) => {
  if (!timer.running && timer.elapsed === 0) return null;
  const color = timer.isCritical ? 'from-red-500 to-red-600' : timer.isWarning ? 'from-yellow-500 to-orange-500' : 'from-violet-500 to-fuchsia-500';
  return (
    <div className="flex items-center gap-3 text-sm">
      <Clock className={`w-4 h-4 ${timer.isCritical ? 'text-red-400 animate-pulse' : timer.isWarning ? 'text-yellow-400' : 'text-gray-400'}`} />
      <span className={`font-mono font-bold ${timer.isCritical ? 'text-red-400' : timer.isWarning ? 'text-yellow-400' : 'text-gray-300'}`}>
        {timer.formattedElapsed}
      </span>
      {timer.formattedRemaining && (
        <span className="text-gray-600">/ {timer.formattedRemaining} left</span>
      )}
      {timer.percentUsed > 0 && (
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-24">
          <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
            style={{ width: `${timer.percentUsed}%` }} />
        </div>
      )}
    </div>
  );
};

// ── Question Session ──────────────────────────────────────────────────────────
const QuestionSession = ({ interview, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(interview.lastSavedIndex || 0);
  const [answers, setAnswers] = useState(
    (interview.questions || []).map((q) => q.userAnswer || '')
  );
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [gradingStarted, setGradingStarted] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const autoSaveRef = useRef(null);

  const { connected, joinInterview, emitTyping, on, off } = useSocket();

  const timer = useInterviewTimer(30, () => {
    toast.error('Time is up! Auto-submitting your answers.', { duration: 3000 });
    handleSubmit(true);
  });

  // Join socket room and start timer
  useEffect(() => {
    joinInterview(interview._id);
    timer.start();

    on('grading_started', () => setGradingStarted(true));

    return () => {
      off('grading_started');
      timer.pause();
    };
  }, [interview._id]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      handleAutoSave();
    }, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [answers, currentIndex]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentIndex]);

  const handleAutoSave = async () => {
    try {
      setSaving(true);
      await api.put(`/interviews/${interview._id}/progress`, {
        answers,
        currentIndex,
      });
      setLastSaved(new Date());
    } catch { /* silent fail */ }
    finally { setSaving(false); }
  };

  // Voice-to-text using Web Speech API
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in this browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    let finalTranscript = answers[currentIndex];

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += ' ' + event.results[i][0].transcript;
        } else {
          interim = event.results[i][0].transcript;
        }
      }
      const updated = [...answers];
      updated[currentIndex] = (finalTranscript + ' ' + interim).trim();
      setAnswers(updated);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => { setIsListening(false); toast.error('Voice recognition error'); };

    recognition.start();
    setIsListening(true);
    toast.success('Listening... Speak your answer');
  };

  const handleAnswerChange = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
    emitTyping(interview._id, currentIndex, value.length > 0);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const unanswered = answers.filter((a) => !a.trim()).length;
      if (unanswered > 0) {
        if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
      }
    }
    setSubmitting(true);
    timer.pause();
    if (recognitionRef.current) recognitionRef.current.stop();
    try {
      const { data } = await api.put(`/interviews/${interview._id}/submit`, {
        answers,
        duration: timer.elapsedMinutes,
      });
      onComplete(data?.interview || data);
    } catch {
      toast.error('Failed to submit. Please try again.');
      setSubmitting(false);
      timer.start();
    }
  };

  const question = interview.questions?.[currentIndex];
  const totalQuestions = interview.questions?.length || 0;
  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">No questions found for this interview.</p>
      </div>
    );
  }
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const categoryColor = {
    technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    behavioral: 'bg-green-500/10 text-green-400 border-green-500/20',
    situational: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  const difficultyColor = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };

  if (gradingStarted || submitting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-xl font-bold text-white">AI is grading your answers...</h2>
          <p className="text-gray-400">Analyzing your responses with GPT-4o. This takes a few seconds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-white truncate">{interview.title}</h1>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            {/* Socket status */}
            {connected
              ? <Wifi className="w-4 h-4 text-green-400" title="Realtime connected" />
              : <WifiOff className="w-4 h-4 text-gray-600" title="Offline" />
            }
            {/* Auto-save indicator */}
            {saving
              ? <span className="text-xs text-gray-500 flex items-center gap-1"><Save className="w-3 h-3 animate-pulse" />Saving...</span>
              : lastSaved && <span className="text-xs text-gray-600">Saved {lastSaved.toLocaleTimeString()}</span>
            }
            <span className="text-sm text-gray-500">{currentIndex + 1} / {totalQuestions}</span>
          </div>
        </div>

        {/* Timer */}
        <TimerBar timer={timer} />

        {/* Progress bar */}
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-3">
          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">Q{currentIndex + 1}</span>
            <span className={`badge border ${categoryColor[question.category] || categoryColor.general}`}>{question.category}</span>
            {question.difficulty && (
              <span className={`text-xs font-medium capitalize ${difficultyColor[question.difficulty]}`}>
                {question.difficulty}
              </span>
            )}
          </div>
          {/* Voice button */}
          <button onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
            title="Toggle voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? 'Stop' : 'Voice'}
          </button>
        </div>

        <p className="text-lg text-white leading-relaxed font-medium mb-6">{question.question}</p>

        <textarea
          ref={textareaRef}
          value={answers[currentIndex]}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your answer here. Be specific and use the STAR method for behavioral questions (Situation → Task → Action → Result)..."
          rows={8}
          className="input-field resize-none"
        />

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600">{answers[currentIndex].trim().split(/\s+/).filter(Boolean).length} words</span>
          <span className="text-xs text-gray-600">{answers[currentIndex].length} chars</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex gap-1.5">
          {interview.questions.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                idx === currentIndex ? 'bg-violet-500 scale-125'
                  : answers[idx].trim() ? 'bg-violet-500/40'
                  : 'bg-gray-700'
              }`}
              aria-label={`Go to question ${idx + 1}`} />
          ))}
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <button onClick={() => setCurrentIndex((i) => i + 1)}
            className="btn-primary flex items-center gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" /> Submit for AI Review
          </button>
        )}
      </div>
    </div>
  );
};

// ── Results Page ──────────────────────────────────────────────────────────────
const Results = ({ interview, onRetry }) => {
  const navigate = useNavigate();
  const score = interview.overallScore;

  const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = score >= 80 ? 'from-green-500/20 to-green-500/5' : score >= 60 ? 'from-yellow-500/20 to-yellow-500/5' : 'from-red-500/20 to-red-500/5';
  const categoryColor = {
    technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    behavioral: 'bg-green-500/10 text-green-400 border-green-500/20',
    situational: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const answeredCount = interview.questions.filter((q) => q.userAnswer?.trim()).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Overall Score Card */}
      <div className={`card text-center mb-6 bg-gradient-to-b ${scoreBg}`}>
        <div className="flex items-center justify-center mb-4">
          <Award className={`w-14 h-14 ${scoreColor}`} />
        </div>
        <h1 className={`text-5xl font-extrabold mb-1 ${scoreColor}`}>{score}%</h1>
        <p className="text-gray-300 font-semibold text-lg mb-3">{interview.title}</p>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">{interview.feedback}</p>

        <div className="flex justify-center gap-8 mt-6 text-sm">
          {[
            { label: 'Questions', value: interview.questions.length },
            { label: 'Answered', value: answeredCount },
            { label: 'Duration', value: `${interview.duration}m` },
            { label: 'Level', value: interview.experienceLevel },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-white font-bold capitalize">{value}</p>
              <p className="text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Score breakdown bar */}
        <div className="mt-6 max-w-sm mx-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0</span><span>50</span><span>100</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${
              score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400'
              : score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
              : 'bg-gradient-to-r from-red-500 to-rose-400'
            }`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      {/* Per-question Feedback */}
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-violet-400" /> AI Feedback
      </h2>

      <div className="space-y-5 mb-8">
        {interview.questions.map((q, idx) => (
          <div key={idx} className="card hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">Q{idx + 1}</span>
                <span className={`badge border ${categoryColor[q.category] || categoryColor.general}`}>{q.category}</span>
                {q.aiGenerated && (
                  <span className="text-xs text-violet-400 flex items-center gap-1">
                    <Star className="w-3 h-3" /> AI Graded
                  </span>
                )}
              </div>
              <span className={`text-sm font-bold ${q.score >= 80 ? 'text-green-400' : q.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {q.score}%
              </span>
            </div>

            <p className="text-white font-medium mb-3">{q.question}</p>

            {q.userAnswer ? (
              <div className="bg-gray-800/50 rounded-xl p-3 mb-3">
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Your Answer</p>
                <p className="text-gray-300 text-sm leading-relaxed">{q.userAnswer}</p>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-3">
                <p className="text-red-400 text-sm">No answer provided</p>
              </div>
            )}

            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
                <p className="text-xs text-violet-400 font-medium uppercase tracking-wide">AI Feedback</p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{q.aiFeedback}</p>
            </div>

            {/* Strengths & Improvements */}
            {(q.aiStrengths?.length > 0 || q.aiImprovements?.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {q.aiStrengths?.length > 0 && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3">
                    <p className="text-xs text-green-400 font-medium mb-2 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> Strengths
                    </p>
                    <ul className="space-y-1">
                      {q.aiStrengths.map((s, i) => (
                        <li key={i} className="text-gray-300 text-xs">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {q.aiImprovements?.length > 0 && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                    <p className="text-xs text-yellow-400 font-medium mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Improve
                    </p>
                    <ul className="space-y-1">
                      {q.aiImprovements.map((s, i) => (
                        <li key={i} className="text-gray-300 text-xs">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {q.aiSampleAnswer && (
              <div className="mt-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
                <p className="text-xs text-blue-400 font-medium mb-1">💡 Key Point for Ideal Answer</p>
                <p className="text-gray-400 text-xs leading-relaxed">{q.aiSampleAnswer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onRetry} className="btn-primary flex-1 flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Practice Again
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1 flex items-center justify-center gap-2">
          <Home className="w-4 h-4" /> Dashboard
        </button>
        <button onClick={() => navigate('/leaderboard')} className="btn-secondary flex-1 flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4" /> Leaderboard
        </button>
      </div>
    </div>
  );
};

// ── Main Interview Page ───────────────────────────────────────────────────────
const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(id ? 'loading' : 'setup');
  const [interview, setInterview] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/interviews/${id}`)
      .then(({ data }) => {
        const interviewData = data?.interview || data;
        setInterview(interviewData);
        setStep(interviewData.status === 'completed' ? 'results' : 'session');
      })
      .catch(() => {
        toast.error('Interview not found');
        navigate('/dashboard');
      });
  }, [id, navigate]);

  const handleStart = async (formData) => {
    setCreating(true);
    try {
      const { data } = await api.post('/interviews', {
        ...formData,
        targetRole: formData.jobRole,
        useAI: formData.jobDescription?.length > 50,
      });
      const interviewData = data?.interview || data;
      setInterview(interviewData);
      setStep('session');
      navigate(`/interview/${interviewData._id}`, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create interview session';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const handleComplete = (completedInterview) => {
    setInterview(completedInterview);
    setStep('results');
    toast.success(`Interview complete! Score: ${completedInterview.overallScore}%`, { duration: 5000 });
  };

  const handleRetry = () => {
    setInterview(null);
    setStep('setup');
    navigate('/interview/new', { replace: true });
  };

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (step === 'setup') return <SetupForm onStart={handleStart} loading={creating} />;
  if (step === 'session') return <QuestionSession interview={interview} onComplete={handleComplete} />;
  if (step === 'results') return <Results interview={interview} onRetry={handleRetry} />;
  return null;
};

export default Interview;
