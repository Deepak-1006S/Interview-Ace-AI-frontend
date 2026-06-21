import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Zap, Brain, Target, TrendingUp, CheckCircle, ArrowRight,
  Mic, Star, Users, Award, Code2, FileText, BarChart3,
  ChevronDown, Play, Shield, Cpu, Rocket, Quote,
  Link as IconLink, ExternalLink, Mail
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: Brain, title: 'AI Mock Interviews', desc: 'Realistic questions tailored to your role and experience level, graded by GPT-4o with detailed per-answer feedback.', color: 'violet', tag: 'GPT-4o Powered' },
  { icon: FileText, title: 'Resume ATS Analyzer', desc: 'Upload your resume and get an instant ATS score, keyword gap analysis, and actionable improvements.', color: 'blue', tag: 'Instant Results' },
  { icon: Code2, title: 'Coding Challenges', desc: 'LeetCode-style problems covering Easy → Hard. Arrays, DP, Graphs, and more — all in-browser.', color: 'green', tag: '8+ Problems' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track scores over time, spot skill gaps, and see your progress across Frontend, Backend, and DSA categories.', color: 'fuchsia', tag: 'Live Charts' },
];

const stats = [
  { value: '10K+', label: 'Interviews Completed', icon: Award },
  { value: '95%', label: 'User Success Rate', icon: Star },
  { value: '30+', label: 'Job Roles Covered', icon: Target },
  { value: '50K+', label: 'Active Users', icon: Users },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer @ Google', avatar: 'PS', score: 94, text: 'InterviewAce helped me prep for my Google L5 interview in just 3 weeks. The AI feedback was incredibly specific — much better than doing mock interviews alone.' },
  { name: 'James Liu', role: 'Frontend Developer @ Meta', avatar: 'JL', score: 89, text: 'The resume analyzer caught 6 missing keywords that a recruiter would have filtered out. Got callbacks from Amazon, Meta and Stripe after fixing it.' },
  { name: 'Aisha Patel', role: 'Data Scientist @ Netflix', avatar: 'AP', score: 91, text: 'I used the AI mock interviews every day for a month. The behavioral question feedback using STAR method was a game changer for my Netflix final round.' },
  { name: 'Carlos Rodriguez', role: 'Backend Engineer @ Stripe', avatar: 'CR', score: 87, text: 'The coding challenges and analytics dashboard showed me exactly where I was weak. Went from 55% to 87% average score before my Stripe interview.' },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started',
    features: ['5 AI mock interviews / month', '1 resume analysis', '3 coding challenges', 'Basic performance stats', 'Community leaderboard'],
    cta: 'Get Started Free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    desc: 'For serious job seekers',
    features: ['Unlimited AI mock interviews', 'Unlimited resume analyses', 'All coding challenges', 'Advanced analytics & trends', 'Priority AI feedback', 'Interview history export', 'Role-specific question banks'],
    cta: 'Start Pro Trial',
    href: '/register',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: '$49',
    period: 'per month',
    desc: 'For bootcamps & teams',
    features: ['Everything in Pro', 'Up to 10 team members', 'Admin dashboard', 'Team leaderboard', 'Bulk resume analysis', 'Custom question banks', 'Dedicated support'],
    cta: 'Contact Sales',
    href: '/register',
    highlighted: false,
  },
];

const colorMap = {
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', badge: 'bg-violet-500/20 text-violet-300' },
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   badge: 'bg-blue-500/20 text-blue-300' },
  green:  { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  badge: 'bg-green-500/20 text-green-300' },
  fuchsia:{ bg: 'bg-fuchsia-500/10',text: 'text-fuchsia-400',border: 'border-fuchsia-500/20',badge: 'bg-fuchsia-500/20 text-fuchsia-300' },
};

// ── Component ─────────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'Is the AI feedback actually useful?', a: 'Yes — we use GPT-4o to analyze your answers against the specific job role, experience level, and question category. You get a score, strengths, areas to improve, and what an ideal answer would emphasize.' },
    { q: 'How does the Resume ATS Analyzer work?', a: 'You upload your PDF resume and our engine extracts the text, checks for 100+ tech keywords, action verbs, quantified achievements, proper sections, and formatting. You get a 0–100 ATS score plus specific fixes.' },
    { q: 'Does it work for non-engineering roles?', a: 'Primarily yes for tech roles (SWE, Frontend, Backend, Data, DevOps, PM, QA, Mobile, Security, ML). Behavioral and situational questions work for any role.' },
    { q: 'How is this different from LeetCode or Pramp?', a: 'We combine mock interviews + resume analysis + coding challenges + performance analytics in one platform. LeetCode focuses only on DSA; Pramp needs another human. We use AI 24/7.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" /> GPT-4o Powered Interview Coach
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up leading-tight">
            <span className="text-white">Land Your Dream Job at</span><br />
            <span className="gradient-text">FAANG & Top Tech</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI mock interviews, ATS resume analysis, coding challenges, and real-time performance analytics — everything you need to ace your next tech interview.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/interview/new" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
                  <Mic className="w-4 h-4" /> Start Practice
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 shadow-lg shadow-violet-500/25">
                  Start for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4">
                  <Play className="w-4 h-4" /> See How It Works
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {['No credit card required', 'Free plan available', '5-min setup'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-violet-400" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview Card ── */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-8">
        <div className="relative rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl shadow-black/60">
          {/* Fake browser chrome */}
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-500 text-center max-w-xs mx-auto">
              app.interviewace.ai/dashboard
            </div>
          </div>

          {/* Mock Dashboard UI */}
          <div className="bg-gray-950 p-5 sm:p-6">
            {/* Top row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Welcome back 👋</p>
                <h3 className="text-white font-bold text-lg">Deepak's Dashboard</h3>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live
              </span>
            </div>

            {/* Stat cards row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Interview Score', value: '87%', color: 'text-violet-400', bg: 'bg-violet-500/10', bar: 87, barColor: 'bg-violet-500' },
                { label: 'Resume Score',    value: '82%', color: 'text-blue-400',   bg: 'bg-blue-500/10',   bar: 82, barColor: 'bg-blue-500'   },
                { label: 'Coding Score',    value: '74%', color: 'text-green-400',  bg: 'bg-green-500/10',  bar: 74, barColor: 'bg-green-500'  },
                { label: 'Sessions Done',   value: '12',  color: 'text-yellow-400', bg: 'bg-yellow-500/10', bar: null, barColor: '' },
              ].map(({ label, value, color, bg, bar, barColor }) => (
                <div key={label} className={`${bg} border border-gray-800 rounded-xl p-3`}>
                  <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                  {bar !== null && (
                    <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${bar}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Skills + Recent interviews */}
            <div className="grid sm:grid-cols-5 gap-4">
              {/* Skills breakdown */}
              <div className="sm:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Skill Breakdown</p>
                <div className="space-y-2.5">
                  {[
                    { skill: 'React / Frontend', pct: 90, color: 'from-blue-500 to-cyan-400' },
                    { skill: 'Backend / Node',   pct: 75, color: 'from-violet-500 to-fuchsia-500' },
                    { skill: 'DSA / Algorithms', pct: 70, color: 'from-green-500 to-emerald-400' },
                    { skill: 'System Design',    pct: 65, color: 'from-yellow-500 to-orange-400' },
                  ].map(({ skill, pct, color }) => (
                    <div key={skill}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300 text-xs">{skill}</span>
                        <span className="text-white text-xs font-semibold">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent sessions */}
              <div className="sm:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent Sessions</p>
                <div className="space-y-2">
                  {[
                    { title: 'Frontend Interview',  role: 'React Developer',    score: 90, badge: 'bg-green-500/10 text-green-400' },
                    { title: 'MERN Stack Interview', role: 'Full Stack Dev',    score: 82, badge: 'bg-yellow-500/10 text-yellow-400' },
                    { title: 'DSA Practice Round',   role: 'Software Engineer', score: 78, badge: 'bg-yellow-500/10 text-yellow-400' },
                  ].map(({ title, role, score, badge }) => (
                    <div key={title} className="flex items-center justify-between gap-3 bg-gray-800/50 rounded-lg px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{title}</p>
                        <p className="text-gray-500 text-xs">{role}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge} border-current shrink-0`}>{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle glow under the card */}
        <div className="absolute inset-x-1/4 bottom-0 h-8 bg-violet-600/20 blur-2xl pointer-events-none" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gray-900/60 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="w-5 h-5 text-violet-400" />
                  <span className="text-3xl font-extrabold gradient-text">{value}</span>
                </div>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything in one platform</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Built to get you <span className="gradient-text">hired</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            From your first practice question to your final offer, InterviewAce covers every step of the interview process.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color, tag }) => {
            const c = colorMap[color];
            return (
              <div key={title} className="card group hover:border-gray-600 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${c.bg} ${c.border}`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{tag}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">How it works</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Go from zero to interview-ready in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Shield, title: 'Create Free Account', desc: 'Sign up in 30 seconds. No credit card needed.' },
              { step: '02', icon: FileText, title: 'Upload Your Resume', desc: 'Get instant ATS score and keyword analysis.' },
              { step: '03', icon: Mic, title: 'Start AI Mock Interview', desc: 'Answer role-specific questions, get GPT-4 feedback.' },
              { step: '04', icon: Rocket, title: 'Track & Improve', desc: 'See your progress, fix weak areas, ace the real thing.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-flex mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 rounded-full text-xs font-bold text-white flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Success stories</p>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Candidates who <span className="gradient-text">got the offer</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(({ name, role, avatar, score, text }) => (
            <div key={name} className="card hover:border-gray-700 transition-all duration-300">
              <div className="flex items-start gap-2 mb-4">
                <Quote className="w-5 h-5 text-violet-400/50 shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
              </div>
              <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">{score}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple pricing</p>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Invest in your <span className="gradient-text">career</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">Start free. Upgrade when you're ready to go all-in.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map(({ name, price, period, desc, features: f, cta, href, highlighted, badge }) => (
              <div key={name} className={`card relative flex flex-col transition-all duration-300 ${highlighted ? 'border-violet-500/60 shadow-2xl shadow-violet-500/10 scale-105' : 'hover:border-gray-700'}`}>
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {badge}
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-gray-400 text-sm font-medium mb-1">{name}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-extrabold ${highlighted ? 'gradient-text' : 'text-white'}`}>{price}</span>
                    <span className="text-gray-500 text-sm mb-1">/{period}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{desc}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {f.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to={href} className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${highlighted ? 'btn-primary' : 'btn-secondary'}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-white">{faq.q}</p>
                <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === i && (
                <p className="text-gray-400 text-sm leading-relaxed mt-3 pt-3 border-t border-gray-800">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative bg-gradient-to-r from-violet-600/20 via-fuchsia-600/15 to-violet-600/20 border border-violet-500/30 rounded-3xl p-12 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Ready to ace your interview?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              Join 50,000+ candidates who prepared with InterviewAce and landed roles at Google, Meta, Amazon, and Stripe.
            </p>
            <Link to={user ? '/interview/new' : '/register'}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4 shadow-lg shadow-violet-500/25">
              {user ? 'Start Practicing Now' : 'Get Started — It\'s Free'} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-lg gradient-text">InterviewAce</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">AI-powered interview prep for candidates targeting top US tech companies.</p>
              <div className="flex items-center gap-3 mt-4">
                {[IconLink, ExternalLink, Mail].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            {[
              { label: 'Product', links: ['AI Mock Interview', 'Resume Analyzer', 'Coding Challenges', 'Analytics', 'Leaderboard'] },
              { label: 'Company', links: ['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'] },
              { label: 'Resources', links: ['Documentation', 'Interview Guides', 'System Design', 'DSA Cheatsheet', 'Support'] },
            ].map(({ label, links }) => (
              <div key={label}>
                <p className="text-white font-semibold text-sm mb-4">{label}</p>
                <ul className="space-y-2">
                  {links.map((l) => (
                    <li key={l}>
                      <span className="text-gray-500 text-sm hover:text-gray-300 transition-colors cursor-pointer">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2025 InterviewAce AI. All rights reserved.</p>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> support@interviewace.ai
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
