import { User, LogOut, HeartPulse } from 'lucide-react';

export default function Profile({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('asthma-user');
    setUser(null);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-1">Profil Bilgileri</h1>
      
      <div className="card text-center flex flex-col items-center border-0 shadow-sm mt-2">
        <div className="bg-primary-light p-4 rounded-full text-primary mb-3">
          <User size={48} />
        </div>
        <h2 className="text-2xl font-black mb-1 text-text-main">{user.name}</h2>
        <div className="px-4 py-1.5 bg-danger-light text-danger font-bold rounded-full text-sm mb-2 shadow-sm">
          Kan Grubu: {user.bloodType}
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-1">
        <h3 className="text-sm font-bold text-muted mb-4 border-b pb-2 border-border flex items-center gap-2">
          <HeartPulse size={16} /> Medikal Kayıt
        </h3>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-xs text-muted font-medium mb-1 block">Kritik İlaç / İnhaler</span>
            <span className="font-bold text-sm text-primary">{user.medication}</span>
          </div>
          <div>
            <span className="text-xs text-muted font-medium mb-1 block">Şiddetli Alerjiler</span>
            <span className="font-bold text-sm text-danger">{user.allergies || 'Belirtilmedi'}</span>
          </div>
          <div>
            <span className="text-xs text-muted font-medium mb-1 block">Acil Durum Kişisi</span>
            <span className="font-bold text-sm">{user.emergencyContact}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={handleLogout} className="btn btn-danger-outline bg-white border-2 border-danger-light w-full py-3 rounded-xl font-bold shadow-sm">
          <LogOut size={20} /> Profil Kaydını Sil
        </button>
        <p className="text-xs text-center text-muted mt-3">Profili sildiğinizde cihazınızdaki bilgileriniz silinir ve kayıt ekranına yönlendirilirsiniz.</p>
      </div>
    </div>
  );
}
