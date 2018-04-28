import firebase from 'firebase';
import firestore from 'firebase/firestore';
import * as firebaseui from 'firebaseui';

export const appEnv = process.env.REACT_APP_DIST_ENV;
// Initialize Firebase
var defaultConfig = {
  apiKey: 'AIzaSyDvumnbJHCeFR6R3FgF-eevtZov1HiMFZ8',
  authDomain: 'sundayschoollessons-2271f.firebaseapp.com',
  databaseURL: 'https://sundayschoollessons-2271f.firebaseio.com',
  storageBucket: 'sundayschoollessons-2271f.appspot.com',
  projectId: 'sundayschoollessons-2271f',
};
var staginConfig = {
  apiKey: 'AIzaSyC6387U9FVVSO7DSBigkGeyqjTSp941PtI',
  authDomain: 'dev-5564e.firebaseapp.com',
  databaseURL: 'https://dev-5564e.firebaseio.com',
  projectId: 'dev-5564e',
  storageBucket: 'dev-5564e.appspot.com',
  messagingSenderId: '198159921058',
};
firebase.initializeApp(appEnv === 'staging' ? staginConfig : defaultConfig);
console.log(process.env.REACT_APP_DIST_ENV);

// FirebaseUI config.
export const APP_ID = 'com-bellman-ssl-dev';
export const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/home',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};
export const firebaseDb =
  appEnv === 'staging'
    ? firebase
        .database()
        .ref()
        .child(APP_ID)
    : firebase.database().ref();
// export const fireStoreDb =
//   appEnv === 'staging'
//     ? firestore.collection(APP_ID)
//     : firestore.firestore();
export const firebaseAuth = firebase.auth();
export const firebaseUI = new firebaseui.auth.AuthUI(firebaseAuth);
