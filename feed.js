import { auth, db, storage } from './main.js';
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const postBtn = document.getElementById('postBtn');
const feedContainer = document.getElementById('feedContainer');

// 1. Pubblicare un post
postBtn.addEventListener('click', async () => {
    const text = document.getElementById('postContent').value;
    const file = document.getElementById('mediaFile').files[0];

    if (!text && !file) return alert("Scrivi qualcosa o carica un file!");

    let mediaUrl = "";
    if (file) {
        // Carica su Firebase Storage
        const storageRef = ref(storage, 'posts/' + file.name);
        await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(storageRef);
    }

    // Salva su Firestore
    await addDoc(collection(db, "posts"), {
        text: text,
        mediaUrl: mediaUrl,
        user: auth.currentUser.displayName,
        createdAt: new Date()
    });
    
    document.getElementById('postContent').value = ""; // Pulisci form
});

// 2. Caricare il feed in tempo reale
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    feedContainer.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        feedContainer.innerHTML += `
            <div class="post-card">
                <h3>${data.user}</h3>
                <p>${data.text}</p>
                ${data.mediaUrl ? `<img src="${data.mediaUrl}" class="post-media">` : ""}
            </div>
        `;
    });
});
