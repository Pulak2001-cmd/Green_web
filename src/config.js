import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey: "AIzaSyD7lTLMj2B2HcaeOuFUcJM4cs3oDhMzhxo",
  authDomain: "indiagreen-b1d80.firebaseapp.com",
  projectId: "indiagreen-b1d80",
  storageBucket: "indiagreen-b1d80.appspot.com",
  messagingSenderId: "855747078972",
  appId: "1:855747078972:web:f628a895b1863d156c0c39",
  measurementId: "G-VZ9XZ0L2TE"
};

if(firebase.app.length){
    console.log(firebase.app.length)
   firebase.initializeApp(firebaseConfig) 
}