import { Link } from 'react-router-dom';
import { Activity, Wind, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      {/* Air Quality Quick Widget */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--secondary-light) 0%, #fff 100%)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wind className="text-secondary" size={24} />
            <h2 className="text-lg font-bold">Hava Kalitesi (AQI)</h2>
          </div>
          <span className="text-2xl text-secondary font-bold">42</span>
        </div>
        <p className="text-sm font-medium mb-1">Durum: <span className="text-secondary">İyi</span></p>
        <p className="text-xs text-muted">Açık hava aktiviteleri için uygun. Polen seviyesi düşük.</p>
        <Link to="/env" className="text-sm text-primary font-bold mt-2 inline-block">Detaylı Rapor &rarr;</Link>
      </div>

      {/* Voice Analysis CTA */}
      <div className="card text-center flex flex-col items-center gap-3 border-0" style={{boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)'}}>
        <div style={{ padding: '1.25rem', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
          <Activity size={36} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-1">Günlük Ses Analizi</h2>
          <p className="text-xs text-muted px-4">Sesinizden solunum riskinizi değerlendirin. Sadece 5 saniye sürer.</p>
        </div>
        <Link to="/voice" className="btn btn-primary w-full mt-2" style={{textDecoration:'none'}}>
          Hemen Test Et
        </Link>
      </div>

      {/* Status Summary */}
      <div className="flex gap-4">
        <div className="card w-full flex flex-col items-center justify-center text-center p-3">
          <ShieldCheck size={28} className="text-secondary mb-1" />
          <h3 className="text-sm font-bold">Koruma</h3>
          <p className="text-xs text-muted">İlaç alındı</p>
        </div>
        <div className="card w-full flex flex-col items-center justify-center text-center p-3 border" style={{ borderColor: 'var(--danger-light)' }}>
          <AlertTriangle size={28} className="text-danger mb-1" />
          <h3 className="text-sm font-bold text-danger">Uyarı</h3>
          <p className="text-xs text-muted">Nem %70</p>
        </div>
      </div>
    </div>
  );
}
