// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    firebase.initializeApp({
    apiKey: "AIzaSyBGewvoq0GfOyo1BK44Y-RJOtH2Hs4tNNE",
    authDomain: "secret-santa-cb2b2.firebaseapp.com",
    projectId: "secret-santa-cb2b2",
    storageBucket: "secret-santa-cb2b2.firebasestorage.app",
    messagingSenderId: "612984789760",
    appId: "1:612984789760:web:d88f3fe6da9ec0803fb1e5",
    measurementId: "G-PTFQSD3V75"
});

const auth = firebase.auth();

// Protect the dashboard page
auth.onAuthStateChanged((user) => {
if (user) {
    // User is logged in
    document.getElementById("welcomeMessage").innerText = `Welcome, ${user.email}`;
} else {
    // Redirect to login page if not logged in
    window.location.href = "index.html";
}
});

// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
auth.signOut().then(() => {
    window.location.href = "index.html"; // Redirect to login page after logout
}).catch((error) => {
    console.error(error.message);
});
});
