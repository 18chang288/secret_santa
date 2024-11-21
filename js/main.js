// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import bcrpt from "bcryptjs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyBGewvoq0GfOyo1BK44Y-RJOtH2Hs4tNNE",
    authDomain: "secret-santa-cb2b2.firebaseapp.com",
    projectId: "secret-santa-cb2b2",
    storageBucket: "secret-santa-cb2b2.firebasestorage.app",
    messagingSenderId: "612984789760",
    appId: "1:612984789760:web:d88f3fe6da9ec0803fb1e5",
    measurementId: "G-PTFQSD3V75"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("JavaScript is running!");

(function ($) {
    "use strict";

    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', async function(event){
        event.preventDefault();
        console.log("Form submitted!");

        const username = $('#loginUsername').val();
        const password = $('#loginPassword').val();

        try {

            // Fetch user data from Firestore
            const userDocRef = doc(db, 'users', username);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                alert("Username not found!");
                return;
            }

            const userData = userDoc.data();
            const hashedPassword = userData.password;

            // Compare hashed password
            const isPasswordValid = await bcrpt.compare(password, hashedPassword);

            if (isPasswordValid) {
                alert("Login Successful!");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            }
            else {
                alert("Invalid password!");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Login failed: " + error.message);
        }
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).addClass('active');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).removeClass('active');
            showPass = 0;
        }
        
    });


})(jQuery);