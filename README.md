🫁 SpiroMine (Asthma Assistant)
SpiroMine, astım hastalarının yaşam kalitesini artırmak, çevresel tetikleyicileri takip etmek ve kriz anlarını yönetmek için geliştirilmiş yapay zeka destekli bir mobil ve web asistanıdır. Uygulama, hastaların günlük solunum takibinden acil durum ihtiyaçlarına kadar geniş bir yelpazede destek sunar.
________________________________________
🚀 Proje Hakkında
SpiroMine, astım semptomlarını (nefes darlığı, hırıltı, öksürük) minimize etmeyi ve hastaların çevresel faktörlerden korunmasını amaçlar. Proje, Cross-Platform yapısı sayesinde hem Web hem de Mobil (Android) üzerinden erişilebilirdir.
✨ Temel Özellikler
•	Günlük Ses Analizi: Kullanıcı her gün aynı saatte kısa bir ses kaydı alır. Yapay zeka modeli bu kaydı analiz ederek solunum hızı, hırıltı ve öksürük durumlarını takip eder, kişisel bir solunum haritası çıkarır.
•	Hava & Çevre Analizi: API entegrasyonları ile anlık konumdaki hava kalitesi, duman durumu ve polen miktarını takip eder.
•	Gıda Katkı Tarayıcı: Market ürünlerindeki astımı tetikleyebilecek sülfit, MSG, koruyucu ve tatlandırıcı maddeleri barkod tarama ile tespit eder.
•	Acil Durum QR Kod: Ani bir kriz anında hastanın acil ihtiyaçlarına ve sağlık bilgilerine hızlıca ulaşılmasını sağlar.
•	Stres Yönetimi ve 4-7-8 Egzersizi: Emosyonel stresin atakları tetiklemesini önlemek için anatomik figür rehberliğinde nefes egzersizleri sunar.
________________________________________
🧠 Yapay Zeka ve Model Detayları
SpiroMine'ın kalbinde, solunum seslerini analiz ederek hastalık seyrini takip eden bir derin öğrenme modeli yer almaktadır.
Veri Setleri
Modelin eğitimi ve doğrulanması için dünya çapında kabul görmüş iki ana veri seti kullanılmıştır:
• ICBHI 2017 Veri Seti (Kaggle)Coswara Project: COVID-19 ve diğer solunum yolu hastalıklarının (astım vb.) tespiti için toplanmış, öksürük ve nefes seslerini içeren geniş çaplı bir veri setidir.🔗 
• Coswara Project Veri Seti (Kaggle)
Yöntem ve Notebook
•	Yöntem: Ses verileri MFCC ve spektrogram analiz yöntemleri kullanılarak öznitelik çıkarımına tabi tutulmuş ve CNN mimarisi ile sınıflandırılmıştır.
•	Notebook: Model eğitim süreçlerini ve analizlerini aşağıdaki linkten inceleyebilirsiniz:
o Kaggle Notebook: 🔗 SpiroMine Respiratory Analysis 
o Proje Dosyası: notebooks/spiromine-respiratory-analysis.ipynb
________________________________________
🛠️ Kullanılan API'lar
Uygulama, çevresel verileri ve ürün bilgilerini toplamak için aşağıdaki servisleri kullanır:
•	Google Air Quality API: Bölgesel hava kalitesi indeksi (AQI) ve kirlilik verileri için.
•	Google Pollen API: Mevsimsel alerjen ve polen yoğunluğu takibi için.
•	OpenFoodFacts API: Gıda ürünlerinin içeriklerini ve katkı maddelerini taramak için.
________________________________________
💻 Kurulum ve Çalıştırma
Web (React + Vite)
1.	npm install komutu ile bağımlılıkları yükleyin.
2.	npm run dev ile yerel sunucuyu başlatın.
Mobil (Android)
Uygulama Capacitor ile Android'e entegre edilmiştir.
1.	npx cap open android komutu ile projeyi Android Studio'da açın.
2.	Uygulamanın hazır APK dosyası projenin release klasöründe yer almaktadır.
________________________________________
👥 Ekip Üyeleri (Proje Ortakları)
•	Fatıma Yaylı - Bilgisayar Mühendisliği Öğrencisi
•	Zeynep Dağtekin - Yazılım Mühendisliği Öğrencisi
Gİthub: https://github.com/zeynepvera
•	Süveybe Rana Yiğit - Psikoloji Öğrencisi
________________________________________
📝 Kaynakça
•	Fesci, D. H., & Görgülü, A. Ü. (2005). Astım ve Yaşam. Hacettepe Üniversitesi Hemşirelik Fakültesi Dergisi, 12(1), 77-83.
________________________________________
Bu proje tıbbi bir teşhis aracı değil, destekleyici bir takip asistanıdır.

