import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Activity, Wind, HeartPulse, AlertCircle, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

import HomePage from './pages/Home';
import VoicePage from './pages/VoiceAnalysis';
import EnvPage from './pages/Environment';
import LifePage from './pages/Lifestyle';
import EmergencyPage from './pages/Emergency';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';

function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'var(--primary)' : 'var(--text-muted)';
  
  if (location.pathname === '/emergency') return null;

  return (
    <div style={{
      position: 'absolute', bottom: 0, width: '100%',
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '0.75rem 0', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
      zIndex: 20
    }}>
      <Link to="/" style={{ color: isActive('/'), textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Home size={24} />
        <span className="text-xs font-medium">Ana Sayfa</span>
      </Link>
      <Link to="/voice" style={{ color: isActive('/voice'), textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Activity size={24} />
        <span className="text-xs font-medium">Analiz</span>
      </Link>
      <Link to="/env" style={{ color: isActive('/env'), textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Wind size={24} />
        <span className="text-xs font-medium">Çevre</span>
      </Link>
      <Link to="/life" style={{ color: isActive('/life'), textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <HeartPulse size={24} />
        <span className="text-xs font-medium">Asistan</span>
      </Link>
      <Link to="/profile" style={{ color: isActive('/profile'), textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <User size={24} />
        <span className="text-xs font-medium">Profil</span>
      </Link>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="container">
      {children}
      <BottomNav />
    </div>
  );
}

function Header() {
  const location = useLocation();
  if (location.pathname === '/emergency') return null;
  
  return (
    <div className="header flex justify-between items-center bg-surface w-full">
      <div className="flex items-center gap-2">
        <Wind size={28} className="text-primary" />
        <h1 className="text-xl text-primary font-bold" style={{ letterSpacing: '-0.5px' }}>Nefesim</h1>
      </div>
      <Link to="/emergency" className="btn btn-danger-outline" style={{ padding: '0.5rem 0.75rem', width: 'auto', borderRadius: '12px', textDecoration: 'none' }}>
        <AlertCircle size={20} />
        <span className="text-sm font-bold">Acil QR</span>
      </Link>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const saved = localStorage.getItem('asthma-user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (!user) {
    return (
      <Router>
        <div className="container">
          <Routes>
            <Route path="*" element={<RegisterPage onLogin={setUser} />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
        <Header />
        <div className="page-content" style={{ overflowY: 'auto', paddingBottom: '90px', height: '100%' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="/env" element={<EnvPage />} />
            <Route path="/life" element={<LifePage />} />
            <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="/emergency" element={<EmergencyPage user={user} />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}
