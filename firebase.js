import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT.firebaseapp.com",
    projectId: "PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handleMessageLogic() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const textEl = document.getElementById("text-content");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!id || !textEl) return;

    const ref = doc(db, "messages", id);

    try {
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            textEl.textContent = "Mesaj bulunamadı.";
            return;
        }

        textEl.textContent = snap.data().text;

        let duration = 180; // saniye (3 dk)

        const interval = setInterval(async () => {

            duration--;

            let m = Math.floor(duration / 60);
            let s = duration % 60;

            minutesEl.textContent = m.toString().padStart(2, '0');
            secondsEl.textContent = s.toString().padStart(2, '0');

            if (duration <= 0) {
                clearInterval(interval);

                await deleteDoc(ref);

                textEl.textContent = "Mesaj süresi doldu ve silindi.";
            }

        }, 1000);

    } catch (e) {
        textEl.textContent = "Bağlantı hatası.";
        console.error(e);
    }
}