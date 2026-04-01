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
    
    // Hedef Tarih: 3 Nisan 2026, Saat 00:00 (Nisan ayı indeksi 3'tür)
    const expiryDate = new Date(2026, 3, 3, 0, 0, 0); 

    const updateCountdown = async () => {
        const now = new Date();
        const diff = expiryDate - now;

        if (diff <= 0) {
            try {
                await deleteDoc(ref);
                textContentEl.textContent = "Bu gizli kayıt 3 Nisan itibarıyla imha edilmiştir.";
            } catch (e) {
                textContentEl.textContent = "Erişim süresi doldu.";
            }
            // Süre dolduğunda her şeyi sıfırla
            ["hours", "minutes", "seconds"].forEach(unit => {
                const el = document.getElementById(unit);
                if (el) el.textContent = "00";
            });
            return;
        }

        // Zamanı birimlere ayır (Toplam saati alarak günü devre dışı bırakıyoruz)
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // HTML elementlerini güncelle
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

        if (hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
        if (minsEl) minsEl.textContent = m.toString().padStart(2, '0');
        if (secsEl) secsEl.textContent = s.toString().padStart(2, '0');

        // Progress bar (Daire) güncelleme logic
        if (circle) {
            const radius = 70;
            const circumference = radius * 2 * Math.PI;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            
            // Daireyi 24 saatlik bir dilime göre görselleştiriyoruz
            const percentage = (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24);
            circle.style.strokeDashoffset = circumference * percentage;
        }
    };

    try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
            textContentEl.textContent = snap.data().text;
            // Geri sayımı başlat
            setInterval(updateCountdown, 1000);
            updateCountdown(); 
        } else {
            textContentEl.textContent = "Mesaj bulunamadı.";
        }
    } catch (e) {
        textContentEl.textContent = "Bağlantı hatası.";
    }
}