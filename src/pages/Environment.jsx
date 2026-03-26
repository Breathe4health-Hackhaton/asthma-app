import { useState, useEffect } from 'react';
import { Wind, CloudRain, Thermometer, MapPin, X, ArrowDown, LocateFixed } from 'lucide-react';
import { fetchAirQuality, fetchPollen } from '../services/googleApi';

export default function Environment() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ aqi: 42, pollLevel: 'Orta Risk', recomendation: 'İyi Seviyede' });
  const [showModal, setShowModal] = useState(false);
  
  const [startPoint, setStartPoint] = useState('Mevcut Konumum');
  const [endPoint, setEndPoint] = useState('Beşiktaş Merkez');
  const [routeAnalyzed, setRouteAnalyzed] = useState(false);
  const [locationName, setLocationName] = useState('GPS Bağlanıyor...');

  useEffect(() => {
    async function loadApiData() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocationName('GPS Bağlantılı');
            await fetchAndSetData(lat, lng);
          },
          async (error) => {
            console.warn("GPS Erişimi verilmedi, varsayılan koordinata geçiliyor.");
            setLocationName('İstanbul (Varsayılan)');
            await fetchAndSetData(40.990, 29.020);
          },
          { timeout: 10000 }
        );
      } else {
        setLocationName('Tarayıcı/Telefon GPS desteklemiyor.');
        await fetchAndSetData(40.990, 29.020);
      }
    }

    async function fetchAndSetData(lat, lng) {
      const aqData = await fetchAirQuality(lat, lng);
      const pollenData = await fetchPollen(lat, lng);

      if (aqData && !aqData.error) {
         const index = aqData.indexes?.[0]; 
         setData(prev => ({ 
           ...prev, 
           aqi: index?.aqi || prev.aqi, 
           recomendation: index?.category || prev.recomendation 
        }));
      }
      // You can add pollenData parsing here if you want accurate generic pollen text
      setLoading(false);
    }
    
    loadApiData();
  }, []);

  const handleUseLocation = () => {
    setStartPoint('Mevcut Konumum (GPS)');
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex justify-between items-end mb-1">
        <div>
          <h1 className="text-xl font-bold">Hava & Çevre Analizi</h1>
          <div className="flex items-center gap-1 text-xs mt-2 font-medium" style={{color: 'var(--primary)'}}>
            <MapPin size={14} /> <span>{locationName}</span>
          </div>
        </div>
      </div>

      <div className="card bg-secondary-light border-0 mt-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Wind className="text-secondary" size={32} />
            <div>
              <h2 className="text-lg font-bold">Hava Kalitesi</h2>
              <p className="text-sm font-bold text-secondary">{loading ? 'Yükleniyor...' : data.recomendation}</p>
            </div>
          </div>
          <div className="text-4xl font-black text-secondary">{loading ? '-' : data.aqi}</div>
        </div>
        <p className="text-xs text-muted" style={{color: '#065f46'}}>
          Duman ve tahriş edici gaz oranları düşük. Aktiviteler için güvenli (Referans: Google AQI API).
        </p>
      </div>

      <div className="flex gap-4">
        <div className="card w-full flex-col">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-1 text-yellow-600" style={{color: '#854d0e'}}><CloudRain size={16}/> Polen</h3>
          <p className="text-xs text-muted mb-3 h-8">Mevsimsel çam poleni.</p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold" style={{color: '#ca8a04'}}>{loading ? '...' : data.pollLevel}</span>
          </div>
          <div className="w-full bg-border h-1.5 rounded-full"><div className="h-1.5 rounded-full w-1/2" style={{backgroundColor: '#eab308'}}></div></div>
        </div>
        
        <div className="card w-full flex-col">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-1 text-primary"><Thermometer size={16}/> Hava Durumu</h3>
          <p className="text-xs text-muted mb-1 h-8">14°C - Parçalı Bulutlu, Nem %55</p>
          <div className="mt-auto">
            <span className="text-xs font-bold text-danger">Uyarı: Gece ani ısı düşüşü.</span>
          </div>
        </div>
      </div>

      <div className="card mt-1 shadow-md border-0" style={{ background: 'linear-gradient(to bottom, #ffffff, var(--primary-light))'}}>
        <h3 className="text-base font-bold mb-2">Astım Risk Tahmini Raporu</h3>
        <p className="text-sm mb-5 text-muted">Mevcut konumunuzdaki verilere göre dışarı çıkarken inhaler almanız önerilir.</p>
        <button onClick={() => {setShowModal(true); setRouteAnalyzed(false);}} className="btn btn-primary w-full shadow-md">Seyahat Rotasını Kontrol Et</button>
      </div>

      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.5)', margin: '-1rem', height: '110%' }}>
          <div className="bg-white rounded-2xl w-full p-6 max-w-sm flex flex-col gap-4 shadow-2xl relative border" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => {setShowModal(false); setRouteAnalyzed(false);}} className="absolute top-4 right-4 text-muted border-0 bg-transparent cursor-pointer"><X size={24}/></button>
            <h3 className="font-bold text-xl text-primary flex items-center gap-2 mb-2"><MapPin size={24}/> Seyahat Rotası</h3>
            
            {!routeAnalyzed ? (
              <div className="flex flex-col gap-3 mt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                     <label className="text-xs font-bold text-muted block">A NOKTASI (Başlangıç)</label>
                     <button onClick={handleUseLocation} className="text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded flex items-center gap-1 border-0 cursor-pointer hover:bg-primary hover:text-white transition-colors"><LocateFixed size={12}/> Konumumu Kullan</button>
                  </div>
                  <input type="text" className="w-full p-3 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-light" value={startPoint} onChange={e => setStartPoint(e.target.value)} />
                </div>
                <div className="flex justify-center -my-2.5 z-10">
                  <ArrowDown size={28} className="text-text-main bg-white rounded-full p-1 border shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted block mb-1">B NOKTASI (Varış)</label>
                  <input type="text" className="w-full p-3 border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary-light" value={endPoint} onChange={e => setEndPoint(e.target.value)} />
                </div>
                <button className="btn btn-primary mt-4 py-3 rounded-xl font-bold shadow-md" onClick={() => setRouteAnalyzed(true)}>Analiz Et</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-1 mb-2 animate-fade-in">
                <div className="bg-bg-color p-3 rounded-xl border border-primary-light relative">
                  <span className="font-bold block text-xs text-primary mb-1">Başlangıç</span>
                  <span className="text-sm font-medium">{startPoint}</span>
                  <span className="absolute right-3 top-3 text-xs bg-white border font-bold px-2 py-1 rounded text-primary">AQI: {data.aqi}</span>
                </div>
                
                <div className="w-1 h-6 bg-border mx-auto rounded-full"></div>
                
                <div className="bg-bg-color p-3 rounded-xl border border-danger-light relative">
                  <span className="font-bold block text-xs text-danger mb-1">Varış</span>
                  <span className="text-sm font-medium pr-16">{endPoint}</span>
                  <span className="absolute right-3 top-3 text-xs bg-white border font-bold px-2 py-1 rounded text-danger">AQI: {data.aqi + 15}</span>
                </div>

                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 mt-2">
                  <p className="text-sm text-yellow-800" style={{lineHeight: 1.5}}>
                    DİKKAT: <strong>{endPoint}</strong> bölgesinde tahmini AQI yüksekliği ve trafik kaynaklı hava kirliliği (NO2) artışı bekleniyor. Maske takmanız önerilir.
                  </p>
                </div>
                <button className="btn w-full bg-surface border font-bold py-3 mt-2 rounded-xl text-text-main" onClick={() => setRouteAnalyzed(false)}>Rotayı Değiştir</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
