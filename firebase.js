import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyALPm-92IPjZYadmz3x7vMC4y-hVCd61A8",
    authDomain: "silme-3f2b4.firebaseapp.com",
    projectId: "silme-3f2b4",
    storageBucket: "silme-3f2b4.firebasestorage.app",
    messagingSenderId: "519245368530",
    appId: "1:519245368530:web:d41f22ef5150ed5bbc310b",
    measurementId: "G-S3T24GH456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handleMessageLogic() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const textContentEl = document.getElementById("text-content");
    const circle = document.getElementById('progress-bar');

    if (!id || !textContentEl) return;

    const ref = doc(db, "messages", id);
    // Hedef: 3 Nisan 2026, Saat 00:00 (Nisan ayı indeksi 3'tür)
    const expiryDate = new Date(2026, 3, 3, 0, 0, 0); 

    const updateCountdown = async () => {
        const now = new Date();
        const diff = expiryDate - now; // Milisaniye cinsinden fark

        if (diff <= 0) {
            try {
                await deleteDoc(ref);
                textContentEl.textContent = "Bu gizli kayıt 3 Nisan itibarıyla imha edilmiştir.";
            } catch (e) {
                textContentEl.textContent = "Erişim süresi doldu.";
            }
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        // Zaman birimlerini hesapla (GÜNÜ ATLIYORUZ, toplam saati alıyoruz)
        const totalHours = Math.floor(diff / (1000 * 60 * 60)); // Toplam saati hesaplar (örn: 23, 48, 72 gibi)
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // Ekrana yazdır (tek hanelilerin başına 0 ekleyerek)
        document.getElementById("hours").textContent = totalHours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = m.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = s.toString().padStart(2, '0');

        // Progress bar (Daire) güncelleme
        if (circle) {
            const radius = 70;
            const circumference = radius * 2 * Math.PI;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            
            const maxDurationHours = 24; // Daireyi 24 saatlik bir periyoda göre doldur (opsiyonel)
            const percentageHours = Math.min(totalHours / maxDurationHours, 1);
            
            circle.style.strokeDashoffset = circumference - (percentageHours * circumference);
        }
    };

    // İlk mesajı getir
    try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
            textContentEl.textContent = snap.data().text; // "Denemeden bilemezsin..." verisini çeker
            // Geri sayımı her saniye güncellemek için başlat
            setInterval(updateCountdown, 1000); 
            updateCountdown(); // İlk açılışta hemen çalıştır
        } else {
            textContentEl.textContent = "Mesaj bulunamadı.";
        }
    } catch (e) {
        textContentEl.textContent = "Bağlantı hatası.";
    }
}