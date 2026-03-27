import { useState, useRef } from 'react';
import { Mic, Square, Activity, AlertCircle, FileCog } from 'lucide-react';
import { analyzeBreathingAudio } from '../services/aiModel';

export default function VoiceAnalysis() {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleRecordToggle = async () => {
    if (isRecording) {
      // Kaydı durdur
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setProgress(0);
      return;
    }

    // Mikrofon izni al
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Ses verisini ArrayBuffer'a çevir
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();

        // Stream'i kapat
        stream.getTracks().forEach(t => t.stop());

        // Modele gönder
        const res = await analyzeBreathingAudio(arrayBuffer);
        setResult(res);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 5 saniye progress
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 500);

    } catch (err) {
      alert('Mikrofon erişimi reddedildi: ' + err.message);
    }
  };

  // ... geri kalan JSX aynı kalır

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-1">Ses Analizi (.onnx)</h1>
      <p className="text-sm text-muted mb-2">Makine öğrenmesi ile solunum hızı, hırıltı ve öksürük tespiti.</p>

      {!result ? (
        <div className="card flex flex-col items-center justify-center p-6 gap-6 shadow-md" style={{ minHeight: '320px' }}>
          <div
            onClick={handleRecordToggle}
            className="flex items-center justify-center cursor-pointer transition-all"
            style={{
              width: '130px', height: '130px', borderRadius: '50%',
              background: isRecording ? 'var(--danger-light)' : 'var(--primary-light)',
              color: isRecording ? 'var(--danger)' : 'var(--primary)',
              boxShadow: isRecording ? '0 0 25px rgba(239, 68, 68, 0.4)' : '0 0 15px rgba(14, 165, 233, 0.2)',
              transform: isRecording ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {isRecording ? <Square size={52} fill="currentColor" /> : <Mic size={52} />}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold">{isRecording ? "Kaydediliyor..." : "Kayıt İçin Dokunun"}</h3>
            <p className="text-xs text-muted mt-1">{isRecording ? "Lütfen normal nefes alıp verin (5 sn)" : "Sakin bir ortamda 5 saniyelik kayıt yapın"}</p>
          </div>

          <div className="w-full bg-border h-2 rounded-full mt-2" style={{ overflow: 'hidden', visibility: isRecording ? 'visible' : 'hidden' }}>
            <div className="bg-danger h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="card bg-surface text-center">
            <Activity size={56} className="text-primary mb-3 mx-auto" />
            <h2 className="text-xl font-bold mb-2">Solunum Haritası</h2>

            {result.isMock && (
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 p-2 rounded-lg mb-3">
                <FileCog size={14} /> Local model bulunamadı
              </div>
            )}

            <div className="inline-block px-4 py-1.5 font-bold rounded-full text-sm mb-4" style={{ backgroundColor: '#fef08a', color: '#854d0e' }}>
              Risk Seviyesi: {result.risk}
            </div>
            <p className="text-sm font-medium mb-6">{result.recommendation}</p>

            <div className="flex flex-col gap-4 text-left px-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Takipne (Hızlı Solunum)</span>
                  <span style={{ color: '#eab308' }}>{result.tachypnea}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${result.tachypnea}%`, backgroundColor: '#eab308' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Nefes Darlığı</span>
                  <span style={{ color: '#eab308' }}>{result.shortnessOfBreath}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{ width: `${result.shortnessOfBreath}%`, backgroundColor: '#eab308' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Hırıltı</span>
                  <span className="text-primary">{result.wheezing}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${result.wheezing}%` }}></div></div>
              </div>
            </div>

            <button className="btn mt-8 w-full bg-primary-light text-primary font-bold py-3" onClick={() => setResult(null)}>
              Tekrar Test Et
            </button>
          </div>
          <div className="card bg-danger-light border-0 py-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-danger flex-shrink-0 mt-0.5" size={20} />
              <p className="text-xs font-medium text-danger" style={{ lineHeight: 1.5 }}>
                Bu analiz model ile yapılmıştır, klinik teşhis yerine geçmez. Kötü hissediyorsanız doktorunuza başvurun.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
