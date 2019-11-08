import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA341M_Jwir3UczbdMh3zZjepXkkkW5xUs',
  authDomain: 'clickr-19a6d.firebaseapp.com',
  databaseURL: 'https://clickr-19a6d.firebaseio.com',
  projectId: 'clickr-19a6d',
  storageBucket: 'clickr-19a6d.appspot.com',
  messagingSenderId: '1030742871567',
  appId: '1:1030742871567:web:efe94e2a47f9f6a5e49d7a',
};

const Firebase = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;

Firebase.addMovie = async (payload) => {
  try {
    const query = await db.collection('movies').where('movie', '==', payload).get();
    if (query.docs.length !== 0) throw new Error('Movie already exists in the database.');
    await db.collection('movies').add({
      movie: payload,
      tp: 0,
      fp: 0,
      free: 0,
      twp: 0,
      fn: 0,
      sc: 0,
      misc: 0,
      total: 0,
      created_at: new Date().toISOString().substr(0, 10),
    });
    return true;
  } catch (error) {
    return error;
  }
};

Firebase.deleteMovie = async (payload) => {
  try {
    const doc = await db.collection('movies').doc(payload).get();
    await doc.ref.delete();
    return true;
  } catch (error) {
    return error;
  }
};

Firebase.login = async () => {
  try {
    const provider = new firebaseAuth.GoogleAuthProvider();
    await firebaseAuth().signInWithPopup(provider);
    return true;
  } catch (error) {
    return error;
  }
};

export default Firebase;
