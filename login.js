import { auth, provider } from './main.js';
import { signInWithPopup } from "firebase/auth";

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
    try {
        // Avvia il popup di Google
        const result = await signInWithPopup(auth, provider);
        // Se il login ha successo, vai al feed
        window.location.href = "feed.html";
    } catch (error) {
        console.error("Errore durante il login:", error);
        alert("Ops! Qualcosa è andato storto col login. Riprova!");
    }
});
