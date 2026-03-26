import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Wind, AlertTriangle } from 'lucide-react';
import { fetchAirQuality } from '../services/googleApi'; // Servisi içeri aktardık

export default function Home() {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Konum izni al ve koordinatları yakala
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 2. Google API'den veriyi çek
        const data = await fetchAirQuality(latitude, longitude);

        if (data && data.indexes) {
          setAqiData(data);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Konum hatası:", error);
        setLoading(false);
      }
    );
  }, []);

  // AQI değerine göre renk ve metin belirleyen yardımcı fonksiyon
  const getStatus = (aqi) => {
    if (aqi <= 50) return { label: 'İyi', color: 'text-secondary' };
    if (aqi <= 100) return { label: 'Orta', color: 'text-yellow-500' };
    return { label: 'Riskli', color: 'text-danger' };
  };

  const currentAqi = aqiData?.indexes?.[0]?.aqi || "---";
  const status = getStatus(currentAqi);

  return (
    <div className="flex flex-col gap-4">
      {/* Hava Kalitesi Widget (Artık Dinamik) */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--secondary-light) 0%, #fff 100%)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wind className="text-secondary" size={24} />
            <h2 className="text-lg font-bold">Hava Kalitesi (AQI)</h2>
          </div>
          <span className={`text-2xl font-bold ${status.color}`}>
            {loading ? "..." : currentAqi}
          </span>
        </div>
        <p className="text-sm font-medium mb-1">
          Durum: <span className={status.color}>{loading ? "Yükleniyor" : status.label}</span>
        </p>
        <p className="text-xs text-muted">
          {aqiData?.healthRecommendations?.generalPopulation || "Veriler güncelleniyor..."}
        </p>
        <Link to="/env" className="text-sm text-primary font-bold mt-2 inline-block">Detaylı Rapor &rarr;</Link>
      </div>

      {/* Voice Analysis CTA */}
      <div className="card text-center flex flex-col items-center gap-3 border-0" style={{ boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)' }}>
        <div style={{ padding: '1.25rem', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
          <Activity size={36} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-1">Günlük Ses Analizi</h2>
          <p className="text-xs text-muted px-4">Sesinizden solunum riskinizi değerlendirin. Sadece 5 saniye sürer.</p>
        </div>
        <Link to="/voice" className="btn btn-primary w-full mt-2" style={{ textDecoration: 'none' }}>
          Hemen Test Et
        </Link>
      </div>


    </div>
  );
}
