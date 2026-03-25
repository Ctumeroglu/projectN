import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Senin sağladığın güncel Firebase yapılandırması
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
    const countdownEl = document.getElementById("countdown");
    const circle = document.getElementById('progress-bar');

    if (!id || !textContentEl) return;

    const ref = doc(db, "messages", id);
    
    // Silinme Tarihi: 2 Nisan 2026 (Ay indeksi 3 = Nisan)
    const expiryDate = new Date(2026, 3, 2); 
    const now = new Date();

    // 1. Önce kalan günü hesaplayalım
    const diff = expiryDate - now;
    const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    // 2. Dairesel ilerleme çubuğunu (Progress Bar) güncelleme
    if (circle) {
        // r="70" için çevre hesaplama: 2 * PI * r
        const radius = 70; 
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        
        // 30 günlük bir periyodu %100 kabul ederek barın doluluk oranını belirle
        const maxDays = 30; 
        const percentage = Math.min(daysLeft / maxDays, 1);
        const offset = circumference - (percentage * circumference);
        
        // Barın yavaşça dolması için offseti uygula
        circle.style.strokeDashoffset = offset;
    }

    // 3. Süre dolduysa otomatik sil ve kullanıcıyı bilgilendir
    if (now >= expiryDate) {
        try {
            await deleteDoc(ref);
        } catch (e) {
            console.error("Silme hatası:", e);
        }
        textContentEl.textContent = "Bu gizli kayıt 2 Nisan itibarıyla imha edilmiştir.";
        if (countdownEl) countdownEl.textContent = "0";
        return;
    }

    // 4. Mesajı getir ve ekrana yaz
    try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
            // Skeleton loader'ı temizle ve gerçek mesajı yaz
            textContentEl.textContent = snap.data().text;
            
            // Sayısal geri sayımı güncelle
            if (countdownEl) countdownEl.textContent = daysLeft;
        } else {
            textContentEl.textContent = "Mesaj bulunamadı veya daha önce silindi.";
        }
    } catch (e) {
        console.error("Bağlantı hatası:", e);
        textContentEl.textContent = "Bağlantı hatası oluştu. Lütfen internetinizi kontrol edin.";
    }
}