import { useState, useEffect } from 'react';
import { Bell, ScanBarcode, Heart, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { fetchProductInfo } from '../services/foodFactsApi';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import BreathingFigure from '../pages/BreathingFigure';

const chestVariants = {
  'Nefes Al': {
    scale: 1.25,
    translateY: '-20px',
    boxShadow: '0 0 40px rgba(96, 165, 250, 0.5)',
    transition: { duration: 4, ease: "easeInOut" }
  },
  'İçinde Tut': {
    scale: 1.28,
    translateY: '-22px',
    boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)',
    transition: { duration: 7, ease: "linear" }
  },
  'Yavaşça Ver': {
    scale: 1,
    translateY: '0px',
    boxShadow: 'none',
    transition: { duration: 8, ease: "easeInOut" }
  }
};


export default function Lifestyle() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('');
  const [breathCount, setBreathCount] = useState(0);
  const [circleScale, setCircleScale] = useState(1);

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Breathing Exercise Logic (4-7-8)
  useEffect(() => {
    if (!breathingActive) return;

    let timer;
    const cycle = () => {
      setBreathPhase('Nefes Al');
      setBreathCount(4);
      setCircleScale(1.5);

      timer = setTimeout(() => {
        setBreathPhase('İçinde Tut');
        setBreathCount(7);
        setCircleScale(1.5); // stays expanded

        timer = setTimeout(() => {
          setBreathPhase('Yavaşça Ver');
          setBreathCount(8);
          setCircleScale(1);

          timer = setTimeout(cycle, 8000);
        }, 7000);
      }, 4000);
    };

    cycle();

    const countdown = setInterval(() => {
      setBreathCount(c => c > 0 ? c - 1 : 0);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [breathingActive]);

  const startScanner = () => {
    // Profildeki alerji bilgisini çek
    const savedUser = localStorage.getItem('asthma-user');
    const userAllergies = savedUser ? JSON.parse(savedUser).allergies : "";

    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(async (text) => {
        scanner.clear();
        setScanning(false);
        setLoadingProduct(true);
        const product = await fetchProductInfo(text, userAllergies);
        setScanResult(product);
        setLoadingProduct(false);
      }, (error) => { });

      window.qrScanner = scanner;
    }, 100);
  };

  const closeScanner = () => {
    if (window.qrScanner) window.qrScanner.clear();
    setScanning(false);
  };

  const simulateScan = async () => {
    setLoadingProduct(true);
    setScanResult({
      found: true,
      name: "Örnek Katkılı Hazır Çorba",
      brand: "Knorr",
      dangerous: true,
      warnings: ["Monosodyum Glutamat (MSG) tespit edildi.", "Sülfit (Koruyucu Madde) tespit edildi. Astım atağını tetikleyebilir!"]
    });
    setLoadingProduct(false);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-xl font-bold mb-1">Yaşam Tarzı & Asistan</h1>


      {/* Barcode Scanner */}
      <div className="card bg-surface shadow-sm border-0">
        <div className="flex flex-col items-center text-center py-2">
          {!scanning ? (
            <>
              <div className="bg-slate-100 p-3.5 rounded-full mb-3 text-text-main shadow-sm"><ScanBarcode size={36} /></div>
              <h3 className="text-lg font-bold mb-1">Gıda Katkı Tarayıcı</h3>
              <p className="text-xs text-muted mb-4 px-3">Market ürünlerindeki astımı tetikleyen sülfit ve Msg gibi maddeleri tespit edin.</p>
              <div className="flex gap-2 w-full">
                <button onClick={startScanner} className="btn w-full font-bold bg-text-main text-white py-3 border-0 rounded-xl cursor-pointer">Kamerayı Aç</button>
                <button onClick={simulateScan} className="btn w-1/3 bg-slate-100 border-0 rounded-xl text-xs font-bold text-muted cursor-pointer">Test Tarama</button>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="flex justify-between w-full mb-2">
                <h3 className="font-bold text-sm">Barkodu Okutun</h3>
                <button onClick={closeScanner} className="cursor-pointer border-0 bg-transparent"><X size={20} className="text-danger" /></button>
              </div>
              <div id="reader" className="w-full rounded-lg overflow-hidden border"></div>
            </div>
          )}
        </div>

        {loadingProduct && <div className="text-center p-3 text-sm font-bold text-primary animate-pulse">Ürün Sorgulanıyor...</div>}

        {scanResult && !loadingProduct && (
          <div className="mt-4 p-3 rounded-xl border animate-fade-in bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg">{scanResult.name} <span className="text-xs text-muted block">{scanResult.brand}</span></h4>
              <button onClick={() => setScanResult(null)} className="text-muted border-0 bg-transparent cursor-pointer"><X size={16} /></button>
            </div>
            {scanResult.dangerous ? (
              <div className="bg-danger-light p-3 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-danger font-bold mb-2"><AlertTriangle size={18} /> RİSKLİ İÇERİK!</div>
                <ul className="text-xs text-danger font-medium flex flex-col gap-1 pl-5 list-disc">
                  {scanResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            ) : (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-green-800">
                <div className="flex items-center gap-2 font-bold"><CheckCircle size={18} /> Astım İçin Güvenli</div>
                <p className="text-xs mt-1">Bilinen tetikleyici katkı maddesi bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stress Management */}
      <div className="card bg-surface shadow-sm border-0">
        <div className="flex gap-3 mb-4 items-center">
          <div className="bg-danger-light p-2.5 rounded-full text-danger"><Heart size={22} /></div>
          <div>
            <h3 className="text-base font-bold">Stres Yönetimi</h3>
            <p className="text-xs text-muted">Duygusal stres atakları tetikleyebilir.</p>
          </div>
        </div>
        <div className="bg-bg-color p-3.5 rounded-md mb-4 flex justify-between items-center border" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-bold">4-7-8 Nefes Egzersizi</span>
        </div>
        <button onClick={() => setBreathingActive(true)} className="btn w-full font-bold bg-danger-light text-danger py-3 border-0 rounded-xl cursor-pointer">Egzersize Başla</button>
      </div>


      <AnimatePresence>
        {breathingActive && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="card" style={{
              width: '92%', maxWidth: '360px', position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '1.5rem 1rem'
            }}>
              <button onClick={() => setBreathingActive(false)} style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                <X size={24} />
              </button>

              {/* İnsan figürü SVG */}
              <BreathingFigure phase={breathPhase} />

              <h2 style={{ fontSize: '22px', fontWeight: 600, margin: '8px 0 4px', minHeight: '32px' }}>
                {breathPhase || 'Hazır'}
              </h2>
              <div style={{ fontSize: '52px', fontWeight: 700, color: '#2176AE', minHeight: '64px', lineHeight: 1 }}>
                {breathCount}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
