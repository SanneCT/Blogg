import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc
} from "firebase/firestore";

import {
    getAuth, 
    createUserWithEmailAndPassword, 
    signOut,
    signInWithEmailAndPassword
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyALRpbFfVILVzQC_sC_QfTM4S0k_44-QQk",
    authDomain: "minblogg-4b922.firebaseapp.com",
    projectId: "minblogg-4b922",
    storageBucket: "minblogg-4b922.appspot.com",
    messagingSenderId: "23369904460",
    appId: "1:23369904460:web:e564988f54f9b03923dfe9"
  };

  // Initialize Firebase
initializeApp(firebaseConfig);

//init service
const db = getFirestore();
const auth = getAuth();

//ref til kolleksjon
const colRefBlogs = collection(db, "Blogs");

//hente ut den tomme diven der data skal skrives ut
const parentElement = document.getElementById("blogs")

//gå gjennom alle docs og skriv ut alle i rekkefølgen til artikkelnummerene
getDocs(colRefBlogs)
.then((snapshot) => {
    let blog = []
    snapshot.docs.forEach((doc) => {
        blog.push({ ...doc.data(), id: doc.id });
        const newDiv = document.createElement('div');
        newDiv.classList.add("blogs");
        newDiv.innerHTML += `<h2> ${doc.data().Title} </h2>
        <br>${doc.data().Text}
        <br>
        <br> Skrevet av: ${doc.data().Author} 
        <br>
        <br>
        <br>`;

        parentElement.appendChild(newDiv);
    })

})
//feilmeldinger
.catch(err => {
    console.log(err.message);
});





//LOGG INN OG REGISTRERING

//LOGG INN
const formWrapper = document.querySelector('.form-wrapper')
const page2 = document.querySelector('.page2')
const SignInForm = document.querySelector(".login");

//sjekke om bruker er logget inn
document.addEventListener('DOMContentLoaded', (e) => {
  let user = localStorage.getItem('user');
  if (user) {
    formWrapper.classList.add('d-none');
    page2.classList.remove('d-none');
    logoutButton.classList.remove('d-none');
  }
});


SignInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = SignInForm.email.value;
  const password = SignInForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
  .then((cred) => {
    console.log('user logged in', cred.user);
    localStorage.setItem("user", cred.user.email); //lager brukeren i local storage
    SignInForm.reset();
    formWrapper.classList.add('d-none');
    page2.classList.remove('d-none');
    location.reload();
    

  })
  .catch((err) => {
    console.log(err.message)
  })

});

//LOGG UT
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
console.log('hei');
    signOut(auth)
    .then(() => {console.log('the user signed out')
    localStorage.removeItem("user");
    formWrapper.classList.remove('d-none');
    page2.classList.add('d-none'); 
    location.reload();
})
.catch((err) => {
    console.log(err.message);
})

})


//REGISTRER
const addUserForm = document.querySelector(".Register");

addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = addUserForm.email.value;
  const password = addUserForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
  .then ((cred) => {
    console.log('user created', cred.user);
    addUserForm.reset();
  })
  .catch((err) => {
    console.log(err.message);
  })
  
});

//SJEKK OM ADMIN, DISPLAY VEILEDER
const veileder = document.querySelector('.veileder');
let cred = localStorage.getItem('user');

if(cred === 'sanne@bloggis.com') {
  console.log('is admin');
  veileder.classList.remove('d-none');
};


//DISPLAY BLOGGER TIL SPESIFIK PERSON



//LEGG TIL SKO
const addForm = document.querySelector('.add');

addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    addDoc(colRefBlogs, {
        Title: addForm.Title.value,
        Author: addForm.Author.value,
        Text: addForm.Text.value
    })
    .then (() => {
        addForm.reset()
    });

});