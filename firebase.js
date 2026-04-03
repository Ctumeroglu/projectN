import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 SENİN GERÇEK FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyALPm-92IPjZYadmz3x7vMC4y-hVCd61A8",
    authDomain: "silme-3f2b4.firebaseapp.com",
    projectId: "silme-3f2b4",
    storageBucket: "silme-3f2b4.firebasestorage.app",
    messagingSenderId: "519245368530",
    appId: "1:519245368530:web:d41f22ef5150ed5bbc310b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handleMessageLogic() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const textEl = document.getElementById("text-content");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Eğer bu sayfa mesaj sayfası değilse çık
    if (!id || !textEl) return;

    const ref = doc(db, "messages", id);

    try {
        const snap = await getDoc(ref);

        console.log("ID:", id);
        console.log("Veri var mı:", snap.exists());

        if (!snap.exists()) {
            textEl.textContent = "Mesaj bulunamadı veya silinmiş.";
            return;
        }

        // ✅ Mesajı ekrana bas
        textEl.textContent = snap.data().text;

        let duration = 180; // 3 dakika

        const interval = setInterval(async () => {

            duration--;

            let m = Math.floor(duration / 60);
            let s = duration % 60;

            if (minutesEl) minutesEl.textContent = m.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = s.toString().padStart(2, '0');

            if (duration <= 0) {
                clearInterval(interval);

                try {
                    await deleteDoc(ref);
                    textEl.textContent = "Bu mesaj süresi dolduğu için silindi.";
                } catch (err) {
                    console.error("Silme hatası:", err);
                    textEl.textContent = "Süre doldu ama silinemedi.";
                }
            }

        }, 1000);

    } catch (e) {
        console.error("Firebase Hatası:", e);
        textEl.textContent = "Bağlantı hatası (Firebase).";
    }
}