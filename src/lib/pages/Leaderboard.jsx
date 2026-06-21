import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Trophy, Medal, Star, Target, TrendingUp, Crown, Users, Zap } from 'lucide-react';

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-bold text-gray-500 w-5 text-center">{rank}</span>;
};

const Avatar = ({ name, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base' };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lbRes, rankRes] = await Promise.all([
          api.get(`/leaderboard?period=${period}&limit=20`),
          user ? api.get('/leaderboard/me') : Promise.resolve(null),
        ]);
        setLeaderboard(lbRes.data.leaderboard);
        if (rankRes) setMyRank(rankRes.data);
      } catch {
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, user]);

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Trophy className="w-3.5 h-3.5" /> Global Rankings
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Interview <span className="gradient-text">Leaderboard</span>
        </h1>
        <p className="text-gray-400">See how you stack up against candidates practicing for top US companies.</p>
      </div>

      {/* My Rank Card */}
      {user && myRank && myRank.rank && (
        <div className="card mb-6 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border-violet-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} />
              <div>
                <p className="text-white font-semibold">{user.name} <span className="text-violet-400">(You)</span></p>
                <p className="text-gray-500 text-sm">Rank #{myRank.rank} of {myRank.totalUsers} users</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">#{myRank.rank}</p>
              <p className="text-gray-500 text-sm">{myRank.averageScore}% avg</p>
            </div>
          </div>
        </div>
      )}

      {/* Period Tabs */}
      <div className="flex gap-2 mb-6">
        {periods.map(({ value, label }) => (
          <button key={value} onClick={() => setPeriod(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
              period === value
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">No rankings yet</h3>
          <p className="text-gray-500 mb-6">Complete at least one interview to appear on the leaderboard.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isMe = user && entry.userId?.toString() === user._id?.toString();
            return (
              <div key={entry.userId}
                className={`card flex items-center gap-4 transition-all duration-200 ${
                  isMe ? 'border-violet-500/40 bg-violet-500/5' : 'hover:border-gray-700'
                } ${entry.rank <= 3 ? 'py-4' : ''}`}
              >
                {/* Rank */}
                <div className="w-8 flex items-center justify-center shrink-0">
                  <RankIcon rank={entry.rank} />
                </div>

                {/* Avatar */}
                <Avatar name={entry.name} size={entry.rank <= 3 ? 'md' : 'sm'} />

                {/* Name & stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold truncate ${entry.rank <= 3 ? 'text-white text-base' : 'text-gray-200 text-sm'}`}>
                      {entry.name}
                    </p>
                    {isMe && <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">You</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" />{entry.totalInterviews} sessions</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" />Best: {entry.bestScore}%</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <p className={`font-bold text-lg ${
                    entry.averageScore >= 80 ? 'text-green-400'
                    : entry.averageScore >= 60 ? 'text-yellow-400'
                    : 'text-gray-300'
                  }`}>{entry.averageScore}%</p>
                  <p className="text-xs text-gray-600">avg score</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
