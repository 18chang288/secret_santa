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
const db = firebase.firestore();

// Protect the dashboard page
auth.onAuthStateChanged((user) => {
if (user) {
    // User is logged in
    const initializeUser = async () => {
    const email = user.email;
    const username = email.substring(0, email.indexOf('@'));
    document.getElementById("welcomeMessage").innerText = `Welcome, ${username}!`;

    // check if user already has assignment
    const participantsRef = firebase.firestore().collection("Participants");
    const snapshot = await participantsRef.where("name", "==", username).get();

    if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.assigned) {
            console.log(`Assignment already exists for ${username}: ${userData.assigned}`);
            document.getElementById('assignment-list').innerHTML = `<h1>${userData.assigned}</h1>`;
            document.getElementById('generate').style.display = 'none';
            document.getElementById('results').style.display = 'block';
        }
    }
    };
    initializeUser().catch((error) => {
    console.error("Error initializing user:", error);
    });

} else {
    // Redirect to login page if not logged in
    window.location.href = "index.html";
}
});

//   // Function to format the date
//   function formatDate(date) {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
//   }

//   // Get today's date
//   const today = new Date();

//   // Format the date and insert it into the span
//   document.getElementById('current-date').textContent = formatDate(today);

  //--------------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('logout').addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            window.location.href = "index.html"; // Redirect to the login page or home page
        } catch (error) {
            console.error("Error logging out:", error);
        }
    });
    
    async function fetchParticipants() {
        try {
        const participantsRef = firebase.firestore().collection("Participants");
        const snapshot = await participantsRef.get();

        console.log("snapshot size: ", snapshot.size);

        if (snapshot.empty) {
            console.error("No matching documents.");
            return { kids: [], adults: [] };
        }
    
        const participants = [];
        snapshot.forEach((doc) => {
            console.log("Document data: ", doc.data());
            participants.push(doc.data());
        });
    
        const kids = [];
        const adults = [];
    
        participants.forEach((participant) => {
            if (participant.role === "kid") {
                kids.push(participant.name);
            } else if (participant.role === "adult") {
                adults.push(participant.name);
            }
        });
    
        return { kids, adults };
    } catch (error) {
        console.error("Error fetching participants:", error);
    }
}

    async function saveAssignmentsToFirebase(assignments) {
        const participantsRef = firebase.firestore().collection("Participants");
    
        for (const [giver, recipients] of Object.entries(assignments)) {
            const query = participantsRef.where("name", "==", giver);
            const snapshot = await query.get();
    
            if (!snapshot.empty) {
                snapshot.forEach(async (doc) => {
                    await participantsRef.doc(doc.id).update({
                        assigned: recipients.join(", "),
                    });
                });
            }
        }
    }
    
    document.getElementById('generate').addEventListener('click', async () => {
        try {
            // Authenticate and ensure the user is logged in
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const email = user.email;
                    const username = email.substring(0, email.indexOf('@')).trim();
    
                    const participantsRef = firebase.firestore().collection("Participants");
    
                    // Check if the user already has an assignment
                    const userSnapshot = await participantsRef.where("name", "==", username).get();
    
                    if (userSnapshot.empty) {
                        console.error("User not found in the participants list:", username);
                        return;
                    }
    
                    const userDoc = userSnapshot.docs[0];
                    const userData = userDoc.data();
    
                    // Check if user already has assignments
                    if (userData.assigned) {
                        // Display the assignments for the user
                        document.getElementById('assignment-list').innerHTML = `<h1>${userData.assigned}</h1>`;
                        document.getElementById("welcomeMessage").innerText = `Welcome, ${username}!`;
    
                        // Hide the generate button and show the results
                        document.getElementById('generate').style.display = 'none';
                        document.getElementById('results').style.display = 'block';
                        return;
                    }
    
                    // Initialize assignments
                    let assignments = [];
    
                    // Fetch unassigned kids
                    const kidsSnapshot = await participantsRef
                        .where("picked", "==", false)
                        .where("role", "==", "kid")
                        .get();
                    let kids = kidsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
                    // Fetch unassigned adults excluding self
                    const adultsSnapshot = await participantsRef
                        .where("picked", "==", false)
                        .where("role", "==", "adult")
                        .where("name", "!=", username)
                        .get();
                    let adults = adultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
                    // Determine the number of recipients for this gifter
                    let numRecipientsToAssign = kids.length > 0 ? 2 : 1;
    
                    // Assign recipients
                    if (kids.length > 0) {
                        // Assign a kid
                        const randomKidIndex = Math.floor(Math.random() * kids.length);
                        const kidRecipient = kids[randomKidIndex];
                        assignments.push(kidRecipient.name);
    
                        // Remove kid from the list and mark as picked
                        kids.splice(randomKidIndex, 1);
                        await participantsRef.doc(kidRecipient.id).update({ picked: true });
                    }
    
                    // Assign an adult
                    if (adults.length > 0) {
                        const randomAdultIndex = Math.floor(Math.random() * adults.length);
                        const adultRecipient = adults[randomAdultIndex];
                        assignments.push(adultRecipient.name);
    
                        // Remove adult from the list and mark as picked
                        adults.splice(randomAdultIndex, 1);
                        await participantsRef.doc(adultRecipient.id).update({ picked: true });
                    } else {
                        console.error("No adults left to assign.");
                        document.getElementById('assignment-list').innerHTML = `<p>No adults left to assign.</p>`;
                        return;
                    }
    
                    // Update the user's assignments in the database
                    await participantsRef.doc(userDoc.id).update({ assigned: assignments.join(", ") });
    
                    // Display the assignments for the user
                    document.getElementById('assignment-list').innerHTML = `<h1>${assignments.join(", ")}</h1>`;
                    document.getElementById("welcomeMessage").innerText = `Welcome, ${username}!`;
    
                    // Hide the generate button and show the results
                    document.getElementById('generate').style.display = 'none';
                    document.getElementById('results').style.display = 'block';
    
                } else {
                    // Redirect to the login page if not logged in
                    window.location.href = "index.html";
                }
            });
        } catch (error) {
            console.error("Error during assignment generation:", error);
        }
    });    
    
});