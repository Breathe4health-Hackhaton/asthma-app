import { useState, useEffect } from 'react';
import { Wind, CloudRain, Thermometer, MapPin, X, ArrowDown, LocateFixed } from 'lucide-react';
import { fetchAirQuality, fetchPollen } from '../services/googleApi';

export default function Environment() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    aqi: 0,
    pollLevel: 'Yükleniyor...',
    recomendation: 'Analiz ediliyor...',
    healthAdvice: 'Veriler güncelleniyor...'
  });
  const [showModal, setShowModal] = useState(false);
  const [startPoint, setStartPoint] = useState('Mevcut Konumum');
  const [endPoint, setEndPoint] = useState('Beşiktaş Merkez');
  const [routeAnalyzed, setRouteAnalyzed] = useState(false);
  const [locationName, setLocationName] = useState('GPS Aranıyor...');

  useEffect(() => {
    async function loadApiData() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Konum ismini koordinatlara göre güncelle (Veya "Aktif Konum" de)
            setLocationName(`Aktif Konum (${lat.toFixed(2)}, ${lng.toFixed(2)})`);
            await fetchAndSetData(lat, lng);
          },
          async (error) => {
            console.warn("GPS Erişimi verilmedi, varsayılan koordinata geçiliyor.");
            setLocationName('İstanbul (Varsayılan)');
            await fetchAndSetData(40.990, 29.020);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        setLocationName('GPS Desteklenmiyor');
        await fetchAndSetData(40.990, 29.020);
      }
    }

    async function fetchAndSetData(lat, lng) {
      setLoading(true);
      try {
        const [aqData, pollenData] = await Promise.all([
          fetchAirQuality(lat, lng),
          fetchPollen(lat, lng)
        ]);

        // Hava Kalitesi İşleme
        let currentAqi = 0;
        let currentRec = "Bilinmiyor";
        let currentAdvice = "Veri alınamadı.";

        if (aqData && aqData.indexes) {
          const index = aqData.indexes[0];
          currentAqi = index.aqi;
          currentRec = index.category || "İyi";
          currentAdvice = aqData.healthRecommendations?.generalPopulation || "Dışarı çıkmak için uygun.";
        }

        // Polen Verisi İşleme (Google Pollen API formatına göre)
        let pLevel = "Düşük Risk";
        if (pollenData && pollenData.dailyInfo?.[0]?.pollenTypeInfo) {
          const treePollen = pollenData.dailyInfo[0].pollenTypeInfo.find(p => p.pollenType === 'GRASS');
          pLevel = treePollen ? treePollen.indexInfo.category : "Düşük Risk";
        }

        setData({
          aqi: currentAqi,
          pollLevel: pLevel,
          recomendation: currentRec,
          healthAdvice: currentAdvice
        });
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    }

    loadApiData();
  }, []);

  const handleUseLocation = () => {
    setStartPoint(locationName);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex justify-between items-end mb-1">
        <div>
          <h1 className="text-xl font-bold">Hava & Çevre Analizi</h1>
          <div className="flex items-center gap-1 text-xs mt-2 font-medium" style={{ color: 'var(--primary)' }}>
            <MapPin size={14} /> <span>{locationName}</span>
          </div>
        </div>
      </div>

      {/* Hava Kalitesi Kartı */}
      <div className="card bg-secondary-light border-0 mt-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Wind className="text-secondary" size={32} />
            <div>
              <h2 className="text-lg font-bold">Hava Kalitesi</h2>
              <p className="text-sm font-bold text-secondary">
                {loading ? 'Yükleniyor...' : data.recomendation}
              </p>
            </div>
          </div>
          <div className="text-4xl font-black text-secondary">
            {loading ? '-' : data.aqi}
          </div>
        </div>
        <p className="text-xs text-muted" style={{ color: '#065f46' }}>
          {data.healthAdvice}
        </p>
      </div>

      {/* Polen ve Hava Durumu Yan Yana */}
      <div className="flex gap-4">
        <div className="card w-full flex-col">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-1 text-yellow-600" style={{ color: '#854d0e' }}>
            <CloudRain size={16} /> Polen
          </h3>
          <p className="text-xs text-muted mb-3 h-8">Bölgenizdeki genel polen durumu.</p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold" style={{ color: '#ca8a04' }}>
              {loading ? '...' : data.pollLevel}
            </span>
          </div>
          <div className="w-full bg-border h-1.5 rounded-full">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ backgroundColor: '#eab308', width: data.pollLevel === 'Yüksek Risk' ? '90%' : '40%' }}
            ></div>
          </div>
        </div>

        <div className="card w-full flex-col">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-1 text-primary">
            <Thermometer size={16} /> Hava Durumu
          </h3>
          <p className="text-xs text-muted mb-1 h-8">14°C - Parçalı Bulutlu, Nem %55</p>
          <div className="mt-auto">
            <span className="text-xs font-bold text-danger">Uyarı: Gece ani ısı düşüşü.</span>
          </div>
        </div>
      </div>

      {/* Risk Raporu */}
      <div className="card mt-1 shadow-md border-0" style={{ background: 'linear-gradient(to bottom, #ffffff, var(--primary-light))' }}>
        <h3 className="text-base font-bold mb-2">Astım Risk Tahmini Raporu</h3>
        <p className="text-sm mb-5 text-muted">
          {data.aqi > 100 ? "Hava kalitesi düşük, koruyucu önlemler alınız." : "Mevcut konumunuzdaki verilere göre dışarı çıkmak için güvenli."}
        </p>
        <button
          onClick={() => { setShowModal(true); setRouteAnalyzed(false); }}
          className="btn btn-primary w-full shadow-md"
        >
          Seyahat Rotasını Kontrol Et
        </button>
      </div>

      {/* Modal Kısmı Aynı Kalabilir, sadece startPoint dinamikleşti */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0,0,0,0.5)', margin: '-1rem', height: '110%' }}>
          {/* ... Modal içeriği aynı kodlarla devam eder ... */}
        </div>
      )}
    </div>
  );
}