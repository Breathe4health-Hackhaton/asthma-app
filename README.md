# 🫁 SpiroMine (Asthma Assistant)

**SpiroMine**, astım hastalarının yaşam kalitesini artırmak, çevresel tetikleyicileri takip etmek ve kriz anlarını yönetmek için geliştirilmiş yapay zeka destekli bir mobil ve web asistanıdır.Uygulama, hastaların günlük solunum takibinden acil durum ihtiyaçlarına kadar geniş bir yelpazede destek sunar.

---

## 🚀 Proje Hakkında

SpiroMine; nefes darlığı, hırıltı ve öksürük gibi astım semptomlarını minimize etmeyi ve hastaları çevresel faktörlerden korumayı amaçlar. Cross-Platform yapısı sayesinde hem **Web** hem de **Mobil (Android)** üzerinden erişilebilirdir.

### ✨ Temel Özellikler
* **Günlük Ses Analizi:** Kullanıcı her gün aynı saatte kısa bir ses kaydı alır. Yapay zeka modeli; solunum hızı, hırıltı ve öksürük durumlarını takip ederek kişisel bir solunum haritası çıkarır.
* **Hava & Çevre Analizi:** API entegrasyonları ile anlık konumdaki hava kalitesini, duman durumunu ve polen miktarını takip eder.
* **Gıda Katkı Tarayıcı:** Market ürünlerindeki astımı tetikleyebilecek sülfit, MSG ve koruyucu maddeleri barkod tarama ile tespit eder.
* **Acil Durum QR Kod:** Ani bir kriz anında, hastanın acil ihtiyaçlarına ve sağlık bilgilerine çevredekiler tarafından hızlıca ulaşılmasını sağlar.
* **Stres Yönetimi ve 4-7-8 Egzersizi:** Emosyonel stresin atakları tetiklemesini önlemek için anatomik figür rehberliğinde nefes egzersizleri sunar.

---

## 🧠 Yapay Zeka ve Model Detayları

SpiroMine'ın merkezinde, solunum seslerini analiz ederek hastalık seyrini takip eden bir derin öğrenme modeli yer almaktadır.

### **Veri Setleri**
Modelin eğitimi için dünya çapında kabul görmüş iki ana veri seti kullanılmıştır:
* **ICBHI 2017:** Solunum sesleri (hırıltı, çıtırtı vb.) analizi için kullanılan kapsamlı veri seti.
    * [🔗 ICBHI 2017 Veri Seti (Kaggle)](https://www.kaggle.com/datasets/husninm/icbhi-2017-challenge)
* **Coswara Project:** COVID-19 ve diğer solunum yolu hastalıklarının tespiti için toplanmış ses veri seti.
    * [🔗 Coswara Project Veri Seti (Kaggle)](https://www.kaggle.com/datasets/janashreeananthan/coswara)

### **Yöntem ve Notebook**
* **Yöntem:** Ses verileri **MFCC** ve spektrogram analiz yöntemleri kullanılarak öznitelik çıkarımına tabi tutulmuş ve **CNN** mimarisi ile sınıflandırılmıştır.
* **Notebook:** Model eğitim süreçlerini ve analizlerini aşağıdaki linkten inceleyebilirsiniz:
    * [🔗 Kaggle: SpiroMine Respiratory Analysis](https://www.kaggle.com/code/fatmayayl/spiromine-respiratory-analysis)
    * **Yerel Dosya:** `notebooks/spiromine-respiratory-analysis.ipynb`

---

## 🛠️ Kullanılan API'lar

Uygulama, çevresel verileri ve ürün bilgilerini toplamak için aşağıdaki servisleri kullanır:
* **Google Air Quality API:** Bölgesel hava kalitesi indeksi (AQI) ve kirlilik verileri için.
* **Google Pollen API:** Mevsimsel alerjen ve polen yoğunluğu takibi için.
* **OpenFoodFacts API:** Gıda ürünlerinin içeriklerini ve katkı maddelerini taramak için.

---

## 💻 Kurulum ve Çalıştırma

### **Web (React + Vite)**
1.  `npm install` komutu ile bağımlılıkları yükleyin.
2.  `npm run dev` ile yerel sunucuyu başlatın.

### **Mobil (Android)**
Uygulama **Capacitor** ile Android'e entegre edilmiştir.
1.  `npx cap open android` komutu ile projeyi Android Studio'da açın.
2.  Hazır APK dosyası projenin `release` klasöründe yer almaktadır.

---

## 👥 Ekip Üyeleri (Proje Ortakları)

* **Fatıma Yaylı** - Bilgisayar Mühendisliği Öğrencisi | [🔗 GitHub](https://github.com/fatimayyl)
* **Zeynep Dağtekin** - Yazılım Mühendisliği Öğrencisi | [🔗 GitHub](https://github.com/zeynepvera)
* **Süveybe Rana Yiğit** - Psikoloji Öğrencisi | [🔗 GitHub](https://github.com/suveyberanay)

---

## 📝 Kaynakça

* Fesci, D. H., & Görgülü, A. Ü. (2005). *Astım ve Yaşam*. [cite_start]Hacettepe Üniversitesi Hemşirelik Fakültesi Dergisi, 12(1), 77-83. [cite: 74]

---

> **⚠️ Not:** Bu proje tıbbi bir teşhis aracı değil, destekleyici bir takip asistanıdır.
