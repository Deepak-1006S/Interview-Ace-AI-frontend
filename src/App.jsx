import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './lib/pages/Home';
import Login from './lib/pages/Login';
import Register from './lib/pages/Register';
import Dashboard from './lib/pages/Dashboard';
import Interview from './lib/pages/Interview';
import Leaderboard from './lib/pages/Leaderboard';
import Profile from './lib/pages/Profile';
import ResumeAnalyzer from './lib/pages/ResumeAnalyzer';
import CodingChallengePage from './lib/pages/CodingChallenge';
import Analytics from './lib/pages/Analytics';
import InterviewHistory from './lib/pages/InterviewHistory';
import AdminDashboard from './lib/pages/AdminDashboard';

// Coding pages need their own layout (no footer, full height)
const isCodingRoute = () => window.location.pathname.startsWith('/coding/') && window.location.pathname !== '/coding';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/"          element={<Home />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/register"  element={<Register />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/coding"    element={<CodingChallengePage />} />
              <Route path="/coding/:slug" element={<ProtectedRoute><CodingChallengePage /></ProtectedRoute>} />

              {/* Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/interview/new" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
              <Route path="/interview/:id" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/resume"    element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/history"   element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
              <Route path="/admin"     element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
