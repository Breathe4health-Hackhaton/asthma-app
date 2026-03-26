import { useState } from 'react';
import { Wind } from 'lucide-react';

export default function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    bloodType: 'A+',
    medication: '',
    allergies: '',
    emergencyContact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('asthma-user', JSON.stringify(formData));
    if (onLogin) onLogin(formData);
  };

  return (
    <div className="flex flex-col gap-4 p-5 h-full bg-surface" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div className="text-center mb-4 mt-6">
        <Wind size={56} className="text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-black text-primary mb-2">Nefesim</h1>
        <p className="text-sm text-muted px-4">Sağlığınızı yönetmek ve acil durumlara hazırlıklı olmak için profilinizi oluşturun.</p>
      </div>

      <div className="card shadow-lg border-0" style={{background: 'var(--primary-light)'}}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-primary mb-1 block">Ad Soyad</label>
            <input required type="text" className="w-full p-3 border-0 rounded-md shadow-sm" style={{outline: 'none'}} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Örn: Ali Yılmaz" />
          </div>
          <div>
            <label className="text-xs font-bold text-primary mb-1 block">Kan Grubu</label>
            <select className="w-full p-3 border-0 rounded-md shadow-sm" style={{outline: 'none', background: 'white'}} value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})}>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
              <option>0+</option><option>0-</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-primary mb-1 block">Acil İlacınız / İnhaler</label>
            <input required type="text" className="w-full p-3 border-0 rounded-md shadow-sm" style={{outline: 'none'}} value={formData.medication} onChange={e => setFormData({...formData, medication: e.target.value})} placeholder="Örn: Ventolin 100mcg" />
          </div>
          <div>
            <label className="text-xs font-bold text-primary mb-1 block">Şiddetli Alerjiler (Opsiyonel)</label>
            <input type="text" className="w-full p-3 border-0 rounded-md shadow-sm" style={{outline: 'none'}} value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="Örn: Penisilin, Çam Poleni" />
          </div>
          <div>
            <label className="text-xs font-bold text-primary mb-1 block">Acil Durum Kişisi (Tel)</label>
            <input required type="tel" className="w-full p-3 border-0 rounded-md shadow-sm" style={{outline: 'none'}} value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} placeholder="0555 *** ** **" />
          </div>
          <button type="submit" className="btn btn-primary mt-4 py-3 text-lg rounded-xl shadow-md cursor-pointer">Kaydet ve Başla</button>
        </form>
      </div>
    </div>
  );
}
