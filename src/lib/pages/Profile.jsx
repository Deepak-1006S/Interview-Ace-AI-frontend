import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { User, Mail, Briefcase, Link, Save, Star, Flame, Trophy, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: '',
    targetRole: '',
    linkedIn: '',
    github: '',
    emailNotifications: true,
    isPublic: true,
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/users/stats'),
        ]);
        const p = profileRes.data.user;
        setForm({
          name: p.name || '',
          bio: p.bio || '',
          targetRole: p.targetRole || '',
          linkedIn: p.linkedIn || '',
          github: p.github || '',
          emailNotifications: p.emailNotifications !== false,
          isPublic: p.isPublic !== false,
        });
        setStats(statsRes.data.stats);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Your Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account and track your achievements.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-5">Personal Info</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={form.targetRole}
                      onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                      placeholder="e.g., Software Engineer at Google"
                      className="input-field pl-10" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3} className="input-field resize-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="url" value={form.linkedIn}
                      onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub URL</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="url" value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="input-field pl-10" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" /> Privacy & Notifications
                </h3>
                {[
                  { key: 'isPublic', label: 'Show me on the leaderboard', description: 'Your name and scores are visible to other users' },
                  { key: 'emailNotifications', label: 'Email notifications', description: 'Get tips and progress updates' },
                ].map(({ key, label, description }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5">
                      <input type="checkbox" checked={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                        className="sr-only" />
                      <div onClick={() => setForm({ ...form, [key]: !form[key] })}
                        className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${form[key] ? 'bg-violet-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5 ${form[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">{label}</p>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button type="submit" disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                  : <><Save className="w-4 h-4" />Save Changes</>
                }
              </button>
            </form>
          </div>
        </div>

        {/* Right Column — Stats & Badges */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { label: 'Interviews', value: stats?.totalInterviews ?? 0, icon: '🎯' },
                { label: 'Avg Score', value: `${stats?.averageScore ?? 0}%`, icon: '📊' },
                { label: 'Best Score', value: `${stats?.bestScore ?? 0}%`, icon: '⭐' },
                { label: 'Streak', value: `${stats?.currentStreak ?? 0}d`, icon: '🔥' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-lg">{icon}</p>
                  <p className="text-white font-bold text-sm">{value}</p>
                  <p className="text-gray-600 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          {stats?.badges?.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Badges
              </h3>
              <div className="space-y-2">
                {stats.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Streak Info */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Practice Streak
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-400">{stats?.currentStreak ?? 0}</p>
                <p className="text-gray-500 text-sm">day streak</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-300">{stats?.longestStreak ?? 0}</p>
                <p className="text-gray-500 text-sm">personal best</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
