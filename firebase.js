import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDoc
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

//LOGG INN
const formWrapper = document.querySelector('.form-wrapper')
const page2 = document.querySelector('.page2')
const SignInForm = document.querySelector(".login");

//ref til kolleksjon
const colRefBlogs = collection(db, "Blogs");

//hente ut den tomme diven der data skal skrives ut
const parentElement = document.querySelector("#blogs");

//REGISTRER FORM
const addUserForm = document.querySelector(".Register");

//Logg ut form
const logoutButton = document.querySelector('#logout');

//Veileder nav
const veileder = document.querySelector('.veileder');

//Legg til blogger form
const addForm = document.querySelector('.add');

//Fjern blogger form
const removeForm = document.querySelector('.remove');

//LIKES 
const docRef = doc(db, "Blogs", "2GLSGHXy5BAGh4dPrtWQ");

const docSnap = await getDoc(docRef);

let numberOfLikes = docSnap.data().Likes;


const likeKnapp = document.querySelector("#tryLike");


//sjekke om bruker er logget inn
document.addEventListener('DOMContentLoaded', () => {
  let user = localStorage.getItem('user');
  if (user) {
    formWrapper.classList.add('d-none');
    page2.classList.remove('d-none');
    logoutButton.classList.remove('d-none');
  }
});


//gå gjennom alle docs og skriv ut alle
await getDocs(colRefBlogs)
  .then((snapshot) => {
    let blog = []
    snapshot.docs.forEach((localDoc) => {
      blog.push({ ...localDoc.data(), id: localDoc.id });
      const newDiv = document.createElement('div');
      newDiv.classList.add("blogs");
      newDiv.innerHTML += `<h2> ${localDoc.data().Title} </h2>
        <br>${localDoc.data().Text}
        <br>
        <br> Skrevet av: ${localDoc.data().Author} 
        <br>
        <br> Likes: ${localDoc.data().Likes}
        <br>
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
      console.log('Error:!', err.message)
    })

});

//LOGG UT
logoutButton.addEventListener('click', () => {
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
addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = addUserForm.email.value;
  const password = addUserForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created', cred.user);
      addUserForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    })

});

//SJEKK OM ADMIN, DISPLAY VEILEDER
let cred = localStorage.getItem('user');

if (cred === 'sanne@bloggis.com') {
  console.log('is admin');
  veileder.classList.remove('d-none');
};

//LEGG TIL BLOGG
addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRefBlogs, {
    Title: addForm.Title.value,
    Author: addForm.Author.value,
    Text: addForm.Text.value
  })
    .then(() => {
      addForm.reset()
    });

});

//FJERNE BLOGGER
removeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, "Blogs", removeForm.bloggID.value)

  deleteDoc(docRef)
    .then(() => {
      removeForm.reset()
      console.log("item removed");
    });

});

//LIKES ISH
likeKnapp.addEventListener('click', () => {
  console.log('button clicked')
  const like = { Likes: numberOfLikes + 1 };
updateDoc(docRef, like)
  .then(docRef => {
    console.log('doc updated');
    location.reload();
  }).catch(err => {
    console.log(err.message)
  })
})

