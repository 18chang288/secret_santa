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
    const email = user.email;
    const username = email.substring(0, email.indexOf('@'));
    document.getElementById("welcomeMessage").innerText = `Welcome, ${username}!`;
} else {
    // Redirect to login page if not logged in
    window.location.href = "index.html";
}
});

// Handle Secret Santa selection
document.getElementById('selectSantaBtn').addEventListener('click', () => {
    const wheel = document.getElementById('wheel');
    const segments = wheel.querySelectorAll('.segment');
    const randomIndex = Math.floor(Math.random() * segments.length);
    const selectedSegment = segments[randomIndex];

    // Rotate the wheel
    const rotation = 360 * 3 + randomIndex * (360 / segments.length);
    wheel.style.transform = `rotate(${rotation}deg)`;

    // Display the selected Secret Santa
    setTimeout(() => {
        document.getElementById('santaName').textContent = `Secret Santa ${selectedSegment.textContent}`;
    }, 4000); // Wait for the rotation to complete
});

// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
auth.signOut().then(() => {
    window.location.href = "index.html"; // Redirect to login page after logout
}).catch((error) => {
    console.error(error.message);
});
});

// snowfall
function createSnowflakes() {
    const snowContainer = document.querySelector('.snow');
    const snowflakeCount = 100; // Adjust the number of snowflakes

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5s and 10s
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // Random size between 10px and 20px
        snowContainer.appendChild(snowflake);
    }
}

document.addEventListener('DOMContentLoaded', createSnowflakes);