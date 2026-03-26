import { QRCodeSVG } from 'qrcode.react';
import { PhoneCall, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Emergency({ user }) {
  if (!user) return <div className="p-4 text-center">Yükleniyor...</div>;

  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nN:Hasta;${user.name};;;\nFN:${user.name}\nNOTE:ASTIM HASTASI. Kritik İlaç: ${user.medication}. Kan Grubu: ${user.bloodType}. Alerjiler: ${user.allergies || 'Yok'}.\nTEL;TYPE=EMERGENCY:${user.emergencyContact}\nEND:VCARD`;

  return (
    <div className="flex flex-col gap-4" style={{ paddingBottom: '2rem', minHeight: 'calc(100vh - 2rem)' }}>
      {/* Top red header */}
      <div className="flex justify-between items-center bg-danger p-5 rounded-b-3xl -mt-4 -mx-4 mb-2 text-black shadow-lg" style={{ paddingTop: '2.5rem' }}>
        <Link to="/" className="text-white hover:text-white font-bold inline-block" style={{ textDecoration: 'none' }}>&larr; Kapat</Link>
        <h1 className="text-lg font-black tracking-wide">ACİL DURUM KARTI</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="card flex flex-col items-center justify-center p-6 text-center border-0 bg-white" style={{ boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)' }}>
        <div className="bg-white p-3 rounded-xl shadow-md mb-4 border inline-block" style={{ borderColor: 'var(--border)' }}>
          <QRCodeSVG value={vCardData} size={200} fgColor="#ef4444" level="M" />
        </div>
        <h2 className="text-xl font-black mb-1 text-text-main">{user.name}</h2>
        <div className="flex items-center justify-center gap-1 text-danger font-bold text-sm mb-2"><AlertCircle size={16} /> Astım Hastası</div>
        <p className="text-xs text-muted font-medium px-2">Lütfen beni en yakın sağlık kuruluşuna yetiştirin veya kilit bilgileri kullanın.</p>
      </div>

      <div className="card border-0 shadow-sm mt-1">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2"><FileText size={18} className="text-danger" /> Tıbbi Bilgiler</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm text-muted font-medium">Kan Grubu</span>
            <span className="text-sm font-black text-danger">{user.bloodType}</span>
          </div>
          <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm text-muted font-medium">Kritik İlaç</span>
            <span className="text-sm font-black text-primary w-1/2 text-right">{user.medication}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted font-medium">Şiddetli Alerjiler</span>
            <span className="text-sm font-black text-danger w-1/2 text-right">{user.allergies || 'Bilinen alerji yok'}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <a href="tel:112" className="btn btn-danger py-4 text-lg w-full flex justify-center items-center gap-2 shadow-md" style={{ borderRadius: '16px', textDecoration: 'none' }}>
          <PhoneCall size={26} fill="currentColor" />
          <span className="font-black tracking-wide">112 ACİL ÇAĞRI</span>
        </a>

        <a href={`tel:${user.emergencyContact}`} className="btn w-full bg-white border-2 font-bold py-3 flex justify-center items-center" style={{ borderColor: 'var(--border)', color: 'var(--text-main)', borderRadius: '16px', textDecoration: 'none' }}>
          Yakınları Ara ({user.emergencyContact})
        </a>
      </div>
    </div>
  );
}
