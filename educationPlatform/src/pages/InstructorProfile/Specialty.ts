const specialties = [
    "Front-End Developer",
    "Back-End Developer",
    "Full-Stack Developer",
    "Mobile Developer",
    "Yazılım Mühendisi",
    "Bilgisayar Mühendisi",
    "Game Developer", // Yazım hatası düzeltildi
    "Web Developer",
    "Bilgisayar Programcısı",
    "Veri Analisti",
    "Yapay Zeka Mühendisi",
    "Ağ Yöneticisi",
    "Gömülü Sistemler Mühendisi",
    "Robotik Mühendisi",
    "UI/UX Tasarımcısı"
  ];
  
  const sortedSpecialties = specialties.sort((a, b) => a.localeCompare(b, 'tr')); // Türkçe sıralama
  
  export default sortedSpecialties; // Doğru olan değişken dışa aktarılıyor
  