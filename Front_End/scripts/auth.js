const firebaseConfig = {
  apiKey: "AIzaSyDyL4pKx81YoOzhOVLNXxAhmgOCIXFnWN8",
  authDomain: "visual-physics-lab.firebaseapp.com",
  projectId: "visual-physics-lab",
  storageBucket: "visual-physics-lab.firebasestorage.app",
  messagingSenderId: "231263141383",
  appId: "1:231263141383:web:aa3017dd4974e9ed0434a2",
  measurementId: "G-ERYXZWHVER"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  auth.useEmulator("http://127.0.0.1:9099");
  console.log("🔧 Using Auth Emulator");
}

// Navi UI
function bindAuthUI(){
  const loginBtn  = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo  = document.getElementById("userInfo");

  if (!logoutBtn || !userInfo) return;

  if (logoutBtn) {
    logoutBtn.onclick = () => auth.signOut().catch(console.error);
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      logoutBtn.style.display = "";
      userInfo.textContent = user.displayName || user.email || "(signed in)";
      userInfo.style.cursor = "pointer";
      userInfo.style.textDecoration = "underline";
      userInfo.onclick = () => {
        window.location.href = "history.html";
      };
    } else {
      if (loginBtn) loginBtn.style.display = "";
      logoutBtn.style.display = "none";
      userInfo.textContent = "";
      userInfo.style.cursor = "default";
      userInfo.style.textDecoration = "none";
      userInfo.onclick = null;
    }
  });
}
document.addEventListener("DOMContentLoaded", bindAuthUI);
