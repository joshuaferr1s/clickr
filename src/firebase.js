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

Firebase.updateMovie = async (payload) => {
  try {
    const { id, movie } = payload;
    const doc = await db.collection('movies').doc(id).get();
    if (!doc.exists) throw new Error('Movie does not exist in the database.');
    await doc.ref.update({ movie });
    return true;
  } catch (error) {
    return error;
  }
};

Firebase.recordMovie = async (payload) => {
  try {
    const {
      id, type, value, total,
    } = payload;
    const doc = await db.collection('movies').doc(id).get();
    if (!doc.exists) throw new Error('Movie does not exist in the database.');
    await doc.ref.update({ [type]: value, total });
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

Firebase.newUser = async (payload) => {
  try {
    const {
      displayName, photoURL, email, id,
    } = payload;
    Promise.all([
      db.collection('users').doc(id).set({
        displayName,
        photoURL,
        email,
      }),
      db.collection('allowed').doc(id).set({
        allowed: false,
      }),
      db.collection('admins').doc(id).set({
        admin: false,
      }),
    ]);
    return true;
  } catch (error) {
    return error;
  }
};

Firebase.isAllowed = async (payload) => {
  try {
    const doc = await db.collection('allowed').doc(payload).get();
    if (!doc.exists) throw new Error('User is not allowed.');
    return doc.data().allowed;
  } catch (error) {
    return false;
  }
};

Firebase.updateAllowed = async (payload) => {
  try {
    const { id, allowed } = payload;
    const doc = await db.collection('allowed').doc(id).get();
    if (!doc.exists) throw new Error('User is not allowed.');
    doc.ref.update({ allowed });
    return true;
  } catch (error) {
    return error;
  }
};

Firebase.isAdmin = async (payload) => {
  try {
    const doc = await db.collection('admins').doc(payload).get();
    if (!doc.exists) throw new Error('User is not an admin.');
    return doc.data().admin;
  } catch (error) {
    return false;
  }
};

Firebase.updateAdmin = async (payload) => {
  try {
    const { id, admin } = payload;
    const doc = await db.collection('admins').doc(id).get();
    if (!doc.exists) throw new Error('User is not an admin.');
    doc.ref.update({ admin });
    return true;
  } catch (error) {
    return error;
  }
};

Firebase.getUsers = async () => {
  try {
    const usersQuerySnapshot = await db.collection('users').get();
    const allowedQuerySnapshot = await db.collection('allowed').get();
    const adminsQuerySnapshot = await db.collection('admins').get();

    const allowed = allowedQuerySnapshot.docs.reduce((acc, cur) => ({
      ...acc,
      [cur.id]: cur.data().allowed,
    }), {});
    const admins = adminsQuerySnapshot.docs.reduce((acc, cur) => ({
      ...acc,
      [cur.id]: cur.data().admin,
    }), {});

    const users = await Promise.all(usersQuerySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      allowed: allowed[doc.id],
      admin: admins[doc.id],
    })));
    return users;
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
